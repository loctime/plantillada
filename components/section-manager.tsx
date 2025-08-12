"use client"

import { useState, useEffect } from 'react'
import { useAdmin } from '@/lib/admin-context'
import { Plus, Trash2, GripVertical, Eye, EyeOff, ChevronDown, ChevronRight, Settings, Image as ImageIcon, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { EditableText } from '@/components/editable-text'
import { EditableImage } from '@/components/editable-image'
import { EditableUrl } from '@/components/editable-url'
import { DynamicSection } from '@/components/dynamic-section'
import { cn } from '@/lib/utils'

interface Section {
  id: string
  title: string
  visible: boolean
  component: React.ReactNode
  description?: string
  type?: string
  content?: {
    title?: string
    subtitle?: string
    description?: string
    imageUrl?: string
    buttonText?: string
    buttonUrl?: string
    backgroundColor?: string
    textColor?: string
  }
}

interface SectionManagerProps {
  sections: Section[]
  onSectionsChange: (sections: Section[]) => void
  className?: string
}



// Tipos de secciones predefinidas
const SECTION_TYPES = [
  {
    id: 'hero',
    title: 'Sección Hero',
    description: 'Título principal, subtítulo y botones de acción',
    template: {
      title: 'Sección Hero',
      description: 'Sección principal con título y call-to-action',
      type: 'hero',
      content: {
        title: 'Título Principal',
        subtitle: 'Subtítulo descriptivo',
        description: 'Descripción detallada de la sección',
        buttonText: 'Call to Action',
        buttonUrl: '#',
        backgroundColor: 'transparent',
        textColor: 'inherit'
      }
    }
  },
  {
    id: 'content',
    title: 'Sección de Contenido',
    description: 'Texto, imágenes y contenido multimedia',
    template: {
      title: 'Nueva Sección de Contenido',
      description: 'Sección con contenido personalizable',
      type: 'content',
      content: {
        title: 'Título de la Sección',
        description: 'Contenido descriptivo de la sección',
        imageUrl: '',
        buttonText: '',
        buttonUrl: '',
        backgroundColor: 'transparent',
        textColor: 'inherit'
      }
    }
  },
  {
    id: 'testimonials',
    title: 'Sección de Testimonios',
    description: 'Opiniones y comentarios de clientes',
    template: {
      title: 'Testimonios',
      description: 'Sección para mostrar testimonios de clientes',
      type: 'testimonials',
      content: {
        title: 'Lo que dicen nuestros clientes',
        description: 'Testimonios y opiniones de clientes satisfechos',
        backgroundColor: '#f8fafc',
        textColor: 'inherit'
      }
    }
  },
  {
    id: 'cta',
    title: 'Call to Action',
    description: 'Botón de acción principal',
    template: {
      title: 'Call to Action',
      description: 'Sección para impulsar la acción del usuario',
      type: 'cta',
      content: {
        title: '¿Listo para comenzar?',
        description: 'Da el siguiente paso hacia tus objetivos',
        buttonText: 'Comenzar Ahora',
        buttonUrl: '#',
        backgroundColor: '#059669',
        textColor: '#ffffff'
      }
    }
  },
  {
    id: 'linkhub',
    title: 'Link Hub',
    description: 'Página de enlaces y perfil personal',
    template: {
      title: 'Link Hub',
      description: 'Sección que muestra enlaces y perfil personal',
      type: 'linkhub',
      content: {
        title: 'Mis Enlaces',
        description: 'Encuentra todos mis enlaces importantes en un solo lugar',
        backgroundColor: 'transparent',
        textColor: 'inherit'
      }
    }
  },
  {
    id: 'shop',
    title: 'Tienda',
    description: 'Catálogo de productos y carrito de compras',
    template: {
      title: 'Tienda',
      description: 'Sección que muestra productos y permite compras',
      type: 'shop',
      content: {
        title: 'Nuestra Tienda',
        description: 'Descubre nuestros productos y servicios',
        backgroundColor: 'transparent',
        textColor: 'inherit'
      }
    }
  }
]

export function SectionManager({ sections, onSectionsChange, className }: SectionManagerProps) {
  const { isAdminMode, updateConfig } = useAdmin()
  const [isManaging, setIsManaging] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [draggedSection, setDraggedSection] = useState<string | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newSectionData, setNewSectionData] = useState({
    title: '',
    description: '',
    type: 'content'
  })

  // Persistir cambios en la configuración
  const persistSections = async (updatedSections: Section[]) => {
    // Actualizar el estado local
    onSectionsChange(updatedSections)
    
    // Guardar en localStorage
    try {
      localStorage.setItem('landing-sections', JSON.stringify(updatedSections))
    } catch (error) {
      console.warn('No se pudo guardar en localStorage:', error)
    }
    
    // Guardar en la configuración global de Firebase
    if (updateConfig) {
      try {
        // Obtener la configuración actual
        const response = await fetch('/api/config')
        if (response.ok) {
          const currentConfig = await response.json()
          
          // Actualizar la configuración con las secciones
          const updatedConfig = {
            ...currentConfig,
            sections: updatedSections.map(section => ({
              id: section.id,
              title: section.title,
              visible: section.visible,
              description: section.description,
              type: section.type,
              content: section.content
            }))
          }
          
          // Guardar en Firebase
          await updateConfig(updatedConfig)
          console.log('✅ Secciones guardadas en configuración global')
        }
      } catch (error) {
        console.warn('No se pudo guardar en configuración global:', error)
      }
    }
  }

  const toggleSectionVisibility = async (sectionId: string) => {
    const updatedSections = sections.map(section =>
      section.id === sectionId 
        ? { ...section, visible: !section.visible }
        : section
    )
    await persistSections(updatedSections)
  }

  const removeSection = async (sectionId: string) => {
    const updatedSections = sections.filter(section => section.id !== sectionId)
    await persistSections(updatedSections)
  }

  const toggleSectionExpanded = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const handleDragStart = (e: React.DragEvent, sectionId: string) => {
    setDraggedSection(sectionId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, targetSectionId: string) => {
    e.preventDefault()
    if (!draggedSection || draggedSection === targetSectionId) return

    const draggedIndex = sections.findIndex(s => s.id === draggedSection)
    const targetIndex = sections.findIndex(s => s.id === targetSectionId)
    
    const newSections = [...sections]
    const [draggedSectionData] = newSections.splice(draggedIndex, 1)
    newSections.splice(targetIndex, 0, draggedSectionData)
    
    await persistSections(newSections)
    setDraggedSection(null)
  }

  const addSection = async () => {
    const selectedType = SECTION_TYPES.find(t => t.id === newSectionData.type)
    const template = selectedType?.template || SECTION_TYPES[0].template
    
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: newSectionData.title || template.title,
      description: newSectionData.description || template.description,
      visible: true,
      type: template.type,
      content: template.content,
      component: (
        <DynamicSection 
          section={{
            id: `section-${Date.now()}`,
            title: newSectionData.title || template.title,
            description: newSectionData.description || template.description,
            visible: true,
            type: template.type,
            content: template.content,
            component: <div />
          }}
          onUpdate={async (newContent) => {
            const updatedSections = sections.map(s =>
              s.id === `section-${Date.now()}` 
                ? { ...s, content: newContent }
                : s
            )
            await persistSections(updatedSections)
          }}
        />
      )
    }
    
    await persistSections([...sections, newSection])
    setShowAddDialog(false)
    setNewSectionData({ title: '', description: '', type: 'content' })
  }

  const updateSectionTitle = async (sectionId: string, newTitle: string) => {
    const updatedSections = sections.map(section =>
      section.id === sectionId 
        ? { ...section, title: newTitle }
        : section
    )
    await persistSections(updatedSections)
  }

  const updateSectionContent = async (sectionId: string, newContent: any) => {
    const updatedSections = sections.map(section =>
      section.id === sectionId 
        ? { ...section, content: newContent }
        : section
    )
    await persistSections(updatedSections)
  }

  if (!isAdminMode) {
    return (
      <div className={className}>
        {sections.filter(section => section.visible).map(section => (
          <div key={section.id}>
            {section.component}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Panel de gestión de secciones */}
      {isManaging && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-emerald-800">Gestión de Secciones</h3>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Nueva Sección
            </Button>
          </div>
          
          <div className="space-y-2">
            {sections.map((section, index) => (
              <div 
                key={section.id} 
                className={cn(
                  "bg-white rounded-lg border transition-all",
                  draggedSection === section.id && "opacity-50",
                  "hover:shadow-md"
                )}
                draggable
                onDragStart={(e) => handleDragStart(e, section.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, section.id)}
              >
                <div className="flex items-center gap-3 p-4">
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Input
                        value={section.title}
                        onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                        className="h-8 text-sm font-medium border-0 p-0 focus-visible:ring-0"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleSectionExpanded(section.id)}
                        className="h-6 w-6 p-0"
                      >
                        {expandedSections.has(section.id) ? 
                          <ChevronDown className="h-3 w-3" /> : 
                          <ChevronRight className="h-3 w-3" />
                        }
                      </Button>
                    </div>
                    
                    {expandedSections.has(section.id) && (
                      <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
                        <p className="text-muted-foreground mb-2">
                          {section.description || 'Sin descripción'}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          Tipo: {section.type || 'personalizada'} | 
                          ID: {section.id}
                        </div>
                        {section.content && (
                          <div className="mt-2 text-xs">
                            <p>Contenido: {section.content.title || 'Sin título'}</p>
                            {section.content.imageUrl && <p>Imagen: ✓</p>}
                            {section.content.buttonText && <p>Botón: {section.content.buttonText}</p>}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleSectionVisibility(section.id)}
                      className={cn(
                        "h-8 w-8 p-0",
                        section.visible ? "text-emerald-600" : "text-muted-foreground"
                      )}
                      title={section.visible ? "Ocultar sección" : "Mostrar sección"}
                    >
                      {section.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeSection(section.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Eliminar sección"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {sections.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No hay secciones configuradas</p>
              <p className="text-sm">Haz clic en "Agregar Nueva Sección" para comenzar</p>
            </div>
          )}
        </div>
      )}

      {/* Dialog para agregar nueva sección */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nueva Sección</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="section-title">Título de la sección</Label>
              <Input
                id="section-title"
                value={newSectionData.title}
                onChange={(e) => setNewSectionData({ ...newSectionData, title: e.target.value })}
                placeholder="Ej: Mi Nueva Sección"
              />
            </div>
            <div>
              <Label htmlFor="section-description">Descripción</Label>
              <Textarea
                id="section-description"
                value={newSectionData.description}
                onChange={(e) => setNewSectionData({ ...newSectionData, description: e.target.value })}
                placeholder="Describe el contenido de esta sección..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="section-type">Tipo de sección</Label>
              <select
                id="section-type"
                value={newSectionData.type}
                onChange={(e) => setNewSectionData({ ...newSectionData, type: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                {SECTION_TYPES.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.title} - {type.description}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={addSection} className="bg-emerald-600 hover:bg-emerald-700">
                Agregar Sección
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Toggle para mostrar/ocultar panel de gestión */}
      <div className="fixed top-20 right-4 z-40">
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
          {isManaging ? "Ocultar Gestión" : "Gestionar Secciones"}
        </Button>
      </div>

      {/* Renderizar secciones visibles */}
      {sections.filter(section => section.visible).map(section => (
        <div key={section.id} className="relative">
          {section.component}
          
          {/* Indicador de sección editable */}
          <div className="absolute top-2 left-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity">
            {section.title}
          </div>
        </div>
      ))}
    </div>
  )
}
