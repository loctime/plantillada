"use client"

import { useEffect, useState } from 'react'
import { getDesignById, applyDesignToDocument } from '@/lib/designs'
import { loadConfig } from '@/lib/config-loader'

interface DesignApplierProps {
  currentTemplate?: string
}

export function DesignApplier({ currentTemplate }: DesignApplierProps) {
  const [selectedDesigns, setSelectedDesigns] = useState<{[key: string]: string} | undefined>()

  // Cargar configuración
  useEffect(() => {
    const loadDesigns = async () => {
      try {
        const config = await loadConfig()
        setSelectedDesigns(config.selectedDesigns)
      } catch (error) {
        console.error('Error loading config:', error)
      }
    }

    loadDesigns()
  }, [])

  // Aplicar diseños cuando cambien las dependencias
  useEffect(() => {
    if (!selectedDesigns || !currentTemplate) return
    
    const designId = selectedDesigns[currentTemplate]
    if (designId) {
      const design = getDesignById(designId)
      if (design) {
        applyDesignToDocument(design)
      }
    }
  }, [selectedDesigns, currentTemplate])

  return null // Este componente no renderiza nada
}
