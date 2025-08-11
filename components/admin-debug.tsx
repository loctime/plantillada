"use client"

import { useAdmin } from '@/lib/admin-context'

export function AdminDebug() {
  const { isAdminMode, toggleAdminMode } = useAdmin()

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
