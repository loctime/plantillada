"use client"

import { useState } from 'react'
import { useAdmin } from '@/lib/admin-context'
import { Edit2, Plus, Trash2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EditableListProps {
  items: string[]
  onSave: (newItems: string[]) => void
  className?: string
  placeholder?: string
  addButtonText?: string
}

export function EditableList({ 
  items, 
  onSave, 
  className,
  placeholder = "Agregar elemento...",
  addButtonText = "Agregar"
}: EditableListProps) {
  const { isAdminMode, isSaving } = useAdmin()
  const [isEditing, setIsEditing] = useState(false)
  const [editItems, setEditItems] = useState<string[]>(items)
  const [newItem, setNewItem] = useState('')
  const [isPending, setIsPending] = useState(false)

  const handleSave = async () => {
    const filteredItems = editItems.filter(item => item.trim() !== '')
    if (JSON.stringify(filteredItems) !== JSON.stringify(items)) {
      setIsPending(true)
      try {
        await onSave(filteredItems)
        setIsEditing(false)
      } catch (error) {
        console.error('Error saving list:', error)
        setEditItems(items) // Revertir en caso de error
      } finally {
        setIsPending(false)
      }
    } else {
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditItems(items)
    setIsEditing(false)
    setNewItem('')
  }

  const addItem = () => {
    if (newItem.trim()) {
      setEditItems([...editItems, newItem.trim()])
      setNewItem('')
    }
  }

  const removeItem = (index: number) => {
    setEditItems(editItems.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, value: string) => {
    const newItems = [...editItems]
    newItems[index] = value
    setEditItems(newItems)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addItem()
    }
  }

  if (!isAdminMode) {
    return (
      <ul className={className}>
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-emerald-600 mt-0.5">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )
  }

  if (isEditing) {
    return (
      <div className="space-y-3">
        <ul className={className}>
          {editItems.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-emerald-600 mt-0.5">•</span>
              <input
                type="text"
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                disabled={isPending || isSaving}
                className={cn(
                  "flex-1 p-1 border border-emerald-500 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
                  (isPending || isSaving) && "opacity-50 cursor-not-allowed"
                )}
                placeholder="Elemento de la lista..."
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeItem(index)}
                disabled={isPending || isSaving}
                className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </li>
          ))}
        </ul>

        {/* Agregar nuevo elemento */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isPending || isSaving}
            className={cn(
              "flex-1 p-2 border border-emerald-500 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
              (isPending || isSaving) && "opacity-50 cursor-not-allowed"
            )}
            placeholder={placeholder}
          />
          <Button
            size="sm"
            onClick={addItem}
            disabled={isPending || isSaving}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isPending || isSaving}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isPending || isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
            ) : (
              <Check className="h-4 w-4 mr-1" />
            )}
            Guardar
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={isPending || isSaving}
          >
            <X className="h-4 w-4 mr-1" />
            Cancelar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative group">
      <ul className={cn(
        "cursor-pointer hover:bg-emerald-50 rounded p-2 -m-2 transition-colors",
        isSaving && "opacity-75",
        className
      )}>
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-emerald-600 mt-0.5">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      
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
