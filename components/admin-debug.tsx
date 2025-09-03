"use client"

import { useAdmin } from '@/lib/admin-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Database, HardDrive, AlertTriangle } from 'lucide-react'
import { useState } from 'react'

export function AdminDebug() {
  const { config, refreshConfig, forceReload } = useAdmin()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refreshConfig()
    } finally {
      setIsRefreshing(false)
    }
  }

  const getConfigSource = () => {
    if (!config) return 'none'
    
    // Verificar si tiene datos personalizados
    const hasCustomData = config.site?.title && 
                         config.site?.title !== 'Tu Marca Personal - localhost:3000'
    
    if (hasCustomData) {
      return 'firebase'
    }
    
    return 'default'
  }

  const configSource = getConfigSource()
  const cacheData = typeof window !== 'undefined' ? localStorage.getItem('config-cache') : null

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Debug de Configuración
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estado de la configuración */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 border rounded-lg">
            <div className="text-2xl font-bold mb-1">
              {config ? '✅' : '❌'}
            </div>
            <div className="text-sm text-muted-foreground">Config Cargada</div>
          </div>
          
          <div className="text-center p-3 border rounded-lg">
            <div className="text-2xl font-bold mb-1">
              {configSource === 'firebase' ? '🔥' : configSource === 'default' ? '📝' : '❓'}
            </div>
            <div className="text-sm text-muted-foreground">
              {configSource === 'firebase' ? 'Firebase' : configSource === 'default' ? 'Por Defecto' : 'Desconocido'}
            </div>
          </div>
          
          <div className="text-center p-3 border rounded-lg">
            <div className="text-2xl font-bold mb-1">
              {cacheData ? '💾' : '❌'}
            </div>
            <div className="text-sm text-muted-foreground">Cache Local</div>
          </div>
        </div>

        {/* Información detallada */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">Título del sitio:</span>
            <Badge variant={configSource === 'firebase' ? 'default' : 'secondary'}>
              {config?.site?.title || 'No definido'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">Tagline:</span>
            <Badge variant={configSource === 'firebase' ? 'default' : 'secondary'}>
              {config?.site?.tagline || 'No definido'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">Tenant ID:</span>
            <Badge variant="outline">
              {typeof window !== 'undefined' ? window.location.host : 'SSR'}
            </Badge>
          </div>
        </div>

        {/* Cache local */}
        {cacheData && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <HardDrive className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">Cache Local Disponible</span>
            </div>
            <div className="text-sm text-blue-700">
              <div>Tamaño: {Math.round(cacheData.length / 1024)} KB</div>
              <div>Última actualización: {new Date().toLocaleString()}</div>
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="flex gap-2">
          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            variant="outline"
            className="flex-1"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refrescando...' : 'Refrescar Config'}
          </Button>
          
          <Button 
            onClick={forceReload} 
            variant="destructive"
            className="flex-1"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Forzar Recarga
          </Button>
        </div>

        {/* Información de debug */}
        <div className="text-xs text-muted-foreground p-3 bg-gray-50 rounded-lg">
          <div className="font-medium mb-1">Información de Debug:</div>
          <div>Host: {typeof window !== 'undefined' ? window.location.host : 'SSR'}</div>
          <div>URL: {typeof window !== 'undefined' ? window.location.href : 'SSR'}</div>
          <div>User Agent: {typeof window !== 'undefined' ? window.navigator.userAgent.substring(0, 50) + '...' : 'SSR'}</div>
        </div>
      </CardContent>
    </Card>
  )
}
