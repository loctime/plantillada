"use client"

import { useState } from 'react'
import { useAdmin } from '@/lib/admin-context'
import { Plus, Trash2, Edit2, Settings, Link as LinkIcon, Calendar, ExternalLink, Hash, Play, Download, Mail, Phone, GripVertical, ChevronUp, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
}

interface SectionButtonManagerProps {
  buttons: ButtonConfig[]
  onButtonsChange: (buttons: ButtonConfig[]) => void
  sectionId: string
  sectionName: string
  className?: string
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

export function SectionButtonManager({ buttons, onButtonsChange, sectionId, sectionName, className }: SectionButtonManagerProps) {
  const { isAdminMode } = useAdmin()
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingButton, setEditingButton] = useState<ButtonConfig | null>(null)
  const [buttonData, setButtonData] = useState({
    text: '',
    type: 'url' as const,
    url: '',
    sectionId: '',
    modalTitle: '',
    modalContent: '',
    variant: 'default' as const,
    icon: 'no-icon'
  })

  const addButton = () => {
    const newButton: ButtonConfig = {
      id: `button-${Date.now()}`,
      text: buttonData.text,
      type: buttonData.type,
      url: buttonData.url,
      sectionId: buttonData.sectionId,
      modalTitle: buttonData.modalTitle,
      modalContent: buttonData.modalContent,
      variant: buttonData.variant,
      icon: buttonData.icon,
      order: buttons.length
    }
    
    onButtonsChange([...buttons, newButton])
    setShowAddDialog(false)
    resetButtonData()
  }

  const updateButton = () => {
    if (!editingButton) return
    
    const updatedButtons = buttons.map(button =>
      button.id === editingButton.id
        ? { ...button, ...buttonData }
        : button
    )
    
    onButtonsChange(updatedButtons)
    setShowAddDialog(false)
    setEditingButton(null)
    resetButtonData()
  }

  const deleteButton = (buttonId: string) => {
    const updatedButtons = buttons.filter(button => button.id !== buttonId)
    onButtonsChange(updatedButtons)
  }

  const editButton = (button: ButtonConfig) => {
    setEditingButton(button)
    setButtonData({
      text: button.text,
      type: button.type,
      url: button.url || '',
      sectionId: button.sectionId || '',
      modalTitle: button.modalTitle || '',
      modalContent: button.modalContent || '',
      variant: button.variant || 'default',
      icon: button.icon || 'no-icon'
    })
    setShowAddDialog(true)
  }

