"use client"

import { useState } from 'react'
import { useAdmin } from '@/lib/admin-context'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EditableText } from './editable-text'
import { cn } from '@/lib/utils'

interface TestimonialManagerProps {
  testimonials: Array<{
    quote: string
    author: string
    role: string
  }>
  onTestimonialsChange: (testimonials: Array<{
    quote: string
    author: string
    role: string
  }>) => void
}

export function TestimonialManager({ testimonials, onTestimonialsChange }: TestimonialManagerProps) {
  const { isAdminMode } = useAdmin()
  const [isManaging, setIsManaging] = useState(false)

  const addTestimonial = () => {
    const newTestimonial = {
      quote: 'Nuevo testimonio de cliente satisfecho.',
      author: 'Cliente Anónimo',
      role: 'Profesional'
    }
    onTestimonialsChange([...testimonials, newTestimonial])
  }

  const removeTestimonial = (index: number) => {
    onTestimonialsChange(testimonials.filter((_, i) => i !== index))
  }

  const updateTestimonial = (index: number, updates: Partial<typeof testimonials[0]>) => {
    const newTestimonials = [...testimonials]
    newTestimonials[index] = { ...newTestimonials[index], ...updates }
    onTestimonialsChange(newTestimonials)
  }

  if (!isAdminMode) {
    return null
  }

  return (
    <div className="mb-6">
      {/* Panel de gestión de testimonios */}
      {isManaging && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-emerald-800">Gestión de Testimonios</h3>
          <div className="space-y-4">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg border p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Testimonio {index + 1}</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeTestimonial(index)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Testimonio</label>
                    <EditableText
                      value={testimonial.quote}
                      onSave={(newValue) => updateTestimonial(index, { quote: newValue })}
                      className="text-sm leading-relaxed italic"
                      tag="blockquote"
                      multiline
                    />
                  </div>
                  
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Autor</label>
                      <EditableText
                        value={testimonial.author}
                        onSave={(newValue) => updateTestimonial(index, { author: newValue })}
                        className="text-sm font-medium"
                        tag="figcaption"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Cargo/Rol</label>
                      <EditableText
                        value={testimonial.role}
                        onSave={(newValue) => updateTestimonial(index, { role: newValue })}
                        className="text-xs text-muted-foreground"
                        tag="div"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <Button
              onClick={addTestimonial}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Nuevo Testimonio
            </Button>
          </div>
        </div>
      )}

      {/* Toggle para mostrar/ocultar panel de gestión */}
      <div className="flex justify-center mb-6">
        <Button
          onClick={() => setIsManaging(!isManaging)}
          variant={isManaging ? "default" : "outline"}
          size="sm"
          className={cn(
            "shadow-lg transition-all duration-200",
            isManaging && "bg-emerald-600 hover:bg-emerald-700"
          )}
        >
          <Edit2 className="h-4 w-4 mr-2" />
          {isManaging ? "Ocultar Gestión de Testimonios" : "Gestionar Testimonios"}
        </Button>
      </div>
    </div>
  )
}
