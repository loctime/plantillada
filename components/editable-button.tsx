"use client"

import { useState, useRef, useEffect } from 'react'
import { useAdmin } from '@/lib/admin-context'
import { Edit2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EditableButtonProps {
  value: string
  onSave: (newValue: string) => void
  className?: string
  placeholder?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  disabled?: boolean
  children?: React.ReactNode
  [key: string]: any // Para pasar otras props al botón
}

export function EditableButton({ 
  value, 
  onSave, 
  className,
  placeholder = "Texto del botón",
  variant = "default",
  size = "default",
  disabled = false,
  children,
  ...buttonProps
}: EditableButtonProps) {
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
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSave = async () => {
    if (editValue.trim() !== value) {
      setIsPending(true)
      try {
        await onSave(editValue.trim())
        setIsEditing(false)
      } catch (error) {
        console.error('Error saving button text:', error)
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

  if (!isAdminMode) {
    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        disabled={disabled}
        {...buttonProps}
      >
        {children}
        {value}
      </Button>
    )
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isPending || isSaving}
          className={cn(
            "flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
            (isPending || isSaving) && "opacity-50 cursor-not-allowed",
            "border-emerald-500"
          )}
          placeholder={placeholder}
          style={{ 
            minWidth: `${Math.max(editValue.length * 8, 100)}px`,
            width: 'auto'
          }}
        />
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!editValue.trim() || isPending || isSaving}
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
    )
  }

  return (
    <div className="relative group">
      <Button
        variant={variant}
        size={size}
        className={cn(
          "transition-all duration-200",
          isSaving && "opacity-75",
          isAdminMode && "ring-2 ring-emerald-200 ring-opacity-50",
          className
        )}
        disabled={disabled || isSaving}
        {...buttonProps}
      >
        {children}
        {value}
      </Button>
      
      {/* Botón de edición */}
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setIsEditing(true)}
        disabled={isSaving}
        className={cn(
          "absolute -top-2 -right-2 h-6 w-6 p-0 transition-opacity bg-white border shadow-sm hover:bg-gray-50 z-10",
          isAdminMode ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      >
        <Edit2 className="h-3 w-3" />
      </Button>
    </div>
  )
}
