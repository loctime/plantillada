"use client"

import { useState, useRef } from 'react'
import { Upload, X, Check, Image as ImageIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  onUpload: (url: string) => void
  onCancel?: () => void
  className?: string
  maxSize?: number // en MB
  acceptedTypes?: string[]
}

export function ImageUpload({ 
  onUpload, 
  onCancel,
  className,
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setError(null)
    
    // Validar tipo
    if (!acceptedTypes.includes(file.type)) {
      setError(`Tipo de archivo no permitido. Tipos válidos: ${acceptedTypes.join(', ')}`)
      return
    }

    // Validar tamaño
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Archivo demasiado grande. Máximo: ${maxSize}MB`)
      return
    }

    // Crear preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Subir archivo
    setIsUploading(true)
    
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

      onUpload(data.url)
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido')
      setPreview(null)
    } finally {
      setIsUploading(false)
    }
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
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleCancel = () => {
    setPreview(null)
    setError(null)
    onCancel?.()
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Área de drop */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          dragActive 
            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" 
            : "border-gray-300 dark:border-gray-600",
          isUploading && "opacity-50 cursor-not-allowed"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleInputChange}
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="space-y-2">
            <Loader2 className="h-8 w-8 mx-auto animate-spin text-emerald-600" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Subiendo archivo...
            </p>
          </div>
        ) : preview ? (
          <div className="space-y-2">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-h-32 mx-auto rounded"
            />
            <p className="text-sm text-emerald-600">
              ¡Archivo listo para subir!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="h-8 w-8 mx-auto text-gray-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Arrastra una imagen aquí o haz clic para seleccionar
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Máximo {maxSize}MB • {acceptedTypes.join(', ')}
            </p>
          </div>
        )}
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Botones de acción */}
      {preview && !isUploading && (
        <div className="flex gap-2">
          <Button
            onClick={() => onUpload(preview)}
            className="bg-emerald-600 hover:bg-emerald-700"
            disabled={isUploading}
          >
            <Check className="h-4 w-4 mr-2" />
            Confirmar
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isUploading}
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
        </div>
      )}
    </div>
  )
}