  const resetButtonData = () => {
    setButtonData({
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

  const handleButtonClick = (button: ButtonConfig) => {
    switch (button.type) {
      case 'url':
        if (button.url) {
          window.open(button.url, '_blank')
        }
        break
      case 'section':
        if (button.sectionId) {
          const element = document.getElementById(button.sectionId)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }
        break
      case 'modal':
        // Aquí podrías implementar un modal personalizado
        if (button.modalTitle && button.modalContent) {
          alert(`${button.modalTitle}\n\n${button.modalContent}`)
        }
        break
    }
  }

  const renderButton = (button: ButtonConfig) => {
    const variantClasses = {
      default: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      outline: 'border border-emerald-600 text-emerald-600 hover:bg-emerald-50',
      secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900'
    }

    return (
      <button
        key={button.id}
        onClick={() => handleButtonClick(button)}
        className={cn(
          'inline-flex h-10 items-center justify-center rounded-md px-6 text-sm font-medium shadow-sm transition-colors',
          variantClasses[button.variant || 'default']
        )}
      >
        {getIconComponent(button.icon)}
        {button.text}
      </button>
    )
  }

  if (!isAdminMode) {
    return (
      <div className={cn("flex flex-col sm:flex-row gap-3", className)}>
        {buttons.map(button => renderButton(button))}
      </div>
    )
  }

  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={cn("mt-6", className)}>
      {/* Botón compacto para expandir/contraer */}
      <div className="flex items-center justify-between mb-4">
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="outline"
          size="sm"
          className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
        >
          <Settings className="h-4 w-4 mr-2" />
          Botones de {sectionName} ({buttons.length})
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 ml-2" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-2" />
          )}
        </Button>
        
        {isExpanded && (
          <Button
            onClick={() => setShowAddDialog(true)}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-3 w-3 mr-1" />
            Agregar Botón
          </Button>
        )}
      </div>

      {/* Panel expandible de gestión de botones */}
      {isExpanded && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          {/* Lista de botones existentes */}
          {buttons.length > 0 && (
            <div className="space-y-2">
              {buttons.map((button, index) => (
                <div 
                  key={button.id} 
                  className="flex items-center gap-2 p-2 bg-white rounded border"
                >
                  <GripVertical className="h-3 w-3 text-gray-400" />
                  <Input
                    value={button.text}
                    onChange={(e) => {
                      const updatedButtons = buttons.map(b =>
                        b.id === button.id ? { ...b, text: e.target.value } : b
                      )
                      onButtonsChange(updatedButtons)
                    }}
                    className="h-7 text-xs border-0 p-0 focus-visible:ring-0"
                    placeholder="Texto del botón"
                  />
                  <Select
                    value={button.type}
                    onValueChange={(value: 'url' | 'section' | 'modal') => {
                      const updatedButtons = buttons.map(b =>
                        b.id === button.id ? { ...b, type: value } : b
                      )
                      onButtonsChange(updatedButtons)
                    }}
                  >
                    <SelectTrigger className="h-7 w-20 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="url">URL</SelectItem>
                      <SelectItem value="section">Sección</SelectItem>
                      <SelectItem value="modal">Modal</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => editButton(button)}
                    className="h-7 w-7 p-0"
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteButton(button.id)}
                    className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          {buttons.length === 0 && (
            <p className="text-xs text-blue-600 text-center py-2">
              No hay botones en esta sección. Haz clic en "Agregar Botón" para crear uno.
            </p>
          )}
        </div>
      )}

      {/* Dialog para agregar/editar botón */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingButton ? 'Editar Botón' : 'Agregar Nuevo Botón'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Texto del botón</Label>
              <Input
                value={buttonData.text}
                onChange={(e) => setButtonData({ ...buttonData, text: e.target.value })}
                placeholder="Ej: Contactar, Ver más, etc."
              />
            </div>
            
            <div>
              <Label>Tipo de botón</Label>
              <Select
                value={buttonData.type}
                onValueChange={(value: 'url' | 'section' | 'modal') => 
                  setButtonData({ ...buttonData, type: value })
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
            
            {buttonData.type === 'url' && (
              <div>
                <Label>URL de destino</Label>
                <Input
                  value={buttonData.url}
                  onChange={(e) => setButtonData({ ...buttonData, url: e.target.value })}
                  placeholder="https://ejemplo.com"
                />
              </div>
            )}
            
            {buttonData.type === 'section' && (
              <div>
                <Label>Sección de destino</Label>
                <Select
                  value={buttonData.sectionId}
                  onValueChange={(value) => setButtonData({ ...buttonData, sectionId: value })}
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
            
            {buttonData.type === 'modal' && (
              <>
                <div>
                  <Label>Título del modal</Label>
                  <Input
                    value={buttonData.modalTitle}
                    onChange={(e) => setButtonData({ ...buttonData, modalTitle: e.target.value })}
                    placeholder="Título del modal"
                  />
                </div>
                <div>
                  <Label>Contenido del modal</Label>
                  <Textarea
                    value={buttonData.modalContent}
                    onChange={(e) => setButtonData({ ...buttonData, modalContent: e.target.value })}
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
                  value={buttonData.variant}
                  onValueChange={(value: 'default' | 'outline' | 'secondary') => 
                    setButtonData({ ...buttonData, variant: value })
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
                  value={buttonData.icon}
                  onValueChange={(value) => setButtonData({ ...buttonData, icon: value })}
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
            <Button variant="outline" onClick={() => {
              setShowAddDialog(false)
              setEditingButton(null)
              resetButtonData()
            }}>
              Cancelar
            </Button>
            <Button 
              onClick={editingButton ? updateButton : addButton} 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!buttonData.text.trim()}
            >
              {editingButton ? 'Actualizar Botón' : 'Agregar Botón'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Renderizar botones */}
      <div className="flex flex-col sm:flex-row gap-3">
        {buttons.map(button => renderButton(button))}
      </div>
    </div>
  )
}
