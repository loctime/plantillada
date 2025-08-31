"use client"

import { useState } from "react"
import { useAdmin } from "@/lib/admin-context"
import { getDesignsForTemplate, applyDesignToDocument } from "@/lib/designs"
import { getTenantId } from "@/lib/config-loader"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Palette } from "lucide-react"

type Props = {
  templateType?: string
  fullWidth?: boolean
}

export function DesignQuickPicker({ templateType = "landing", fullWidth = false }: Props) {
  const { config, updateConfig, isAdminMode, refreshConfig } = useAdmin()
  const [open, setOpen] = useState(false)
  const [applyingId, setApplyingId] = useState<string | null>(null)

  if (!isAdminMode || !config) return null

  const designs = getDesignsForTemplate(templateType)
  const selected = config.selectedDesigns?.[templateType]

  const handleApply = async (designId: string) => {
    const design = designs.find(d => d.id === designId)
    if (!design) return
    try {
      setApplyingId(designId)
      // Aplicación visual inmediata de variables CSS del diseño
      applyDesignToDocument(design)

      // Construir colores simplificados desde el diseño seleccionado
      const buildSimplifiedColorsFromDesign = (d: any) => {
        const scheme = d?.colorScheme || { primary: '#10b981', secondary: '#3b82f6', accent: '#10b981' }
        return {
          light: {
            primary: '#f5f5dc',      // beige por defecto
            secondary: scheme.secondary || '#87ceeb',  // usar el secundario del diseño
            tertiary: scheme.primary || '#90ee90',     // usar el primario del diseño
            border1: '#0000ff',      // azul por defecto
            border2: '#000000',      // negro por defecto
            text: '#000000'          // negro por defecto
          },
          dark: {
            primary: '#2f2f2f',      // negro mate por defecto
            secondary: scheme.secondary || '#4a90e2',  // usar el secundario del diseño
            tertiary: scheme.primary || '#6b8e23',     // usar el primario del diseño
            border1: '#8a2be2',      // violeta por defecto
            border2: '#0000ff',      // azul por defecto
            text: '#ffffff'          // blanco por defecto
          }
        }
      }

      // Construir tema base desde el diseño seleccionado
      const buildBaseThemeFromDesign = (d: any) => {
        const scheme = d?.colorScheme || { primary: '#10b981', secondary: '#3b82f6', accent: '#10b981' }
        return {
          light: {
            backgroundColor: '#f5f5dc',
            sectionBackground: '#f5f5dc',
            navbarBackground: '#f5f5dc',
            textColor: '#000000',
            accentColor: scheme.secondary || '#87ceeb',
            primaryButtonColor: scheme.secondary || '#87ceeb',
            secondaryButtonColor: scheme.primary || '#90ee90',
            outlineButtonColor: '#0000ff',
            headingColor: undefined
          },
          dark: {
            backgroundColor: '#2f2f2f',
            sectionBackground: '#2f2f2f',
            navbarBackground: '#2f2f2f',
            textColor: '#ffffff',
            accentColor: scheme.secondary || '#4a90e2',
            primaryButtonColor: scheme.secondary || '#4a90e2',
            secondaryButtonColor: scheme.primary || '#6b8e23',
            outlineButtonColor: '#8a2be2',
            headingColor: undefined
          }
        }
      }
      const mergeTheme = (base: any, override?: any) => ({
        light: { ...(base?.light || {}), ...(override?.light || {}) },
        dark: { ...(base?.dark || {}), ...(override?.dark || {}) }
      })

      // Overrides guardados por diseño (si existen)
      const overrides = (config as any)?.designOverrides?.[designId]?.theme
      const baseTheme = buildBaseThemeFromDesign(design)
      const effectiveTheme = mergeTheme(baseTheme, overrides)

      // Aplicar al DOM variables CSS principales (modo claro)
      const CSS_VAR_MAP: Record<string, string> = {
        backgroundColor: '--background-color',
        sectionBackground: '--section-background',
        navbarBackground: '--navbar-background',
        textColor: '--text-color',
        accentColor: '--accent-color',
        primaryButtonColor: '--primary-button-color',
        secondaryButtonColor: '--secondary-button-color',
        outlineButtonColor: '--outline-button-color',
        headingColor: '--heading-color'
      }
      const light = effectiveTheme.light || {}
      Object.entries(CSS_VAR_MAP).forEach(([k, cssVar]) => {
        const val = (light as any)[k]
        if (val) document.documentElement.style.setProperty(cssVar, val)
      })

      // Guardar selección y tema efectivo (no pisar overrides)
      await updateConfig({
        selectedDesigns: {
          ...(config.selectedDesigns || {}),
          [templateType]: designId
        },
        theme: effectiveTheme
      } as any)

      setOpen(false)
    } finally {
      setApplyingId(null)
    }
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className={fullWidth ? "w-full" : ""}>
            <Palette className="h-4 w-4 mr-2" /> Diseños
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-2" align="end">
          <div className="text-xs font-medium mb-2">Elige un diseño</div>
          <div className="space-y-1">
            {designs.map((d) => (
              <button
                key={d.id}
                onClick={() => handleApply(d.id)}
                disabled={!!applyingId}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-muted/60 text-left ${selected === d.id ? 'ring-1 ring-primary' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.colorScheme.primary }} />
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.colorScheme.secondary }} />
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.colorScheme.accent }} />
                  <span className="text-sm">{d.name}</span>
                </div>
                {selected === d.id && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700">Activo</span>
                )}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {applyingId && (
        <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center" aria-live="polite" aria-busy="true">
          <div className="bg-white dark:bg-neutral-900 rounded-lg p-4 shadow-md flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-600 border-t-transparent" />
            <p className="text-sm text-muted-foreground">Aplicando diseño...</p>
          </div>
        </div>
      )}
    </>
  )
}


