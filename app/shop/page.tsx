"use client"

import { useState, useEffect } from 'react'
import { Config } from '@/lib/config-loader'
import { useAdmin } from '@/lib/admin-context'

import { ShopDesignSelector } from '@/components/shop-design-selector'
import { Design } from '@/lib/designs'
import './layout-styles.css'
import { ImageModal } from '@/components/image-modal'
import { useImageModal } from '@/hooks/use-image-modal'
import { BulkUploadProducts } from '@/components/bulk-upload-products'
import { BulkEditProducts } from '@/components/bulk-edit-products'
import { PromotionsSection } from '@/components/promotions-section'
import { PromotionSelectorModal } from '@/components/promotion-selector-modal'
import { PromotionModal } from '@/components/promotion-modal'
import { CategoriesSection } from '@/components/categories-section'

// Componentes de la tienda
import { ShopHeader } from '@/components/shop/shop-header'
import { ShopFilters } from '@/components/shop/shop-filters'
import { ProductGrid } from '@/components/shop/product-grid'
import { ProductEditModal } from '@/components/shop/product-edit-modal'
import { Cart } from '@/components/shop/cart'
import { CartButton } from '@/components/shop/cart-button'
import { ShopBanner } from '@/components/shop/shop-banner'
import { useShop } from '@/hooks/use-shop'
import { sampleProducts } from '@/components/shop/sample-products'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Product } from '@/components/shop/types'

