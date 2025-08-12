"use client"

import { useState, useEffect } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Save } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface PriceVisibilityToggleProps {
  tenantId: string
  onConfigUpdate?: () => void
}

export function PriceVisibilityToggle({ tenantId, onConfigUpdate }: PriceVisibilityToggleProps) {
  const [showPrices, setShowPrices] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadPriceSettings()
  }, [tenantId])

  const loadPriceSettings = async () => {
    try {
      setLoading(true)
      const { loadConfig } = await import('@/lib/config-loader')
      const config = await loadConfig(tenantId)
      setShowPrices(config.site?.showPrices ?? true)
    } catch (error) {
      console.error('Error cargando configuración de precios:', error)
      toast({
        title: "Error",
        description: "No se pudo cargar la configuración de precios",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const savePriceSettings = async () => {
    try {
      setSaving(true)
      const { loadConfig, saveConfig } = await import('@/lib/config-loader')
      const config = await loadConfig(tenantId)
      
      // Actualizar configuración global
      const updatedConfig = {
        ...config,
        site: {
          ...config.site,
          showPrices
        }
      }

      // Actualizar configuración de sesiones individuales
      if (updatedConfig.sessions) {
        updatedConfig.sessions = updatedConfig.sessions.map(session => ({
          ...session,
          showPrice: showPrices
        }))
      }

      // Actualizar configuración del curso
      if (updatedConfig.course) {
        updatedConfig.course = {
          ...updatedConfig.course,
          showPrice: showPrices
        }
      }

      const success = await saveConfig(updatedConfig, tenantId)
      
      if (success) {
        toast({
          title: "Configuración guardada",
          description: `Los precios ahora están ${showPrices ? 'visibles' : 'ocultos'} en el sitio`,
        })
        onConfigUpdate?.()
      } else {
        throw new Error('Error guardando configuración')
      }
    } catch (error) {
      console.error('Error guardando configuración de precios:', error)
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración de precios",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const togglePriceVisibility = (checked: boolean) => {
    setShowPrices(checked)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cargando configuración...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {showPrices ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
          Visibilidad de Precios
        </CardTitle>
        <CardDescription>
          Controla si los precios se muestran o se ocultan en el sitio web
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="price-visibility"
            checked={showPrices}
            onCheckedChange={togglePriceVisibility}
            disabled={saving}
          />
          <Label htmlFor="price-visibility" className="text-sm font-medium">
            {showPrices ? 'Mostrar precios' : 'Ocultar precios'}
          </Label>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {showPrices ? (
            <p>Los precios serán visibles en todas las secciones del sitio</p>
          ) : (
            <p>Los precios estarán ocultos. Los usuarios deberán contactarte para conocer tarifas</p>
          )}
        </div>

        <Button 
          onClick={savePriceSettings} 
          disabled={saving}
          className="w-full"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Guardar Configuración
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground">
          <p><strong>Nota:</strong> Esta configuración afecta a todas las secciones del sitio.</p>
          <p>Para bufetes de abogados, se recomienda mantener los precios ocultos.</p>
        </div>
      </CardContent>
    </Card>
  )
}
