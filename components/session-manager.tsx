"use client"

import { useState } from 'react'
import { useAdmin } from '@/lib/admin-context'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EditableText } from './editable-text'
import { EditableList } from './editable-list'
import { EditableUrl } from './editable-url'
import { cn } from '@/lib/utils'

interface SessionManagerProps {
  sessions: Array<{
    id: string
    name: string
    summary: string
    duration: string
    price: string
    features: string[]
    hotmartUrl: string
  }>
  onSessionsChange: (sessions: Array<{
    id: string
    name: string
    summary: string
    duration: string
    price: string
    features: string[]
    hotmartUrl: string
  }>) => void
}

export function SessionManager({ sessions, onSessionsChange }: SessionManagerProps) {
  const { isAdminMode } = useAdmin()
  const [isManaging, setIsManaging] = useState(false)

  const addSession = () => {
    const newSession = {
      id: `session-${Date.now()}`,
      name: 'Nueva Sesión',
      summary: 'Descripción de la nueva sesión',
      duration: '60 min',
      price: '€99',
      features: ['Característica 1', 'Característica 2'],
      hotmartUrl: ''
    }
    onSessionsChange([...sessions, newSession])
  }

  const removeSession = (sessionId: string) => {
    onSessionsChange(sessions.filter(session => session.id !== sessionId))
  }

  const updateSession = (index: number, updates: Partial<typeof sessions[0]>) => {
    const newSessions = [...sessions]
    newSessions[index] = { ...newSessions[index], ...updates }
    onSessionsChange(newSessions)
  }

  if (!isAdminMode) {
    return null
  }

  return (
    <div className="mb-6">
      {/* Panel de gestión de sesiones */}
      {isManaging && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-emerald-800">Gestión de Sesiones</h3>
          <div className="space-y-4">
            {sessions.map((session, index) => (
              <div key={session.id} className="bg-white rounded-lg border p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Sesión {index + 1}</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeSession(session.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                    <EditableText
                      value={session.name}
                      onSave={(newValue) => updateSession(index, { name: newValue })}
                      className="text-lg font-semibold"
                      tag="h3"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Resumen</label>
                    <EditableText
                      value={session.summary}
                      onSave={(newValue) => updateSession(index, { summary: newValue })}
                      className="text-sm text-muted-foreground"
                      tag="p"
                      multiline
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Precio</label>
                    <EditableText
                      value={session.price}
                      onSave={(newValue) => updateSession(index, { price: newValue })}
                      className="text-2xl font-bold"
                      tag="span"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Duración</label>
                    <EditableText
                      value={session.duration}
                      onSave={(newValue) => updateSession(index, { duration: newValue })}
                      className="text-sm text-muted-foreground"
                      tag="span"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Características</label>
                    <EditableList
                      items={session.features}
                      onSave={(newFeatures) => updateSession(index, { features: newFeatures })}
                      className="mt-2"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <EditableUrl
                      value={session.hotmartUrl}
                      onSave={(newValue) => updateSession(index, { hotmartUrl: newValue })}
                      label="URL de Hotmart"
                      placeholder="https://pay.hotmart.com/..."
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <Button
              onClick={addSession}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Nueva Sesión
            </Button>
          </div>
        </div>
      )}

      {/* Toggle para mostrar/ocultar panel de gestión */}
      <div className="flex justify-center mb-6">
        <Button
          onClick={() => setIsManaging(!isManaging)}
          variant={isManaging ? "default" : "outline"}
          size="sm"
          className={cn(
            "shadow-lg transition-all duration-200",
            isManaging && "bg-emerald-600 hover:bg-emerald-700"
          )}
        >
          <Edit2 className="h-4 w-4 mr-2" />
          {isManaging ? "Ocultar Gestión de Sesiones" : "Gestionar Sesiones"}
        </Button>
      </div>
    </div>
  )
}
