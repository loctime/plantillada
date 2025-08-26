"use client"

import { useState, useEffect } from 'react'
import { X, ExternalLink, Upload, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ImageUpload } from './image-upload'

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (imageUrl: string) => void
  currentImage?: string
  title?: string
  placeholder?: string
  maxSize?: number // en MB
  acceptedTypes?: string[]
  className?: string
}

export function ImageModal({
  isOpen,
  onClose,
  onSave,
  currentImage = '',
  title = 'Cambiar Imagen',
  placeholder = 'https://ejemplo.com/imagen.jpg',
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  className
}: ImageModalProps) {
  const [imageUrl, setImageUrl] = useState(currentImage)
  const [showUpload, setShowUpload] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setImageUrl(currentImage)
      setError(null)
      setShowUpload(false)
    }
  }, [isOpen, currentImage])

  const handleSave = () => {
    if (!imageUrl.trim()) {
      setError('Por favor ingresa una URL de imagen válida')
      return
    }
    onSave(imageUrl.trim())
    onClose()
  }

  const handleCancel = () => {
    setImageUrl(currentImage)
    setError(null)
    setShowUpload(false)
    onClose()
  }

  const handleUrlChange = (url: string) => {
    setImageUrl(url)
    setError(null)
  }

  const handleUpload = (url: string) => {
    setImageUrl(url)
    setShowUpload(false)
    setError(null)
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleCancel}
    >
      <div 
        className={cn(
          "bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">{title}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-8 w-8 p-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Opciones de edición */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={!showUpload ? "default" : "outline"}
              onClick={() => setShowUpload(false)}
              className={!showUpload ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              URL
            </Button>
            <Button
              size="sm"
              variant={showUpload ? "default" : "outline"}
              onClick={() => setShowUpload(true)}
              className={showUpload ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              <Upload className="h-4 w-4 mr-2" />
              Subir
            </Button>
          </div>

          {/* Campo de URL */}
          {!showUpload && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de la imagen
                </label>
                <Input
                  value={imageUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder={placeholder}
                  className="w-full"
                />
              </div>

              {/* Vista previa */}
              {imageUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vista Previa
                  </label>
                  <div className="border rounded-lg p-2 bg-gray-50">
                    <img
                      src={imageUrl}
                      alt="Vista previa"
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/300x200?text=URL+inválida'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Upload de archivo usando el componente existente */}
          {showUpload && (
            <div className="space-y-4">
              <ImageUpload
                onUpload={handleUpload}
                onCancel={() => setShowUpload(false)}
                maxSize={maxSize}
                acceptedTypes={acceptedTypes}
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-6 border-t">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!imageUrl.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Check className="h-4 w-4 mr-2" />
            Guardar
          </Button>
        </div>
      </div>
    </div>
  )
}
