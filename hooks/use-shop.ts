import { useState, useEffect, useMemo } from 'react'
import { Product, CartItem } from '@/components/shop/types'
import { sampleProducts } from '@/components/shop/sample-products'
import { useToast } from '@/hooks/use-toast'

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

export function useShop() {
  const [products, setProducts] = useState<Product[]>(sampleProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(sampleProducts)
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
  const { toast } = useToast()

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))]
    return cats.sort()
  }, [products])

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
  }, [products, searchTerm, selectedCategory, priceRange, selectedRating, sortBy])

  // Funciones del carrito
  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id)
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [...prev, {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image
        }]
      }
    })
    
    toast({
      title: 'Producto agregado',
      description: `${product.name} se agregó al carrito`
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
    
    const updatedProducts = [...products, ...newProducts]
    console.log('📦 Updated products count:', updatedProducts.length)
    
    setProducts(updatedProducts)
    setFilteredProducts(updatedProducts)
    
    // Forzar actualización inmediata
    setTimeout(() => {
      console.log('🔄 Forcing re-render after bulk upload')
      setProducts([...updatedProducts])
    }, 100)
    
    toast({
      title: 'Carga masiva completada',
      description: `${newProducts.length} productos agregados exitosamente`
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
    categories,
    cartItems,
    isCartOpen,
    setIsCartOpen,
    showBulkUploadModal,
    setShowBulkUploadModal,
    promotions,
    selectedPromotion,
    showPromotionSelector,
    setShowPromotionSelector,
    
    // Funciones
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    handleBulkProductsUploaded,
    clearFilters,
    addPromotion,
    handleAddPromotionToCart,
    handlePromotionSelection
  }
}
