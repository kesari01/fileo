import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { isFileExpired } from '@/lib/utils'

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
    if (isFileExpired(file.expires_at)) {
      return NextResponse.json(
        { success: false, error: 'File has expired' },
        { status: 410 }
      )
    }

    // Return file info (excluding password hash)
    const fileInfo = {
      id: file.id,
      file_name: file.file_name,
      file_size: file.file_size,
      mime_type: file.mime_type,
      created_at: file.created_at,
      expires_at: file.expires_at,
      download_count: file.download_count,
      has_password: !!file.password_hash,
    }

    return NextResponse.json({
      success: true,
      file: fileInfo,
    })

  } catch (error) {
    console.error('File info API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 