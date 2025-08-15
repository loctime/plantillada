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

// Mapeo de claves del editor a claves del theme
const THEME_KEY_MAP: Record<string, string | undefined> = {
  backgroundColor: 'backgroundColor',
  sectionBackgroundColor: 'sectionBackground',
  navbarBackgroundColor: 'navbarBackground',
  buttonBackgroundColor: 'primaryButtonColor',
  titleColor: 'headingColor',
  // Los siguientes no pertenecen al theme directamente; se manejan como overrides de site
  buttonTextColor: undefined,
  heroTitleColor: undefined,
  heroSubtitleColor: undefined,
  taglineColor: undefined,
  sessionsTitleColor: undefined,
  heroBackgroundColor: undefined
}

// Mapeo a variables CSS kebab-case
const CSS_VAR_MAP: Record<string, string> = {
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

function buildBaseThemeFromDesign(design: any) {
  const scheme = design?.colorScheme || { primary: '#10b981', secondary: '#3b82f6', accent: '#10b981' }
  return {
    light: {
      backgroundColor: '#ffffff',
      sectionBackground: '#f8fafc',
      navbarBackground: '#ffffff',
      textColor: '#1e293b',
      accentColor: scheme.accent,
      primaryButtonColor: scheme.primary,
      secondaryButtonColor: scheme.secondary,
      outlineButtonColor: scheme.secondary,
      headingColor: undefined
    },
    dark: {
      backgroundColor: '#0f172a',
      sectionBackground: '#1e293b',
      navbarBackground: '#0f172a',
      textColor: '#f1f5f9',
      accentColor: scheme.accent,
      primaryButtonColor: scheme.primary,
      secondaryButtonColor: scheme.secondary,
      outlineButtonColor: '#9ca3af',
      headingColor: undefined
    }
  }
}

function mergeTheme(base: any, override?: any) {
  return {
    light: { ...(base?.light || {}), ...(override?.light || {}) },
    dark: { ...(base?.dark || {}), ...(override?.dark || {}) }
  }
}

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
    // 1) Override del theme por diseño (modo claro)
    const themeKey = THEME_KEY_MAP[key]
    const themeOverride = (activeOverrides as any)?.theme?.light
    if (themeKey && themeOverride?.[themeKey]) return themeOverride[themeKey]

    // 2) Override específico del diseño activo en site (para claves no-theme)
    const overrideVal = activeOverrides?.site?.[key]
    if (overrideVal) return overrideVal

    // 3) Mapeo desde theme del tenant (modo claro)
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

    // 4) Variables CSS por defecto del diseño
    const cssVar = CSS_VAR_MAP[key]
    if (cssVar && activeDesign?.cssVariables?.[cssVar]) return activeDesign.cssVariables[cssVar]

    // 5) Fallback: valores sueltos en site
    const siteVal = (config?.site as any)?.[key]
    if (siteVal) return siteVal
    return undefined
  }

  if (!isAdminMode || !config) return null

  const handleColorChange = async (key: string, value: string) => {
    try {
      // Aplicar color inmediatamente al DOM (kebab-case)
      const cssVar = CSS_VAR_MAP[key]
      if (cssVar) {
        document.documentElement.style.setProperty(cssVar, value)
      }
      
      // Guardar en la configuración
      const designId = config.selectedDesigns?.landing
      if (designId) {
        const themeKey = THEME_KEY_MAP[key]
        if (themeKey) {
          // Edita el theme por diseño (modo claro). Se puede extender a dark si agregas un toggle.
          const base = buildBaseThemeFromDesign(activeDesign)
          const currentOverride = (config as any)?.designOverrides?.[designId]?.theme
          const newOverride = {
            light: {
              ...(currentOverride?.light || {}),
              [themeKey]: value
            },
            dark: { ...(currentOverride?.dark || {}) }
          }
          const effective = mergeTheme(base, newOverride)

          console.log('🎨 Guardando override de theme para diseño:', designId, newOverride)
          await updateConfig({
            designOverrides: {
              ...(config as any).designOverrides,
              [designId]: {
                ...(config as any).designOverrides?.[designId],
                theme: newOverride
              }
            },
            theme: effective
          } as any)
          console.log('✅ Override de theme guardado y tema efectivo actualizado')
        } else {
          // Claves no-theme: guardar como overrides de site por diseño
          console.log('📝 Guardando override de site para diseño:', designId, key, value)
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
          console.log('✅ Override de site guardado')
        }
      } else {
        await updateConfig({
          ...config,
          site: {
            ...config.site,
            [key]: value
          }
        })
        console.log('🗂️ Guardado global en site (sin diseño activo)', key, value)
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
              className="w-full h-[25vh] max-h-[220px] overflow-hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-start gap-4 mb-2">
                  <SheetTitle className="flex items-center gap-2 text-base font-semibold text-blue-600 flex-shrink-0">
                    <Palette className="h-4 w-4" />
                    Colores Globales
                  </SheetTitle>
                  
                  <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-3 gap-1">
                      {COLORS.map((color) => {
                        const currentValue = getEffectiveColor(color.key) || "#000000"
                        
                        return (
                          <div key={color.key} className="flex items-center gap-1 p-1 border rounded bg-background/50">
                            <span className="text-xs font-medium whitespace-nowrap text-foreground/80">{color.label}:</span>
                            <Input
                              type="color"
                              value={currentValue}
                              onChange={(e) => handleColorChange(color.key, e.target.value)}
                              className="w-6 h-6 p-0 cursor-pointer rounded border"
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-xs text-muted-foreground">Cambios automáticos</span>
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
