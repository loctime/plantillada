"use client"

import { useMemo, useState } from 'react'
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
import { getDesignById } from '@/lib/designs'

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
  { key: "sectionBackgroundColor", label: "seccion-fondo" },
  { key: "heroBackgroundColor", label: "hero-bg" }
]

export function GlobalColorEditor() {
  const { config, updateConfig, isAdminMode } = useAdmin()
  const [isOpen, setIsOpen] = useState(false)
  const activeDesignId = config?.selectedDesigns?.landing
  const activeOverrides = (config as any)?.designOverrides?.[activeDesignId || '']
  const activeDesign = useMemo(() => activeDesignId ? getDesignById(activeDesignId) : undefined, [activeDesignId])

  const getEffectiveColor = (key: string): string | undefined => {
    // 1) Override específico del diseño activo
    const overrideVal = activeOverrides?.site?.[key]
    if (overrideVal) return overrideVal

    // 2) Mapeo desde theme del tenant (modo claro)
    const theme = (config as any)?.theme?.light || {}
    const themeMap: Record<string, string | undefined> = {
      backgroundColor: theme.backgroundColor,
      sectionBackgroundColor: theme.sectionBackground,
      navbarBackgroundColor: theme.navbarBackground,
      buttonBackgroundColor: theme.primaryButtonColor,
      titleColor: (config as any)?.theme?.light?.headingColor,
      // acentos y secundarios
      linkColor: theme.accentColor,
    }
    if (key in themeMap && themeMap[key as keyof typeof themeMap]) return themeMap[key as keyof typeof themeMap]

    // 3) Variables CSS por defecto del diseño
    const cssVarMap: Record<string, string> = {
      backgroundColor: '--background-color',
      sectionBackgroundColor: '--section-background',
      navbarBackgroundColor: '--navbar-background',
      buttonBackgroundColor: '--primary-button-color',
      buttonTextColor: '--button-text-color',
      titleColor: '--heading-color',
      linkColor: '--link-color',
      linkHoverColor: '--link-hover-color',
      heroBackgroundColor: '--section-background'
    }
    const cssVar = cssVarMap[key]
    if (cssVar && activeDesign?.cssVariables?.[cssVar]) return activeDesign.cssVariables[cssVar]

    // 4) Fallback: valores sueltos en site
    const siteVal = (config?.site as any)?.[key]
    if (siteVal) return siteVal
    return undefined
  }

  if (!isAdminMode || !config) return null

  const handleColorChange = async (key: string, value: string) => {
    try {
      // Aplicar color inmediatamente al DOM
      document.documentElement.style.setProperty(`--${key}`, value)
      
      // Guardar en la configuración
      const designId = config.selectedDesigns?.landing
      if (designId) {
        // Guardar override específico del diseño activo
        await updateConfig({
          designOverrides: {
            ...(config as any).designOverrides,
            [designId]: {
              ...(config as any).designOverrides?.[designId],
              site: {
                ...(config as any).designOverrides?.[designId]?.site,
                [key]: value
              }
            }
          }
        } as any)
      } else {
        await updateConfig({
          ...config,
          site: {
            ...config.site,
            [key]: value
          }
        })
      }
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
                      const currentValue = getEffectiveColor(color.key) || "#000000"
                      
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
