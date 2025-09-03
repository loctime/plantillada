"use client"

import { useAdmin } from '@/lib/admin-context'
import { useAdminAuth } from '@/hooks/use-admin-auth'
import { useState, useEffect } from 'react'
import { Bug, X } from 'lucide-react'

export function AdminDebug() {
  const { isAdminMode, config, isSaving, lastSaved, refreshConfig, forceReload } = useAdmin()
  const [showDebug, setShowDebug] = useState(false)
  const [lastSyncCheck, setLastSyncCheck] = useState<Date | null>(null)
  const [syncStatus, setSyncStatus] = useState<'synced' | 'outdated' | 'checking'>('synced')

  // Verificar estado de sincronización
  const checkSyncStatus = async () => {
    if (!config) return
    
    setSyncStatus('checking')
    try {
      const response = await fetch('/api/config')
      if (response.ok) {
        const serverData = await response.json()
        const isSynced = JSON.stringify(serverData) === JSON.stringify(config)
        setSyncStatus(isSynced ? 'synced' : 'outdated')
        setLastSyncCheck(new Date())
      } else {
        setSyncStatus('outdated')
      }
    } catch (error) {
      setSyncStatus('outdated')
    }
  }

  // Verificar sincronización automáticamente cada 10 segundos
  useEffect(() => {
    if (isAdminMode) {
      const interval = setInterval(checkSyncStatus, 10000)
      return () => clearInterval(interval)
    }
  }, [isAdminMode, config])

  if (!isAdminMode) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Botón de debug */}
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-3 shadow-lg transition-all duration-200"
        title="Debug Admin"
      >
        <Bug className="h-5 w-5" />
      </button>

      {/* Panel de debug */}
      {showDebug && (
        <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 min-w-80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Debug Admin</h3>
            <button
              onClick={() => setShowDebug(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Estado de sincronización */}
          <div className="mb-4 p-3 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Estado de Sincronización
              </span>
              <button
                onClick={checkSyncStatus}
                className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded"
              >
                Verificar
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                syncStatus === 'synced' ? 'bg-green-500' :
                syncStatus === 'outdated' ? 'bg-red-500' : 'bg-yellow-500'
              }`} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {syncStatus === 'synced' ? 'Sincronizado' :
                 syncStatus === 'outdated' ? 'Desactualizado' : 'Verificando...'}
              </span>
            </div>
            
            {lastSyncCheck && (
              <p className="text-xs text-gray-500 mt-1">
                Última verificación: {lastSyncCheck.toLocaleTimeString()}
              </p>
            )}
          </div>

          {/* Estado del guardado */}
          <div className="mb-4 p-3 rounded-lg border">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estado del Guardado
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isSaving ? 'bg-yellow-500' : 'bg-green-500'}`} />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {isSaving ? 'Guardando...' : 'Sin cambios pendientes'}
                </span>
              </div>
              {lastSaved && (
                <p className="text-xs text-gray-500">
                  Último guardado: {lastSaved.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>

          {/* Información de configuración */}
          <div className="mb-4 p-3 rounded-lg border">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Configuración Actual
            </h4>
            <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <p><strong>Título:</strong> {config?.site?.title || 'No definido'}</p>
              <p><strong>Tagline:</strong> {config?.site?.tagline || 'No definido'}</p>
              <p><strong>Plantillas activas:</strong> {config?.activeTemplates?.length || 0}</p>
              <p><strong>Sesiones:</strong> {config?.sessions?.length || 0}</p>
            </div>
          </div>

          {/* Acciones */}
          <div className="space-y-2">
            <button
              onClick={refreshConfig}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
            >
              🔄 Recargar desde Firebase
            </button>
            <button
              onClick={forceReload}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition-colors"
            >
              🔄 Recargar Página Completa
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
