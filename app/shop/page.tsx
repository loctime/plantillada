"use client"

import { useState, useEffect } from 'react'
import { Config } from '@/lib/config-loader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { 
  Search, 
  ShoppingCart, 
  Star, 
  Filter, 
  ChevronDown,
  Heart,
  Eye,
  ShoppingBag,
  X,
  Minus,
  Plus,
  Edit3,
  Plus as PlusIcon,
  Trash2
} from 'lucide-react'
import { useAdmin } from '@/lib/admin-context'
import { AdminToggle } from '@/components/admin-toggle'
import { ShopDesignSelector } from '@/components/shop-design-selector'
import { Design } from '@/lib/designs'

interface Product {
  id: string
  name: string
  brand: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  category: string
  inStock: boolean
  description: string
  features: string[]
}

// Productos de ejemplo basados en la imagen
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'iPad 11th (A16)',
    brand: 'iPad',
    price: 899.00,
    originalPrice: 999.00,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
    rating: 4.5,
    reviews: 128,
    category: 'tablets',
    inStock: true,
    description: 'iPad de 11 pulgadas con chip A16, perfecto para productividad y creatividad.',
    features: ['Chip A16 Bionic', '11 pulgadas', '128GB', 'WiFi + Cellular']
  },
  {
    id: '2',
    name: 'iPad Mini (A17)',
    brand: 'iPad',
    price: 599.00,
    originalPrice: 699.00,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
    rating: 4.3,
    reviews: 89,
    category: 'tablets',
    inStock: true,
    description: 'iPad Mini compacto con chip A17, ideal para uso portátil.',
    features: ['Chip A17 Pro', '8.3 pulgadas', '64GB', 'WiFi']
  },
  {
    id: '3',
    name: 'iPad Air M2',
    brand: 'iPad',
    price: 799.00,
    originalPrice: 899.00,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
    rating: 4.7,
    reviews: 156,
    category: 'tablets',
    inStock: true,
    description: 'iPad Air con chip M2, potencia profesional en formato ligero.',
    features: ['Chip M2', '10.9 pulgadas', '256GB', 'WiFi + Cellular']
  },
  {
    id: '4',
    name: 'NUBIA FLIP',
    brand: 'Nubia',
    price: 757.00,
    originalPrice: 899.00,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    rating: 4.2,
    reviews: 67,
    category: 'smartphones',
    inStock: true,
    description: 'Smartphone plegable con diseño innovador y tecnología avanzada.',
    features: ['Pantalla plegable', '6.9 pulgadas', '256GB', '5G']
  },
  {
    id: '5',
    name: 'ROG PHONE 8',
    brand: 'ASUS',
    price: 1299.00,
    originalPrice: 1499.00,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    rating: 4.6,
    reviews: 234,
    category: 'gaming',
    inStock: true,
    description: 'Smartphone gaming con refrigeración líquida y rendimiento extremo.',
    features: ['Snapdragon 8 Gen 3', '16GB RAM', '512GB', 'Gaming']
  },
  {
    id: '6',
    name: 'Nubia Red Magic 6',
    brand: 'Nubia',
    price: 757.00,
    originalPrice: 899.00,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    rating: 4.4,
    reviews: 189,
    category: 'gaming',
    inStock: true,
    description: 'Smartphone gaming con ventilador integrado y pantalla de alta frecuencia.',
    features: ['Snapdragon 888', '12GB RAM', '256GB', '165Hz']
  }
]

interface CartItem extends Product {
  quantity: number
}

interface ShopConfig {
  storeName: string
  storeTagline: string
  navigation: string[]
  categories: string[]
  searchPlaceholder: string
  filterButtonText: string
  bestSellersTitle: string
  breadcrumbText: string
  resultsText: string
  sortOptions: { value: string; label: string }[]
  addToCartText: string
  outOfStockText: string
  cartTitle: string
  emptyCartText: string
  checkoutText: string
  totalText: string
}

