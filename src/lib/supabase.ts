import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface FileRecord {
  id: string
  file_name: string
  storage_path: string
  password_hash: string | null
  created_at: string
  expires_at: string | null
  download_count: number
  file_size: number
  mime_type: string
}

export interface UploadResponse {
  success: boolean
  fileId?: string
  error?: string
  shareUrl?: string
}

export interface DownloadResponse {
  success: boolean
  file?: FileRecord
  error?: string
  downloadUrl?: string
} 