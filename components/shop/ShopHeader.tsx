"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  ShoppingCart, 
  Menu, 
  X,
  User,
  Heart
} from "lucide-react"
import { ShopDesignSelector } from "@/components/shop-design-selector"
import { Design } from "@/lib/designs"
import { useAdmin } from "@/lib/admin-context"

interface ShopHeaderProps {
  storeName: string
  storeTagline: string
  navigation: string[]
  searchPlaceholder: string
  cartItemCount?: number
  onSearch?: (query: string) => void
  onCartClick?: () => void
  onNavItemClick?: (item: string) => void
  onDesignSelect?: (design: Design) => void
  onLayoutChange?: (layout: 'mobile-first' | 'web-first') => void
  onProductStyleChange?: (style: 'cards-square' | 'list-horizontal') => void
  onSidebarChange?: (sidebar: boolean) => void
  className?: string
}

export function ShopHeader({
  storeName,
  storeTagline,
  navigation,
  searchPlaceholder,
  cartItemCount = 0,
  onSearch,
  onCartClick,
  onNavItemClick,
  onDesignSelect,
  onLayoutChange,
  onProductStyleChange,
  onSidebarChange,
  className = ""
}: ShopHeaderProps) {
  const { isAdminMode } = useAdmin()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchQuery)
  }

  const handleNavClick = (item: string) => {
    onNavItemClick?.(item)
    setIsMobileMenuOpen(false)
  }

  return (
    <header className={`bg-white shadow-sm border-b ${className}`}>
      {/* Header Superior */}
      <div className="bg-gray-50 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-gray-600">{storeTagline}</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <User className="h-4 w-4 mr-2" />
                Mi Cuenta
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600">
                <Heart className="h-4 w-4 mr-2" />
                Favoritos
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Header Principal */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo y Nombre */}
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-gray-900">
              {storeName}
            </div>
          </div>

          {/* Buscador - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
            </form>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-4">
            {/* Selector de Diseño (solo en modo admin) */}
            {isAdminMode && onDesignSelect && (
              <ShopDesignSelector 
                onDesignSelect={onDesignSelect}
                onLayoutChange={onLayoutChange}
                onProductStyleChange={onProductStyleChange}
                onSidebarChange={onSidebarChange}
              />
            )}
            
            {/* Carrito */}
            <Button
              variant="outline"
              size="sm"
              onClick={onCartClick}
              className="relative"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Carrito
              {cartItemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {/* Menú Móvil */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Buscador - Móvil */}
        <div className="md:hidden mt-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Navegación */}
      <nav className="border-t bg-white">
        <div className="container mx-auto px-4">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center space-x-8 py-3">
            {navigation.map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className="text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="space-y-2">
                {navigation.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleNavClick(item)}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
