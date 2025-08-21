"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Star, ShoppingCart, ChevronDown, ChevronUp } from 'lucide-react'
import { PromotionModal } from './promotion-modal'
import { Product } from '@/components/shop/types'
import { useAdmin } from '@/lib/admin-context'

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

interface PromotionsSectionProps {
  promotions: Promotion[]
  onAddPromotion: (promotion: Promotion) => void
  onAddToCart: (promotion: Promotion) => void
  availableProducts: Product[]
}

export function PromotionsSection({ 
  promotions, 
  onAddPromotion, 
  onAddToCart, 
  availableProducts 
}: PromotionsSectionProps) {
  const [showModal, setShowModal] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const { isAdminMode } = useAdmin()

  const activePromotions = promotions.filter(p => p.isActive)

  // Cargar estado del desplegable desde localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('promotions-expanded')
    if (savedState !== null) {
      setIsExpanded(JSON.parse(savedState))
    }
  }, [])

  // Guardar estado del desplegable en localStorage
  const handleToggleExpanded = () => {
    const newState = !isExpanded
    setIsExpanded(newState)
    localStorage.setItem('promotions-expanded', JSON.stringify(newState))
  }

  const handleSavePromotion = (promotion: Promotion) => {
    onAddPromotion(promotion)
  }

  const getDiscountPercentage = (originalPrice: number, currentPrice: number) => {
    if (originalPrice <= currentPrice) return 0
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
  }

  return (
    <div className="mb-8">
      {/* Header de la sección */}
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Promociones Especiales</h2>
            <p className="text-gray-600">Ofertas únicas y combos especiales</p>
          </div>
          {isAdminMode && (
            <Button 
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Promoción
            </Button>
          )}
        </div>
        
        {/* Botón de ocultar/mostrar de ancho completo */}
        <Button
          variant="outline"
          onClick={handleToggleExpanded}
          className="w-full py-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <span className="font-medium">
            {isExpanded ? 'Ocultar Promociones' : 'Mostrar Promociones'}
          </span>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Indicador cuando está colapsado */}
      {!isExpanded && activePromotions.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-red-500 fill-current" />
              <span className="text-sm font-medium text-gray-700">
                {activePromotions.length} promoción{activePromotions.length !== 1 ? 'es' : ''} disponible{activePromotions.length !== 1 ? 's' : ''}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleExpanded}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Ver promociones
            </Button>
          </div>
        </div>
      )}

      {/* Contenido desplegable */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
        isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        {/* Grid de promociones */}
        {activePromotions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activePromotions.map((promotion) => {
              const discount = getDiscountPercentage(promotion.originalPrice, promotion.price)
              
              return (
                <div 
                  key={promotion.id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Imagen */}
                  <div className="relative h-48 bg-gradient-to-br from-red-50 to-orange-50">
                    <img
                      src={promotion.image}
                      alt={promotion.name}
                      className="w-full h-full object-cover"
                    />
                    {discount > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        -{discount}%
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      PROMO
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {promotion.name}
                    </h3>
                    
                    {promotion.description && (
                      <p className="text-gray-600 text-sm mb-4">
                        {promotion.description}
                      </p>
                    )}

                    {/* Detalles de productos y bebidas */}
                    <div className="space-y-2 mb-4">
                      <div className="text-sm">
                        <span className="font-semibold text-gray-700">Productos:</span>
                        <span className="text-gray-600 ml-1">
                          {promotion.productType === 'choice' ? 'A elección' : 'Fijo'}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold text-gray-700">Bebidas:</span>
                        <span className="text-gray-600 ml-1">
                          {promotion.beverageType === 'choice' ? 'A elección' : 'Fija'}
                        </span>
                      </div>
                    </div>

                    {/* Precios */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-red-600">
                          ${promotion.price.toFixed(2)}
                        </span>
                        {promotion.originalPrice > promotion.price && (
                          <span className="text-lg text-gray-400 line-through">
                            ${promotion.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Botón agregar al carrito */}
                    <Button 
                      onClick={() => onAddToCart(promotion)}
                      className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Agregar al Carrito
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-gray-400 mb-4">
              <ShoppingCart className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No hay promociones activas
            </h3>
            <p className="text-gray-500 mb-4">
              Crea tu primera promoción para empezar a ofrecer ofertas especiales
            </p>
            {isAdminMode && (
              <Button 
                onClick={() => setShowModal(true)}
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Promoción
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modal de creación de promociones */}
      <PromotionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSavePromotion}
        availableProducts={availableProducts}
      />
    </div>
  )
}
