import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'
import { Trash2, RotateCcw, Download, Clock, User } from 'lucide-react'
import { getBackups, restoreFromBackup, deleteBackup } from '../lib/designs'
import { getTenantId } from '../lib/config-loader'

interface Backup {
  id: string
  timestamp: string
  tenantId: string
  description: string
  config: any
}

interface BackupManagerProps {
  onRestore?: () => void
}

export default function BackupManager({ onRestore }: BackupManagerProps) {
  const [backups, setBackups] = useState<Backup[]>([])
  const [loading, setLoading] = useState(true)
  const [restoring, setRestoring] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    loadBackups()
  }, [])

  const loadBackups = async () => {
    try {
      setLoading(true)
      const tenantId = getTenantId()
      const backupsList = await getBackups(tenantId)
      setBackups(backupsList)
    } catch (error) {
      console.error('Error cargando backups:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async (backupId: string) => {
    try {
      setRestoring(backupId)
      const tenantId = getTenantId()
      const success = await restoreFromBackup(backupId, tenantId)
      
      if (success) {
        // Recargar la página para aplicar los cambios
        window.location.reload()
      } else {
        alert('Error restaurando backup')
      }
    } catch (error) {
      console.error('Error restaurando backup:', error)
      alert('Error restaurando backup')
    } finally {
      setRestoring(null)
    }
  }

  const handleDelete = async (backupId: string) => {
    try {
      setDeleting(backupId)
      const success = await deleteBackup(backupId)
      
      if (success) {
        setBackups(backups.filter(b => b.id !== backupId))
      } else {
        alert('Error eliminando backup')
      }
    } catch (error) {
      console.error('Error eliminando backup:', error)
      alert('Error eliminando backup')
    } finally {
      setDeleting(null)
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getBackupDescription = (backup: Backup) => {
    if (backup.description) return backup.description
    
    const config = backup.config
    if (config?.site?.title) {
      return `Backup de "${config.site.title}"`
    }
    
    return 'Backup automático'
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Backups</CardTitle>
          <CardDescription>Cargando backups...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Gestión de Backups
        </CardTitle>
        <CardDescription>
          Restaura configuraciones anteriores o elimina backups antiguos
        </CardDescription>
      </CardHeader>
      <CardContent>
        {backups.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay backups disponibles</p>
            <p className="text-sm">Los backups se crean automáticamente al aplicar diseños</p>
          </div>
        ) : (
          <div className="space-y-4">
            {backups.map((backup) => (
              <div
                key={backup.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">
                      {getBackupDescription(backup)}
                    </h4>
                    <Badge variant="secondary" className="text-xs">
                      {backup.config?.selectedDesigns ? 
                        Object.values(backup.config.selectedDesigns).join(', ') : 
                        'Sin diseño'
                      }
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(backup.timestamp)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {backup.tenantId}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={restoring === backup.id}
                      >
                        {restoring === backup.id ? (
                          'Restaurando...'
                        ) : (
                          <>
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Restaurar
                          </>
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Restaurar backup?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción reemplazará toda la configuración actual con la del backup del{' '}
                          <strong>{formatDate(backup.timestamp)}</strong>.
                          <br />
                          <br />
                          <strong>⚠️ Esta acción no se puede deshacer.</strong>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRestore(backup.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Restaurar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={deleting === backup.id}
                      >
                        {deleting === backup.id ? (
                          'Eliminando...'
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </>
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar backup?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción eliminará permanentemente el backup del{' '}
                          <strong>{formatDate(backup.timestamp)}</strong>.
                          <br />
                          <br />
                          <strong>⚠️ Esta acción no se puede deshacer.</strong>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(backup.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
