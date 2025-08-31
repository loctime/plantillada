"use client"

import { useState, useEffect } from 'react'
import { useAdmin } from '@/lib/admin-context'
import { 
  DEFAULT_SIMPLIFIED_THEME, 
  applySimplifiedColors,
  SimplifiedTheme 
} from '@/lib/simplified-colors'

export function useTheme() {
  const { config } = useAdmin()
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Detectar preferencia del sistema al cargar
  useEffect(() => {
    console.log('🔄 useTheme: Detectando preferencia inicial del tema')
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      console.log(`📥 useTheme: Tema guardado encontrado: ${savedTheme}`)
      setIsDarkMode(savedTheme === 'dark')
    } else {
      // Detectar preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      console.log(`🌐 useTheme: Usando preferencia del sistema: ${prefersDark ? 'oscuro' : 'claro'}`)
      setIsDarkMode(prefersDark)
    }
  }, [])

  // Aplicar tema cuando cambie
  useEffect(() => {
    console.log(`🎨 useTheme: Aplicando tema ${isDarkMode ? 'oscuro' : 'claro'}`)
    const theme = isDarkMode ? 'dark' : 'light'
    localStorage.setItem('theme', theme)
    
    // Aplicar clase de tema al documentElement
    const root = document.documentElement
    if (isDarkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    console.log(`🎭 useTheme: Clase 'dark' ${isDarkMode ? 'agregada' : 'removida'} del documentElement`)
    
    // Aplicar sistema de colores simplificado
    const simplifiedColors = (config as any)?.simplifiedColors || DEFAULT_SIMPLIFIED_THEME
    console.log('🎨 useTheme: Aplicando colores simplificados')
    applySimplifiedColors(simplifiedColors, isDarkMode)
    
    // Mantener compatibilidad con el sistema anterior si existe
    if (config?.theme) {
      console.log('✅ useTheme: Configuración de tema anterior disponible (compatibilidad)')
      const designId = config.selectedDesigns?.landing
      const designOverride = designId ? (config as any).designOverrides?.[designId]?.theme : undefined
      const mergedTheme = {
        light: { ...(config.theme.light || {}), ...(designOverride?.light || {}) },
        dark: { ...(config.theme.dark || {}), ...(designOverride?.dark || {}) }
      }
      const activeTheme = mergedTheme[isDarkMode ? 'dark' : 'light']
      
      // Aplicar variables CSS adicionales del sistema anterior
      console.log('🎨 useTheme: Aplicando variables CSS adicionales del sistema anterior')
      if (activeTheme.backgroundColor) root.style.setProperty('--background-color', activeTheme.backgroundColor)
      if (activeTheme.sectionBackground) root.style.setProperty('--section-background', activeTheme.sectionBackground)
      if (activeTheme.navbarBackground) root.style.setProperty('--navbar-background', activeTheme.navbarBackground)
      if (activeTheme.textColor) root.style.setProperty('--text-color', activeTheme.textColor)
      if (activeTheme.accentColor) root.style.setProperty('--accent-color', activeTheme.accentColor)
      if (activeTheme.primaryButtonColor) root.style.setProperty('--primary-button-color', activeTheme.primaryButtonColor)
      if (activeTheme.secondaryButtonColor) root.style.setProperty('--secondary-button-color', activeTheme.secondaryButtonColor)
      if (activeTheme.outlineButtonColor) root.style.setProperty('--outline-button-color', activeTheme.outlineButtonColor)
      if (activeTheme.cardBackground) root.style.setProperty('--card-background', activeTheme.cardBackground)
      if (activeTheme.cardForeground) root.style.setProperty('--card-foreground', activeTheme.cardForeground)
      if (activeTheme.borderColor) root.style.setProperty('--border-color', activeTheme.borderColor)
      if (activeTheme.headingColor) root.style.setProperty('--heading-color', activeTheme.headingColor)
      
      // Crear color de navegación con transparencia
      const navbarColor = activeTheme.navbarBackground || '#ffffff'
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
    } else {
      console.log('⚠️ useTheme: No hay configuración de tema disponible')
    }
  }, [isDarkMode, config])

  const toggleTheme = () => {
    console.log(`🔄 useTheme: Toggle del tema de ${isDarkMode ? 'oscuro' : 'claro'} a ${!isDarkMode ? 'oscuro' : 'claro'}`)
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
