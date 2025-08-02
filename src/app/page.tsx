'use client'

import { useState } from 'react'
import { UploadForm } from '@/components/UploadForm'
import { Header } from '@/components/Header'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      <main className="max-w-2xl mx-auto mt-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Share Files Securely
          </h1>
          <p className="text-lg text-gray-600">
            Upload files up to 50MB with password protection and automatic expiry
          </p>
        </div>
        
        <UploadForm />
        
        <div className="mt-12 text-center text-gray-500">
          <p className="text-sm">
            Files are automatically deleted after expiry. Maximum file size: 50MB
          </p>
        </div>
      </main>
    </div>
  )
} 