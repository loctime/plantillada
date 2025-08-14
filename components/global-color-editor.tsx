"use client"

import { useState } from 'react'
import { useAdmin } from '@/lib/admin-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Palette, Settings, Eye, EyeOff, Save, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface ColorGroup {
  name: string
  colors: {
    key: string
    label: string
    description: string
    defaultValue: string
  }[]
}

const COLOR_GROUPS: ColorGroup[] = [
  {
    name: "Títulos",
    colors: [
      {
        key: "heroTitleColor",
        label: "Título Principal",
        description: "Color del título principal de la página",
        defaultValue: "#000000"
      },
      {
        key: "heroSubtitleColor", 
        label: "Subtítulo Principal",
        description: "Color del subtítulo principal",
        defaultValue: "#666666"
      },
      {
        key: "taglineColor",
        label: "Tagline",
        description: "Color del tagline del sitio",
        defaultValue: "#888888"
      },
      {
        key: "sessionsTitleColor",
        label: "Título de Sesiones",
        description: "Color del título de la sección de sesiones",
        defaultValue: "#000000"
      }
    ]
  },
  {
    name: "Navegación",
    colors: [
      {
        key: "titleColor",
        label: "Título de Navegación",
        description: "Color del título en la barra de navegación",
        defaultValue: "#000000"
      },
      {
        key: "navbarBackgroundColor",
        label: "Fondo de Navegación",
        description: "Color de fondo de la barra de navegación",
        defaultValue: "#ffffff"
      }
    ]
  },
  {
    name: "Botones",
    colors: [
      {
        key: "buttonBackgroundColor",
        label: "Fondo de Botones",
        description: "Color de fondo de los botones principales",
        defaultValue: "#000000"
      },
      {
        key: "buttonTextColor",
        label: "Texto de Botones",
        description: "Color del texto de los botones principales",
        defaultValue: "#ffffff"
      }
    ]
  },
  {
    name: "Fondos",
    colors: [
      {
        key: "backgroundColor",
        label: "Fondo Principal",
        description: "Color de fondo principal de la página",
        defaultValue: "#ffffff"
      },
      {
        key: "sectionBackgroundColor",
        label: "Fondo de Secciones",
        description: "Color de fondo de las secciones",
        defaultValue: "#f8f9fa"
      }
    ]
  }
]

export function GlobalColorEditor() {
  const { config, updateConfig, isAdminMode } = useAdmin()
  const [isOpen, setIsOpen] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [tempColors, setTempColors] = useState<Record<string, string>>({})
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  if (!isAdminMode || !config) return null

  // Inicializar colores temporales
  const initializeTempColors = () => {
    const colors: Record<string, string> = {}
    COLOR_GROUPS.forEach(group => {
      group.colors.forEach(color => {
        colors[color.key] = (config.site as any)?.[color.key] || color.defaultValue
      })
    })
    setTempColors(colors)
  }

  const handleColorChange = (key: string, value: string) => {
    setTempColors(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = async () => {
    try {
      await updateConfig({
        ...config,
        site: {
          ...config.site,
          ...tempColors
        }
      })
      setIsOpen(false)
    } catch (error) {
      console.error('Error saving colors:', error)
    }
  }

  const handleReset = () => {
    initializeTempColors()
  }

  const handlePreview = () => {
    // Aplicar colores temporalmente para preview
    Object.entries(tempColors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value)
    })
  }

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev)
      if (newSet.has(groupName)) {
        newSet.delete(groupName)
      } else {
        newSet.add(groupName)
      }
      return newSet
    })
  }

  const ColorInput = ({ color }: { color: any }) => {
    const currentValue = tempColors[color.key] || (config.site as any)?.[color.key] || color.defaultValue
    
    return (
      <div className="flex items-center gap-2 p-2 border rounded hover:bg-muted/30 transition-colors">
        <div className="flex-1 min-w-0">
          <Label className="text-xs font-medium truncate">{color.label}</Label>
        </div>
        <div className="flex items-center gap-1">
          <Input
            type="color"
            value={currentValue}
            onChange={(e) => handleColorChange(color.key, e.target.value)}
            className="w-6 h-6 p-0 cursor-pointer rounded border"
          />
          <Input
            type="text"
            value={currentValue}
            onChange={(e) => handleColorChange(color.key, e.target.value)}
            className="w-16 h-6 text-xs"
            placeholder="#000000"
          />
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Sheet open={isOpen} onOpenChange={(open) => {
            setIsOpen(open)
            if (open) {
              initializeTempColors()
            }
          }}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Palette className="h-4 w-4" />
                Colores Globales
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="bottom" 
              className="w-full h-[25vh] max-h-[300px] overflow-hidden"
            >
              <SheetHeader className="mb-2">
                <div className="flex items-center justify-between w-full">
                  <SheetTitle className="flex items-center gap-2 text-sm">
                    <Palette className="h-4 w-4" />
                    Editor de Colores Globales
                  </SheetTitle>
                  
                  {/* Controles en la primera línea */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPreview(!showPreview)}
                      className="h-6 px-2 text-xs"
                    >
                      {showPreview ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      Preview
                    </Button>
                    {showPreview && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreview}
                        className="h-6 px-2 text-xs"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Aplicar
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReset}
                      className="h-6 px-2 text-xs"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Reset
                    </Button>
                    <Button
                      onClick={handleSave}
                      size="sm"
                      className="h-6 px-2 text-xs"
                    >
                      <Save className="h-3 w-3" />
                      Guardar
                    </Button>
                  </div>
                </div>
              </SheetHeader>

              <div className="flex flex-col h-full">

                {/* Grupos de colores compactos */}
                <div className="flex-1 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-2">
                    {COLOR_GROUPS.map((group) => (
                      <div key={group.name} className="border rounded p-2">
                        <button
                          onClick={() => toggleGroup(group.name)}
                          className="flex items-center justify-between w-full text-xs font-medium mb-1"
                        >
                          {group.name}
                          {expandedGroups.has(group.name) ? 
                            <ChevronUp className="h-3 w-3" /> : 
                            <ChevronDown className="h-3 w-3" />
                          }
                        </button>
                        {expandedGroups.has(group.name) && (
                          <div className="space-y-1">
                            {group.colors.map((color) => (
                              <ColorInput key={color.key} color={color} />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preview compacto */}
                {showPreview && (
                  <div className="border-t pt-2 mt-2">
                    <div className="text-xs font-medium mb-1">Preview:</div>
                                         <div className="flex items-center gap-2 p-2 border rounded text-xs">
                       <div 
                         className="w-4 h-4 rounded border"
                         style={{ backgroundColor: tempColors.backgroundColor || (config.site as any)?.backgroundColor || "#ffffff" }}
                       />
                       <span>Fondo</span>
                       <div 
                         className="w-4 h-4 rounded border"
                         style={{ backgroundColor: tempColors.heroTitleColor || (config.site as any)?.heroTitleColor || "#000000" }}
                       />
                       <span>Título</span>
                       <Button
                         size="sm"
                         className="h-4 px-2 text-xs"
                         style={{
                           backgroundColor: tempColors.buttonBackgroundColor || (config.site as any)?.buttonBackgroundColor || "#000000",
                           color: tempColors.buttonTextColor || (config.site as any)?.buttonTextColor || "#ffffff"
                         }}
                       >
                         Botón
                       </Button>
                     </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </TooltipTrigger>
        <TooltipContent>
          <p>Editor de colores globales</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
