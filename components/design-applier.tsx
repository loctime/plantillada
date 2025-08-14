"use client"

import { useEffect } from 'react'
import { getDesignById, applyDesignToDocument, applyDesignToConfig } from '@/lib/designs'
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
    
    if (designId) {
      console.log('🎨 Aplicando diseño:', designId)
      
      // Cargar desde el sistema de diseños
      const design = getDesignById(designId)
      if (design) {
        console.log('✅ Diseño encontrado en sistema, aplicando...')
        
        // Aplicar diseño visual inmediatamente
        applyDesignToDocument(design)
        
        // Aplicar configuración del diseño si no está ya aplicada
        if (design.predefinedConfig && config) {
          const needsUpdate = !config.site?.heroTitle || config.site?.heroTitle === 'Tu Marca Personal'
          
          if (needsUpdate) {
            console.log('🔄 Aplicando configuración del diseño a la base de datos...')
            applyDesignToConfig(designId, 'default', {
              applyContent: true,
              applyColors: false, // Los colores ya se aplicaron visualmente
              createBackup: false
            }).then(() => {
              console.log('✅ Configuración del diseño aplicada y guardada')
            }).catch((error) => {
              console.error('❌ Error aplicando configuración del diseño:', error)
            })
          } else {
            console.log('✅ Configuración del diseño ya está aplicada')
          }
        }
      } else {
        console.log('⚠️ Diseño no encontrado en sistema:', designId)
      }
    } else {
      console.log('⚠️ DesignApplier: No se encontró designId para template:', currentTemplate)
    }
  }, [selectedDesigns, currentTemplate, config, updateConfig])

  return null // Este componente no renderiza nada
}
