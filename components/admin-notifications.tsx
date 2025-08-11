"use client"

import { useEffect, useState } from 'react'
import { useAdmin } from '@/lib/admin-context'
import { Check, AlertCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Notification {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
  duration?: number
}

export function AdminNotifications() {
  const { isSaving, lastSaved } = useAdmin()
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    if (isSaving) {
      const notification: Notification = {
        id: 'saving',
        type: 'info',
        message: 'Guardando cambios...',
        duration: 0 // No auto-remove
      }
      setNotifications(prev => [notification])
    } else if (lastSaved) {
      const notification: Notification = {
        id: 'saved',
        type: 'success',
        message: `Cambios guardados exitosamente a las ${lastSaved.toLocaleTimeString()}`,
        duration: 3000
      }
      setNotifications(prev => [notification])
    }
  }, [isSaving, lastSaved])

  useEffect(() => {
    notifications.forEach(notification => {
      if (notification.duration && notification.duration > 0) {
        const timer = setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== notification.id))
        }, notification.duration)
        return () => clearTimeout(timer)
      }
    })
  }, [notifications])

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg shadow-lg border backdrop-blur-sm min-w-[300px]",
            notification.type === 'success' && "bg-green-50 border-green-200 text-green-800",
            notification.type === 'error' && "bg-red-50 border-red-200 text-red-800",
            notification.type === 'info' && "bg-blue-50 border-blue-200 text-blue-800"
          )}
        >
          {notification.type === 'success' && <Check className="h-4 w-4" />}
          {notification.type === 'error' && <AlertCircle className="h-4 w-4" />}
          {notification.type === 'info' && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          )}
          
          <span className="text-sm font-medium flex-1">{notification.message}</span>
          
          <button
            onClick={() => removeNotification(notification.id)}
            className="text-current hover:opacity-70 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
