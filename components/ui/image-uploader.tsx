'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from './button'
import { Upload, X, Loader2 } from 'lucide-react'
import { uploadImage, uploadMultipleImages, validateImageFile } from '@/lib/storage'

interface ImageUploaderProps {
  onUpload: (urls: string[]) => void
  currentImages?: string[]
  onRemove?: (url: string) => void
  multiple?: boolean
  maxFiles?: number
  storagePath: string
  accept?: string
  maxSizeMB?: number
  className?: string
}

export function ImageUploader({
  onUpload,
  currentImages = [],
  onRemove,
  multiple = false,
  maxFiles = 10,
  storagePath,
  accept = 'image/jpeg,image/jpg,image/png,image/webp',
  maxSizeMB = 5,
  className = ''
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Ensure currentImages is always an array
  const safeCurrentImages = Array.isArray(currentImages) ? currentImages : []

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setError(null)
    setUploading(true)

    try {
      // Validate files
      const validFiles: File[] = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        try {
          validateImageFile(file, maxSizeMB)
          validFiles.push(file)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Invalid file')
          continue
        }
      }

      if (validFiles.length === 0) {
        setUploading(false)
        return
      }

      // Check max files limit
      if (safeCurrentImages.length + validFiles.length > maxFiles) {
        setError(`Maximum ${maxFiles} images allowed`)
        setUploading(false)
        return
      }

      // Upload files
      let urls: string[]
      if (multiple) {
        urls = await uploadMultipleImages(validFiles, storagePath)
      } else {
        const url = await uploadImage(validFiles[0], storagePath)
        urls = [url]
      }

      onUpload(urls)
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Failed to upload images')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = (url: string) => {
    if (onRemove) {
      onRemove(url)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div 
        className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer"
        onClick={triggerFileInput}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        
        {uploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 mb-1">
              {multiple ? 'Click to upload images' : 'Click to upload an image'}
            </p>
            <p className="text-xs text-gray-500">
              JPG, PNG, WebP (Max {maxSizeMB}MB each)
            </p>
            <Button type="button" variant="outline" size="sm" className="mt-3" disabled={uploading}>
              Choose Files
            </Button>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Image Preview Grid */}
      {safeCurrentImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {safeCurrentImages.map((url, index) => (
            <div key={index} className="relative border rounded-lg overflow-hidden group">
              <div className="aspect-video bg-gray-100 relative">
                <Image 
                  src={url} 
                  alt={`Upload ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              {onRemove && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove(url)
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}