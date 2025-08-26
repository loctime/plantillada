"use client"

import { useAdmin } from '@/lib/admin-context'
import { useAdminAuth } from '@/hooks/use-admin-auth'

export function AdminDebug() {
  const { isAdminMode, toggleAdminMode } = useAdmin()
  const { isAuthenticated } = useAdminAuth()

  // No renderizar nada si no está autenticado
  if (!isAuthenticated) {
    return null
  }

  
}
