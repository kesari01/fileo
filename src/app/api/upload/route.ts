import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateFileId, hashPassword, calculateExpiryDate, validateFileSize } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const password = formData.get('password') as string
    const expiryHours = parseInt(formData.get('expiryHours') as string) || 24

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file size
    if (!validateFileSize(file)) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 50MB limit' },
        { status: 400 }
      )
    }

    // Generate unique file ID
    const fileId = generateFileId()
    const storagePath = `files/${fileId}/${file.name}`

    // Hash password if provided
    let passwordHash = null
    if (password && password.trim()) {
      passwordHash = await hashPassword(password)
    }

    // Calculate expiry date
    const expiresAt = calculateExpiryDate(expiryHours)

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('fileo-bucket')
      .upload(storagePath, file)

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { success: false, error: 'Failed to upload file' },
        { status: 500 }
      )
    }

    // Save file metadata to database
    const { data: dbData, error: dbError } = await supabase
      .from('files')
      .insert({
        id: fileId,
        file_name: file.name,
        storage_path: storagePath,
        password_hash: passwordHash,
        created_at: new Date().toISOString(),
        expires_at: expiresAt,
        download_count: 0,
        file_size: file.size,
        mime_type: file.type,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Clean up uploaded file if database insert fails
      await supabase.storage.from('fileo-bucket').remove([storagePath])
      return NextResponse.json(
        { success: false, error: 'Failed to save file metadata' },
        { status: 500 }
      )
    }

    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/file/${fileId}`

    return NextResponse.json({
      success: true,
      fileId,
      shareUrl,
      message: 'File uploaded successfully',
    })

  } catch (error) {
    console.error('Upload API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 