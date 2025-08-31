import { useState, useEffect, useMemo } from 'react'
import { Product, CartItem } from '@/components/shop/types'
import { sampleProducts } from '@/components/shop/sample-products'
import { useToast } from '@/hooks/use-toast'
import { useAdmin } from '@/lib/admin-context'
import { generateUniqueId } from '@/lib/utils'

interface Promotion {
  id: string
  name: string
  productType: 'choice' | 'fixed'
  selectedProducts: string[]
  beverageType: 'choice' | 'fixed'
  selectedBeverages: string[]
  description: string
  price: number
  originalPrice: number
  image: string
  isActive: boolean
}

interface Category {
  id: string
  name: string
  description: string
  isExpanded: boolean
  products: Product[]
  isActive: boolean
}

export function useShop() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState([0, 1500])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedRating, setSelectedRating] = useState(0)
  const [sortBy, setSortBy] = useState('name-asc')
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false)
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null)
  const [showPromotionSelector, setShowPromotionSelector] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const { toast } = useToast()
  const { updateConfig } = useAdmin()

  // Cargar productos y categorías desde localStorage al inicializar
  useEffect(() => {
    // Evitar reinicialización si ya se ha cargado
    if (isInitialized) {
      console.log('🔄 useShop: Ya inicializado, saltando carga...')
      return
    }

    console.log('🔄 useShop: Iniciando carga de datos desde localStorage...')
    try {
      // Cargar productos guardados
      const savedProducts = localStorage.getItem('shop-products')
      console.log('🔍 useShop: Buscando productos en localStorage...')
      
      if (savedProducts && savedProducts !== '[]') {
        const parsedProducts = JSON.parse(savedProducts)
        if (parsedProducts.length > 0) {
          setProducts(parsedProducts)
          console.log('📦 useShop: Productos cargados desde localStorage:', parsedProducts.length)
        } else {
          // Array vacío, cargar productos de muestra
          console.log('📦 useShop: Array vacío encontrado, cargando productos de muestra...')
          setProducts(sampleProducts)
          localStorage.setItem('shop-products', JSON.stringify(sampleProducts))
          console.log('📦 useShop: Productos de muestra cargados y guardados:', sampleProducts.length)
        }
      } else {
        // Si no hay productos guardados, usar productos de muestra
        console.log('📦 useShop: No hay productos guardados, cargando productos de muestra...')
        setProducts(sampleProducts)
        localStorage.setItem('shop-products', JSON.stringify(sampleProducts))
        console.log('📦 useShop: Productos de muestra cargados y guardados:', sampleProducts.length)
      }

      // Cargar categorías guardadas
      const savedCategories = localStorage.getItem('shop-categories')
      console.log('🔍 useShop: Buscando categorías en localStorage...')
      
      if (savedCategories) {
        const parsedCategories = JSON.parse(savedCategories)
        setCategories(parsedCategories)
        console.log('📁 useShop: Categorías cargadas desde localStorage:', parsedCategories.length)
      } else {
        // Categoría por defecto si no hay ninguna guardada
        console.log('📁 useShop: No hay categorías guardadas, creando categoría por defecto...')
        const defaultCategories: Category[] = [
          {
            id: generateUniqueId('category'),
            name: 'General',
            description: 'Categoría general de productos',
            isExpanded: true,
            products: [],
            isActive: true
          }
        ]
        setCategories(defaultCategories)
        localStorage.setItem('shop-categories', JSON.stringify(defaultCategories))
        console.log('📁 useShop: Categoría por defecto creada y guardada')
      }

      // Marcar como inicializado
      setIsInitialized(true)
      console.log('✅ useShop: Inicialización completada')
      
      // Limpiar productos duplicados después de la inicialización
      setTimeout(() => {
        cleanDuplicateProducts()
      }, 100)
    } catch (error) {
      console.error('❌ useShop: Error cargando datos desde localStorage:', error)
      // Fallback a datos por defecto
      console.log('🔄 useShop: Usando datos por defecto como fallback...')
      setProducts(sampleProducts)
      const defaultCategories: Category[] = [
        {
          id: generateUniqueId('category'),
          name: 'General',
          description: 'Categoría general de productos',
          isExpanded: true,
          products: [],
          isActive: true
        }
      ]
      setCategories(defaultCategories)
      setIsInitialized(true)
      
      // Limpiar productos duplicados después del fallback
      setTimeout(() => {
        cleanDuplicateProducts()
      }, 100)
    }
  }, [isInitialized])

  // Función para persistir categorías
  const persistCategories = async (updatedCategories: Category[]) => {
    console.log('🔄 persistCategories called with:', updatedCategories.length, 'categories')
    try {
      // Guardar en localStorage
      localStorage.setItem('shop-categories', JSON.stringify(updatedCategories))
      
      // Por ahora, solo guardar en localStorage para evitar bucles infinitos
      // TODO: Implementar guardado en configuración global de forma segura
      console.log('✅ Categorías guardadas en localStorage')
    } catch (error) {
      console.error('❌ Error persistiendo categorías:', error)
    }
  }

  // Función para persistir productos
  const persistProducts = async (updatedProducts: Product[]) => {
    try {
      // Guardar en localStorage
      localStorage.setItem('shop-products', JSON.stringify(updatedProducts))
      console.log('✅ Productos guardados en localStorage:', updatedProducts.length)
    } catch (error) {
      console.error('Error persistiendo productos:', error)
    }
  }

  // Función para forzar recarga de datos
  const forceReloadData = () => {
    console.log('🔄 useShop: Forzando recarga de datos...')
    setIsInitialized(false)
  }

  // Función para limpiar productos duplicados
  const cleanDuplicateProducts = () => {
    console.log('🧹 useShop: Limpiando productos duplicados...')
    setProducts(prev => {
      const seen = new Set<string>()
      const cleaned = prev.filter(product => {
        if (seen.has(product.id)) {
          console.log('🗑️ useShop: Eliminando producto duplicado:', product.id, product.name)
          return false
        }
        seen.add(product.id)
        return true
      })
      
      if (cleaned.length !== prev.length) {
        console.log(`🧹 useShop: Limpieza completada. ${prev.length - cleaned.length} productos duplicados eliminados`)
        // Persistir productos limpios
        setTimeout(async () => {
          try {
            await persistProducts(cleaned)
          } catch (error) {
            console.error('Error persistiendo productos limpios:', error)
          }
        }, 0)
      }
      
      return cleaned
    })
  }

  // Obtener categorías únicas de productos
  const productCategories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))]
    return cats.sort()
  }, [products])

  // Debug: Log cuando cambia el estado de productos
  useEffect(() => {
    console.log('📊 useShop: Estado de productos actualizado:', products.length, 'productos')
  }, [products])

  // Debug: Log cuando cambia el estado de categorías
  useEffect(() => {
    console.log('📁 useShop: Estado de categorías actualizado:', categories.length, 'categorías')
    categories.forEach((cat, index) => {
      console.log(`   ${index + 1}. "${cat.name}" (ID: ${cat.id})`)
    })
  }, [categories])

  // Filtrar y ordenar productos
  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
      
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      
      const matchesRating = selectedRating === 0 || product.rating >= selectedRating
      
      return matchesSearch && matchesCategory && matchesPrice && matchesRating
    })

    // Ordenar productos
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'rating-desc':
          return b.rating - a.rating
        case 'reviews-desc':
          return b.reviews - a.reviews
        default:
          return 0
      }
    })

    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedCategory, priceRange[0], priceRange[1], selectedRating, sortBy])

  // Funciones del carrito
  const addToCart = (product: Product, selectedOptions?: any, selectedAddons?: any[]) => {
    // Crear un ID único para el item del carrito que incluya las opciones
    let cartItemId = product.id
    let itemName = product.name
    let itemPrice = product.price
    
    // Procesar opciones seleccionadas
    if (selectedOptions && Object.keys(selectedOptions).length > 0) {
      const optionsText = Object.entries(selectedOptions)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ')
      itemName += ` (${optionsText})`
      cartItemId += `-${JSON.stringify(selectedOptions)}`
    }
    
    // Procesar adicionales seleccionados
    if (selectedAddons && selectedAddons.length > 0) {
      const addonsText = selectedAddons.map(addon => addon.name).join(', ')
      itemName += ` [+${addonsText}]`
      itemPrice += selectedAddons.reduce((total, addon) => total + addon.price, 0)
      cartItemId += `-addons-${selectedAddons.map(a => a.name).join(',')}`
    }
    
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === cartItemId)
      if (existingItem) {
        return prev.map(item =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [...prev, {
          id: cartItemId,
          name: itemName,
          price: itemPrice,
          quantity: 1,
          image: product.image,
          selectedOptions,
          selectedAddons
        }]
      }
    })
    
    toast({
      title: 'Producto agregado',
      description: `${itemName} se agregó al carrito`
    })
  }

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const clearCart = () => {
    setCartItems([])
    toast({
      title: 'Carrito vaciado',
      description: 'Se han removido todos los productos del carrito'
    })
  }

  // Función para manejar productos cargados masivamente
  const handleBulkProductsUploaded = async (newProducts: any[]) => {
    console.log('🔄 handleBulkProductsUploaded called with:', newProducts.length, 'products')
    console.log('📦 Current products count:', products.length)
    
    // Detectar categorías en los productos cargados
    const productCategories = new Set<string>()
    newProducts.forEach(product => {
      if (product.category && product.category !== 'general') {
        productCategories.add(product.category)
      }
    })
    
    console.log('📁 Categorías detectadas en productos:', Array.from(productCategories))
    console.log('📁 Categorías existentes:', categories.map(c => c.name))
    
    // Verificar si hay categorías nuevas que no existen en el sistema
    const existingCategoryNames = categories.map(cat => cat.name.toLowerCase().trim())
    const categoriesToAdd: Category[] = []
    const categoriesToUpdate: { categoryId: string, products: any[] }[] = []
    
    productCategories.forEach(categoryName => {
      const normalizedName = categoryName.toLowerCase().trim()
      const existingCategory = categories.find(cat => 
        cat.name.toLowerCase().trim() === normalizedName
      )
      
      if (!existingCategory) {
        // Crear nueva categoría
        const productsInCategory = newProducts.filter(p => p.category === categoryName)
        categoriesToAdd.push({
          id: generateUniqueId('category'),
          name: categoryName.charAt(0).toUpperCase() + categoryName.slice(1), // Capitalizar
          description: `Categoría creada automáticamente con ${productsInCategory.length} productos`,
          isExpanded: true,
          products: productsInCategory,
          isActive: true
        })
        console.log('🆕 Nueva categoría a crear:', categoryName)
      } else {
        // Agregar productos a categoría existente
        const productsInCategory = newProducts.filter(p => p.category === categoryName)
        categoriesToUpdate.push({
          categoryId: existingCategory.id,
          products: productsInCategory
        })
        console.log('➕ Agregando productos a categoría existente:', existingCategory.name)
      }
    })
    
    // Agregar las nuevas categorías al sistema
    if (categoriesToAdd.length > 0) {
      const updatedCategories = [...categories, ...categoriesToAdd]
      setCategories(updatedCategories)
      await persistCategories(updatedCategories)
      console.log('📁 Categorías nuevas agregadas y persistidas:', categoriesToAdd.map(c => c.name))
    }
    
    // Actualizar categorías existentes con nuevos productos
    if (categoriesToUpdate.length > 0) {
      const updatedCategories = categories.map(cat => {
        const update = categoriesToUpdate.find(u => u.categoryId === cat.id)
        if (update) {
          return {
            ...cat,
            products: [...cat.products, ...update.products]
          }
        }
        return cat
      })
      setCategories(updatedCategories)
      await persistCategories(updatedCategories)
      console.log('📁 Categorías existentes actualizadas con nuevos productos')
    }
    
    const updatedProducts = [...products, ...newProducts]
    console.log('📦 Updated products count:', updatedProducts.length)
    
    setProducts(updatedProducts)
    setFilteredProducts(updatedProducts)
    
    // Persistir productos de forma asíncrona
    setTimeout(async () => {
      try {
        await persistProducts(updatedProducts)
      } catch (error) {
        console.error('Error persistiendo productos en carga masiva:', error)
      }
    }, 0)
    
    // Mostrar notificación con información sobre categorías
    let categoryMessage = ''
    if (categoriesToAdd.length > 0 && categoriesToUpdate.length > 0) {
      categoryMessage = `, ${categoriesToAdd.length} categoría(s) nueva(s) creada(s) y productos agregados a ${categoriesToUpdate.length} categoría(s) existente(s)`
    } else if (categoriesToAdd.length > 0) {
      categoryMessage = ` y ${categoriesToAdd.length} categoría(s) nueva(s) creada(s)`
    } else if (categoriesToUpdate.length > 0) {
      categoryMessage = ` y productos agregados a ${categoriesToUpdate.length} categoría(s) existente(s)`
    }
    
    toast({
      title: 'Carga masiva completada',
      description: `${newProducts.length} productos agregados exitosamente${categoryMessage}`
    })
  }

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm('')
    setPriceRange([0, 1500])
    setSelectedCategory('all')
    setSelectedRating(0)
    setSortBy('name-asc')
  }

  // Funciones de categorías
  const addCategory = async (category: Category) => {
    const updatedCategories = [...categories, category]
    setCategories(updatedCategories)
    await persistCategories(updatedCategories)
    toast({
      title: 'Categoría creada',
      description: `${category.name} se ha creado exitosamente`
    })
  }

  const updateCategory = async (categoryId: string, updates: Partial<Category>) => {
    console.log('🔄 updateCategory called:', { categoryId, updates })
    console.log('📁 Current categories:', categories.map(c => ({ id: c.id, name: c.name })))
    
    const updatedCategories = categories.map(cat => 
      cat.id === categoryId 
        ? { ...cat, ...updates }
        : cat
    )
    
    console.log('📁 Updated categories:', updatedCategories.map(c => ({ id: c.id, name: c.name })))
    
    // Actualizar el estado inmediatamente
    setCategories(updatedCategories)
    
    // Persistir en localStorage
    await persistCategories(updatedCategories)
    
    // Forzar una recarga completa del estado después de un breve delay
    setTimeout(() => {
      console.log('🔄 Forzando recarga completa del estado...')
      
      // Recargar desde localStorage para asegurar sincronización
      try {
        const savedCategories = localStorage.getItem('shop-categories')
        if (savedCategories) {
          const reloadedCategories = JSON.parse(savedCategories)
          console.log('📁 Categorías recargadas desde localStorage:', reloadedCategories.map((c: Category) => ({ id: c.id, name: c.name })))
          setCategories(reloadedCategories)
        }
      } catch (error) {
        console.error('❌ Error recargando categorías:', error)
      }
      
      // También forzar recarga de productos
      try {
        const savedProducts = localStorage.getItem('shop-products')
        if (savedProducts) {
          const reloadedProducts = JSON.parse(savedProducts)
          console.log('📦 Productos recargados desde localStorage:', reloadedProducts.length)
          setProducts(reloadedProducts)
        }
      } catch (error) {
        console.error('❌ Error recargando productos:', error)
      }
      
    }, 100)
    
    console.log('✅ updateCategory completed')
    
    toast({
      title: 'Categoría actualizada',
      description: 'Los cambios se han guardado exitosamente'
    })
  }

  const toggleCategory = async (categoryId: string) => {
    const updatedCategories = categories.map(cat => 
      cat.id === categoryId 
        ? { ...cat, isExpanded: !cat.isExpanded }
        : cat
    )
    setCategories(updatedCategories)
    await persistCategories(updatedCategories)
  }

  const addProduct = async (product: Product) => {
    // Agregar el producto a la lista general de productos
    setProducts(prev => {
      const newProducts = [...prev, product]
      
      // Persistir productos de forma asíncrona
      setTimeout(async () => {
        try {
          await persistProducts(newProducts)
        } catch (error) {
          console.error('Error persistiendo productos:', error)
        }
      }, 0)
      
      return newProducts
    })
    
    toast({
      title: 'Producto agregado',
      description: `${product.name} se agregó exitosamente`
    })
  }

  const addProductToCategory = async (categoryId: string, product: Product) => {
    // Agregar el producto a la lista general de productos
    setProducts(prev => {
      const newProducts = [...prev, product]
      
      // Persistir productos de forma asíncrona
      setTimeout(async () => {
        try {
          await persistProducts(newProducts)
        } catch (error) {
          console.error('Error persistiendo productos:', error)
        }
      }, 0)
      
      return newProducts
    })
    
    // Agregar el producto a la categoría específica y persistir
    setCategories(prev => {
      const updatedCategories = prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, products: [...cat.products, product] }
          : cat
      )
      
      // Persistir categorías de forma asíncrona
      setTimeout(async () => {
        try {
          await persistCategories(updatedCategories)
        } catch (error) {
          console.error('Error persistiendo categorías:', error)
        }
      }, 0)
      
      return updatedCategories
    })
    
    toast({
      title: 'Producto agregado',
      description: `${product.name} se agregó a la categoría exitosamente`
    })
  }

  const updateProduct = async (categoryId: string, productId: string, updates: Partial<Product>) => {
    // Actualizar el producto en la lista general
    setProducts(prev => {
      const updatedProducts = prev.map(p => 
        p.id === productId ? { ...p, ...updates } : p
      )
      
      // Persistir productos de forma asíncrona
      setTimeout(async () => {
        try {
          await persistProducts(updatedProducts)
        } catch (error) {
          console.error('Error persistiendo productos:', error)
        }
      }, 0)
      
      return updatedProducts
    })
    
    // Actualizar el producto en la categoría específica
    const updatedCategories = categories.map(cat => 
      cat.id === categoryId 
        ? { 
            ...cat, 
            products: cat.products.map(p => 
              p.id === productId ? { ...p, ...updates } : p
            )
          }
        : cat
    )
    setCategories(updatedCategories)
    await persistCategories(updatedCategories)
    
    toast({
      title: 'Producto actualizado',
      description: 'Los cambios se han guardado exitosamente'
    })
  }

  const deleteProduct = async (categoryId: string, productId: string) => {
    // Eliminar el producto de la lista general
    setProducts(prev => {
      const updatedProducts = prev.filter(p => p.id !== productId)
      
      // Persistir productos de forma asíncrona
      setTimeout(async () => {
        try {
          await persistProducts(updatedProducts)
        } catch (error) {
          console.error('Error persistiendo productos:', error)
        }
      }, 0)
      
      return updatedProducts
    })
    
    // Eliminar el producto de la categoría específica
    const updatedCategories = categories.map(cat => 
      cat.id === categoryId 
        ? { 
            ...cat, 
            products: cat.products.filter(p => p.id !== productId)
          }
        : cat
    )
    setCategories(updatedCategories)
    await persistCategories(updatedCategories)
    
    toast({
      title: 'Producto eliminado',
      description: 'El producto se ha eliminado exitosamente'
    })
  }

  // Funciones de promociones
  const addPromotion = (promotion: Promotion) => {
    setPromotions(prev => [...prev, promotion])
    toast({
      title: 'Promoción creada',
      description: `${promotion.name} se ha creado exitosamente`
    })
  }

  const handleAddPromotionToCart = (promotion: Promotion) => {
    setSelectedPromotion(promotion)
    setShowPromotionSelector(true)
  }

  const handlePromotionSelection = (selectedItems: { products: string[], beverages: string[] }) => {
    if (!selectedPromotion) return

    const selectedProductNames = selectedItems.products.map(id => 
      products.find(p => p.id === id)?.name
    ).filter(Boolean).join(', ')

    const selectedBeverageNames = selectedItems.beverages.map(id => {
      const beverage = products.find(p => p.id === id)
      return beverage?.name
    }).filter(Boolean).join(', ')

    const promotionItem: CartItem = {
      id: `promo-${selectedPromotion.id}-${Date.now()}`,
      name: `${selectedPromotion.name} - ${selectedProductNames}${selectedBeverageNames ? ` + ${selectedBeverageNames}` : ''}`,
      price: selectedPromotion.price,
      quantity: 1,
      image: selectedPromotion.image,
      isPromotion: true,
      promotionDetails: {
        promotionId: selectedPromotion.id,
        selectedProducts: selectedItems.products,
        selectedBeverages: selectedItems.beverages
      }
    }

    setCartItems(prev => [...prev, promotionItem])
    
    toast({
      title: 'Promoción agregada',
      description: `${selectedPromotion.name} se agregó al carrito`
    })

    setSelectedPromotion(null)
    setShowPromotionSelector(false)
  }

  // Función para actualizar productos y categorías masivamente
  const handleBulkEditProducts = async (updatedProducts: Product[], updatedCategories: Category[]) => {
    console.log('🔄 handleBulkEditProducts called with:', updatedProducts.length, 'products and', updatedCategories.length, 'categories')
    
    // Actualizar productos
    setProducts(updatedProducts)
    setFilteredProducts(updatedProducts)
    
    // Actualizar categorías
    setCategories(updatedCategories)
    
    // Persistir categorías
    await persistCategories(updatedCategories)
    
    // Guardar productos en localStorage como respaldo
    try {
      localStorage.setItem('shop-products', JSON.stringify(updatedProducts))
      console.log('✅ Productos guardados en localStorage')
    } catch (error) {
      console.error('Error guardando productos en localStorage:', error)
    }
    
    // Por ahora, solo guardar en localStorage para evitar bucles infinitos
    // TODO: Implementar guardado en configuración global de forma segura
    
    toast({
      title: 'Edición masiva completada',
      description: `${updatedProducts.length} productos y ${updatedCategories.length} categorías actualizados exitosamente`
    })
  }

  return {
    // Estado
    products,
    filteredProducts,
    searchTerm,
    setSearchTerm,
    priceRange,
    setPriceRange,
    selectedCategory,
    setSelectedCategory,
    selectedRating,
    setSelectedRating,
    sortBy,
    setSortBy,
    productCategories,
    cartItems,
    isCartOpen,
    setIsCartOpen,
    showBulkUploadModal,
    setShowBulkUploadModal,
    promotions,
    selectedPromotion,
    showPromotionSelector,
    setShowPromotionSelector,
    categories,
    isInitialized,
    
    // Funciones
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    handleBulkProductsUploaded,
    clearFilters,
    addPromotion,
    handleAddPromotionToCart,
    handlePromotionSelection,
    addCategory,
    updateCategory,
    toggleCategory,
    addProduct,
    addProductToCategory,
    updateProduct,
    deleteProduct,
    persistCategories,
    handleBulkEditProducts,
    forceReloadData,
    cleanDuplicateProducts
  }
}
