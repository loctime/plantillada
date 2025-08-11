"use client"

import { useState, useEffect } from 'react'
import { useAdmin } from '@/lib/admin-context'

export function useTheme() {
  const { config } = useAdmin()
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Detectar preferencia del sistema al cargar
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark')
    } else {
      // Detectar preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDarkMode(prefersDark)
    }
  }, [])

  // Aplicar tema cuando cambie
  useEffect(() => {
    const theme = isDarkMode ? 'dark' : 'light'
    localStorage.setItem('theme', theme)
    
    // Aplicar estilos CSS personalizados si existen en la configuración
    if (config?.theme) {
      const activeTheme = config.theme[isDarkMode ? 'dark' : 'light']
      
      // Aplicar variables CSS personalizadas
      const root = document.documentElement
      root.style.setProperty('--background-color', activeTheme.backgroundColor)
      root.style.setProperty('--section-background', activeTheme.sectionBackground)
      root.style.setProperty('--navbar-background', activeTheme.navbarBackground)
      root.style.setProperty('--text-color', activeTheme.textColor)
      root.style.setProperty('--accent-color', activeTheme.accentColor)
      root.style.setProperty('--primary-button-color', activeTheme.primaryButtonColor)
      root.style.setProperty('--secondary-button-color', activeTheme.secondaryButtonColor)
      root.style.setProperty('--outline-button-color', activeTheme.outlineButtonColor)
      
      // Crear color de navegación con transparencia
      const navbarColor = activeTheme.navbarBackground
      let navbarWithOpacity = navbarColor
      
      if (navbarColor.startsWith('#')) {
        // Convertir color hex a rgba para mejor control de transparencia
        const r = parseInt(navbarColor.slice(1, 3), 16)
        const g = parseInt(navbarColor.slice(3, 5), 16)
        const b = parseInt(navbarColor.slice(5, 7), 16)
        navbarWithOpacity = `rgba(${r}, ${g}, ${b}, 0.8)`
      } else if (navbarColor.startsWith('rgb(')) {
        // Si ya es rgb, convertir a rgba
        navbarWithOpacity = navbarColor.replace('rgb(', 'rgba(').replace(')', ', 0.8)')
      }
      
      root.style.setProperty('--navbar-background-transparent', navbarWithOpacity)
      
      // Aplicar clase de tema
      document.body.classList.toggle('dark', isDarkMode)
    }
  }, [isDarkMode, config])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const setTheme = (dark: boolean) => {
    setIsDarkMode(dark)
  }

  return {
    isDarkMode,
    toggleTheme,
    setTheme
  }
}
