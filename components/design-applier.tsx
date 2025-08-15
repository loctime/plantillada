"use client"

import { useEffect } from 'react'
import { getDesignById } from '@/lib/designs'
import { useAdmin } from '@/lib/admin-context'

interface DesignApplierProps {
  currentTemplate?: string
}

export function DesignApplier({ currentTemplate }: DesignApplierProps) {
  const { config, updateConfig } = useAdmin()
  const selectedDesigns = config?.selectedDesigns

  // Aplicar diseños cuando cambien las dependencias
  useEffect(() => {
    console.log('🎨 DesignApplier: Verificando aplicación de diseño...')
    console.log('🎨 DesignApplier: selectedDesigns:', selectedDesigns)
    console.log('🎨 DesignApplier: currentTemplate:', currentTemplate)
    
    if (!selectedDesigns || !currentTemplate) {
      console.log('⚠️ DesignApplier: No hay selectedDesigns o currentTemplate')
      return
    }
    
    const designId = selectedDesigns[currentTemplate]
    console.log('🎨 DesignApplier: Design ID encontrado:', designId)
    
    // Intencionalmente no aplicamos ni guardamos nada aquí para evitar sobreescrituras
    // El tema y overrides se aplican vía useTheme/useGlobalColors y los selectores de diseño
  }, [selectedDesigns, currentTemplate, config, updateConfig])

  return null // Este componente no renderiza nada
}
