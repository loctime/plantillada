"use client"

import { useState, useRef, useEffect } from 'react'
import { useAdmin } from '@/lib/admin-context'
import { Edit2, Check, X, Image as ImageIcon, Video, ExternalLink, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EditableMediaProps {
  value: string
  onSave: (newValue: string) => void
  className?: string
  placeholder?: string
  label?: string
  width?: number
  height?: number
  alt?: string
  showPreview?: boolean
  mediaType?: 'auto' | 'image' | 'video'
}

export function EditableMedia({ 
  value, 
  onSave, 
  className,
  placeholder = "https://ejemplo.com/media.jpg",
  label,
  width = 420,
  height = 520,
  alt = "Media",
  showPreview = true,
  mediaType = 'auto'
}: EditableMediaProps) {
  const { isAdminMode, isSaving } = useAdmin()
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [isPending, setIsPending] = useState(false)
  const [mediaError, setMediaError] = useState(false)
  const [detectedType, setDetectedType] = useState<'image' | 'video' | 'unknown'>('unknown')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setEditValue(value)
    setMediaError(false)
    if (value) {
      setDetectedType(detectMediaType(value))
    }
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const detectMediaType = (url: string): 'image' | 'video' | 'unknown' => {
    if (!url) return 'unknown'
    
    const lowerUrl = url.toLowerCase()
    
    // Detectar videos
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi']
    const videoServices = [
      'youtube.com',
      'youtu.be',
      'vimeo.com',
      'dailymotion.com',
      'twitch.tv'
    ]
    
    if (videoExtensions.some(ext => lowerUrl.includes(ext)) ||
        videoServices.some(service => lowerUrl.includes(service))) {
      return 'video'
    }
    
    // Detectar imágenes
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
    const imageServices = [
      'imgur.com',
      'cloudinary.com',
      'unsplash.com',
      'pexels.com',
      'images.unsplash.com'
    ]
    
    if (imageExtensions.some(ext => lowerUrl.includes(ext)) ||
        imageServices.some(service => lowerUrl.includes(service))) {
      return 'image'
    }
    
    return 'unknown'
  }

  const handleSave = async () => {
    if (editValue.trim() !== value) {
      setIsPending(true)
      try {
        await onSave(editValue.trim())
        setIsEditing(false)
        setMediaError(false)
        setDetectedType(detectMediaType(editValue.trim()))
      } catch (error) {
        console.error('Error saving media URL:', error)
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
    setMediaError(false)
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

  const isValidMediaUrl = (url: string) => {
    if (!url) return true
    const lowerUrl = url.toLowerCase()
    
    // URLs que claramente son media
    const mediaExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.mp4', '.webm', '.ogg', '.mov', '.avi']
    if (mediaExtensions.some(ext => lowerUrl.includes(ext))) {
      return true
    }
    
    // URLs de servicios de media conocidos
    const mediaServices = [
      'imgur.com',
      'cloudinary.com',
      'unsplash.com',
      'pexels.com',
      'images.unsplash.com',
      'youtube.com',
      'youtu.be',
      'vimeo.com',
      'dailymotion.com',
      'cdn.jsdelivr.net',
      'cdnjs.cloudflare.com',
      'data:image',
      'data:video',
      'blob:'
    ]
    
    if (mediaServices.some(service => lowerUrl.includes(service))) {
      return true
    }
    
    // Para otras URLs, asumimos que pueden ser media
    return true
  }

  const handleMediaError = () => {
    setMediaError(true)
  }

  const handleMediaLoad = () => {
    setMediaError(false)
  }

  const getEmbedUrl = (url: string): string => {
    const lowerUrl = url.toLowerCase()
    
    // YouTube
    if (lowerUrl.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0]
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url
    }
    if (lowerUrl.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0]
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url
    }
    
    // Vimeo
    if (lowerUrl.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url
    }
    
    return url
  }

  const renderMedia = (url: string, isPreview = false) => {
    const type = detectMediaType(url)
    const embedUrl = getEmbedUrl(url)
    
    if (type === 'video') {
      return (
        <div className="aspect-video w-full rounded-xl border overflow-hidden bg-black">
          <iframe
            src={embedUrl}
            title={alt}
            className="w-full h-full"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
            allowFullScreen
            onError={handleMediaError}
            onLoad={handleMediaLoad}
          />
        </div>
      )
    }
    
    return (
      <img
        src={url}
        alt={alt}
        width={width}
        height={height}
        className="w-full rounded-xl border object-cover"
        onError={handleMediaError}
        onLoad={handleMediaLoad}
      />
    )
  }

  if (!isAdminMode) {
    return (
      <div className={className}>
        {value ? (
          <div className="relative group">
            {renderMedia(value)}
            {mediaError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl border">
                <div className="text-center text-gray-500">
                  {detectedType === 'video' ? (
                    <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  ) : (
                    <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  )}
                  <p className="text-sm">Error al cargar el contenido</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-64 bg-gray-100 rounded-xl border flex items-center justify-center">
            <div className="text-center text-gray-500">
              <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Sin contenido</p>
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
        
        {/* Vista previa del contenido */}
        <div className="relative">
          {editValue ? (
            renderMedia(editValue, true)
          ) : (
            <div className="w-full h-64 bg-gray-100 rounded-xl border flex items-center justify-center">
              <div className="text-center text-gray-500">
                <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Vista previa</p>
              </div>
            </div>
          )}
          
          {mediaError && editValue && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-xl border-2 border-red-200">
              <div className="text-center text-red-600">
                {detectedType === 'video' ? (
                  <Video className="h-12 w-12 mx-auto mb-2" />
                ) : (
                  <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                )}
                <p className="text-sm font-medium">Error al cargar el contenido</p>
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
                isValidUrl(editValue) && isValidMediaUrl(editValue) || !editValue 
                  ? "border-emerald-500 focus:ring-emerald-500/20" 
                  : "border-red-500 focus:ring-red-500/20"
              )}
              placeholder={placeholder}
            />
            <Button
              size="sm"
              onClick={handleSave}
              disabled={(editValue && (!isValidUrl(editValue) || !isValidMediaUrl(editValue))) || isPending || isSaving}
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
          {editValue && isValidUrl(editValue) && !isValidMediaUrl(editValue) && (
            <p className="text-sm text-red-600">La URL debe ser de un contenido válido</p>
          )}
          
          {/* Sugerencias */}
          <div className="text-xs text-muted-foreground">
            <p>💡 Sugerencias:</p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>Imágenes: JPG, PNG, GIF, WebP, SVG o servicios como Imgur, Unsplash</li>
              <li>Videos: MP4, WebM, OGG o YouTube, Vimeo, Dailymotion</li>
              <li>El tipo de contenido se detecta automáticamente</li>
              <li>Deja vacío para usar contenido por defecto</li>
            </ul>
          </div>
        </div>
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
              <p className="text-sm font-medium text-emerald-700">Haz clic para agregar imagen o video</p>
            </div>
          </div>
        )}
        {value ? (
          <div className="relative">
            {renderMedia(value)}
            {mediaError && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-xl border-2 border-red-200">
                <div className="text-center text-red-600">
                  {detectedType === 'video' ? (
                    <Video className="h-8 w-8 mx-auto mb-1" />
                  ) : (
                    <ImageIcon className="h-8 w-8 mx-auto mb-1" />
                  )}
                  <p className="text-xs font-medium">Error en el contenido</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-64 bg-gray-100 rounded-xl border flex items-center justify-center">
            <div className="text-center text-gray-500">
              <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Sin contenido</p>
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
      
      {/* Botón para abrir contenido */}
      {value && !mediaError && (
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
