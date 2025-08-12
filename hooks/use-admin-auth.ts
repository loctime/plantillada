"use client"

import { useState, useEffect } from 'react'

interface UseAdminAuthReturn {
  isAuthenticated: boolean
  login: () => void
  logout: () => void
  checkAuth: () => boolean
}

export function useAdminAuth(): UseAdminAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Verificar autenticación al cargar y escuchar cambios en localStorage
  useEffect(() => {
    const checkAuth = (): boolean => {
      if (typeof window === 'undefined') return false
      
      const authStatus = localStorage.getItem('admin-authenticated')
      const loginTime = localStorage.getItem('admin-login-time')
      
      if (authStatus === 'true' && loginTime) {
        // Verificar si han pasado más de 24 horas desde el login
        const loginTimestamp = parseInt(loginTime)
        const currentTime = Date.now()
        const hoursSinceLogin = (currentTime - loginTimestamp) / (1000 * 60 * 60)
        
        if (hoursSinceLogin < 24) {
          setIsAuthenticated(true)
          return true
        } else {
          // Sesión expirada, limpiar localStorage
          localStorage.removeItem('admin-authenticated')
          localStorage.removeItem('admin-login-time')
          setIsAuthenticated(false)
          return false
        }
      } else {
        setIsAuthenticated(false)
        return false
      }
    }

    // Verificar autenticación inicial
    checkAuth()

    // Escuchar cambios en localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin-authenticated' || e.key === 'admin-login-time') {
        checkAuth()
      }
    }

    // Escuchar eventos de storage (para cambios desde otras pestañas)
    window.addEventListener('storage', handleStorageChange)

    // Crear un evento personalizado para cambios en la misma pestaña
    const handleCustomStorageChange = (e: CustomEvent) => {
      if (e.detail.key === 'admin-authenticated' || e.detail.key === 'admin-login-time') {
        checkAuth()
      }
    }

    window.addEventListener('admin-auth-change', handleCustomStorageChange as EventListener)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('admin-auth-change', handleCustomStorageChange as EventListener)
    }
  }, [])

  const checkAuth = (): boolean => {
    if (typeof window === 'undefined') return false
    
    const authStatus = localStorage.getItem('admin-authenticated')
    const loginTime = localStorage.getItem('admin-login-time')
    
    if (authStatus === 'true' && loginTime) {
      // Verificar si han pasado más de 24 horas desde el login
      const loginTimestamp = parseInt(loginTime)
      const currentTime = Date.now()
      const hoursSinceLogin = (currentTime - loginTimestamp) / (1000 * 60 * 60)
      
      if (hoursSinceLogin < 24) {
        setIsAuthenticated(true)
        return true
      } else {
        // Sesión expirada, limpiar localStorage
        localStorage.removeItem('admin-authenticated')
        localStorage.removeItem('admin-login-time')
        setIsAuthenticated(false)
        return false
      }
    } else {
      setIsAuthenticated(false)
      return false
    }
  }

  const login = () => {
    localStorage.setItem('admin-authenticated', 'true')
    localStorage.setItem('admin-login-time', Date.now().toString())
    setIsAuthenticated(true)
    
    // Disparar evento personalizado para notificar el cambio
    window.dispatchEvent(new CustomEvent('admin-auth-change', {
      detail: { key: 'admin-authenticated', value: 'true' }
    }))
  }

  const logout = () => {
    localStorage.removeItem('admin-authenticated')
    localStorage.removeItem('admin-login-time')
    setIsAuthenticated(false)
    
    // Disparar evento personalizado para notificar el cambio
    window.dispatchEvent(new CustomEvent('admin-auth-change', {
      detail: { key: 'admin-authenticated', value: null }
    }))
  }

  return {
    isAuthenticated,
    login,
    logout,
    checkAuth
  }
}
