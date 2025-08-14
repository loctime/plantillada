"use client"

import { useState } from 'react'
import { useAdmin } from '@/lib/admin-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Palette } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const COLORS = [
  { key: "backgroundColor", label: "fondo" },
  { key: "buttonBackgroundColor", label: "botones" },
  { key: "heroTitleColor", label: "titulos" },
  { key: "heroSubtitleColor", label: "subtitulos" },
  { key: "taglineColor", label: "tagline" },
  { key: "sessionsTitleColor", label: "sesiones" },
  { key: "titleColor", label: "navegacion" },
  { key: "navbarBackgroundColor", label: "nav-fondo" },
  { key: "buttonTextColor", label: "boton-texto" },
  { key: "sectionBackgroundColor", label: "seccion-fondo" }
]

export function GlobalColorEditor() {
  const { config, updateConfig, isAdminMode } = useAdmin()
  const [isOpen, setIsOpen] = useState(false)

  if (!isAdminMode || !config) return null

  const handleColorChange = async (key: string, value: string) => {
    try {
      // Aplicar color inmediatamente al DOM
      document.documentElement.style.setProperty(`--${key}`, value)
      
      // Guardar en la configuración
      await updateConfig({
        ...config,
        site: {
          ...config.site,
          [key]: value
        }
      })
    } catch (error) {
      console.error('Error updating color:', error)
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
                     <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
              className="w-full h-[20vh] max-h-[180px] overflow-hidden"
            >
              <SheetHeader className="mb-1">
                <div className="flex items-center justify-between w-full">
                  <SheetTitle className="flex items-center gap-2 text-base font-semibold text-blue-600">
                    <Palette className="h-4 w-4" />
                    Colores Globales
                  </SheetTitle>
                  
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">Cambios automáticos</span>
                  </div>
                </div>
              </SheetHeader>

              <div className="flex flex-col h-full">
                {/* Colores en grid reactivo */}
                <div className="flex-1 overflow-y-auto">
                  <div className="grid grid-cols-10 gap-1">
                    {COLORS.map((color) => {
                      const currentValue = (config.site as any)?.[color.key] || "#000000"
                      
                      return (
                        <div key={color.key} className="flex items-center gap-1 p-1 border rounded">
                          <span className="text-sm font-medium whitespace-nowrap text-red-600">{color.label}:</span>
                          <Input
                            type="color"
                            value={currentValue}
                            onChange={(e) => handleColorChange(color.key, e.target.value)}
                            className="w-8 h-8 p-0 cursor-pointer rounded border"
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
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
