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

  return (
    <div className="fixed bottom-4 left-4 bg-black text-white p-2 rounded text-xs z-50">
      <div>Admin Mode: {isAdminMode ? 'ON' : 'OFF'}</div>
      <button 
        onClick={toggleAdminMode}
        className="bg-blue-500 px-2 py-1 rounded mt-1 text-xs"
      >
        Toggle Admin
      </button>
    </div>
  )
}
