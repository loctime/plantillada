"use client"

import { Button } from '@/components/ui/button'
import { ShoppingCart, Menu, Upload } from 'lucide-react'
import { useAdmin } from '@/lib/admin-context'
import { ShopDesignSelector } from '@/components/shop-design-selector'
import { Design } from '@/lib/designs'

interface ShopHeaderProps {
  shopConfig: any
  cartItemCount: number
  onOpenCart: () => void
  onOpenBulkUpload: () => void
  onToggleMobileMenu: () => void
  selectedDesign?: string
  onDesignSelect?: (design: Design) => void
}

export function ShopHeader({
  shopConfig,
  cartItemCount,
  onOpenCart,
  onOpenBulkUpload,
  onToggleMobileMenu,
  selectedDesign,
  onDesignSelect
}: ShopHeaderProps) {
  const { isAdminMode } = useAdmin()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y título */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              {shopConfig.title}
            </h1>
          </div>

          {/* Navegación central */}
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Inicio
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
              Productos
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
              Categorías
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
              Contacto
            </a>
          </nav>

          {/* Acciones del lado derecho */}
          <div className="flex items-center space-x-4">
            {/* Selector de diseños (solo en modo admin) */}
            {isAdminMode && onDesignSelect && (
              <ShopDesignSelector
                selectedDesign={selectedDesign}
                onDesignSelect={onDesignSelect}
                className="hidden md:flex"
              />
            )}

            {/* Botón de carga masiva (solo en modo admin) */}
            {isAdminMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenBulkUpload}
                className="hidden md:flex"
              >
                <Upload className="h-4 w-4 mr-2" />
                Carga Masiva
              </Button>
            )}

            {/* Carrito */}
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenCart}
              className="relative"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Carrito
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>

            {/* Menú móvil */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleMobileMenu}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
