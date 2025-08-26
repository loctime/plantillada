"use client"

import { Button } from '@/components/ui/button'
import { ShoppingCart, Menu, Upload, Edit3, X } from 'lucide-react'
import { useAdmin } from '@/lib/admin-context'
import { ShopDesignSelector } from '@/components/shop-design-selector'
import { Design } from '@/lib/designs'
import { DynamicNavigation } from '@/components/dynamic-navigation'
import { Config } from '@/lib/config-loader'
import { ThemeSwitch } from '@/components/theme-switch'
import { AdminToggle } from '@/components/admin-toggle'
import { EditableText } from '@/components/editable-text'
import Link from 'next/link'

interface ShopHeaderProps {
  shopConfig: any
  cartItemCount: number
  onOpenCart: () => void
  onOpenBulkUpload: () => void
  onOpenBulkEdit: () => void
  onToggleMobileMenu: () => void
  selectedDesign?: string
  onDesignSelect?: (design: Design) => void
  config?: Config | null
  isMobileMenuOpen?: boolean
}

export function ShopHeader({
  shopConfig,
  cartItemCount,
  onOpenCart,
  onOpenBulkUpload,
  onOpenBulkEdit,
  onToggleMobileMenu,
  selectedDesign,
  onDesignSelect,
  config,
  isMobileMenuOpen = false
}: ShopHeaderProps) {
  const { isAdminMode, updateConfig } = useAdmin()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y título */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-semibold text-lg text-gray-900">
                <EditableText
                  value={config?.site?.title || shopConfig.title}
                  onSave={(value) => updateConfig({ site: { ...config?.site, title: value } })}
                  className="font-semibold text-lg"
                />
              </span>
            </Link>
          </div>

          {/* Navegación central - Usando DynamicNavigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <DynamicNavigation config={config} />
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

            {/* Botones de gestión masiva (solo en modo admin) */}
            {isAdminMode && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onOpenBulkUpload}
                  className="hidden md:flex"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Carga Masiva
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onOpenBulkEdit}
                  className="hidden md:flex"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Editar Masivo
                </Button>
              </>
            )}

            {/* Theme Switch */}
            <ThemeSwitch />

            {/* Admin Toggle */}
            <AdminToggle />

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
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-2">
              <DynamicNavigation config={config} isMobile={true} />
              
              {/* Botones de admin en móvil */}
              {isAdminMode && onDesignSelect && (
                <div className="mt-4">
                  <ShopDesignSelector
                    selectedDesign={selectedDesign}
                    onDesignSelect={onDesignSelect}
                    fullWidth
                  />
                </div>
              )}
              
              {isAdminMode && (
                <div className="mt-4 space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onOpenBulkUpload}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Carga Masiva
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onOpenBulkEdit}
                    className="w-full"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Editar Masivo
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
