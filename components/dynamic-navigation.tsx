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
    if (config?.selectedTemplates) {
      const items = config.selectedTemplates
        .map(templateId => templateNavigation[templateId])
        .filter(Boolean)
      
      // Siempre incluir la página principal si no está seleccionada
      if (!config.selectedTemplates.includes('landing')) {
        items.unshift(templateNavigation.landing)
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
  }, [config?.selectedTemplates, isAuthenticated])

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
              "transition-colors flex items-center gap-2",
              isMobile 
                ? "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" 
                : "text-gray-700 hover:text-gray-900",
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
