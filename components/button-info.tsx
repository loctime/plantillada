"use client"

import { useAdmin } from '@/lib/admin-context'
import { Info, Plus, Settings, ExternalLink, Hash, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function ButtonInfo() {
  const { isAdminMode } = useAdmin()

  if (!isAdminMode) return null

  return (
    <Card className="mb-6 border-emerald-200 bg-emerald-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-emerald-800">
          <Info className="h-5 w-5" />
          Nuevo Sistema de Gestión de Botones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <h4 className="font-semibold text-emerald-700 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Agregar Botones
            </h4>
            <p className="text-sm text-emerald-600">
              Haz clic en "Gestionar Botones" en cualquier sección para agregar, editar o eliminar botones.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-emerald-700 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Tipos de Botones
            </h4>
            <div className="text-sm text-emerald-600 space-y-1">
              <div className="flex items-center gap-2">
                <ExternalLink className="h-3 w-3" />
                <span>URL externa</span>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="h-3 w-3" />
                <span>Sección de la web</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                <span>Modal personalizable</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-emerald-700">
              Características
            </h4>
            <ul className="text-sm text-emerald-600 space-y-1">
              <li>• Texto editable</li>
              <li>• Iconos configurables</li>
              <li>• Estilos personalizables</li>
              <li>• Modales con contenido HTML</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-2 border-t border-emerald-200">
          <p className="text-xs text-emerald-600">
            💡 <strong>Consejo:</strong> Los botones se guardan automáticamente y están disponibles en todas las secciones. 
            Puedes crear botones que abran modales con contenido personalizado, enlaces externos o navegación interna.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
