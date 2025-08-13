import { useState } from 'react'

interface UploadResult {
  url: string
  publicId: string
  width: number
  height: number
  format: string
  size: number
}

interface UseImageUploadReturn {
  uploadImage: (file: File) => Promise<UploadResult>
  isUploading: boolean
  error: string | null
  clearError: () => void
}

export function useImageUpload(): UseImageUploadReturn {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadImage = async (file: File): Promise<UploadResult> => {
    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al subir archivo')
      }

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      throw err
    } finally {
      setIsUploading(false)
    }
  }

  const clearError = () => setError(null)

  return {
    uploadImage,
    isUploading,
    error,
    clearError
  }
}
