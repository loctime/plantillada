"use client"

import { useState, useEffect } from 'react'
import { Config } from '@/lib/config-loader'
import { cn } from '@/lib/utils'

interface NavigationItem {
  id: string
  name: string
  route: string
  icon: string
}

const templateNavigation: Record<string, NavigationItem> = {
  landing: {
    id: 'landing',
    name: 'Inicio',
    route: '/',
    icon: '🏠'
  },
  shop: {
    id: 'shop',
    name: 'Tienda',
    route: '/shop',
    icon: '🛒'
  },
  forum: {
    id: 'forum',
    name: 'Foro',
    route: '/forum',
    icon: '💬'
  }
}

interface DynamicNavigationProps {
  config?: Config
  isMobile?: boolean
}

export function DynamicNavigation({ config, isMobile = false }: DynamicNavigationProps) {
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([])

  useEffect(() => {
    if (config?.selectedTemplates) {
      const items = config.selectedTemplates
        .map(templateId => templateNavigation[templateId])
        .filter(Boolean)
      
      // Siempre incluir la página principal si no está seleccionada
      if (!config.selectedTemplates.includes('landing')) {
        items.unshift(templateNavigation.landing)
      }
      
      setNavigationItems(items)
    } else {
      // Fallback: mostrar navegación por defecto
      setNavigationItems([
        templateNavigation.landing,
        templateNavigation.shop
      ])
    }
  }, [config?.selectedTemplates])

  return (
    <nav className={isMobile ? "flex flex-col space-y-4" : "hidden md:flex space-x-8"}>
      {navigationItems.map((item) => (
        <a
          key={item.id}
          href={item.route}
          className={cn(
            "transition-colors flex items-center gap-2",
            isMobile 
              ? "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" 
              : "text-gray-700 hover:text-gray-900"
          )}
        >
          <span>{item.icon}</span>
          <span>{item.name}</span>
        </a>
      ))}
    </nav>
  )
}
