"use client"

import { useEffect } from 'react'
import { useAdmin } from '@/lib/admin-context'

export function useGlobalColors() {
  const { config } = useAdmin()

  useEffect(() => {
    if (!config?.site) return

    // Seleccionar overrides por diseño activo si existen
    try {
      const designId = config.selectedDesigns?.landing
      const overrides = designId && (config.designOverrides as any)?.[designId]
      const mergedSite = overrides?.site ? { ...(config.site as any), ...overrides.site } : (config.site as any)
      const mergedTheme = overrides?.theme ? { ...(config.theme as any), ...overrides.theme } : config.theme

      // PRIORIDAD: Si el usuario tiene configuración personalizada, NO aplicar estilos por defecto
      const hasUserCustomization = config.simplifiedColors || 
        (config.theme && (config.theme.light || config.theme.dark)) ||
        Object.keys(mergedSite).some(key => key.includes('Color'))

      if (hasUserCustomization) {
        console.log('🎨 useGlobalColors: Usuario tiene personalización, respetando configuración')
        return // NO aplicar estilos por defecto si el usuario tiene personalización
      }

      console.log('🎨 useGlobalColors: Aplicando estilos por defecto del diseño')

      const styleElement = document.getElementById('global-colors-style') || 
        (() => {
          const el = document.createElement('style')
          el.id = 'global-colors-style'
          document.head.appendChild(el)
          return el
        })()

      const cssVarMap: Record<string, string> = {
        backgroundColor: '--background-color',
        sectionBackgroundColor: '--section-background',
        navbarBackgroundColor: '--navbar-background',
        buttonBackgroundColor: '--primary-button-color',
        buttonTextColor: '--button-text-color',
        titleColor: '--heading-color',
        // extras posibles
        linkColor: '--link-color',
        linkHoverColor: '--link-hover-color'
      }

      const lightThemeVars: string[] = []
      const darkThemeVars: string[] = []

      // Mapear config.theme a variables CSS del sistema (SIN !important)
      const theme = mergedTheme
      if (theme?.light) {
        const t = theme.light as any
        if (t.backgroundColor) lightThemeVars.push(`--background-color: ${t.backgroundColor};`)
        if (t.sectionBackground) lightThemeVars.push(`--section-background: ${t.sectionBackground};`)
        if (t.navbarBackground) lightThemeVars.push(`--navbar-background: ${t.navbarBackground};`)
        if (t.textColor) lightThemeVars.push(`--text-color: ${t.textColor};`)
        if (t.accentColor) lightThemeVars.push(`--accent-color: ${t.accentColor};`)
        if (t.primaryButtonColor) lightThemeVars.push(`--primary-button-color: ${t.primaryButtonColor};`)
        if (t.secondaryButtonColor) lightThemeVars.push(`--secondary-button-color: ${t.secondaryButtonColor};`)
        if (t.outlineButtonColor) lightThemeVars.push(`--outline-button-color: ${t.outlineButtonColor};`)
        if (t.cardBackground) lightThemeVars.push(`--card-background: ${t.cardBackground};`)
        if (t.cardForeground) lightThemeVars.push(`--card-foreground: ${t.cardForeground};`)
        if (t.borderColor) lightThemeVars.push(`--border-color: ${t.borderColor};`)
      }
      if (theme?.dark) {
        const t = theme.dark as any
        if (t.backgroundColor) darkThemeVars.push(`--background-color: ${t.backgroundColor};`)
        if (t.sectionBackground) darkThemeVars.push(`--section-background: ${t.sectionBackground};`)
        if (t.navbarBackground) darkThemeVars.push(`--navbar-background: ${t.navbarBackground};`)
        if (t.textColor) darkThemeVars.push(`--text-color: ${t.textColor};`)
        if (t.accentColor) darkThemeVars.push(`--accent-color: ${t.accentColor};`)
        if (t.primaryButtonColor) darkThemeVars.push(`--primary-button-color: ${t.primaryButtonColor};`)
        if (t.secondaryButtonColor) darkThemeVars.push(`--secondary-button-color: ${t.secondaryButtonColor};`)
        if (t.outlineButtonColor) darkThemeVars.push(`--outline-button-color: ${t.outlineButtonColor};`)
        if (t.cardBackground) darkThemeVars.push(`--card-background: ${t.cardBackground};`)
        if (t.cardForeground) darkThemeVars.push(`--card-foreground: ${t.cardForeground};`)
        if (t.borderColor) darkThemeVars.push(`--border-color: ${t.borderColor};`)
      }

      // Overrides desde config.site (SIN !important)
      const siteOverrides: string[] = []
      Object.entries(cssVarMap).forEach(([key, cssVar]) => {
        const val = (mergedSite as any)[key]
        if (val) {
          siteOverrides.push(`${cssVar}: ${val};`)
        }
      })

      const cssBlocks: string[] = []
      if (lightThemeVars.length > 0 || siteOverrides.length > 0) {
        cssBlocks.push(`:root {\n${[...lightThemeVars, ...siteOverrides].join('\n')}\n}`)
      }
      if (darkThemeVars.length > 0 || siteOverrides.length > 0) {
        cssBlocks.push(`.dark {\n${[...darkThemeVars, ...siteOverrides].join('\n')}\n}`)
      }

      // Reglas específicas por elementos (SIN !important)
      const elementRules = buildElementColorRules(mergedSite)

      styleElement.textContent = [
        cssBlocks.join('\n'),
        elementRules
      ].join('\n')
    } catch (e) {
      console.warn('⚠️ useGlobalColors: Error aplicando estilos:', e)
    }
  }, [config?.site, config?.theme, config?.selectedDesigns, (config as any)?.designOverrides, config?.simplifiedColors])

  const buildElementColorRules = (site: any) => {
    const cssRules: string[] = []

    if (site.heroTitleColor) {
      cssRules.push(`
        .hero-title, h1, .text-4xl, .text-5xl { color: ${site.heroTitleColor}; }
      `)
    }
    if (site.heroSubtitleColor) {
      cssRules.push(`
        .hero-subtitle, .theme-text-subtitle { color: ${site.heroSubtitleColor}; }
      `)
    }
    if (site.taglineColor) {
      cssRules.push(`
        .tagline, .text-xs { color: ${site.taglineColor}; }
      `)
    }
    if (site.sessionsTitleColor) {
      cssRules.push(`
        .sessions-title, h2 { color: ${site.sessionsTitleColor}; }
      `)
    }
    if (site.sessionsSubtitleColor) {
      cssRules.push(`
        .sessions-subtitle { color: ${site.sessionsSubtitleColor}; }
      `)
    }
    if (site.titleColor) {
      cssRules.push(`
        .navbar-title, header span { color: ${site.titleColor}; }
      `)
    }
    if (site.navbarBackgroundColor) {
      cssRules.push(`
        header, .theme-bg-navbar-transparent { background-color: ${site.navbarBackgroundColor}; }
      `)
    }
    if (site.buttonBackgroundColor) {
      cssRules.push(`
        .theme-btn-primary, button[class*="bg-"] { background-color: ${site.buttonBackgroundColor}; }
      `)
    }
    if (site.buttonTextColor) {
      cssRules.push(`
        .theme-btn-primary, button[class*="bg-"] { color: ${site.buttonTextColor}; }
      `)
    }
    if (site.backgroundColor) {
      cssRules.push(`
        .theme-bg-primary, body { background-color: ${site.backgroundColor}; }
      `)
    }
    if (site.sectionBackgroundColor) {
      cssRules.push(`
        .theme-bg-section, section { background-color: ${site.sectionBackgroundColor}; }
      `)
    }

    // Fondo específico del Hero (si se define)
    if (site.heroBackgroundColor) {
      cssRules.push(`
        .hero-section { background-color: ${site.heroBackgroundColor}; }
      `)
    }

    return cssRules.join('\n')
  }

  return null
}
