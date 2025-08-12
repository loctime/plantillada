"use client"

import { useState } from 'react'
import { useAdmin } from '@/lib/admin-context'
import { Plus, Trash2, Edit2, Settings, Link as LinkIcon, Calendar, ExternalLink, Hash, Play, Download, Mail, Phone } from 'lucide-react'
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
}

interface ButtonManagerProps {
  buttons: ButtonConfig[]
  onButtonsChange: (buttons: ButtonConfig[]) => void
  className?: string
  sectionId?: string
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

export function ButtonManager({ buttons, onButtonsChange, className, sectionId }: ButtonManagerProps) {
  const { isAdminMode, isSaving } = useAdmin()
  const [isManaging, setIsManaging] = useState(false)
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
      order: buttons.length
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
      icon: 'none'
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

  const renderButton = (button: ButtonConfig) => {
    const iconComponent = getIconComponent(button.icon)
    
    if (button.type === 'modal') {
      return (
        <Dialog key={button.id}>
          <DialogTrigger asChild>
            <EditableButton
              value={button.text}
              onSave={(newText) => updateButton(button.id, { text: newText })}
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
                  onSave={(newTitle) => updateButton(button.id, { modalTitle: newTitle })}
                  className="text-xl font-semibold"
                  tag="span"
                  placeholder="Título del modal"
                />
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <EditableText
                value={button.modalContent || 'Contenido del modal...'}
                onSave={(newContent) => updateButton(button.id, { modalContent: newContent })}
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
          key={button.id}
          value={button.text}
          onSave={(newText) => updateButton(button.id, { text: newText })}
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
        key={button.id}
        value={button.text}
        onSave={(newText) => updateButton(button.id, { text: newText })}
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
      <div className={cn("flex flex-col sm:flex-row gap-3", className)}>
        {buttons.map(button => renderButton(button))}
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Panel de gestión de botones */}
      {isManaging && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-emerald-800">Gestión de Botones</h4>
            <Button
              onClick={() => setShowAddDialog(true)}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Botón
            </Button>
          </div>
          
          <div className="space-y-2">
            {buttons.map((button, index) => (
              <div key={button.id} className="bg-white rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Input
                        value={button.text}
                        onChange={(e) => updateButton(button.id, { text: e.target.value })}
                        className="h-8 text-sm border-0 p-0 focus-visible:ring-0"
                        placeholder="Texto del botón"
                      />
                      <Select
                        value={button.type}
                        onValueChange={(value: 'url' | 'section' | 'modal') => 
                          updateButton(button.id, { type: value })
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
                        onChange={(e) => updateButton(button.id, { url: e.target.value })}
                        className="h-7 text-xs border-0 p-0 focus-visible:ring-0 text-muted-foreground"
                        placeholder="https://ejemplo.com"
                      />
                    )}
                    
                    {button.type === 'section' && (
                      <Select
                        value={button.sectionId || ''}
                        onValueChange={(value) => updateButton(button.id, { sectionId: value })}
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
                          onChange={(e) => updateButton(button.id, { modalTitle: e.target.value })}
                          className="h-7 text-xs border-0 p-0 focus-visible:ring-0"
                          placeholder="Título del modal"
                        />
                        <Textarea
                          value={button.modalContent || ''}
                          onChange={(e) => updateButton(button.id, { modalContent: e.target.value })}
                          className="h-16 text-xs border-0 p-0 focus-visible:ring-0 resize-none"
                          placeholder="Contenido del modal..."
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 ml-2">
                    <Select
                      value={button.variant || 'default'}
                      onValueChange={(value: 'default' | 'outline' | 'secondary') => 
                        updateButton(button.id, { variant: value })
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
                      value={button.icon || 'none'}
                      onValueChange={(value) => updateButton(button.id, { icon: value })}
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
                      onClick={() => removeButton(button.id)}
                      className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {buttons.length === 0 && (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No hay botones configurados
            </div>
          )}
        </div>
      )}

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

      {/* Toggle para mostrar/ocultar panel de gestión */}
      <div className="flex justify-center mb-4">
        <Button
          onClick={() => setIsManaging(!isManaging)}
          variant={isManaging ? "default" : "outline"}
          size="sm"
          className={cn(
            "shadow-lg transition-all duration-200",
            isManaging && "bg-emerald-600 hover:bg-emerald-700"
          )}
        >
          <Settings className="h-4 w-4 mr-2" />
          {isManaging ? "Ocultar Gestión de Botones" : "Gestionar Botones"}
        </Button>
      </div>

      {/* Renderizar botones */}
      <div className="flex flex-col sm:flex-row gap-3">
        {buttons.map(button => renderButton(button))}
      </div>
    </div>
  )
}
