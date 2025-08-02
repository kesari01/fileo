'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '@/components/Header'
import { FileViewer } from '@/components/FileViewer'
import { PasswordModal } from '@/components/PasswordModal'

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

export default function FilePage() {
  const params = useParams()
  const fileId = params.id as string
  
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    fetchFileInfo()
  }, [fileId])

  const fetchFileInfo = async () => {
    try {
      const response = await fetch(`/api/file/${fileId}`)
      const data = await response.json()

      if (data.success) {
        setFileInfo(data.file)
        if (data.file.has_password) {
          setShowPasswordModal(true)
        }
      } else {
        setError(data.error || 'File not found')
      }
    } catch (error) {
      setError('Failed to load file information')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async (password?: string) => {
    if (!fileInfo) return

    setIsDownloading(true)
    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId: fileInfo.id,
          password,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Create a temporary link and trigger download
        const link = document.createElement('a')
        link.href = data.downloadUrl
        link.download = fileInfo.file_name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Refresh file info to update download count
        fetchFileInfo()
      } else {
        setError(data.error || 'Download failed')
      }
    } catch (error) {
      setError('Download failed. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="card text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading file...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="card text-center">
              <div className="text-red-600 mb-4">
                <svg className="mx-auto h-12 w-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {error}
              </h2>
              <p className="text-gray-600 mb-4">
                The file you're looking for might have been removed or expired.
              </p>
              <a href="/" className="btn-primary">
                Upload New File
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {fileInfo && (
            <FileViewer
              fileInfo={fileInfo}
              onDownload={handleDownload}
              isDownloading={isDownloading}
            />
          )}
        </div>
      </div>

      {showPasswordModal && fileInfo && (
        <PasswordModal
          fileName={fileInfo.file_name}
          onVerify={(password) => {
            setShowPasswordModal(false)
            handleDownload(password)
          }}
          onCancel={() => setShowPasswordModal(false)}
        />
      )}
    </div>
  )
} 