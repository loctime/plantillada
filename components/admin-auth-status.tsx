"use client"

import { useAdminAuth } from '@/hooks/use-admin-auth'
import { Badge } from '@/components/ui/badge'
import { User, Clock, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function AdminAuthStatus() {
  const { isAuthenticated, logout } = useAdminAuth()
  const router = useRouter()

  if (!isAuthenticated) return null

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  // Calcular tiempo restante de sesión
  const getSessionTimeRemaining = () => {
    if (typeof window === 'undefined') return null
    
    const loginTime = localStorage.getItem('admin-login-time')
    if (!loginTime) return null
    
    const loginTimestamp = parseInt(loginTime)
    const currentTime = Date.now()
    const hoursSinceLogin = (currentTime - loginTimestamp) / (1000 * 60 * 60)
    const hoursRemaining = Math.max(0, 24 - hoursSinceLogin)
    
    if (hoursRemaining < 1) {
      const minutesRemaining = Math.floor(hoursRemaining * 60)
      return `${minutesRemaining} min`
    }
    
    return `${Math.floor(hoursRemaining)}h ${Math.floor((hoursRemaining % 1) * 60)}m`
  }

  const timeRemaining = getSessionTimeRemaining()

  return (
    <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-2 shadow-lg border">
      
      
      <Button
        size="sm"
        variant="ghost"
        onClick={handleLogout}
        className="h-6 w-6 p-0 ml-2"
        title="Cerrar sesión"
      >
        <LogOut className="h-3 w-3" />
      </Button>
    </div>
  )
}
