"use client"

import { useState, useRef, useEffect } from 'react'
import { useAdmin } from '@/lib/admin-context'
import { Edit2, Check, X, Image as ImageIcon, ExternalLink, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ImageUpload } from './image-upload'

interface EditableImageProps {
  value: string
  onSave: (newValue: string) => void
  className?: string
  placeholder?: string
  label?: string
  width?: number
  height?: number
  alt?: string
  showPreview?: boolean
}

export function EditableImage({ 
  value, 
  onSave, 
  className,
  placeholder = "https://ejemplo.com/imagen.jpg",
  label,
  width = 420,
  height = 520,
  alt = "Imagen",
  showPreview = true
}: EditableImageProps) {
  const { isAdminMode, isSaving } = useAdmin()
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [isPending, setIsPending] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setEditValue(value)
    setImageError(false)
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleSave = async () => {
    if (editValue.trim() !== value) {
      setIsPending(true)
      try {
        await onSave(editValue.trim())
        setIsEditing(false)
        setImageError(false)
      } catch (error) {
        console.error('Error saving image URL:', error)
        setEditValue(value) // Revertir en caso de error
      } finally {
        setIsPending(false)
      }
    } else {
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
    setImageError(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const isValidImageUrl = (url: string) => {
    if (!url) return true
    const lowerUrl = url.toLowerCase()
    
    // URLs que claramente son imágenes
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
    if (imageExtensions.some(ext => lowerUrl.includes(ext))) {
      return true
    }
    
    // URLs de servicios de imágenes conocidos
    const imageServices = [
      'imgur.com',
      'cloudinary.com',
      'unsplash.com',
      'pexels.com',
      'images.unsplash.com',
      'cdn.jsdelivr.net',
      'cdnjs.cloudflare.com',
      'data:image',
      'blob:'
    ]
    
    if (imageServices.some(service => lowerUrl.includes(service))) {
      return true
    }
    
    // Para otras URLs, asumimos que pueden ser imágenes
    // La validación real se hace cuando se carga la imagen
    return true
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const handleImageLoad = () => {
    setImageError(false)
  }

  const handleUpload = async (url: string) => {
    setIsPending(true)
    try {
      await onSave(url)
      setIsEditing(false)
      setShowUpload(false)
      setImageError(false)
    } catch (error) {
      console.error('Error saving uploaded image:', error)
    } finally {
      setIsPending(false)
    }
  }

  if (!isAdminMode) {
    return (
      <div className={className}>
        {value ? (
          <div className="relative group">
            <img
              src={value}
              alt={alt}
              width={width}
              height={height}
              className="w-full rounded-xl border object-cover"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl border">
                <div className="text-center text-gray-500">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Error al cargar la imagen</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-64 bg-gray-100 rounded-xl border flex items-center justify-center">
            <div className="text-center text-gray-500">
              <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Sin imagen</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (isEditing) {
    return (
      <div className="space-y-4">
        {label && <div className="text-sm font-medium">{label}</div>}
        
        {/* Opciones de edición */}
        <div className="flex gap-2 mb-4">
          <Button
            size="sm"
            variant={!showUpload ? "default" : "outline"}
            onClick={() => setShowUpload(false)}
            className={!showUpload ? "bg-emerald-600 hover:bg-emerald-700" : ""}
          >
            <Edit2 className="h-4 w-4 mr-2" />
            URL
          </Button>
          <Button
            size="sm"
            variant={showUpload ? "default" : "outline"}
            onClick={() => setShowUpload(true)}
            className={showUpload ? "bg-emerald-600 hover:bg-emerald-700" : ""}
          >
            <Upload className="h-4 w-4 mr-2" />
            Subir
          </Button>
        </div>

        {/* Modal de upload */}
        {showUpload && (
          <div className="space-y-4">
            <ImageUpload
              onUpload={handleUpload}
              onCancel={() => setShowUpload(false)}
            />
          </div>
        )}

        {/* Campo de edición de URL */}
        {!showUpload && (
          <>
            {/* Vista previa de la imagen */}
            <div className="relative">
              {editValue ? (
                <img
                  src={editValue}
                  alt={alt}
                  width={width}
                  height={height}
                  className="w-full rounded-xl border object-cover"
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-xl border flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Vista previa</p>
                  </div>
                </div>
              )}
              
              {imageError && editValue && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-xl border-2 border-red-200">
                  <div className="text-center text-red-600">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm font-medium">Error al cargar la imagen</p>
                    <p className="text-xs">Verifica que la URL sea válida</p>
                  </div>
                </div>
              )}
            </div>

            {/* Campo de edición */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="url"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isPending || isSaving}
                  className={cn(
                    "flex-1 p-2 border rounded focus:outline-none focus:ring-2",
                    (isPending || isSaving) && "opacity-50 cursor-not-allowed",
                    isValidUrl(editValue) && isValidImageUrl(editValue) || !editValue 
                      ? "border-emerald-500 focus:ring-emerald-500/20" 
                      : "border-red-500 focus:ring-red-500/20"
                  )}
                  placeholder={placeholder}
                />
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={(editValue && (!isValidUrl(editValue) || !isValidImageUrl(editValue))) || isPending || isSaving}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {isPending || isSaving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isPending || isSaving}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Mensajes de validación */}
              {editValue && !isValidUrl(editValue) && (
                <p className="text-sm text-red-600">Por favor ingresa una URL válida</p>
              )}
              {editValue && isValidUrl(editValue) && !isValidImageUrl(editValue) && (
                <p className="text-sm text-red-600">La URL debe ser de una imagen válida</p>
              )}
              
              {/* Sugerencias */}
              <div className="text-xs text-muted-foreground">
                <p>💡 Sugerencias:</p>
                <ul className="list-disc list-inside space-y-1 mt-1">
                  <li>Usa cualquier URL de imagen válida</li>
                  <li>Servicios recomendados: Imgur, Cloudinary, Unsplash, tu propio servidor</li>
                  <li>La imagen se validará automáticamente al cargar</li>
                  <li>Deja vacío para usar imagen por defecto</li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="relative group">
      <div className={cn(
        "cursor-pointer hover:bg-emerald-50 rounded-xl transition-colors relative",
        isSaving && "opacity-75",
        isAdminMode && "ring-2 ring-emerald-200 ring-opacity-50",
        className
      )}>
        {isAdminMode && !value && (
          <div className="absolute inset-0 flex items-center justify-center bg-emerald-50 bg-opacity-50 rounded-xl">
            <div className="text-center">
              <Edit2 className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
              <p className="text-sm font-medium text-emerald-700">Haz clic para agregar imagen</p>
            </div>
          </div>
        )}
        {value ? (
          <div className="relative">
            <img
              src={value}
              alt={alt}
              width={width}
              height={height}
              className="w-full rounded-xl border object-cover"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-xl border-2 border-red-200">
                <div className="text-center text-red-600">
                  <ImageIcon className="h-8 w-8 mx-auto mb-1" />
                  <p className="text-xs font-medium">Error en la imagen</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-64 bg-gray-100 rounded-xl border flex items-center justify-center">
            <div className="text-center text-gray-500">
              <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Sin imagen</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Botón de edición */}
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setIsEditing(true)}
        disabled={isSaving}
        className={cn(
          "absolute top-2 right-2 h-8 w-8 p-0 transition-opacity bg-white border shadow-sm hover:bg-gray-50 z-10",
          isAdminMode ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      >
        <Edit2 className="h-4 w-4" />
      </Button>
      
      {/* Botón para abrir imagen */}
      {value && !imageError && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => window.open(value, '_blank')}
          className={cn(
            "absolute top-2 left-2 h-8 w-8 p-0 transition-opacity bg-white border shadow-sm hover:bg-gray-50 z-10",
            isAdminMode ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      )}
      
      {/* Label flotante */}
      {label && (
        <div className={cn(
          "absolute -top-2 left-2 bg-white px-2 py-1 rounded text-xs font-medium border shadow-sm transition-opacity z-10",
          isAdminMode ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}>
          {label}
        </div>
      )}
    </div>
  )
}
