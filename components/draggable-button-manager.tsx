"use client"

import { useState } from 'react'
import { useAdmin } from '@/lib/admin-context'
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Plus, Trash2, Settings, Calendar, ExternalLink, Hash, Play, Download, Mail, Phone, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EditableButton } from '@/components/editable-button'
import { EditableText } from '@/components/editable-text'
import { cn } from '@/lib/utils'

export interface ButtonConfig {
  id: string
  text: string
  type: 'url' | 'section' | 'modal'
  url?: string
  sectionId?: string
  modalTitle?: string
  modalContent?: string
  variant?: 'default' | 'outline' | 'secondary'
  icon?: string
  order: number
  section: string // Nueva propiedad para identificar la sección
}

interface DraggableButtonManagerProps {
  buttons: ButtonConfig[]
  onButtonsChange: (buttons: ButtonConfig[]) => void
  className?: string
  currentSection: string
  availableSections: { id: string; name: string }[]
}

// Secciones disponibles para scroll interno
const AVAILABLE_SECTIONS = [
  { id: 'hero', name: 'Hero (Inicio)' },
  { id: 'sesiones', name: 'Sesiones' },
  { id: 'curso', name: 'Curso Online' },
  { id: 'testimonios', name: 'Testimonios' },
  { id: 'contacto', name: 'Contacto' }
]

// Iconos disponibles
const AVAILABLE_ICONS = [
  { value: 'no-icon', label: 'Sin icono' },
  { value: 'calendar', label: 'Calendario' },
  { value: 'external-link', label: 'Enlace externo' },
  { value: 'hash', label: 'Sección' },
  { value: 'play', label: 'Reproducir' },
  { value: 'download', label: 'Descargar' },
  { value: 'mail', label: 'Email' },
  { value: 'phone', label: 'Teléfono' }
]

function getIconComponent(iconName?: string) {
  if (!iconName || iconName === 'no-icon') return null
  
  const iconMap = {
    'calendar': <Calendar className="h-4 w-4 mr-2" />,
    'external-link': <ExternalLink className="h-4 w-4 mr-2" />,
    'hash': <Hash className="h-4 w-4 mr-2" />,
    'play': <Play className="h-4 w-4 mr-2" />,
    'download': <Download className="h-4 w-4 mr-2" />,
    'mail': <Mail className="h-4 w-4 mr-2" />,
    'phone': <Phone className="h-4 w-4 mr-2" />
  }
  
  return iconMap[iconName as keyof typeof iconMap] || null
}

