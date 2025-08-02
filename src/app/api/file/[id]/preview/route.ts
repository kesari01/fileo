import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getFileTypeCategory } from '@/lib/utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fileId = params.id

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
    const isExpired = new Date(file.expires_at) < new Date()
    if (isExpired) {
      return NextResponse.json(
        { success: false, error: 'File has expired' },
        { status: 410 }
      )
    }

    // Only allow preview for images and PDFs
    const fileTypeCategory = getFileTypeCategory(file.mime_type)
    if (fileTypeCategory === 'other') {
      return NextResponse.json(
        { success: false, error: 'Preview not available for this file type' },
        { status: 400 }
      )
    }

    // Generate signed URL for preview
    const { data: signedUrl, error: urlError } = await supabase.storage
      .from('fileo-bucket')
      .createSignedUrl(file.storage_path, 300) // 5 minutes expiry

    if (urlError) {
      console.error('Signed URL error:', urlError)
      return NextResponse.json(
        { success: false, error: 'Failed to generate preview link' },
        { status: 500 }
      )
    }

    // Redirect to the signed URL
    return NextResponse.redirect(signedUrl.signedUrl)

  } catch (error) {
    console.error('Preview API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 