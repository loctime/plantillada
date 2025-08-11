"use client"

import { useState, useRef, useEffect } from 'react'
import { useAdmin } from '@/lib/admin-context'
import { Edit2, Check, X, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EditableUrlProps {
  value: string
  onSave: (newValue: string) => void
  className?: string
  placeholder?: string
  label?: string
  showPreview?: boolean
}

export function EditableUrl({ 
  value, 
  onSave, 
  className,
  placeholder = "https://ejemplo.com",
  label,
  showPreview = true
}: EditableUrlProps) {
  const { isAdminMode, isSaving } = useAdmin()
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [isPending, setIsPending] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setEditValue(value)
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
      } catch (error) {
        console.error('Error saving URL:', error)
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

  if (!isAdminMode) {
    return (
      <div className={className}>
        {label && <span className="text-sm text-muted-foreground">{label}: </span>}
        {value ? (
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-emerald-600 hover:text-emerald-700 underline inline-flex items-center gap-1"
          >
            {showPreview ? value : 'Ver enlace'}
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="text-muted-foreground italic">Sin enlace</span>
        )}
      </div>
    )
  }

  if (isEditing) {
    return (
      <div className="space-y-2">
        {label && <div className="text-sm font-medium">{label}</div>}
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
              isValidUrl(editValue) || !editValue 
                ? "border-emerald-500 focus:ring-emerald-500/20" 
                : "border-red-500 focus:ring-red-500/20"
            )}
            placeholder={placeholder}
          />
          <Button
            size="sm"
            onClick={handleSave}
            disabled={(editValue && !isValidUrl(editValue)) || isPending || isSaving}
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
        {editValue && !isValidUrl(editValue) && (
          <p className="text-sm text-red-600">Por favor ingresa una URL válida</p>
        )}
      </div>
    )
  }

  return (
    <div className="relative group">
      <div className={cn(
        "cursor-pointer hover:bg-emerald-50 rounded px-2 py-1 -mx-2 transition-colors",
        isSaving && "opacity-75",
        className
      )}>
        {label && <span className="text-sm text-muted-foreground">{label}: </span>}
        {value ? (
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-emerald-600 hover:text-emerald-700 underline inline-flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {showPreview ? value : 'Ver enlace'}
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="text-muted-foreground italic">Sin enlace</span>
        )}
      </div>
      
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setIsEditing(true)}
        disabled={isSaving}
        className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white border shadow-sm"
      >
        <Edit2 className="h-3 w-3" />
      </Button>
    </div>
  )
}
