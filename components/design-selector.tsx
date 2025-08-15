"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { 
  Palette,
  CheckCircle,
  FileText,
  Paintbrush,
  AlertTriangle,
  Info
} from "lucide-react"
import { Design, getDesignsForTemplate } from "@/lib/designs"
import { getTenantId } from "@/lib/config-loader"
import { useAdmin } from "@/lib/admin-context"

interface DesignSelectorProps {
  onDesignSelect: (design: Design) => void
  selectedDesign?: string
  templateType: string
  onApply?: () => void
}

export function DesignSelector({ onDesignSelect, selectedDesign, templateType, onApply }: DesignSelectorProps) {
  const { config, updateConfig } = useAdmin()
  const [selectedDesignState, setSelectedDesignState] = useState<string>(selectedDesign || '')
  const [applyContent, setApplyContent] = useState(false)
  const [applyColors, setApplyColors] = useState(true)
  const [applying, setApplying] = useState(false)

  // Sincronizar el estado interno con las props
  useEffect(() => {
    setSelectedDesignState(selectedDesign || '')
  }, [selectedDesign])

  const handleDesignSelect = (designId: string) => {
    setSelectedDesignState(designId)
    const designs = getDesignsForTemplate(templateType)
    const selectedDesign = designs.find(d => d.id === designId)
    if (selectedDesign) {
      onDesignSelect(selectedDesign)
    }
  }

  const handleApplyDesign = async () => {
    if (!selectedDesignState) return

    try {
      setApplying(true)
      const designs = getDesignsForTemplate(templateType)
      const selected = designs.find(d => d.id === selectedDesignState)
      if (!selected) return

      // Guardar selección del diseño
      await updateConfig({
        selectedDesigns: {
          ...(config?.selectedDesigns || {}),
          [templateType]: selectedDesignState
        }
      } as any)

      // Si el usuario eligió aplicar contenido predefinido, podemos delegarlo a la página (o mostrar aviso)
      if (applyContent && onApply) onApply()
    } catch (error) {
      console.error('Error aplicando diseño:', error)
      alert('Error aplicando el diseño')
    } finally {
      setApplying(false)
    }
  }

  const getStatusBadge = (status: Design['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Activo</Badge>
      case 'beta':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Beta</Badge>
      case 'coming-soon':
        return <Badge variant="outline" className="text-gray-500">Próximamente</Badge>
    }
  }

  const designs = getDesignsForTemplate(templateType)
  const selectedDesignObj = designs.find(d => d.id === selectedDesignState)

  if (designs.length === 0) {
    return (
      <div className="text-center py-8">
        <Palette className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay diseños disponibles</h3>
        <p className="text-gray-500">No hay diseños configurados para este tipo de plantilla.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Selecciona tu Diseño</h2>
        <p className="text-muted-foreground">
          Elige el estilo visual que mejor represente tu negocio
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {designs.map((design) => (
          <Card 
            key={design.id}
            className={`transition-all duration-200 hover:shadow-lg cursor-pointer ${
              selectedDesignState === design.id
                ? 'ring-2 ring-primary border-primary' 
                : 'hover:border-gray-300'
            }`}
            onClick={() => handleDesignSelect(design.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="p-1.5 rounded-md text-white"
                    style={{ backgroundColor: design.colorScheme.primary }}
                  >
                    {design.icon}
                  </div>
                  <div>
                    <CardTitle className="text-sm">{design.name}</CardTitle>
                    {getStatusBadge(design.status)}
                  </div>
                </div>
                {selectedDesignState === design.id && (
                  <CheckCircle className="h-5 w-5 text-primary" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <CardDescription className="text-xs">
                {design.description}
              </CardDescription>
              
              <div className="space-y-2">
                <h4 className="font-medium text-xs">Paleta de colores:</h4>
                <div className="flex gap-2">
                  <div 
                    className="w-6 h-6 rounded-full border border-gray-200"
                    style={{ backgroundColor: design.colorScheme.primary }}
                    title="Color primario"
                  />
                  <div 
                    className="w-6 h-6 rounded-full border border-gray-200"
                    style={{ backgroundColor: design.colorScheme.secondary }}
                    title="Color secundario"
                  />
                  <div 
                    className="w-6 h-6 rounded-full border border-gray-200"
                    style={{ backgroundColor: design.colorScheme.accent }}
                    title="Color de acento"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <h4 className="font-medium text-xs">Características:</h4>
                <ul className="space-y-0.5">
                  {design.features.slice(0, 2).map((feature, index) => (
                    <li key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                      <div className="w-1 h-1 bg-primary rounded-full" />
                      {feature}
                    </li>
                  ))}
                  {design.features.length > 2 && (
                    <li className="text-xs text-muted-foreground">
                      +{design.features.length - 2} más...
                    </li>
                  )}
                </ul>
              </div>

              {design.predefinedConfig && (
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-1 text-xs text-blue-600">
                    <FileText className="h-3 w-3" />
                    Incluye contenido predefinido
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedDesignState && selectedDesignObj && (
        <div className="space-y-4">
          <Separator />
          
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">
              Diseño seleccionado: {selectedDesignObj.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              Este diseño se aplicará a toda la plantilla {templateType}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Opciones de Aplicación</CardTitle>
              <CardDescription>
                Elige qué elementos del diseño quieres aplicar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="apply-colors" 
                  checked={applyColors}
                  onCheckedChange={(checked) => setApplyColors(checked as boolean)}
                />
                <Label htmlFor="apply-colors" className="flex items-center gap-2">
                  <Paintbrush className="h-4 w-4" />
                  Aplicar colores y tipografías
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="apply-content" 
                  checked={applyContent}
                  onCheckedChange={(checked) => setApplyContent(checked as boolean)}
                />
                <Label htmlFor="apply-content" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Aplicar contenido predefinido
                  {selectedDesignObj.predefinedConfig && (
                    <Badge variant="secondary" className="text-xs">Disponible</Badge>
                  )}
                </Label>
              </div>

              {selectedDesignObj.predefinedConfig && applyContent && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Contenido que se aplicará:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Título y descripción del sitio</li>
                        <li>• Servicios/sesiones específicos del sector</li>
                        <li>• Información "Sobre mí" adaptada</li>
                        <li>• Testimonios relevantes</li>
                        <li>• Información de contacto</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium mb-1">⚠️ Importante:</p>
                    <p className="text-xs">
                      Se creará automáticamente un backup de tu configuración actual antes de aplicar el diseño.
                      Podrás restaurarlo desde la sección de backups si lo necesitas.
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleApplyDesign}
                disabled={applying || (!applyColors && !applyContent)}
                className="w-full"
              >
                {applying ? (
                  'Aplicando diseño...'
                ) : (
                  <>
                    <Palette className="h-4 w-4 mr-2" />
                    Aplicar Diseño
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
