"use client"

import { useState, useEffect } from 'react'
import { Config } from '@/lib/config-loader'
import { useAdmin } from '@/lib/admin-context'
import { AdminToggle } from '@/components/admin-toggle'
import { ShopDesignSelector } from '@/components/shop-design-selector'
import { Design } from '@/lib/designs'
import './layout-styles.css'
import { ImageModal } from '@/components/image-modal'
import { useImageModal } from '@/hooks/use-image-modal'
import { BulkUploadProducts } from '@/components/bulk-upload-products'
import { PromotionsSection } from '@/components/promotions-section'
import { PromotionSelectorModal } from '@/components/promotion-selector-modal'

// Componentes de la tienda
import { ShopHeader } from '@/components/shop/shop-header'
import { ShopSidebar } from '@/components/shop/shop-sidebar'
import { ShopFilters } from '@/components/shop/shop-filters'
import { ProductGrid } from '@/components/shop/product-grid'
import { ShopCart } from '@/components/shop/shop-cart'
import { useShop } from '@/hooks/use-shop'
import { sampleProducts } from '@/components/shop/sample-products'

export default function ShopPage() {
  const { isAdminMode } = useAdmin()
  const [config, setConfig] = useState<Config | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedDesign, setSelectedDesign] = useState<string>('')
  const { isOpen: imageModalOpen, closeModal: closeImageModal, modalConfig } = useImageModal()

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
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    handleBulkProductsUploaded,
    clearFilters,
    addPromotion,
    handleAddPromotionToCart,
    handlePromotionSelection
  } = useShop()

  // Debug logs
  console.log('🏪 ShopPage render - Products count:', products.length)
  console.log('🏪 ShopPage render - Filtered products count:', filteredProducts.length)

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
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        selectedDesign={selectedDesign}
        onDesignSelect={handleDesignSelect}
      />

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar con filtros */}
          <ShopSidebar
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            selectedRating={selectedRating}
            setSelectedRating={setSelectedRating}
            onClearFilters={clearFilters}
          />

          {/* Contenido principal */}
          <div className="flex-1">
            {/* Sección de Promociones */}
            <PromotionsSection
              promotions={promotions}
              onAddPromotion={addPromotion}
              onAddToCart={handleAddPromotionToCart}
              availableProducts={products}
            />

            {/* Filtros superiores */}
            <ShopFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOptions={shopConfig.sortOptions}
              resultsText={shopConfig.resultsText}
              filteredProductsCount={filteredProducts.length}
              totalProductsCount={products.length}
            />

            {/* Grid de productos */}
            <ProductGrid
              products={filteredProducts}
              layoutConfig={layoutConfig}
              onAddToCart={addToCart}
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
      <ShopCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
      />

      {/* Modal de carga masiva */}
      {showBulkUploadModal && (
        <BulkUploadProducts
          onProductsUploaded={handleBulkProductsUploaded}
          onClose={() => setShowBulkUploadModal(false)}
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

      {/* Modal de imagen */}
      <ImageModal 
        isOpen={imageModalOpen}
        onClose={closeImageModal}
        onSave={modalConfig.onSave}
      />

      {/* Componentes de administración */}
      <AdminToggle />
    </div>
  )
}
