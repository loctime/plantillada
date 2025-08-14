"use client"

import { useState, useRef, useEffect } from 'react'
import { useAdmin } from '@/lib/admin-context'
import { Edit2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ColorPicker } from '@/components/color-picker'

interface EditableTextProps {
  value: string
  onSave: (newValue: string) => void
  className?: string
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  placeholder?: string
  multiline?: boolean
  textColor?: string
  onColorChange?: (color: string) => void
  showColorPicker?: boolean
}

export function EditableText({ 
  value, 
  onSave, 
  className, 
  tag = 'span',
  placeholder = "Escribir texto...",
  multiline = false,
  textColor,
  onColorChange,
  showColorPicker = false
}: EditableTextProps) {
  const { isAdminMode, isSaving } = useAdmin()
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [isPending, setIsPending] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    setEditValue(value)
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      if (multiline) {
        inputRef.current.setSelectionRange(editValue.length, editValue.length)
      }
    }
  }, [isEditing, editValue.length, multiline])

  const handleSave = async () => {
    if (editValue.trim() !== value) {
      setIsPending(true)
      try {
        await onSave(editValue.trim())
        setIsEditing(false)
      } catch (error) {
        console.error('Error saving text:', error)
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
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (!isAdminMode) {
    const Tag = tag as keyof React.JSX.IntrinsicElements
    return (
      <Tag 
        className={className}
        style={textColor ? { color: textColor } : undefined}
      >
        {value}
      </Tag>
    )
  }

  if (isEditing) {
    return (
      <div className="relative group">
        {multiline ? (
          <textarea
            ref={inputRef as React.Ref<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isPending || isSaving}
            className={cn(
              "w-full min-h-[60px] p-2 border border-emerald-500 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
              (isPending || isSaving) && "opacity-50 cursor-not-allowed",
              className
            )}
            placeholder={placeholder}
          />
        ) : (
          <input
            ref={inputRef as React.Ref<HTMLInputElement>}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isPending || isSaving}
            className={cn(
              "w-full p-1 border border-emerald-500 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
              (isPending || isSaving) && "opacity-50 cursor-not-allowed",
              className
            )}
            placeholder={placeholder}
          />
        )}
        
        <div className="absolute -top-2 -right-2 flex gap-1">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isPending || isSaving}
            className="h-6 w-6 p-0 bg-emerald-600 hover:bg-emerald-700"
          >
            {isPending || isSaving ? (
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
            ) : (
              <Check className="h-3 w-3" />
            )}
          </Button>
          <Button
            size="sm"
            onClick={handleCancel}
            disabled={isPending || isSaving}
            variant="outline"
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative group">
      <div 
        className={cn(
          "cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded px-1 -mx-1 transition-colors",
          isSaving && "opacity-75",
          className
        )}
        style={textColor ? { color: textColor } : undefined}
      >
        {value || <span className="text-muted-foreground italic">{placeholder}</span>}
      </div>
      
      <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsEditing(true)}
          disabled={isSaving}
          className="h-6 w-6 p-0 custom-bg border shadow-sm"
        >
          <Edit2 className="h-3 w-3" />
        </Button>
        
        {showColorPicker && onColorChange && (
          <ColorPicker
            value={textColor || '#000000'}
            onChange={onColorChange}
            compact={true}
            className="h-6 w-6 p-0"
          />
        )}
      </div>
    </div>
  )
}
