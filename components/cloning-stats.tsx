"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Download, 
  Upload, 
  Package, 
  Clock, 
  HardDrive,
  TrendingUp,
  AlertTriangle,
  RefreshCw
} from "lucide-react"

interface CloningStats {
  totalProducts: number
  successfulClones: number
  failedClones: number
  averageProcessingTime: number
  imagesProcessed: number
  storageUsed: number
  lastClonedAt: string
  topCategories: Array<{ name: string; count: number }>
  recentActivity: Array<{
    id: string
    action: string
    timestamp: string
    details: string
  }>
}

interface CloningStatsProps {
  onRefresh?: () => void
}

export function CloningStats({ onRefresh }: CloningStatsProps) {
  const [stats, setStats] = useState<CloningStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadStats = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/cloning-stats')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setStats(result.stats)
        } else {
          setError(result.error || 'Error al cargar estadísticas')
        }
      } else {
        setError('Error de conexión')
      }
    } catch (error) {
      setError('Error al cargar estadísticas')
      console.error('Error loading stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days > 0) return `${days} día${days > 1 ? 's' : ''}`
    if (hours > 0) return `${hours} hora${hours > 1 ? 's' : ''}`
    if (minutes > 0) return `${minutes} minuto${minutes > 1 ? 's' : ''}`
    return 'Ahora mismo'
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'product_cloned':
        return <Download className="h-4 w-4 text-green-500" />
      case 'clone_failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Package className="h-4 w-4 text-blue-500" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'product_cloned':
        return 'text-green-600'
      case 'clone_failed':
        return 'text-red-600'
      default:
        return 'text-blue-600'
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Cargando estadísticas...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600 mb-2">{error}</p>
            <Button onClick={loadStats} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Productos</p>
                <p className="text-2xl font-bold">{stats.totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Clonados Exitosos</p>
                <p className="text-2xl font-bold">{stats.successfulClones}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Imágenes Procesadas</p>
                <p className="text-2xl font-bold">{stats.imagesProcessed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Almacenamiento</p>
                <p className="text-2xl font-bold">{stats.storageUsed}MB</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Métricas de Rendimiento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Tiempo promedio de clonación:</span>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{stats.averageProcessingTime}s</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Tasa de éxito:</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                {stats.totalProducts > 0 
                  ? Math.round((stats.successfulClones / stats.totalProducts) * 100)
                  : 0}%
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Fallos:</span>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="font-medium text-red-600">{stats.failedClones}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Última clonación:</span>
              <span className="text-sm font-medium">
                {formatTime(stats.lastClonedAt)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Categorías Principales</CardTitle>
            <CardDescription>Productos clonados por categoría</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topCategories.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">
                        {index + 1}
                      </span>
                    </div>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <Badge variant="outline">{category.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Actividad Reciente</span>
            <Button onClick={loadStats} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                {getActionIcon(activity.action)}
                <div className="flex-1">
                  <p className={`text-sm font-medium ${getActionColor(activity.action)}`}>
                    {activity.details}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
