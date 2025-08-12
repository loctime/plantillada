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
import { Plus, Trash2, Settings, Calendar, ExternalLink, Hash, Play, Download, Mail, Phone, GripVertical, Move } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EditableButton } from '@/components/editable-button'
import { EditableText } from '@/components/editable-text'
import { cn } from '@/lib/utils'
import { ButtonConfig } from './draggable-button-manager'

interface GlobalButtonManagerProps {
  buttons: ButtonConfig[]
  onButtonsChange: (buttons: ButtonConfig[]) => void
  className?: string
}

// Secciones disponibles
const AVAILABLE_SECTIONS = [
  { id: 'hero', name: 'Hero (Inicio)' },
  { id: 'about', name: 'Sobre Mí' },
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

// Componente para botones arrastrables en vista global
function GlobalSortableButton({ button, onUpdate, onRemove, onMoveToSection }: {
  button: ButtonConfig
  onUpdate: (updates: Partial<ButtonConfig>) => void
  onRemove: () => void
  onMoveToSection: (section: string) => void
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
  const currentSection = AVAILABLE_SECTIONS.find(s => s.id === button.section)

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
              
              <Select
                value={button.section}
                onValueChange={(value) => onMoveToSection(value)}
              >
                <SelectTrigger className="w-40 h-8">
                  <SelectValue />
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
      
      {/* Vista previa del botón */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Vista previa:</span>
          <div className="flex-1">
            <EditableButton
              value={button.text}
              onSave={(newText) => onUpdate({ text: newText })}
              variant={button.variant}
              className={cn(
                button.variant === 'outline' 
                  ? "custom-outline-button-bg custom-outline-button-text" 
                  : "custom-primary-button-bg hover:opacity-90 text-white",
                "h-8 text-sm"
              )}
              placeholder="Texto del botón"
            >
              {iconComponent}
            </EditableButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export function GlobalButtonManager({ 
  buttons, 
  onButtonsChange, 
  className 
}: GlobalButtonManagerProps) {
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
    icon: 'no-icon',
    section: 'hero'
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
      section: newButtonData.section
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
      icon: 'no-icon',
      section: 'hero'
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

  const moveButtonToSection = (buttonId: string, newSection: string) => {
    const updatedButtons = buttons.map(button =>
      button.id === buttonId ? { ...button, section: newSection } : button
    )
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

  if (!isAdminMode) {
    return null
  }

  // Agrupar botones por sección
  const buttonsBySection = AVAILABLE_SECTIONS.map(section => ({
    ...section,
    buttons: buttons.filter(button => button.section === section.id)
  }))

  return (
    <div className={className}>
      {/* Panel de gestión global de botones */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-blue-800">
            Gestión Global de Botones ({buttons.length} botones)
          </h4>
          <Button
            onClick={() => setShowAddDialog(true)}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Botón
          </Button>
        </div>
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={buttons.map(button => button.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {buttonsBySection.map(section => (
                <div key={section.id} className="space-y-2">
                  <h5 className="text-xs font-medium text-blue-700 uppercase tracking-wide">
                    {section.name} ({section.buttons.length})
                  </h5>
                  {section.buttons.map((button) => (
                    <GlobalSortableButton
                      key={button.id}
                      button={button}
                      onUpdate={(updates) => updateButton(button.id, updates)}
                      onRemove={() => removeButton(button.id)}
                      onMoveToSection={(newSection) => moveButtonToSection(button.id, newSection)}
                    />
                  ))}
                  {section.buttons.length === 0 && (
                    <div className="text-center py-2 text-muted-foreground text-xs">
                      No hay botones en esta sección
                    </div>
                  )}
                </div>
              ))}
            </div>
          </SortableContext>
        </DndContext>
        
        {buttons.length === 0 && (
          <div className="text-center py-4 text-muted-foreground text-sm">
            No hay botones configurados
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
            
            <div className="grid grid-cols-2 gap-4">
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
              
              <div>
                <Label>Sección de destino</Label>
                <Select
                  value={newButtonData.section}
                  onValueChange={(value) => setNewButtonData({ ...newButtonData, section: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
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
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!newButtonData.text.trim()}
            >
              Agregar Botón
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
