"use client"

import { useState } from 'react'
import { useAdmin } from '@/lib/admin-context'
import { Button } from '@/components/ui/button'
import { Settings, Save, Check, RefreshCw, Palette } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { AdminAuthStatus } from './admin-auth-status'
import { useAdminAuth } from '@/hooks/use-admin-auth'
import { GlobalColorEditor } from './global-color-editor'

export function AdminToggle() {
  const { isAdminMode, toggleAdminMode, isSaving, lastSaved, refreshConfig, forceReload } = useAdmin()
  const { isAuthenticated } = useAdminAuth()


  // No renderizar nada si no está autenticado
  if (!isAuthenticated) {
    return null
  }

  return (
    <TooltipProvider>
      <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
                 {/* Fila superior: Botón Admin y Estado de autenticación */}
         <div className="flex items-center gap-2">
           {/* Toggle del modo admin */}
           <Tooltip>
             <TooltipTrigger asChild>
               <Button
                 onClick={toggleAdminMode}
                 variant={isAdminMode ? "default" : "outline"}
                 size="sm"
                 className={cn(
                   "shadow-lg transition-all duration-200",
                   isAdminMode && "bg-emerald-600 hover:bg-emerald-700"
                 )}
               >
                 <Settings className="h-4 w-4 mr-2" />
                 {isAdminMode ? "Modo Admin" : "Admin"}
               </Button>
             </TooltipTrigger>
             <TooltipContent>
               <p>Activar modo admin</p>
               <p className="text-xs text-muted-foreground">Atajo: Ctrl+Shift+A</p>
             </TooltipContent>
           </Tooltip>

           {/* Estado de autenticación */}
           <AdminAuthStatus />
         </div>

         {/* Fila inferior: Editor de colores globales - solo visible en modo admin */}
         {isAdminMode && (
           <div className="flex items-center gap-2">
             <GlobalColorEditor />
           </div>
         )}



        {/* Indicador de guardado - solo visible en modo admin */}
        {isAdminMode && (
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border">
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
                <span className="text-sm text-muted-foreground">Guardando...</span>
              </>
            ) : lastSaved ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="text-sm text-muted-foreground">
                  Guardado {lastSaved.toLocaleTimeString()}
                </span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Sin cambios</span>
              </>
            )}
            
            {/* Botón de refrescar */}
            <Button
              size="sm"
              variant="ghost"
              onClick={refreshConfig}
              className="h-6 w-6 p-0 ml-2"
              title="Refrescar configuración"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
            
            {/* Botón de forzar recarga */}
            <Button
              size="sm"
              variant="ghost"
              onClick={forceReload}
              className="h-6 w-6 p-0 ml-1"
              title="Forzar recarga completa"
            >
              <RefreshCw className="h-3 w-3 text-orange-600" />
            </Button>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
