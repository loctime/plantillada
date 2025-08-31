"use client"

import { useState, useEffect } from 'react'
import { Config } from '@/lib/config-loader'
import { useAdmin } from '@/lib/admin-context'
import { Design, shopDesigns } from '@/lib/designs'
import './layout-styles.css'

// Componentes del nuevo sistema
import { UniversalNavbar } from '@/components/universal-navbar'
import { ShopFooter } from '@/components/shop/ShopFooter'
import { ShopSidebar } from '@/components/shop/ShopSidebar'
import { ShopDesignSelector } from '@/components/shop-design-selector'
import { AdminToggle } from '@/components/admin-toggle'

// Componentes de UI
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Filter, ShoppingCart, Star, Heart } from 'lucide-react'

// Tipos
interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  rating: number
  inStock: boolean
}

interface LayoutConfig {
  design: string
  layout: 'mobile-first' | 'web-first'
  productStyle: 'cards-square' | 'list-horizontal' | 'menu-vertical'
  sidebar: boolean
}

export default function ShopPage() {
  const { isAdminMode } = useAdmin()
  const [config, setConfig] = useState<Config | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Estado del diseño
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>({
    design: 'food-shop',
    layout: 'mobile-first',
    productStyle: 'cards-square',
    sidebar: false
  })
  
  // Estado de la tienda
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [searchQuery, setSearchQuery] = useState('')
  const [cartItems, setCartItems] = useState<Product[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Configuración actual del diseño
  const currentDesign = shopDesigns.find(d => d.id === layoutConfig.design)
  const designConfig = currentDesign?.predefinedConfig?.shopConfig || {
    storeName: 'Mi Tienda',
    storeTagline: 'Los mejores productos',
    navigation: ['INICIO', 'PRODUCTOS', 'OFERTAS', 'CONTACTO'],
    categories: ['Todos', 'Electrónicos', 'Ropa', 'Hogar'],
    searchPlaceholder: 'Buscar productos...',
    addToCartText: 'Agregar al Carrito',
    cartTitle: 'Carrito de Compras'
  }

  // Cargar configuración
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/config')
        const data = await response.json()
        setConfig(data)
        
        // Cargar productos de ejemplo
        setProducts(sampleProducts)
        setFilteredProducts(sampleProducts)
      } catch (error) {
        console.error('Error loading config:', error)
        // Usar productos de ejemplo si no hay configuración
        setProducts(sampleProducts)
        setFilteredProducts(sampleProducts)
      } finally {
        setLoading(false)
      }
    }
    
    loadConfig()
  }, [])

  // Aplicar filtros
  useEffect(() => {
    let filtered = products
    
    // Filtro por categoría
    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }
    
    // Filtro por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    setFilteredProducts(filtered)
  }, [products, selectedCategory, searchQuery])

  // Manejadores del diseño
  const handleDesignSelect = (design: Design) => {
    // Detectar el estilo de producto basado en el diseño
    let productStyle = 'cards-square'
    if (design.id === 'restaurant-shop') {
      productStyle = 'menu-vertical'
    } else if (design.id === 'moda-shop') {
      productStyle = 'list-horizontal'
    }
    
    setLayoutConfig(prev => ({ 
      ...prev, 
      design: design.id,
      productStyle: productStyle as 'cards-square' | 'list-horizontal' | 'menu-vertical'
    }))
  }

  const handleLayoutChange = (layout: 'mobile-first' | 'web-first') => {
    setLayoutConfig(prev => ({ ...prev, layout }))
  }

  const handleProductStyleChange = (style: 'cards-square' | 'list-horizontal' | 'menu-vertical') => {
    setLayoutConfig(prev => ({ ...prev, productStyle: style }))
  }

  const handleSidebarToggle = () => {
    setLayoutConfig(prev => ({ ...prev, sidebar: !prev.sidebar }))
  }

  // Manejadores de la tienda
  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
  }

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => [...prev, product])
  }

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId))
  }

  const handleCartClick = () => {
    // Implementar lógica del carrito
    console.log('Carrito clickeado')
  }

  // Generar clases CSS dinámicas
  const getLayoutClasses = () => {
    const classes = []
    
    // Layout principal
    if (layoutConfig.layout === 'mobile-first') {
      classes.push('layout-mobile-first')
    } else {
      classes.push('layout-web-first')
    }
    
    // Sidebar
    if (layoutConfig.sidebar) {
      classes.push('layout-with-sidebar')
    }
    
    // Estilo de productos
    classes.push(`product-style-${layoutConfig.productStyle}`)
    
    // Diseño específico
    classes.push(`design-${layoutConfig.design}`)
    
    return classes.join(' ')
  }

  // Renderizar producto
  const renderProduct = (product: Product) => {
    if (layoutConfig.productStyle === 'cards-square') {
      return (
        <Card key={product.id} className="product-card">
          <CardContent className="product-content">
            <img 
              src={product.image || '/placeholder.jpg'} 
              alt={product.name}
              className="product-image"
            />
            <div className="flex-1">
              <h3 className="product-title">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="product-price">${product.price}</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
              <div className="product-actions">
                <Button 
                  size="sm" 
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock}
                >
                  {designConfig.addToCartText}
                </Button>
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    } else if (layoutConfig.productStyle === 'menu-vertical') {
      return (
        <Card key={product.id} className="product-card menu-vertical-card">
          <CardContent className="product-content p-4">
            <div className="flex items-center justify-between w-full">
              {/* Información del producto */}
              <div className="flex-1">
                <h3 className="product-title text-lg font-semibold mb-1">{product.name}</h3>
                {product.description && (
                  <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                )}
                <div className="flex items-center gap-4">
                  <span className="product-price text-xl font-bold text-primary">${product.price}</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Botones de acción */}
              <div className="flex items-center gap-2 ml-4">
                <Button 
                  size="sm" 
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {designConfig.addToCartText}
                </Button>
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    } else {
      return (
        <Card key={product.id} className="product-card">
          <CardContent className="product-content">
            <img 
              src={product.image || '/placeholder.jpg'} 
              alt={product.name}
              className="product-image"
            />
            <div className="flex-1">
              <h3 className="product-title">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="product-price">${product.price}</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
              <div className="product-actions">
                <Button 
                  size="sm" 
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock}
                >
                  {designConfig.addToCartText}
                </Button>
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div 
      className={`shop-container ${getLayoutClasses()}`}
      data-product-style={layoutConfig.productStyle}
    >
      {/* Navbar Universal */}
      <UniversalNavbar 
        showDesignPicker={false}
        showScheduleButton={false}
      />
      
      {/* Barra de herramientas de la tienda */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-900">{designConfig.storeName}</h1>
              <span className="text-sm text-gray-600">{designConfig.storeTagline}</span>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Selector de Diseño */}
              <ShopDesignSelector 
                onDesignSelect={handleDesignSelect}
                onLayoutChange={handleLayoutChange}
                onProductStyleChange={handleProductStyleChange}
                onSidebarChange={handleSidebarToggle}
              />
              
              {/* Carrito */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleCartClick}
                className="relative"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Carrito
                {cartItems.length > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {cartItems.length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
          
          {/* Buscador */}
          <div className="mt-3">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder={designConfig.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="shop-container">
        {/* Sidebar */}
        {layoutConfig.sidebar && (
          <ShopSidebar
            categories={designConfig.categories}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onCategorySelect={handleCategorySelect}
            onPriceRangeChange={(min, max) => console.log('Price range:', min, max)}
            onRatingFilter={(rating) => console.log('Rating filter:', rating)}
          />
        )}

                 {/* Contenido Principal */}
         <div className="main-content">
           {/* Barra de herramientas */}
           <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm">
             <div className="flex items-center gap-4">
               <Badge variant="secondary">
                 {filteredProducts.length} productos
               </Badge>
             </div>
             
             <div className="flex items-center gap-2">
               {layoutConfig.sidebar && (
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={() => setSidebarOpen(true)}
                   className="lg:hidden"
                 >
                   <Filter className="h-4 w-4 mr-2" />
                   Filtros
                 </Button>
               )}
             </div>
           </div>

          {/* Grid de Productos */}
          <div className="products-grid">
            {filteredProducts.map(renderProduct)}
          </div>

          {/* Mensaje si no hay productos */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-500">
                Intenta ajustar los filtros o la búsqueda
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <ShopFooter
        storeName={designConfig.storeName}
        storeTagline={designConfig.storeTagline}
      />

      {/* Componentes de administración */}
      <AdminToggle />
      <ShopDesignSelector 
        selectedDesign={layoutConfig.design}
        onDesignSelect={handleDesignSelect}
        onLayoutChange={handleLayoutChange}
        onProductStyleChange={handleProductStyleChange}
        onSidebarChange={handleSidebarToggle}
      />
    </div>
  )
}

// Productos de ejemplo
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Producto Ejemplo 1',
    description: 'Descripción del producto ejemplo 1',
    price: 99.99,
    image: '/placeholder.jpg',
    category: 'Electrónicos',
    rating: 4,
    inStock: true
  },
  {
    id: '2',
    name: 'Producto Ejemplo 2',
    description: 'Descripción del producto ejemplo 2',
    price: 149.99,
    image: '/placeholder.jpg',
    category: 'Ropa',
    rating: 5,
    inStock: true
  },
  {
    id: '3',
    name: 'Producto Ejemplo 3',
    description: 'Descripción del producto ejemplo 3',
    price: 79.99,
    image: '/placeholder.jpg',
    category: 'Hogar',
    rating: 3,
    inStock: false
  },
  {
    id: '4',
    name: 'Producto Ejemplo 4',
    description: 'Descripción del producto ejemplo 4',
    price: 199.99,
    image: '/placeholder.jpg',
    category: 'Electrónicos',
    rating: 4,
    inStock: true
  }
]
