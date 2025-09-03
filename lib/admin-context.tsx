"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Config, saveConfig } from './config-loader'

// Merge profundo para asegurar presencia de claves críticas como site.title
function mergeConfig<T extends Partial<Config>>(base: Config, incoming?: T | null): Config {
  const src = incoming || {} as Partial<Config>
  const merged: Config = {
    ...base,
    ...src,
    site: { ...base.site, ...(src.site || {}) },
    integrations: { ...base.integrations, ...(src.integrations || {}) },
    buttons: { ...base.buttons, ...(src.buttons || {}) },
    course: { ...base.course, ...(src.course || {}) },
    about: { ...base.about, ...(src.about || {}) },
    contact: { ...base.contact, ...(src.contact || {}) },
    legal: { ...base.legal, ...(src.legal || {}) },
    // Merge seguro de overrides por diseño
    designOverrides: {
      ...(base as any).designOverrides,
      ...(src as any).designOverrides
    },
    theme: src.theme
      ? {
          light: { ...(base.theme?.light || {}), ...(src.theme.light || {}) },
          dark: { ...(base.theme?.dark || {}), ...(src.theme.dark || {}) }
        }
      : base.theme,
    linkHub: src.linkHub
      ? {
          profile: { ...(base.linkHub?.profile || {}), ...(src.linkHub.profile || {}) },
          links: src.linkHub.links ?? base.linkHub?.links ?? [],
          theme: { ...(base.linkHub?.theme || {}), ...(src.linkHub.theme || {}) },
          social: { ...(base.linkHub?.social || {}), ...(src.linkHub.social || {}) }
        }
      : base.linkHub,
    shopConfig: { ...(base.shopConfig || {}), ...(src.shopConfig || {}) } as any,
    sessions: src.sessions ?? base.sessions,
    testimonials: src.testimonials ?? base.testimonials,
    products: src.products ?? base.products,
    sections: src.sections ?? base.sections,
    selectedTemplates: src.selectedTemplates ?? base.selectedTemplates,
    selectedDesigns: { ...(base.selectedDesigns || {}), ...(src.selectedDesigns || {}) },
    currentTemplate: src.currentTemplate ?? base.currentTemplate,
    fumigaciones: src.fumigaciones ? { ...(base.fumigaciones || {}), ...src.fumigaciones } : base.fumigaciones
  }
  return merged
}

