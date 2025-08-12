"use client"

import { useAdmin } from '@/lib/admin-context'
import { Button } from '@/components/ui/button'
import { EditableText } from '@/components/editable-text'
import { EditableImage } from '@/components/editable-image'
import { EditableUrl } from '@/components/editable-url'
import { SectionButtonManager, ButtonConfig } from '@/components/section-button-manager'

interface SectionContent {
  title?: string
  subtitle?: string
  description?: string
  imageUrl?: string
  buttonText?: string
  buttonUrl?: string
  backgroundColor?: string
  textColor?: string
  buttons?: ButtonConfig[]
}

interface Section {
  id: string
  title: string
  visible: boolean
  component: React.ReactNode
  description?: string
  type?: string
  content?: SectionContent
}

interface DynamicSectionProps {
  section: Section
  onUpdate: (content: SectionContent) => void
}

export function DynamicSection({ section, onUpdate }: DynamicSectionProps) {
  const { isAdminMode } = useAdmin()
  const content = section.content || {}

  const handleContentUpdate = (field: string, value: string) => {
    const newContent = { ...content, [field]: value }
    onUpdate(newContent)
  }

  return (
    <section 
      className="w-full py-12 md:py-16"
      style={{ 
        backgroundColor: content.backgroundColor || 'transparent',
        color: content.textColor || 'inherit'
      }}
    >
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          {/* Contenido de texto */}
          <div className="space-y-6">
            {content.title && (
              <EditableText
                value={content.title}
                onSave={(value) => handleContentUpdate('title', value)}
                className="text-3xl sm:text-4xl font-bold tracking-tight"
                tag="h2"
                placeholder="Título de la sección..."
              />
            )}
            
            {content.subtitle && (
              <EditableText
                value={content.subtitle}
                onSave={(value) => handleContentUpdate('subtitle', value)}
                className="text-xl text-muted-foreground"
                tag="h3"
                placeholder="Subtítulo..."
              />
            )}
            
            {content.description && (
              <EditableText
                value={content.description}
                onSave={(value) => handleContentUpdate('description', value)}
                className="text-muted-foreground leading-relaxed"
                tag="p"
                multiline
                placeholder="Descripción de la sección..."
              />
            )}
            
            {/* Gestión de botones */}
            <SectionButtonManager
              buttons={content.buttons || []}
              onButtonsChange={(newButtons) => handleContentUpdate('buttons', newButtons)}
              sectionId={section.id}
              sectionName={section.title}
            />
            
            {/* Botón legacy (para compatibilidad) */}
            {content.buttonText && !content.buttons?.length && (
              <div className="flex flex-col sm:flex-row gap-3">
                <EditableText
                  value={content.buttonText}
                  onSave={(value) => handleContentUpdate('buttonText', value)}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-600 hover:bg-emerald-700 px-6 text-sm font-medium text-white shadow-sm transition-colors"
                  tag="span"
                  placeholder="Texto del botón..."
                />
                {content.buttonUrl && (
                  <EditableUrl
                    value={content.buttonUrl}
                    onSave={(value) => handleContentUpdate('buttonUrl', value)}
                    placeholder="URL del botón..."
                    className="text-xs text-muted-foreground"
                  />
                )}
              </div>
            )}
          </div>
          
          {/* Imagen */}
          {content.imageUrl && (
            <div className="relative">
              <EditableImage
                value={content.imageUrl}
                onSave={(value) => handleContentUpdate('imageUrl', value)}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                placeholder="URL de la imagen..."
              />
            </div>
          )}
        </div>
        
        {/* Controles de edición para secciones vacías */}
        {isAdminMode && (!content.title && !content.description && !content.imageUrl) && (
          <div className="mt-8 p-6 border-2 border-dashed border-muted-foreground/20 rounded-lg text-center">
            <p className="text-muted-foreground mb-4">Esta sección está vacía. Haz hover sobre los elementos para editarlos.</p>
            <div className="flex justify-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleContentUpdate('title', 'Nuevo Título')}
              >
                Agregar Título
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleContentUpdate('description', 'Nueva descripción')}
              >
                Agregar Descripción
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleContentUpdate('imageUrl', 'https://via.placeholder.com/600x400')}
              >
                Agregar Imagen
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleContentUpdate('buttonText', 'Nuevo Botón')}
              >
                Agregar Botón
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
