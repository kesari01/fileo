'use client'

import { useState } from 'react'
import { formatFileSize, getFileTypeCategory } from '@/lib/utils'

interface FileInfo {
  id: string
  file_name: string
  file_size: number
  mime_type: string
  created_at: string
  expires_at: string
  download_count: number
  has_password: boolean
}

interface FileViewerProps {
  fileInfo: FileInfo
  onDownload: (password?: string) => void
  isDownloading: boolean
}

export function FileViewer({ fileInfo, onDownload, isDownloading }: FileViewerProps) {
  const [showPreview, setShowPreview] = useState(false)
  const fileTypeCategory = getFileTypeCategory(fileInfo.mime_type)
  const isExpired = new Date(fileInfo.expires_at) < new Date()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getFileIcon = () => {
    switch (fileTypeCategory) {
      case 'image':
        return (
          <svg className="h-12 w-12 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        )
      case 'pdf':
        return (
          <svg className="h-12 w-12 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        )
      default:
        return (
          <svg className="h-12 w-12 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* File Header */}
      <div className="card">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {getFileIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {fileInfo.file_name}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Size:</span> {formatFileSize(fileInfo.file_size)}
              </div>
              <div>
                <span className="font-medium">Type:</span> {fileInfo.mime_type}
              </div>
              <div>
                <span className="font-medium">Uploaded:</span> {formatDate(fileInfo.created_at)}
              </div>
              <div>
                <span className="font-medium">Downloads:</span> {fileInfo.download_count}
              </div>
              <div>
                <span className="font-medium">Expires:</span> {formatDate(fileInfo.expires_at)}
              </div>
              <div>
                <span className="font-medium">Protected:</span> {fileInfo.has_password ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      {fileTypeCategory === 'image' && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
          {showPreview && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <img
                src={`/api/file/${fileInfo.id}/preview`}
                alt={fileInfo.file_name}
                className="max-w-full h-auto rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  const nextSibling = e.currentTarget.nextElementSibling as HTMLElement
                  if (nextSibling) {
                    nextSibling.style.display = 'block'
                  }
                }}
              />
              <div className="hidden text-center text-gray-500 py-8">
                Preview not available
              </div>
            </div>
          )}
        </div>
      )}

      {fileTypeCategory === 'pdf' && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
          {showPreview && (
            <div className="border rounded-lg bg-gray-50">
              <iframe
                src={`/api/file/${fileInfo.id}/preview`}
                className="w-full h-96 rounded"
                title={fileInfo.file_name}
              />
            </div>
          )}
        </div>
      )}

      {/* Download Section */}
      <div className="card">
        <div className="text-center space-y-4">
          {isExpired ? (
            <div className="text-red-600">
              <svg className="mx-auto h-12 w-12 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <h3 className="text-lg font-semibold">File Has Expired</h3>
              <p className="text-gray-600">
                This file is no longer available for download.
              </p>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-gray-900">
                Ready to Download
              </h3>
              <p className="text-gray-600">
                Click the button below to download the file.
              </p>
              <button
                onClick={() => onDownload()}
                disabled={isDownloading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? 'Downloading...' : 'Download File'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 