"use client"

import { useState, useEffect } from 'react'
import { Config } from '@/lib/config-loader'
import { cn } from '@/lib/utils'
import { useAdminAuth } from '@/hooks/use-admin-auth'
import { AdminLoginModal } from '@/components/admin-login-modal'
import { Settings } from 'lucide-react'

interface NavigationItem {
  id: string
  name: string
  route: string
  icon: string
  onClick?: () => void
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
  },
  psicologos: {
    id: 'psicologos',
    name: 'Psicología',
    route: '/psicologos',
    icon: '🧠'
  },
  linkhub: {
    id: 'linkhub',
    name: 'Links',
    route: '/linkhub',
    icon: '🔗'
  }
}

interface DynamicNavigationProps {
  config?: Config
  isMobile?: boolean
}

export function DynamicNavigation({ config, isMobile = false }: DynamicNavigationProps) {
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([])
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { isAuthenticated, login } = useAdminAuth()

  useEffect(() => {
    // Usar activeTemplates si está disponible, sino selectedTemplates (legacy)
    const activeTemplates = config?.activeTemplates || config?.selectedTemplates || []
    
    if (activeTemplates.length > 0) {
      const items = activeTemplates
        .map(templateId => templateNavigation[templateId])
        .filter(Boolean)
      
      // Siempre incluir la página principal si no está seleccionada
      if (!activeTemplates.includes('landing')) {
        items.unshift(templateNavigation.landing)
      }
      
      // Agregar elementos de navegación personalizados si existen
      if (config?.navigation?.customItems) {
        items.push(...config.navigation.customItems)
      }
      
      // Agregar enlace de admin si está autenticado
      if (isAuthenticated) {
        items.push({
          id: 'admin',
          name: 'Admin',
          route: '/admin',
          icon: '⚙️'
        })
      } else {
        // Agregar botón de login de admin si no está autenticado
        items.push({
          id: 'admin-login',
          name: 'Admin',
          route: '#',
          icon: '⚙️',
          onClick: () => setShowLoginModal(true)
        })
      }
      
      setNavigationItems(items)
    } else {
      // Fallback: mostrar navegación por defecto
      const defaultItems = [
        templateNavigation.landing,
        templateNavigation.shop
      ]
      
      // Agregar elementos de navegación personalizados si existen
      if (config?.navigation?.customItems) {
        defaultItems.push(...config.navigation.customItems)
      }
      
      // Agregar enlace de admin si está autenticado
      if (isAuthenticated) {
        defaultItems.push({
          id: 'admin',
          name: 'Admin',
          route: '/admin',
          icon: '⚙️'
        })
      } else {
        // Agregar botón de login de admin si no está autenticado
        defaultItems.push({
          id: 'admin-login',
          name: 'Admin',
          route: '#',
          icon: '⚙️',
          onClick: () => setShowLoginModal(true)
        })
      }
      
      setNavigationItems(defaultItems)
    }
  }, [config?.activeTemplates, config?.selectedTemplates, config?.navigation?.customItems, isAuthenticated])

  const handleLoginSuccess = () => {
    login()
    setShowLoginModal(false)
  }

  return (
    <>
      <nav className={isMobile ? "flex flex-col space-y-4" : "hidden md:flex space-x-8"}>
        {navigationItems.map((item) => (
          <a
            key={item.id}
            href={item.route}
            onClick={item.onClick}
            className={cn(
              "theme-transition flex items-center gap-2",
              isMobile 
                ? "theme-text-primary theme-hover-text py-2 px-3 rounded-md theme-hover-bg" 
                : "theme-nav-link theme-hover-text",
              item.onClick && "cursor-pointer"
            )}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </a>
        ))}
      </nav>
      
      <AdminLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  )
}