// Componente para botones arrastrables
function SortableButton({ button, onUpdate, onRemove, isAdminMode }: {
  button: ButtonConfig
  onUpdate: (updates: Partial<ButtonConfig>) => void
  onRemove: () => void
  isAdminMode: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: button.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const iconComponent = getIconComponent(button.icon)

  const renderButton = () => {
    if (button.type === 'modal') {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <EditableButton
              value={button.text}
              onSave={(newText) => onUpdate({ text: newText })}
              variant={button.variant}
              className="custom-primary-button-bg hover:opacity-90 text-white"
              placeholder="Texto del botón"
            >
              {iconComponent}
            </EditableButton>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                <EditableText
                  value={button.modalTitle || 'Título del Modal'}
                  onSave={(newTitle) => onUpdate({ modalTitle: newTitle })}
                  className="text-xl font-semibold"
                  tag="span"
                  placeholder="Título del modal"
                />
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <EditableText
                value={button.modalContent || 'Contenido del modal...'}
                onSave={(newContent) => onUpdate({ modalContent: newContent })}
                className="text-muted-foreground"
                tag="p"
                multiline
                placeholder="Contenido del modal"
              />
            </div>
          </DialogContent>
        </Dialog>
      )
    }

    if (button.type === 'section') {
      return (
        <EditableButton
          value={button.text}
          onSave={(newText) => onUpdate({ text: newText })}
          variant={button.variant}
          className="custom-outline-button-bg custom-outline-button-text"
          placeholder="Texto del botón"
          onClick={() => {
            const element = document.getElementById(button.sectionId || '')
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' })
            }
          }}
        >
          {iconComponent}
        </EditableButton>
      )
    }

    return (
      <EditableButton
        value={button.text}
        onSave={(newText) => onUpdate({ text: newText })}
        variant={button.variant}
        className={cn(
          button.variant === 'outline' 
            ? "custom-outline-button-bg custom-outline-button-text" 
            : "custom-primary-button-bg hover:opacity-90 text-white"
        )}
        placeholder="Texto del botón"
        onClick={() => {
          if (button.url) {
            window.open(button.url, '_blank')
          }
        }}
      >
        {iconComponent}
      </EditableButton>
    )
  }

  if (!isAdminMode) {
    return (
      <div ref={setNodeRef} style={style} {...attributes}>
        {renderButton()}
      </div>
    )
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes}
      className="bg-white rounded-lg border p-3 mb-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <div 
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Input
                value={button.text}
                onChange={(e) => onUpdate({ text: e.target.value })}
                className="h-8 text-sm border-0 p-0 focus-visible:ring-0"
                placeholder="Texto del botón"
              />
              <Select
                value={button.type}
                onValueChange={(value: 'url' | 'section' | 'modal') => 
                  onUpdate({ type: value })
                }
              >
                <SelectTrigger className="w-32 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="url">URL</SelectItem>
                  <SelectItem value="section">Sección</SelectItem>
                  <SelectItem value="modal">Modal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Campos específicos según el tipo */}
            {button.type === 'url' && (
              <Input
                value={button.url || ''}
                onChange={(e) => onUpdate({ url: e.target.value })}
                className="h-7 text-xs border-0 p-0 focus-visible:ring-0 text-muted-foreground"
                placeholder="https://ejemplo.com"
              />
            )}
            
            {button.type === 'section' && (
              <Select
                value={button.sectionId || ''}
                onValueChange={(value) => onUpdate({ sectionId: value })}
              >
                <SelectTrigger className="w-48 h-7">
                  <SelectValue placeholder="Seleccionar sección" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_SECTIONS.map(section => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {button.type === 'modal' && (
              <div className="space-y-1">
                <Input
                  value={button.modalTitle || ''}
                  onChange={(e) => onUpdate({ modalTitle: e.target.value })}
                  className="h-7 text-xs border-0 p-0 focus-visible:ring-0"
                  placeholder="Título del modal"
                />
                <Textarea
                  value={button.modalContent || ''}
                  onChange={(e) => onUpdate({ modalContent: e.target.value })}
                  className="h-16 text-xs border-0 p-0 focus-visible:ring-0 resize-none"
                  placeholder="Contenido del modal..."
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1 ml-2">
          <Select
            value={button.variant || 'default'}
            onValueChange={(value: 'default' | 'outline' | 'secondary') => 
              onUpdate({ variant: value })
            }
          >
            <SelectTrigger className="w-24 h-7">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Principal</SelectItem>
              <SelectItem value="outline">Borde</SelectItem>
              <SelectItem value="secondary">Secundario</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={button.icon || 'no-icon'}
            onValueChange={(value) => onUpdate({ icon: value })}
          >
            <SelectTrigger className="w-20 h-7">
              <SelectValue placeholder="Icono" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_ICONS.map(icon => (
                <SelectItem key={icon.value} value={icon.value}>
                  {icon.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={onRemove}
            className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export function DraggableButtonManager({ 
  buttons, 
  onButtonsChange, 
  className, 
  currentSection,
  availableSections 
}: DraggableButtonManagerProps) {
  const { isAdminMode } = useAdmin()
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newButtonData, setNewButtonData] = useState({
    text: '',
    type: 'url' as const,
    url: '',
    sectionId: '',
    modalTitle: '',
    modalContent: '',
    variant: 'default' as const,
    icon: 'no-icon'
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const addButton = () => {
    const newButton: ButtonConfig = {
      id: `button-${Date.now()}`,
      text: newButtonData.text,
      type: newButtonData.type,
      url: newButtonData.url,
      sectionId: newButtonData.sectionId,
      modalTitle: newButtonData.modalTitle,
      modalContent: newButtonData.modalContent,
      variant: newButtonData.variant,
      icon: newButtonData.icon,
      order: buttons.length,
      section: currentSection
    }
    
    onButtonsChange([...buttons, newButton])
    setShowAddDialog(false)
    setNewButtonData({
      text: '',
      type: 'url',
      url: '',
      sectionId: '',
      modalTitle: '',
      modalContent: '',
      variant: 'default',
      icon: 'no-icon'
    })
  }

  const updateButton = (buttonId: string, updates: Partial<ButtonConfig>) => {
    const updatedButtons = buttons.map(button =>
      button.id === buttonId ? { ...button, ...updates } : button
    )
    onButtonsChange(updatedButtons)
  }

  const removeButton = (buttonId: string) => {
    const updatedButtons = buttons.filter(button => button.id !== buttonId)
    onButtonsChange(updatedButtons)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = buttons.findIndex(button => button.id === active.id)
      const newIndex = buttons.findIndex(button => button.id === over?.id)
      
      const reorderedButtons = arrayMove(buttons, oldIndex, newIndex)
      
      // Actualizar el orden de los botones
      const updatedButtons = reorderedButtons.map((button, index) => ({
        ...button,
        order: index
      }))
      
      onButtonsChange(updatedButtons)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    
    if (!over) return

    const activeButton = buttons.find(button => button.id === active.id)
    const overButton = buttons.find(button => button.id === over.id)
    
    if (!activeButton || !overButton) return

    // Si el botón se está moviendo a una sección diferente
    if (activeButton.section !== overButton.section) {
      const updatedButtons = buttons.map(button => 
        button.id === active.id 
          ? { ...button, section: overButton.section }
          : button
      )
      onButtonsChange(updatedButtons)
    }
  }

  const currentSectionButtons = buttons.filter(button => button.section === currentSection)

  if (!isAdminMode) {
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <SortableContext 
          items={currentSectionButtons.map(button => button.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className={cn("flex flex-col sm:flex-row gap-3", className)}>
            {currentSectionButtons.map(button => (
              <SortableButton
                key={button.id}
                button={button}
                onUpdate={(updates) => updateButton(button.id, updates)}
                onRemove={() => removeButton(button.id)}
                isAdminMode={false}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    )
  }

  return (
    <div className={className}>
      {/* Panel de gestión de botones */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-emerald-800">
            Gestión de Botones - {availableSections.find(s => s.id === currentSection)?.name || currentSection}
          </h4>
          <Button
            onClick={() => setShowAddDialog(true)}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Botón
          </Button>
        </div>
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
          <SortableContext 
            items={currentSectionButtons.map(button => button.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {currentSectionButtons.map((button) => (
                <SortableButton
                  key={button.id}
                  button={button}
                  onUpdate={(updates) => updateButton(button.id, updates)}
                  onRemove={() => removeButton(button.id)}
                  isAdminMode={true}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        
        {currentSectionButtons.length === 0 && (
          <div className="text-center py-4 text-muted-foreground text-sm">
            No hay botones configurados en esta sección
          </div>
        )}
      </div>

      {/* Dialog para agregar nuevo botón */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Botón</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Texto del botón</Label>
              <Input
                value={newButtonData.text}
                onChange={(e) => setNewButtonData({ ...newButtonData, text: e.target.value })}
                placeholder="Ej: Agendar sesión"
              />
            </div>
            
            <div>
              <Label>Tipo de botón</Label>
              <Select
                value={newButtonData.type}
                onValueChange={(value: 'url' | 'section' | 'modal') => 
                  setNewButtonData({ ...newButtonData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="url">URL externa</SelectItem>
                  <SelectItem value="section">Sección de la web</SelectItem>
                  <SelectItem value="modal">Modal personalizable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {newButtonData.type === 'url' && (
              <div>
                <Label>URL de destino</Label>
                <Input
                  value={newButtonData.url}
                  onChange={(e) => setNewButtonData({ ...newButtonData, url: e.target.value })}
                  placeholder="https://ejemplo.com"
                />
              </div>
            )}
            
            {newButtonData.type === 'section' && (
              <div>
                <Label>Sección de destino</Label>
                <Select
                  value={newButtonData.sectionId}
                  onValueChange={(value) => setNewButtonData({ ...newButtonData, sectionId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar sección" />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_SECTIONS.map(section => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {newButtonData.type === 'modal' && (
              <>
                <div>
                  <Label>Título del modal</Label>
                  <Input
                    value={newButtonData.modalTitle}
                    onChange={(e) => setNewButtonData({ ...newButtonData, modalTitle: e.target.value })}
                    placeholder="Título del modal"
                  />
                </div>
                <div>
                  <Label>Contenido del modal</Label>
                  <Textarea
                    value={newButtonData.modalContent}
                    onChange={(e) => setNewButtonData({ ...newButtonData, modalContent: e.target.value })}
                    placeholder="Contenido del modal..."
                    rows={3}
                  />
                </div>
              </>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Estilo</Label>
                <Select
                  value={newButtonData.variant}
                  onValueChange={(value: 'default' | 'outline' | 'secondary') => 
                    setNewButtonData({ ...newButtonData, variant: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Principal</SelectItem>
                    <SelectItem value="outline">Borde</SelectItem>
                    <SelectItem value="secondary">Secundario</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Icono</Label>
                <Select
                  value={newButtonData.icon}
                  onValueChange={(value) => setNewButtonData({ ...newButtonData, icon: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sin icono" />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_ICONS.map(icon => (
                      <SelectItem key={icon.value} value={icon.value}>
                        {icon.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={addButton} 
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={!newButtonData.text.trim()}
            >
              Agregar Botón
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Renderizar botones */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <SortableContext 
          items={currentSectionButtons.map(button => button.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col sm:flex-row gap-3">
            {currentSectionButtons.map(button => (
              <SortableButton
                key={button.id}
                button={button}
                onUpdate={(updates) => updateButton(button.id, updates)}
                onRemove={() => removeButton(button.id)}
                isAdminMode={false}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
