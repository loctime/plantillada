"use client"

import { useState } from "react"
import { useAdmin } from "@/lib/admin-context"
import { getDesignsForTemplate, applyDesignToConfig, applyDesignToDocument } from "@/lib/designs"
import { getTenantId } from "@/lib/config-loader"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Palette } from "lucide-react"

type Props = {
  templateType?: string
  fullWidth?: boolean
}

export function DesignQuickPicker({ templateType = "landing", fullWidth = false }: Props) {
  const { config, updateConfig, isAdminMode, forceReload } = useAdmin()
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
      // Aplicación visual inmediata de colores (no contenido)
      applyDesignToDocument(design)
      await updateConfig({
        selectedDesigns: {
          ...(config.selectedDesigns || {}),
          [templateType]: designId
        }
      } as any)
      // Guardar en backend (solo colores)
      const tenantId = getTenantId()
      const success = await applyDesignToConfig(designId, tenantId, {
        applyColors: true,
        applyContent: false,
        createBackup: true
      })
      setOpen(false)
      if (success) {
        // Recargar para que la página aplique el layout correcto (fumigaciones u otros)
        forceReload()
      }
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


