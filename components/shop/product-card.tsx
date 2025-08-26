"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, Heart, Eye, Edit3, Plus, Minus } from 'lucide-react'
import { useAdmin } from '@/lib/admin-context'
import { useImageModal } from '@/hooks/use-image-modal'
import { Product } from './types'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
  layoutConfig: any
  onAddToCart?: (product: Product, selectedOptions?: any, selectedAddons?: any[]) => void
  onEditProduct?: (product: Product) => void
}

export function ProductCard({ product, layoutConfig, onAddToCart, onEditProduct }: ProductCardProps) {
  const { isAdminMode } = useAdmin()
  const { openImageModal } = useImageModal()
  const [showOptions, setShowOptions] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<{[key: string]: string}>({})
  const [selectedAddons, setSelectedAddons] = useState<{[key: string]: boolean}>({})

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const handleAddToCart = () => {
    // Si el producto tiene opciones, mostrar el modal de opciones
    if (product.options && Object.values(product.options).some(opt => opt)) {
      setShowOptions(true)
    } else {
      // Si no tiene opciones, agregar directamente al carrito
      onAddToCart?.(product)
    }
  }

  const handleConfirmOptions = () => {
    const formattedOptions: any = {}
    const formattedAddons: any[] = []

    // Procesar opciones seleccionadas
    Object.keys(selectedOptions).forEach(key => {
      if (selectedOptions[key]) {
        formattedOptions[key] = selectedOptions[key]
      }
    })

    // Procesar adicionales seleccionados
    Object.keys(selectedAddons).forEach(addonName => {
      if (selectedAddons[addonName]) {
        const addon = product.addons?.find(a => a.name === addonName)
        if (addon) {
          formattedAddons.push(addon)
        }
      }
    })

    onAddToCart?.(product, formattedOptions, formattedAddons)
    setShowOptions(false)
    setSelectedOptions({})
    setSelectedAddons({})
  }

  const calculateTotalPrice = () => {
    let total = product.price
    
    // Agregar precio de adicionales seleccionados
    Object.keys(selectedAddons).forEach(addonName => {
      if (selectedAddons[addonName]) {
        const addon = product.addons?.find(a => a.name === addonName)
        if (addon) {
          total += addon.price
        }
      }
    })
    
    return total
  }

  return (
    <>
      <Card className="product-card group hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="relative group">
            <img
              src={product.image || '/placeholder.jpg'}
              alt={product.name}
              className="product-image w-full h-48 object-cover rounded-lg mb-4"
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
            {layoutConfig.productStyle === 'food-cards' && (
              <div className="category-badge">
                {product.category}
              </div>
            )}
            {/* Botones de edición (solo en modo admin) */}
            {isAdminMode && (
              <div className="absolute bottom-2 right-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700"
                  onClick={() => onEditProduct?.(product)}
                  title="Editar producto"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                  onClick={() => openImageModal(product)}
                  title="Editar imagen"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="product-info space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 uppercase">{product.brand}</span>
              <div className="flex items-center space-x-1">
                {renderStars(product.rating)}
                <span className="text-xs text-gray-500">({product.reviews})</span>
              </div>
            </div>
            
            <h3 className="font-medium text-gray-900 group">
              {product.name}
            </h3>
            
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-blue-600">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>
            
            <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
            
            {product.features.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {product.features.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            )}

            {/* Mostrar indicador de opciones disponibles */}
            {product.options && Object.values(product.options).some(opt => opt) && (
              <div className="text-xs text-blue-600 font-medium">
                ⚙️ Opciones personalizables disponibles
              </div>
            )}
            
            <Button 
              className="w-full mt-2" 
              disabled={!product.inStock}
              onClick={handleAddToCart}
            >
              {product.inStock ? 'Agregar al Carrito' : 'Sin Stock'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal de opciones y adicionales */}
      {showOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">{product.name}</h3>
              
              {/* Opciones */}
              {product.options && Object.entries(product.options).map(([key, optionName]) => {
                if (!optionName) return null
                const varietyKey = key.replace('option', 'variety') as keyof typeof product.varieties
                const varieties = product.varieties?.[varietyKey as keyof typeof product.varieties] as string[]
                
                if (!varieties || varieties.length === 0) return null
                
                return (
                  <div key={key} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {optionName}
                    </label>
                    <div className="space-y-2">
                      {varieties.map((variety) => (
                        <label key={variety} className="flex items-center">
                          <input
                            type="radio"
                            name={key}
                            value={variety}
                            checked={selectedOptions[key] === variety}
                            onChange={(e) => setSelectedOptions(prev => ({
                              ...prev,
                              [key]: e.target.value
                            }))}
                            className="mr-2"
                          />
                          <span className="text-sm">{variety}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )
              })}

              {/* Adicionales */}
              {product.addons && product.addons.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adicionales
                  </label>
                  <div className="space-y-2">
                    {product.addons.map((addon) => (
                      <label key={addon.name} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedAddons[addon.name] || false}
                            onChange={(e) => setSelectedAddons(prev => ({
                              ...prev,
                              [addon.name]: e.target.checked
                            }))}
                            className="mr-2"
                          />
                          <span className="text-sm">{addon.name}</span>
                        </div>
                        <span className="text-sm font-medium text-blue-600">
                          +${addon.price.toFixed(2)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Precio total */}
              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total:</span>
                  <span className="text-lg font-bold text-blue-600">
                    ${calculateTotalPrice().toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowOptions(false)
                    setSelectedOptions({})
                    setSelectedAddons({})
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirmOptions}
                  className="flex-1"
                >
                  Agregar al Carrito
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
