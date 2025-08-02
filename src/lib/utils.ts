import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'

// Generate a unique file ID
export const generateFileId = (): string => {
  return nanoid(12)
}

// Hash password for storage
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

// Verify password
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash)
}

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Get file type category
export const getFileTypeCategory = (mimeType: string): 'image' | 'pdf' | 'other' => {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType === 'application/pdf') return 'pdf'
  return 'other'
}

// Check if file is expired
export const isFileExpired = (expiresAt: string | null): boolean => {
  if (!expiresAt) return false
  return new Date(expiresAt) < new Date()
}

// Calculate expiry date
export const calculateExpiryDate = (expiryHours: number): string => {
  const expiryDate = new Date()
  expiryDate.setHours(expiryDate.getHours() + expiryHours)
  return expiryDate.toISOString()
}

// Validate file size (max 50MB)
export const validateFileSize = (file: File): boolean => {
  const maxSize = 50 * 1024 * 1024 // 50MB in bytes
  return file.size <= maxSize
}

// Get file extension from filename
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || ''
} 