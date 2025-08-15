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

      // Construir tema base desde el diseño seleccionado
      const buildBaseThemeFromDesign = (d: any) => {
        const scheme = d?.colorScheme || { primary: '#10b981', secondary: '#3b82f6', accent: '#10b981' }
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


