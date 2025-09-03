"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Save, X, Edit3 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EditableTextProps {
  value: string
  onSave: (value: string) => Promise<void> | void
  className?: string
  placeholder?: string
  multiline?: boolean
  maxLength?: number
}

export function EditableText({ 
  value, 
  onSave, 
  className, 
  placeholder, 
  multiline = false,
  maxLength
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [isPending, setIsPending] = useState(false)

  // Solo actualizar editValue cuando cambie value Y no estemos editando
  useEffect(() => {
    if (!isEditing && editValue !== value) {
      console.log('🔄 EditableText: Actualizando editValue desde prop:', { oldValue: editValue, newValue: value })
      setEditValue(value)
    }
  }, [value, isEditing])

  const handleEdit = () => {
    console.log('✏️ EditableText handleEdit called')
    setIsEditing(true)
    setEditValue(value)
  }

  const handleCancel = () => {
    console.log('❌ EditableText handleCancel called')
    setIsEditing(false)
    setEditValue(value)
  }

  const handleSave = async () => {
    console.log('🔄 EditableText handleSave called:', { currentValue: value, newValue: editValue.trim() })
    
    if (editValue.trim() !== value) {
      setIsPending(true)
      try {
        console.log('💾 EditableText calling onSave with:', editValue.trim())
        await onSave(editValue.trim())
        console.log('✅ EditableText onSave completed')
        setIsEditing(false)
        // NO actualizar editValue aquí, dejar que el useEffect lo maneje
      } catch (error) {
        console.error('❌ Error saving text:', error)
        setEditValue(value) // Revertir en caso de error
      } finally {
        setIsPending(false)
      }
    } else {
      console.log('ℹ️ EditableText no changes detected, skipping save')
      setIsEditing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (isEditing) {
    return (
      <div className="flex items-center space-x-2">
        {multiline ? (
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            maxLength={maxLength}
            className={cn("min-h-[60px]", className)}
            autoFocus
          />
        ) : (
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            maxLength={maxLength}
            className={className}
            autoFocus
          />
        )}
        <Button
          size="sm"
          onClick={handleSave}
          disabled={isPending}
          className="bg-green-500 hover:bg-green-600"
        >
          <Save className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCancel}
          disabled={isPending}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="group relative">
      <div className={cn("cursor-pointer hover:bg-gray-50 rounded px-1 py-0.5", className)}>
        {multiline ? (
          <div className="whitespace-pre-wrap">{value || placeholder}</div>
        ) : (
          <span>{value || placeholder}</span>
        )}
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleEdit}
        className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Edit3 className="h-3 w-3" />
      </Button>
    </div>
  )
}
