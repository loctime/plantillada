"use client"

import { useState, useEffect } from "react"
import { Config } from "@/lib/config-loader"
import { loadLayout, LayoutComponent } from "@/lib/layouts"
import { DefaultLayout } from "@/components/layouts/default-layout"

interface DynamicLayoutProps {
  config: Config
}

export function DynamicLayout({ config }: DynamicLayoutProps) {
  const [LayoutComponent, setLayoutComponent] = useState<LayoutComponent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAppropriateLayout = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Obtener el diseño seleccionado para landing
        const selectedDesign = config.selectedDesigns?.landing
        
        if (selectedDesign) {
          console.log(`🎨 Cargando layout para diseño: ${selectedDesign}`)
          const layout = await loadLayout(selectedDesign)
          setLayoutComponent(() => layout)
        } else {
          console.log('🎨 No hay diseño seleccionado, usando layout por defecto')
          setLayoutComponent(() => DefaultLayout)
        }
      } catch (err) {
        console.error('❌ Error cargando layout:', err)
        setError('Error cargando el diseño')
        // Fallback al layout por defecto
        setLayoutComponent(() => DefaultLayout)
      } finally {
        setLoading(false)
      }
    }

    loadAppropriateLayout()
  }, [config.selectedDesigns?.landing])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando diseño...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600">Usando diseño por defecto</p>
        </div>
      </div>
    )
  }

  if (!LayoutComponent) {
    return <DefaultLayout config={config} />
  }

  return <LayoutComponent config={config} />
}