export default function ShopPage() {
  const { isAdminMode } = useAdmin()
  const [config, setConfig] = useState<Config | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedDesign, setSelectedDesign] = useState<string>('')
  const { isOpen: imageModalOpen, closeModal: closeImageModal, modalConfig } = useImageModal()
  const [showPromotionModal, setShowPromotionModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryDescription, setNewCategoryDescription] = useState('')
  const [showBulkEditModal, setShowBulkEditModal] = useState(false)
  const [showProductEditModal, setShowProductEditModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [shopBanners, setShopBanners] = useState([
    {
      id: 'banner-1',
      title: '¡Ofertas Especiales!',
      subtitle: 'Descuentos de hasta 50% en productos seleccionados',
      backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      ctaText: 'Ver Ofertas',
      ctaUrl: '#ofertas',
      image: '',
      isActive: true,
      displayTime: 4,
      transitionEffect: 'fade',
      textPosition: 'center',
      textAnimation: 'fadeIn',
      overlayOpacity: 30,
      borderRadius: 0,
      shadow: false,
      blur: false,
      scale: false
    },
    {
      id: 'banner-2',
      title: 'Envío Gratis',
      subtitle: 'En pedidos superiores a $50',
      backgroundColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      ctaText: 'Comprar Ahora',
      ctaUrl: '#productos',
      image: '',
      isActive: true,
      displayTime: 4,
      transitionEffect: 'slide',
      textPosition: 'center',
      textAnimation: 'slideIn',
      overlayOpacity: 25,
      borderRadius: 8,
      shadow: true,
      blur: false,
      scale: true
    },
    {
      id: 'banner-3',
      title: 'Nuevos Productos',
      subtitle: 'Descubre nuestra última colección',
      backgroundColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      ctaText: 'Explorar',
      ctaUrl: '#nuevos',
      image: '',
      isActive: true,
      displayTime: 5,
      transitionEffect: 'zoom',
      textPosition: 'right',
      textAnimation: 'bounce',
      overlayOpacity: 20,
      borderRadius: 12,
      shadow: true,
      blur: true,
      scale: false
    }
  ])

  // Usar el hook personalizado para toda la lógica de la tienda
  const {
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
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    handleBulkProductsUploaded,
    handleBulkEditProducts,
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
    deleteProduct
  } = useShop()

  // Debug logs
  console.log('🏪 ShopPage render - Products count:', products.length)
  console.log('🏪 ShopPage render - Filtered products count:', filteredProducts.length)

  // Obtener nombres de categorías para componentes que los necesiten
  const categoryNames = categories
    .filter(cat => cat.isActive)
    .map(cat => cat.name)
    .sort()

  // Configuración de la tienda
  const shopConfig = {
    title: config?.site?.title || 'Tienda Online',
    bestSellersTitle: 'Mejores Vendidos',
    breadcrumbText: 'Inicio > Productos',
    resultsText: 'Mostrando {count} de {total} productos',
    sortOptions: [
      { value: 'name-asc', label: 'Nombre A-Z' },
      { value: 'name-desc', label: 'Nombre Z-A' },
      { value: 'price-asc', label: 'Precio: Menor a Mayor' },
      { value: 'price-desc', label: 'Precio: Mayor a Menor' },
      { value: 'rating-desc', label: 'Mejor Calificados' },
      { value: 'reviews-desc', label: 'Más Revisados' }
    ]
  }

  const layoutConfig = {
    type: 'default',
    productStyle: 'default'
  }

  // Cargar configuración
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/config')
        const data = await response.json()
        setConfig(data)
        
        // Cargar diseño seleccionado desde la configuración
        if (data.selectedDesigns?.shop) {
          setSelectedDesign(data.selectedDesigns.shop)
        }
      } catch (error) {
        console.error('Error loading config:', error)
      } finally {
        setLoading(false)
      }
    }

    loadConfig()
  }, [])

  // Aplicar diseño seleccionado cuando cambie
  useEffect(() => {
    const applySelectedDesign = async () => {
      if (selectedDesign && typeof document !== 'undefined') {
        try {
          const { getDesignById, applyDesignToDocument } = await import('@/lib/designs')
          const design = getDesignById(selectedDesign)
          if (design) {
            applyDesignToDocument(design)
            console.log('🎨 Diseño aplicado al cargar:', design.name)
          }
        } catch (error) {
          console.error('Error aplicando diseño al cargar:', error)
        }
      }
    }

    applySelectedDesign()
  }, [selectedDesign])

  // Manejar selección de diseño
  const handleDesignSelect = async (design: Design) => {
    try {
      setSelectedDesign(design.id)
      
      // Aplicar estilos visuales inmediatamente
      if (typeof document !== 'undefined') {
        // Importar la función para aplicar el diseño
        const { applyDesignToDocument } = await import('@/lib/designs')
        applyDesignToDocument(design)
        console.log('🎨 Estilos aplicados:', design.name)
      }
      
      // Guardar la selección en la configuración
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedDesigns: {
            ...(config?.selectedDesigns || {}),
            shop: design.id
          }
        }),
      })

      if (response.ok) {
        console.log('✅ Diseño guardado:', design.name)
      }
    } catch (error) {
      console.error('Error guardando diseño:', error)
    }
  }



  // Manejar creación de categoría
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return

    const newCategory = {
      id: `category-${Date.now()}`,
      name: newCategoryName.trim(),
      description: newCategoryDescription.trim(),
      isExpanded: true,
      products: [],
      isActive: true
    }

    await addCategory(newCategory)
    setNewCategoryName('')
    setNewCategoryDescription('')
    setShowCategoryModal(false)
  }

  // Manejar edición de productos
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setShowProductEditModal(true)
  }

  const handleSaveProduct = async (product: Product) => {
    try {
      // Buscar la categoría del producto
      const productCategory = categories.find(cat => 
        cat.products.some(p => p.id === product.id)
      )
      
      if (productCategory) {
        await updateProduct(productCategory.id, product.id, product)
      } else {
        // Si no está en una categoría específica, actualizar solo en la lista general
        console.log('Producto actualizado en lista general:', product)
      }
      
      setShowProductEditModal(false)
      setEditingProduct(null)
    } catch (error) {
      console.error('Error guardando producto:', error)
    }
  }

  const handleCreateNewProduct = () => {
    setEditingProduct(null)
    setShowProductEditModal(true)
  }

  const handleSaveNewProduct = async (product: Product) => {
    try {
      // Agregar el producto a la lista general
      await addProduct(product)
      
      // Si el producto tiene una categoría específica, también agregarlo a esa categoría
      if (product.category) {
        const selectedCategory = categories.find(cat => cat.name === product.category)
        if (selectedCategory) {
          // Agregar el producto a la categoría específica usando la función del hook
          await addProductToCategory(selectedCategory.id, product)
        }
      }
      
      setShowProductEditModal(false)
    } catch (error) {
      console.error('Error creando producto:', error)
    }
  }

  const handleBannersUpdate = (updatedBanners: any[]) => {
    setShopBanners(updatedBanners)
    console.log('🎨 Banners actualizados:', updatedBanners)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tienda...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ShopHeader
        shopConfig={shopConfig}
        cartItemCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenBulkUpload={() => setShowBulkUploadModal(true)}
        onOpenBulkEdit={() => setShowBulkEditModal(true)}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        selectedDesign={selectedDesign}
        onDesignSelect={handleDesignSelect}
        config={config}
        isMobileMenuOpen={mobileMenuOpen}
      />

      {/* Banner de la tienda */}
      <ShopBanner 
        banners={shopBanners}
        autoPlay={true}
        interval={4000}
        showControls={true}
        showIndicators={true}
        onBannersUpdate={handleBannersUpdate}
      />

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full">
          {/* Filtros superiores - Ahora justo debajo del navbar */}
          <ShopFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={productCategories}
            selectedRating={selectedRating}
            setSelectedRating={setSelectedRating}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOptions={shopConfig.sortOptions}
            resultsText={shopConfig.resultsText}
            filteredProductsCount={filteredProducts.length}
            totalProductsCount={products.length}
            onClearFilters={clearFilters}
          />

          {/* Contenido principal */}
          <div className="w-full mt-8">
            {/* Header compartido para Promociones y Categorías */}
            {isAdminMode && (
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Gestión de Contenido</h2>
                  <p className="text-gray-600">Administra promociones, categorías y productos</p>
                </div>
                <div className="flex space-x-3">
                  <Button 
                    onClick={handleCreateNewProduct}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Producto
                  </Button>
                  <Button 
                    onClick={() => setShowPromotionModal(true)}
                    className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Promoción
                  </Button>
                  <Button 
                    onClick={() => setShowCategoryModal(true)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Categoría
                  </Button>
                </div>
              </div>
            )}

            {/* Sección de Promociones */}
            <PromotionsSection
              promotions={promotions}
              onAddPromotion={addPromotion}
              onAddToCart={handleAddPromotionToCart}
              availableProducts={products}
              showAddButton={false}
              onShowAddModal={() => setShowPromotionModal(true)}
            />

            {/* Sección de Categorías */}
            <CategoriesSection
              categories={categories}
              onAddCategory={addCategory}
              onToggleCategory={toggleCategory}
              onAddProductToCategory={addProductToCategory}
              availableProducts={products}
              showAddButton={false}
              onShowAddModal={() => setShowCategoryModal(true)}
              onAddToCart={addToCart}
              onUpdateCategory={updateCategory}
              onUpdateProduct={updateProduct}
              onDeleteProduct={deleteProduct}
            />

            {/* Grid de productos */}
            <ProductGrid
              products={filteredProducts}
              layoutConfig={layoutConfig}
              onAddToCart={addToCart}
              onEditProduct={handleEditProduct}
            />

            {/* Mensaje si no hay productos */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No se encontraron productos que coincidan con los filtros.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-blue-600 hover:text-blue-700 underline"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Carrito */}
      <Cart
        items={cartItems}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
      />

      {/* Botón flotante del carrito */}
      <CartButton
        items={cartItems}
        onClick={() => setIsCartOpen(true)}
      />

      {/* Modal de carga masiva */}
      {showBulkUploadModal && (
        <BulkUploadProducts
          onProductsUploaded={handleBulkProductsUploaded}
          onClose={() => setShowBulkUploadModal(false)}
          existingCategories={categoryNames}
        />
      )}

      {/* Modal de edición masiva */}
      {showBulkEditModal && (
        <BulkEditProducts
          onProductsUpdated={handleBulkEditProducts}
          onClose={() => setShowBulkEditModal(false)}
          existingProducts={products}
          existingCategories={categories}
        />
      )}

      {/* Modal de selección de promociones */}
      <PromotionSelectorModal
        isOpen={showPromotionSelector}
        onClose={() => setShowPromotionSelector(false)}
        onConfirm={handlePromotionSelection}
        promotion={selectedPromotion}
        availableProducts={products}
      />

      {/* Modal de promociones desde header compartido */}
      <PromotionModal
        isOpen={showPromotionModal}
        onClose={() => setShowPromotionModal(false)}
        onSave={addPromotion}
        availableProducts={products}
      />

      {/* Modal de categorías desde header compartido */}
      <Dialog open={showCategoryModal} onOpenChange={setShowCategoryModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nueva Categoría</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="category-name">Nombre de la Categoría *</Label>
              <Input
                id="category-name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Ej: Electrónicos, Ropa, etc."
              />
            </div>
            
            <div>
              <Label htmlFor="category-description">Descripción</Label>
              <Textarea
                id="category-description"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                placeholder="Describe la categoría..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setShowCategoryModal(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateCategory}
              disabled={!newCategoryName.trim()}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              Crear Categoría
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de edición de productos */}
      <ProductEditModal
        isOpen={showProductEditModal}
        onClose={() => {
          setShowProductEditModal(false)
          setEditingProduct(null)
        }}
        onSave={editingProduct ? handleSaveProduct : handleSaveNewProduct}
        product={editingProduct}
        categories={categories}
      />

      {/* Modal de imagen */}
      <ImageModal 
        isOpen={imageModalOpen}
        onClose={closeImageModal}
        onSave={modalConfig.onSave}
      />

      {/* Componentes de administración */}
      {/* AdminToggle se maneja desde el ShopHeader */}
    </div>
  )
}
