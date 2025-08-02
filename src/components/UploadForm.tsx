'use client'

import { useState, useRef } from 'react'
import { formatFileSize, validateFileSize } from '@/lib/utils'

interface UploadResponse {
  success: boolean
  fileId?: string
  shareUrl?: string
  error?: string
}

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [password, setPassword] = useState('')
  const [expiryHours, setExpiryHours] = useState(24)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (selectedFile: File) => {
    if (!validateFileSize(selectedFile)) {
      alert('File size exceeds 50MB limit')
      return
    }
    setFile(selectedFile)
    setUploadResult(null)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsUploading(true)
    setUploadResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      if (password.trim()) {
        formData.append('password', password)
      }
      formData.append('expiryHours', expiryHours.toString())

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result: UploadResponse = await response.json()
      setUploadResult(result)
    } catch (error) {
      setUploadResult({
        success: false,
        error: 'Upload failed. Please try again.',
      })
    } finally {
      setIsUploading(false)
    }
  }

  const resetForm = () => {
    setFile(null)
    setPassword('')
    setExpiryHours(24)
    setUploadResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="card">
      {!uploadResult?.success ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select File
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
                accept="*/*"
              />
              
              {file ? (
                <div className="space-y-2">
                  <div className="text-lg font-medium text-gray-900">
                    {file.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatFileSize(file.size)}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Choose different file
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-gray-400">
                    <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-primary"
                    >
                      Choose File
                    </button>
                    <p className="mt-2 text-sm text-gray-500">
                      or drag and drop
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">
                    Maximum file size: 50MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Password Protection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Protection (Optional)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password to protect the file"
              className="input-field"
            />
            <p className="mt-1 text-xs text-gray-500">
              Leave empty for no password protection
            </p>
          </div>

          {/* Expiry Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Time
            </label>
            <select
              value={expiryHours}
              onChange={(e) => setExpiryHours(Number(e.target.value))}
              className="input-field"
            >
              <option value={1}>1 hour</option>
              <option value={6}>6 hours</option>
              <option value={12}>12 hours</option>
              <option value={24}>1 day</option>
              <option value={72}>3 days</option>
              <option value={168}>7 days</option>
            </select>
          </div>

          {/* Upload Button */}
          <button
            type="submit"
            disabled={!file || isUploading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Upload File'}
          </button>
        </form>
      ) : (
        /* Success State */
        <div className="text-center space-y-6">
          <div className="text-green-600">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              File Uploaded Successfully!
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Your file is now ready to share
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Share Link
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={uploadResult.shareUrl}
                  readOnly
                  className="input-field rounded-r-none"
                />
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(uploadResult.shareUrl!)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-r-lg transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="btn-secondary"
            >
              Upload Another File
            </button>
          </div>
        </div>
      )}

      {/* Error State */}
      {uploadResult?.success === false && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <div className="text-red-600">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">
                {uploadResult.error}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 