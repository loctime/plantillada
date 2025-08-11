"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Config, saveConfig } from './config-loader'

interface AdminContextType {
  isAdminMode: boolean
  toggleAdminMode: () => void
  config: Config | null
  updateConfig: (updates: Partial<Config>) => Promise<void>
  isSaving: boolean
  lastSaved: Date | null
  refreshConfig: () => Promise<void>
  forceReload: () => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children, initialConfig }: { children: ReactNode, initialConfig: Config }) {
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [config, setConfig] = useState<Config>(initialConfig)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Detectar modo admin con Ctrl+Shift+A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault()
        setIsAdminMode(prev => !prev)
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
        setConfig(data)
        console.log('✅ Configuración actualizada desde servidor')
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
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)
    
    setIsSaving(true)
    try {
      console.log('💾 Guardando configuración en Firestore...')
      const success = await saveConfig(newConfig)
      if (success) {
        setLastSaved(new Date())
        console.log('✅ Configuración guardada exitosamente')
        
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

  return (
    <AdminContext.Provider value={{
      isAdminMode,
      toggleAdminMode,
      config,
      updateConfig,
      isSaving,
      lastSaved,
      refreshConfig,
      forceReload
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