interface AdminContextType {
  isAdminMode: boolean
  toggleAdminMode: () => void
  config: Config | null
  updateConfig: (updates: Partial<Config>) => Promise<void>
  isSaving: boolean
  lastSaved: Date | null
  refreshConfig: () => Promise<void>
  forceReload: () => void
  isLoading: boolean
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children, initialConfig }: { children: ReactNode, initialConfig: Config }) {
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [config, setConfig] = useState<Config | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar configuración real desde Firebase al iniciar
  useEffect(() => {
    const loadConfig = async () => {
      try {
        console.log('🔄 Cargando configuración desde Firebase...')
        const response = await fetch('/api/config')
        if (response.ok) {
          const data = await response.json()
          // Merge profundo con initialConfig para garantizar estructura completa
          setConfig(mergeConfig(initialConfig, data))
          console.log('✅ Configuración cargada desde Firebase:', data.site?.title)
          try {
            localStorage.setItem('config-cache', JSON.stringify(data))
          } catch {}
        } else {
          console.error('❌ Error cargando configuración, usando configuración por defecto')
          // Fallback: intentar cache local
          try {
            const cached = localStorage.getItem('config-cache')
            if (cached) {
              const parsed = JSON.parse(cached)
              setConfig(mergeConfig(initialConfig, parsed))
              console.log('📦 Usando configuración desde cache local')
            } else {
              setConfig(initialConfig)
            }
          } catch {
            setConfig(initialConfig)
          }
        }
      } catch (error) {
        console.error('❌ Error cargando configuración, usando configuración por defecto:', error)
        // Fallback: intentar cache local
        try {
          const cached = localStorage.getItem('config-cache')
          if (cached) {
            const parsed = JSON.parse(cached)
            setConfig(mergeConfig(initialConfig, parsed))
            console.log('📦 Usando configuración desde cache local (fallback)')
          } else {
            setConfig(initialConfig)
          }
        } catch {
          setConfig(initialConfig)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadConfig()
  }, [initialConfig])

  // Detectar modo admin con Ctrl+Shift+A solo si está autenticado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault()
        
        // Verificar si está autenticado antes de permitir el atajo
        if (typeof window !== 'undefined') {
          const authStatus = localStorage.getItem('admin-authenticated')
          const loginTime = localStorage.getItem('admin-login-time')
          
          if (authStatus === 'true' && loginTime) {
            // Verificar si han pasado más de 24 horas desde el login
            const loginTimestamp = parseInt(loginTime)
            const currentTime = Date.now()
            const hoursSinceLogin = (currentTime - loginTimestamp) / (1000 * 60 * 60)
            
            if (hoursSinceLogin < 24) {
              setIsAdminMode(prev => !prev)
            } else {
              // Sesión expirada, limpiar localStorage
              localStorage.removeItem('admin-authenticated')
              localStorage.removeItem('admin-login-time')
              console.log('Sesión expirada, atajo de teclado deshabilitado')
            }
          } else {
            console.log('Usuario no autenticado, atajo de teclado deshabilitado')
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const toggleAdminMode = () => {
    setIsAdminMode(prev => !prev)
  }

  const refreshConfig = async () => {
    try {
      // Agregar timestamp para evitar caché
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/config?t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setConfig(prev => mergeConfig(prev || initialConfig, data))
        console.log('✅ Configuración actualizada desde servidor')
        try {
          localStorage.setItem('config-cache', JSON.stringify(data))
        } catch {}
      } else {
        console.error('❌ Error en respuesta:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error refreshing config:', error)
    }
  }

  const forceReload = () => {
    console.log('🔄 Forzando recarga completa de la página...')
    window.location.reload()
  }

  const updateConfig = async (updates: Partial<Config>) => {
    if (!config) return
    // Merge profundo para no perder propiedades anidadas
    const newConfig = mergeConfig(config, updates)
    setConfig(newConfig)
    
    setIsSaving(true)
    try {
      console.log('💾 Guardando configuración en Firestore...')
      const success = await saveConfig(newConfig)
      if (success) {
        setLastSaved(new Date())
        console.log('✅ Configuración guardada exitosamente')
        
        // Verificar que se guardó correctamente
        try {
          const response = await fetch('/api/config')
          if (response.ok) {
            const savedData = await response.json()
            console.log('🔍 Verificando datos guardados...')
            
            // Si hay diferencias, actualizar el contexto
            if (JSON.stringify(savedData) !== JSON.stringify(newConfig)) {
              console.log('🔄 Datos guardados diferentes, actualizando contexto...')
              const mergedConfig = mergeConfig(initialConfig, savedData)
              setConfig(mergedConfig)
            }
          }
        } catch (verifyError) {
          console.warn('⚠️ No se pudo verificar datos guardados:', verifyError)
        }
        
        try {
          localStorage.setItem('config-cache', JSON.stringify(newConfig))
        } catch {}
        
        // NO recargar desde el servidor para evitar sobrescribir cambios locales
        // await refreshConfig()
      } else {
        console.error('❌ Error al guardar configuración')
        // Revertir cambios en caso de error
        setConfig(config)
      }
    } catch (error) {
      console.error('Error saving config:', error)
      // Revertir cambios en caso de error
      setConfig(config)
    } finally {
      setIsSaving(false)
    }
  }

  // Mostrar loading mientras se carga la configuración
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  return (
    <AdminContext.Provider value={{
      isAdminMode,
      toggleAdminMode,
      config,
      updateConfig,
      isSaving,
      lastSaved,
      refreshConfig,
      forceReload,
      isLoading
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
