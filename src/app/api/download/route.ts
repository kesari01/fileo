import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifyPassword, isFileExpired } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { fileId, password } = await request.json()

    if (!fileId) {
      return NextResponse.json(
        { success: false, error: 'File ID is required' },
        { status: 400 }
      )
    }

    // Get file metadata from database
    const { data: file, error: dbError } = await supabase
      .from('files')
      .select('*')
      .eq('id', fileId)
      .single()

    if (dbError || !file) {
      return NextResponse.json(
        { success: false, error: 'File not found' },
        { status: 404 }
      )
    }

    // Check if file is expired
    if (isFileExpired(file.expires_at)) {
      return NextResponse.json(
        { success: false, error: 'File has expired' },
        { status: 410 }
      )
    }

    // Check password if required
    if (file.password_hash) {
      if (!password) {
        return NextResponse.json(
          { success: false, error: 'Password required' },
          { status: 401 }
        )
      }

      const isValidPassword = await verifyPassword(password, file.password_hash)
      if (!isValidPassword) {
        return NextResponse.json(
          { success: false, error: 'Invalid password' },
          { status: 401 }
        )
      }
    }

    // Generate signed URL for download
    const { data: signedUrl, error: urlError } = await supabase.storage
      .from('fileo-bucket')
      .createSignedUrl(file.storage_path, 60) // 60 seconds expiry

    if (urlError) {
      console.error('Signed URL error:', urlError)
      return NextResponse.json(
        { success: false, error: 'Failed to generate download link' },
        { status: 500 }
      )
    }

    // Increment download count
    await supabase
      .from('files')
      .update({ download_count: file.download_count + 1 })
      .eq('id', fileId)

    return NextResponse.json({
      success: true,
      file,
      downloadUrl: signedUrl.signedUrl,
    })

  } catch (error) {
    console.error('Download API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 