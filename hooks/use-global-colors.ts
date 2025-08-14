"use client"

import { useEffect } from 'react'
import { useAdmin } from '@/lib/admin-context'

export function useGlobalColors() {
  const { config } = useAdmin()

  useEffect(() => {
    if (!config?.site) return

    // Aplicar colores globales como variables CSS
    const colorProperties = [
      'heroTitleColor',
      'heroSubtitleColor', 
      'taglineColor',
      'sessionsTitleColor',
      'sessionsSubtitleColor',
      'titleColor',
      'navbarBackgroundColor',
      'buttonBackgroundColor',
      'buttonTextColor',
      'backgroundColor',
      'sectionBackgroundColor'
    ]

    colorProperties.forEach(property => {
      const value = config.site[property]
      if (value) {
        document.documentElement.style.setProperty(`--${property}`, value)
      }
    })

    // Aplicar colores específicos a elementos
    applyColorsToElements(config.site)
  }, [config?.site])

  const applyColorsToElements = (site: any) => {
    // Aplicar colores a elementos específicos usando selectores CSS
    const styleElement = document.getElementById('global-colors-style') || 
      (() => {
        const el = document.createElement('style')
        el.id = 'global-colors-style'
        document.head.appendChild(el)
        return el
      })()

    const cssRules = []

    // Títulos
    if (site.heroTitleColor) {
      cssRules.push(`
        .hero-title, h1, .text-4xl, .text-5xl {
          color: ${site.heroTitleColor} !important;
        }
      `)
    }

    if (site.heroSubtitleColor) {
      cssRules.push(`
        .hero-subtitle, .theme-text-subtitle {
          color: ${site.heroSubtitleColor} !important;
        }
      `)
    }

    if (site.taglineColor) {
      cssRules.push(`
        .tagline, .text-xs {
          color: ${site.taglineColor} !important;
        }
      `)
    }

    if (site.sessionsTitleColor) {
      cssRules.push(`
        .sessions-title, h2 {
          color: ${site.sessionsTitleColor} !important;
        }
      `)
    }

    if (site.sessionsSubtitleColor) {
      cssRules.push(`
        .sessions-subtitle {
          color: ${site.sessionsSubtitleColor} !important;
        }
      `)
    }

    // Navegación
    if (site.titleColor) {
      cssRules.push(`
        .navbar-title, header span {
          color: ${site.titleColor} !important;
        }
      `)
    }

    if (site.navbarBackgroundColor) {
      cssRules.push(`
        header, .theme-bg-navbar-transparent {
          background-color: ${site.navbarBackgroundColor} !important;
        }
      `)
    }

    // Botones
    if (site.buttonBackgroundColor) {
      cssRules.push(`
        .theme-btn-primary, button[class*="bg-"] {
          background-color: ${site.buttonBackgroundColor} !important;
        }
      `)
    }

    if (site.buttonTextColor) {
      cssRules.push(`
        .theme-btn-primary, button[class*="bg-"] {
          color: ${site.buttonTextColor} !important;
        }
      `)
    }

    // Fondos
    if (site.backgroundColor) {
      cssRules.push(`
        .theme-bg-primary, body {
          background-color: ${site.backgroundColor} !important;
        }
      `)
    }

    if (site.sectionBackgroundColor) {
      cssRules.push(`
        .theme-bg-section, section {
          background-color: ${site.sectionBackgroundColor} !important;
        }
      `)
    }

    styleElement.textContent = cssRules.join('\n')
  }

  return null
}
