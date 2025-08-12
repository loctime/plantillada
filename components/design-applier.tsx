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
        console.log('🎨 DesignApplier: Cargando configuración...')
        const config = await loadConfig()
        console.log('🎨 DesignApplier: Configuración cargada:', config.selectedDesigns)
        setSelectedDesigns(config.selectedDesigns)
      } catch (error) {
        console.error('❌ DesignApplier: Error loading config:', error)
      }
    }

    loadDesigns()
  }, [])

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
      
      // Primero intentar cargar desde el sistema de diseños
      const design = getDesignById(designId)
      if (design) {
        console.log('✅ Diseño encontrado en sistema, aplicando...')
        applyDesignToDocument(design)
        return
      }
      
      // Si no se encuentra en el sistema, intentar cargar desde JSON
      console.log('🔄 Diseño no encontrado en sistema, intentando cargar desde JSON...')
      loadDesignFromJsonAndApply(designId)
    } else {
      console.log('⚠️ DesignApplier: No se encontró designId para template:', currentTemplate)
    }
  }, [selectedDesigns, currentTemplate])

  // Función para cargar diseño desde JSON y aplicarlo
  const loadDesignFromJsonAndApply = async (designId: string) => {
    try {
      console.log('🎨 DesignApplier: Cargando diseño desde JSON:', designId)
      
      // Mapear IDs de diseño a nombres de archivo
      const designFileMap: { [key: string]: string } = {
        'estudio-abogados-premium': 'abogados-design.json',
        'estudio-abogados': 'abogados-design.json'
      }
      
      const fileName = designFileMap[designId]
      if (!fileName) {
        console.log(`⚠️ No se encontró mapeo para el diseño: ${designId}`)
        return
      }
      
      console.log('🎨 DesignApplier: Cargando archivo:', fileName)
      
      // Cargar el archivo JSON
      const response = await fetch(`/${fileName}`)
      if (!response.ok) {
        console.error(`❌ Error cargando archivo de diseño: ${fileName}`)
        return
      }
      
      const designData = await response.json()
      console.log(`✅ Diseño cargado desde JSON: ${designData.name}`)
      
      // Aplicar variables CSS si existen
      if (designData.cssVariables && typeof document !== 'undefined') {
        console.log('🎨 Aplicando variables CSS del diseño...')
        const root = document.documentElement
        
        Object.entries(designData.cssVariables).forEach(([key, value]) => {
          console.log(`🎨 Aplicando CSS: ${key} = ${value}`)
          root.style.setProperty(key, value as string)
        })
      }
      
      // Aplicar configuración de tema si existe
      if (designData.theme && typeof document !== 'undefined') {
        console.log('🎨 Aplicando configuración de tema del diseño...')
        const root = document.documentElement
        
        // Detectar si estamos en modo oscuro
        const isDarkMode = document.body.classList.contains('dark')
        console.log('🎨 Modo oscuro detectado:', isDarkMode)
        
        const activeTheme = isDarkMode ? designData.theme.dark : designData.theme.light
        
        if (activeTheme) {
          console.log('🎨 Aplicando tema:', isDarkMode ? 'oscuro' : 'claro')
          root.style.setProperty('--background-color', activeTheme.backgroundColor)
          root.style.setProperty('--section-background', activeTheme.sectionBackground)
          root.style.setProperty('--navbar-background', activeTheme.navbarBackground)
          root.style.setProperty('--text-color', activeTheme.textColor)
          root.style.setProperty('--accent-color', activeTheme.accentColor)
          root.style.setProperty('--primary-button-color', activeTheme.primaryButtonColor)
          root.style.setProperty('--secondary-button-color', activeTheme.secondaryButtonColor)
          root.style.setProperty('--outline-button-color', activeTheme.outlineButtonColor)
          
          // Crear color de navegación con transparencia
          const navbarColor = activeTheme.navbarBackground
          let navbarWithOpacity = navbarColor
          
          if (navbarColor.startsWith('#')) {
            const r = parseInt(navbarColor.slice(1, 3), 16)
            const g = parseInt(navbarColor.slice(3, 5), 16)
            const b = parseInt(navbarColor.slice(5, 7), 16)
            navbarWithOpacity = `rgba(${r}, ${g}, ${b}, 0.8)`
          } else if (navbarColor.startsWith('rgb(')) {
            navbarWithOpacity = navbarColor.replace('rgb(', 'rgba(').replace(')', ', 0.8)')
          }
          
          root.style.setProperty('--navbar-background-transparent', navbarWithOpacity)
        }
      }
      
      console.log('✅ Diseño aplicado exitosamente desde JSON')
      
    } catch (error) {
      console.error('❌ Error aplicando diseño desde JSON:', error)
    }
  }

  return null // Este componente no renderiza nada
}