const defaultShopConfig: ShopConfig = {
  storeName: "TECH STORE",
  storeTagline: "Tu tienda de tecnología de confianza",
  navigation: ["TIENDA", "CELULARES", "APPLE", "DRONES DJI", "GAMING", "WAREHOUSE", "LISTA DE PRECIOS"],
  categories: ["Todos", "Tablets", "Smartphones", "Gaming"],
  searchPlaceholder: "Buscar productos...",
  filterButtonText: "FILTRAR",
  bestSellersTitle: "Our Best Sellers",
  breadcrumbText: "Inicio / STORE DE LA TIENDA",
  resultsText: "Mostrando 1-{count} de {total} resultados",
  sortOptions: [
    { value: "latest", label: "Ordenar por los últimos" },
    { value: "price-low", label: "Precio: Menor a Mayor" },
    { value: "price-high", label: "Precio: Mayor a Menor" },
    { value: "rating", label: "Mejor Valorados" }
  ],
  addToCartText: "Agregar al Carrito",
  outOfStockText: "Sin Stock",
  cartTitle: "Carrito de Compras",
  emptyCartText: "Tu carrito está vacío",
  checkoutText: "Proceder al Pago",
  totalText: "Total:"
}

export default function ShopPage() {
  const { isAdminMode } = useAdmin()
  const [config, setConfig] = useState<Config | null>(null)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>(sampleProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(sampleProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState([0, 1500])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [sortBy, setSortBy] = useState('latest')
  const [shopConfig, setShopConfig] = useState<ShopConfig>(defaultShopConfig)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState('')
  const [selectedDesign, setSelectedDesign] = useState<string>('tech-shop')
  
  // Estados para gestión de productos
  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productForm, setProductForm] = useState({
    name: '',
    brand: '',
    price: 0,
    originalPrice: 0,
    image: '',
    rating: 4.0,
    reviews: 0,
    category: 'tablets',
    inStock: true,
    description: '',
    features: ['']
  })
  
  // Estados para edición de imagen
  const [showImageModal, setShowImageModal] = useState(false)
  const [editingImageProduct, setEditingImageProduct] = useState<Product | null>(null)
  const [newImageUrl, setNewImageUrl] = useState('')

  // Función helper para guardar configuración preservando el resto
  const saveConfigPreservingRest = async (updates: any) => {
    try {
      // Primero cargar la configuración completa actual
      const currentConfigResponse = await fetch('/api/config')
      let currentConfig = {}
      
      if (currentConfigResponse.ok) {
        currentConfig = await currentConfigResponse.json()
      }
      
      // Actualizar solo las secciones especificadas, preservando el resto
      const updatedConfig = {
        ...currentConfig,
        ...updates,
        // Marcar que esta configuración es para el template shop
        currentTemplate: 'shop'
      }
      
      await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedConfig),
      })
      
      console.log('✅ Configuración guardada preservando el resto')
      return true
    } catch (error) {
      console.error('❌ Error guardando configuración:', error)
      return false
    }
  }

  useEffect(() => {
    const loadConfig = async () => {
      try {
        // Cargar configuración personalizada (sin template) para preservar cambios
        const response = await fetch('/api/config')
        if (response.ok) {
          const shopConfig = await response.json()
          setConfig(shopConfig)
          // Cargar configuración de la tienda si existe
          if (shopConfig.shopConfig) {
            setShopConfig({ ...defaultShopConfig, ...shopConfig.shopConfig })
          }
          // Cargar productos si existen
          if (shopConfig.products && Array.isArray(shopConfig.products)) {
            setProducts(shopConfig.products)
            setFilteredProducts(shopConfig.products)
          }
          
          // Cargar diseño seleccionado si existe
          if (shopConfig.selectedDesign) {
            setSelectedDesign(shopConfig.selectedDesign)
          }
        }
      } catch (error) {
        console.error('Error loading shop config:', error)
      } finally {
        setLoading(false)
      }
    }

    loadConfig()
  }, [])

  // Filtrar productos
  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
      
      return matchesSearch && matchesPrice && matchesCategory
    })

    // Ordenar productos
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'latest':
      default:
        // Mantener orden original
        break
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, priceRange, selectedCategory, sortBy])

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  const startEditing = (field: string, value: string) => {
    if (!isAdminMode) return
    setEditingField(field)
    setEditingValue(value)
  }

  const saveEdit = async () => {
    if (!editingField) return
    
    const newShopConfig = { ...shopConfig }
    const keys = editingField.split('.')
    let current = newShopConfig as any
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    
    current[keys[keys.length - 1]] = editingValue
    setShopConfig(newShopConfig)
    setEditingField(null)
    setEditingValue('')

    // Guardar en la base de datos preservando toda la configuración
    await saveConfigPreservingRest({ shopConfig: newShopConfig })
  }

  const cancelEdit = () => {
    setEditingField(null)
    setEditingValue('')
  }

  const renderEditableText = (field: string, value: string, className: string = "") => {
    if (isAdminMode && editingField === field) {
      return (
        <div className="flex items-center gap-2">
          <Input
            value={editingValue}
            onChange={(e) => setEditingValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit()
              if (e.key === 'Escape') cancelEdit()
            }}
            className={className}
            autoFocus
          />
          <Button size="sm" onClick={saveEdit}>✓</Button>
          <Button size="sm" variant="outline" onClick={cancelEdit}>✕</Button>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2 group">
        <span className={className}>{value}</span>
        {isAdminMode && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => startEditing(field, value)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit3 className="h-3 w-3" />
          </Button>
        )}
      </div>
    )
  }

  // Funciones para gestión de productos
  const openProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setProductForm({
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice || 0,
        image: product.image,
        rating: product.rating,
        reviews: product.reviews,
        category: product.category,
        inStock: product.inStock,
        description: product.description,
        features: [...product.features, '']
      })
    } else {
      setEditingProduct(null)
      setProductForm({
        name: '',
        brand: '',
        price: 0,
        originalPrice: 0,
        image: '',
        rating: 4.0,
        reviews: 0,
        category: 'tablets',
        inStock: true,
        description: '',
        features: ['']
      })
    }
    setShowProductModal(true)
  }

  const closeProductModal = () => {
    setShowProductModal(false)
    setEditingProduct(null)
    setProductForm({
      name: '',
      brand: '',
      price: 0,
      originalPrice: 0,
      image: '',
      rating: 4.0,
      reviews: 0,
      category: 'tablets',
      inStock: true,
      description: '',
      features: ['']
    })
  }

  const saveProduct = async () => {
    const newProduct: Product = {
      id: editingProduct?.id || Date.now().toString(),
      name: productForm.name,
      brand: productForm.brand,
      price: productForm.price,
      originalPrice: productForm.originalPrice > 0 ? productForm.originalPrice : undefined,
      image: productForm.image,
      rating: productForm.rating,
      reviews: productForm.reviews,
      category: productForm.category,
      inStock: productForm.inStock,
      description: productForm.description,
      features: productForm.features.filter(f => f.trim() !== '')
    }

    let updatedProducts: Product[]
    if (editingProduct) {
      // Editar producto existente
      updatedProducts = products.map(p => p.id === editingProduct.id ? newProduct : p)
    } else {
      // Agregar nuevo producto
      updatedProducts = [...products, newProduct]
    }

    setProducts(updatedProducts)

    // Guardar en Firestore preservando toda la configuración
    await saveConfigPreservingRest({ products: updatedProducts })

    closeProductModal()
  }

  const deleteProduct = async (productId: string) => {
    const updatedProducts = products.filter(p => p.id !== productId)
    setProducts(updatedProducts)
    
    // Guardar en Firestore preservando toda la configuración
    await saveConfigPreservingRest({ products: updatedProducts })
  }

  const updateProductForm = (field: string, value: any) => {
    setProductForm(prev => ({ ...prev, [field]: value }))
  }

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...productForm.features]
    newFeatures[index] = value
    if (index === newFeatures.length - 1 && value.trim() !== '') {
      newFeatures.push('')
    }
    setProductForm(prev => ({ ...prev, features: newFeatures }))
  }

  const removeFeature = (index: number) => {
    const newFeatures = productForm.features.filter((_, i) => i !== index)
    setProductForm(prev => ({ ...prev, features: newFeatures }))
  }

  // Funciones para edición de imagen
  const openImageModal = (product: Product) => {
    setEditingImageProduct(product)
    setNewImageUrl(product.image)
    setShowImageModal(true)
  }

  const closeImageModal = () => {
    setShowImageModal(false)
    setEditingImageProduct(null)
    setNewImageUrl('')
  }

  const saveImageUrl = async () => {
    if (!editingImageProduct || !newImageUrl.trim()) return
    
    const updatedProduct = {
      ...editingImageProduct,
      image: newImageUrl.trim()
    }
    
    const updatedProducts = products.map(p => 
      p.id === editingImageProduct.id ? updatedProduct : p
    )
    
    setProducts(updatedProducts)
    
    // Guardar en Firestore preservando toda la configuración
    await saveConfigPreservingRest({ products: updatedProducts })
    
    closeImageModal()
  }

  const handleDesignSelect = async (design: Design) => {
    setSelectedDesign(design.id)
    
    try {
      // Cargar la configuración completa del diseño desde el archivo JSON
      const response = await fetch(`/${design.id}-design.json`)
      if (response.ok) {
        const designConfig = await response.json()
        
        // Aplicar la configuración del diseño
        if (designConfig.config?.shopConfig) {
          setShopConfig(designConfig.config.shopConfig)
        }
        
        if (designConfig.config?.products) {
          setProducts(designConfig.config.products)
          setFilteredProducts(designConfig.config.products)
        }
        
        // Aplicar los colores del diseño
        const root = document.documentElement
        root.style.setProperty('--primary', design.colorScheme.primary)
        root.style.setProperty('--secondary', design.colorScheme.secondary)
        root.style.setProperty('--accent', design.colorScheme.accent)
        
        // Guardar la configuración completa del diseño
        await saveConfigPreservingRest({ 
          selectedDesign: design.id,
          shopDesign: design,
          shopConfig: designConfig.config?.shopConfig,
          products: designConfig.config?.products
        })
        
        console.log(`✅ Diseño ${design.name} aplicado exitosamente`)
      }
    } catch (error) {
      console.error('Error cargando configuración del diseño:', error)
      
      // Fallback: aplicar solo los colores
      const root = document.documentElement
      root.style.setProperty('--primary', design.colorScheme.primary)
      root.style.setProperty('--secondary', design.colorScheme.secondary)
      root.style.setProperty('--accent', design.colorScheme.accent)
      
      // Guardar solo la información básica del diseño
      await saveConfigPreservingRest({ 
        selectedDesign: design.id,
        shopDesign: design 
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Cargando tienda...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="text-blue-600 font-bold text-xl group">
                {renderEditableText('storeName', shopConfig.storeName, "text-blue-600 font-bold text-xl")}
                {isAdminMode && (
                  <div className="text-xs text-gray-400 mt-1 group">
                    {renderEditableText('storeTagline', shopConfig.storeTagline, "text-xs text-gray-400")}
                  </div>
                )}
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              {shopConfig.navigation.map((item, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="hover:text-blue-400 transition-colors group"
                >
                  {isAdminMode ? (
                    renderEditableText(`navigation.${index}`, item, "hover:text-blue-400 transition-colors")
                  ) : (
                    item
                  )}
                </a>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <ShopDesignSelector
                selectedDesign={selectedDesign}
                onDesignSelect={handleDesignSelect}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCart(!showCart)}
                className="relative text-white hover:text-blue-400"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-blue-600 text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
              {/* Búsqueda */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 group">
                  {renderEditableText('searchPlaceholder', shopConfig.searchPlaceholder, "text-sm font-medium text-gray-700")}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder={shopConfig.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filtro de precio */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Filtrar por precio</h3>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={1500}
                  min={0}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Precio: ${priceRange[0]} —</span>
                  <span>${priceRange[1]}</span>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Filter className="h-4 w-4 mr-2" />
                  {shopConfig.filterButtonText}
                </Button>
              </div>

              {/* Categorías */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Categorías</h3>
                {['all', 'tablets', 'smartphones', 'gaming'].map((category, index) => (
                  isAdminMode ? (
                    <div
                      key={category}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors group ${
                        selectedCategory === category
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {renderEditableText(`categories.${index}`, shopConfig.categories[index], "block w-full text-left")}
                    </div>
                  ) : (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCategory === category
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {index === 0 ? shopConfig.categories[0] : shopConfig.categories[index]}
                    </button>
                  )
                ))}
              </div>

              {/* Mejores vendidos */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 group">
                  {renderEditableText('bestSellersTitle', shopConfig.bestSellersTitle, "font-medium text-gray-900")}
                </h3>
                {sampleProducts.slice(0, 3).map(product => (
                  <div key={product.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                      <div className="flex items-center space-x-1">
                        {renderStars(product.rating)}
                      </div>
                      <p className="text-sm font-bold text-blue-600">${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="flex-1">
            {/* Breadcrumbs y controles */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-gray-600 group">
                {renderEditableText('breadcrumbText', shopConfig.breadcrumbText, "text-sm text-gray-600")}
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {shopConfig.resultsText
                    .replace('{count}', filteredProducts.length.toString())
                    .replace('{total}', products.length.toString())}
                </span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {shopConfig.sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {isAdminMode && (
                  <Button
                    onClick={() => openProductModal()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Agregar Producto
                  </Button>
                )}
              </div>
            </div>

                         {/* Grid de productos */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {filteredProducts.map(product => (
                 <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                   <CardContent className="p-4">
                                             <div className="relative group">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                          />
                          <div className="absolute top-2 right-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                              <Heart className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                          {product.originalPrice && (
                            <Badge className="absolute top-2 left-2 bg-blue-600">
                              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                            </Badge>
                          )}
                          {/* Botón para editar imagen (solo en modo admin) */}
                          {isAdminMode && (
                            <Button
                              size="sm"
                              variant="secondary"
                              className="absolute bottom-2 right-2 h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => openImageModal(product)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                     <div className="space-y-2">
                       <div className="flex items-center justify-between">
                         <span className="text-xs text-gray-500 uppercase">{product.brand}</span>
                         <div className="flex items-center space-x-1">
                           {renderStars(product.rating)}
                           <span className="text-xs text-gray-500">({product.reviews})</span>
                         </div>
                       </div>

                       <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>

                       <div className="flex items-center space-x-2">
                         <span className="text-lg font-bold text-blue-600">${product.price.toFixed(2)}</span>
                         {product.originalPrice && (
                           <span className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                         )}
                       </div>

                                               <Button
                          onClick={() => addToCart(product)}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          disabled={!product.inStock}
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          {product.inStock ? shopConfig.addToCartText : shopConfig.outOfStockText}
                        </Button>
                        
                        {/* Botones de administración */}
                        {isAdminMode && (
                          <div className="flex gap-2 mt-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                              onClick={() => openProductModal(product)}
                            >
                              <Edit3 className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                              onClick={() => deleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Eliminar
                            </Button>
                          </div>
                        )}
                     </div>
                   </CardContent>
                 </Card>
               ))}
               
               {/* Botón para agregar producto (solo en modo admin) */}
               {isAdminMode && (
                 <Card className="group hover:shadow-lg transition-shadow border-2 border-dashed border-gray-300 hover:border-green-500">
                   <CardContent className="p-4 flex flex-col items-center justify-center h-full min-h-[300px]">
                     <Button
                       onClick={() => openProductModal()}
                       className="w-full h-full bg-transparent hover:bg-green-50 border-0 p-0 flex flex-col items-center justify-center space-y-4"
                     >
                       <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                         <PlusIcon className="h-8 w-8 text-green-600" />
                       </div>
                       <div className="text-center">
                         <p className="text-lg font-medium text-gray-700 group-hover:text-green-700">Agregar Producto</p>
                         <p className="text-sm text-gray-500">Haz clic para crear un nuevo producto</p>
                       </div>
                     </Button>
                   </CardContent>
                 </Card>
               )}
             </div>
          </div>
        </div>
      </div>

      {/* Modal de Producto */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">
                {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
              </h2>
              <Button variant="ghost" size="sm" onClick={closeProductModal}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <Input
                    value={productForm.name}
                    onChange={(e) => updateProductForm('name', e.target.value)}
                    placeholder="Nombre del producto"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                  <Input
                    value={productForm.brand}
                    onChange={(e) => updateProductForm('brand', e.target.value)}
                    placeholder="Marca del producto"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                  <Input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => updateProductForm('price', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio Original</label>
                  <Input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => updateProductForm('originalPrice', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => updateProductForm('category', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="tablets">{shopConfig.categories[1]}</option>
                    <option value="smartphones">{shopConfig.categories[2]}</option>
                    <option value="gaming">{shopConfig.categories[3]}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de la imagen</label>
                <Input
                  value={productForm.image}
                  onChange={(e) => updateProductForm('image', e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={productForm.rating}
                    onChange={(e) => updateProductForm('rating', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reviews</label>
                  <Input
                    type="number"
                    value={productForm.reviews}
                    onChange={(e) => updateProductForm('reviews', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={productForm.inStock}
                      onChange={(e) => updateProductForm('inStock', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">En Stock</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => updateProductForm('description', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 h-20 resize-none"
                  placeholder="Descripción del producto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Características</label>
                <div className="space-y-2">
                  {productForm.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder={`Característica ${index + 1}`}
                      />
                      {productForm.features.length > 1 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFeature(index)}
                          className="text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 p-6 border-t">
              <Button variant="outline" onClick={closeProductModal}>
                Cancelar
              </Button>
              <Button onClick={saveProduct} className="bg-blue-600 hover:bg-blue-700">
                {editingProduct ? 'Guardar Cambios' : 'Agregar Producto'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Carrito lateral */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold group">
                {renderEditableText('cartTitle', shopConfig.cartTitle, "text-xl font-bold")}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCart(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 group">
                    {renderEditableText('emptyCartText', shopConfig.emptyCartText, "text-gray-500")}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-sm text-gray-500">{item.brand}</p>
                        <p className="font-bold text-blue-600">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold group">
                    {renderEditableText('totalText', shopConfig.totalText, "text-lg font-bold")}
                  </span>
                  <span className="text-xl font-bold text-blue-600">${cartTotal.toFixed(2)}</span>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 group">
                  {renderEditableText('checkoutText', shopConfig.checkoutText, "w-full bg-blue-600 hover:bg-blue-700")}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* WhatsApp flotante */}
      <div className="fixed bottom-6 left-6 z-40">
        <Button
          size="lg"
          className="bg-green-500 hover:bg-green-600 rounded-full h-14 w-14 p-0"
        >
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
        </Button>
      </div>

             {/* Modal de Edición de Imagen */}
       {showImageModal && editingImageProduct && (
         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
             <div className="flex justify-between items-center p-6 border-b">
               <h2 className="text-xl font-bold">Editar Imagen del Producto</h2>
               <Button variant="ghost" size="sm" onClick={closeImageModal}>
                 <X className="h-5 w-5" />
               </Button>
             </div>

             <div className="p-6 space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Imagen Actual
                 </label>
                 <div className="border rounded-lg p-2 bg-gray-50">
                   <img
                     src={editingImageProduct.image}
                     alt={editingImageProduct.name}
                     className="w-full h-32 object-cover rounded"
                     onError={(e) => {
                       e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Imagen+no+disponible'
                     }}
                   />
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   Nueva URL de la imagen
                 </label>
                 <Input
                   value={newImageUrl}
                   onChange={(e) => setNewImageUrl(e.target.value)}
                   placeholder="https://ejemplo.com/nueva-imagen.jpg"
                   className="w-full"
                 />
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Vista Previa
                 </label>
                 <div className="border rounded-lg p-2 bg-gray-50">
                   <img
                     src={newImageUrl || editingImageProduct.image}
                     alt="Vista previa"
                     className="w-full h-32 object-cover rounded"
                     onError={(e) => {
                       e.currentTarget.src = 'https://via.placeholder.com/300x200?text=URL+inválida'
                     }}
                   />
                 </div>
               </div>
             </div>

             <div className="flex justify-end gap-2 p-6 border-t">
               <Button variant="outline" onClick={closeImageModal}>
                 Cancelar
               </Button>
               <Button onClick={saveImageUrl} className="bg-blue-600 hover:bg-blue-700">
                 Guardar Imagen
               </Button>
             </div>
           </div>
         </div>
       )}

       {/* Botón de modo admin */}
       <AdminToggle />
     </div>
   )
 }
