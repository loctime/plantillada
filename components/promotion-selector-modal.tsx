"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { X, Check } from 'lucide-react'
import { Product } from '@/components/shop/types'

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

interface PromotionSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (selectedItems: { products: string[], beverages: string[] }) => void
  promotion: Promotion | null
  availableProducts: Product[]
}

export function PromotionSelectorModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  promotion, 
  availableProducts 
}: PromotionSelectorModalProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [selectedBeverages, setSelectedBeverages] = useState<string[]>([])

  if (!isOpen || !promotion) return null

  // Filtrar bebidas
  const beverages = availableProducts.filter(product => 
    product.category.toLowerCase().includes('bebida') || 
    product.category.toLowerCase().includes('drink') ||
    product.name.toLowerCase().includes('bebida') ||
    product.name.toLowerCase().includes('drink')
  )

  // Obtener productos y bebidas disponibles para esta promoción
  const availablePromotionProducts = availableProducts.filter(p => 
    promotion.selectedProducts.includes(p.id)
  )
  const availablePromotionBeverages = beverages.filter(b => 
    promotion.selectedBeverages.includes(b.id)
  )

  const handleConfirm = () => {
    onConfirm({
      products: selectedProducts,
      beverages: selectedBeverages
    })
    handleClose()
  }

  const handleClose = () => {
    setSelectedProducts([])
    setSelectedBeverages([])
    onClose()
  }

  const toggleProduct = (productId: string) => {
    if (promotion.productType === 'choice') {
      setSelectedProducts(prev => 
        prev.includes(productId) 
          ? prev.filter(id => id !== productId)
          : [...prev, productId]
      )
    } else {
      setSelectedProducts([productId])
    }
  }

  const toggleBeverage = (beverageId: string) => {
    if (promotion.beverageType === 'choice') {
      setSelectedBeverages(prev => 
        prev.includes(beverageId) 
          ? prev.filter(id => id !== beverageId)
          : [...prev, beverageId]
      )
    } else {
      setSelectedBeverages([beverageId])
    }
  }

  const canConfirm = () => {
    if (promotion.productType === 'fixed' && selectedProducts.length !== 1) return false
    if (promotion.beverageType === 'fixed' && selectedBeverages.length !== 1) return false
    if (promotion.productType === 'choice' && selectedProducts.length === 0) return false
    if (promotion.beverageType === 'choice' && selectedBeverages.length === 0) return false
    return true
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Personalizar Promoción</h2>
            <p className="text-gray-600">{promotion.name}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Productos */}
          {availablePromotionProducts.length > 0 && (
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">
                Productos {promotion.productType === 'choice' ? '(Selecciona los que desees)' : '(Selecciona uno)'}
              </h3>
              
              <RadioGroup 
                value={selectedProducts[0] || ''} 
                onValueChange={(value) => toggleProduct(value)}
              >
                {availablePromotionProducts.map(product => (
                  <div key={product.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem 
                      value={product.id} 
                      id={`product-${product.id}`}
                      checked={selectedProducts.includes(product.id)}
                      onClick={() => toggleProduct(product.id)}
                    />
                    <Label 
                      htmlFor={`product-${product.id}`} 
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <img 
                          src={product.image || '/placeholder.jpg'} 
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">${product.price}</div>
                        </div>
                      </div>
                    </Label>
                    {selectedProducts.includes(product.id) && (
                      <Check className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Bebidas */}
          {availablePromotionBeverages.length > 0 && (
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">
                Bebidas {promotion.beverageType === 'choice' ? '(Selecciona las que desees)' : '(Selecciona una)'}
              </h3>
              
              <RadioGroup 
                value={selectedBeverages[0] || ''} 
                onValueChange={(value) => toggleBeverage(value)}
              >
                {availablePromotionBeverages.map(beverage => (
                  <div key={beverage.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem 
                      value={beverage.id} 
                      id={`beverage-${beverage.id}`}
                      checked={selectedBeverages.includes(beverage.id)}
                      onClick={() => toggleBeverage(beverage.id)}
                    />
                    <Label 
                      htmlFor={`beverage-${beverage.id}`} 
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <img 
                          src={beverage.image || '/placeholder.jpg'} 
                          alt={beverage.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium">{beverage.name}</div>
                          <div className="text-sm text-gray-500">${beverage.price}</div>
                        </div>
                      </div>
                    </Label>
                    {selectedBeverages.includes(beverage.id) && (
                      <Check className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Resumen */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Resumen de selección:</h4>
            <div className="space-y-1 text-sm">
              <div>
                <span className="font-medium">Productos seleccionados:</span>
                <span className="text-gray-600 ml-2">
                  {selectedProducts.length > 0 
                    ? selectedProducts.map(id => 
                        availablePromotionProducts.find(p => p.id === id)?.name
                      ).join(', ')
                    : 'Ninguno'
                  }
                </span>
              </div>
              <div>
                <span className="font-medium">Bebidas seleccionadas:</span>
                <span className="text-gray-600 ml-2">
                  {selectedBeverages.length > 0 
                    ? selectedBeverages.map(id => 
                        availablePromotionBeverages.find(b => b.id === id)?.name
                      ).join(', ')
                    : 'Ninguna'
                  }
                </span>
              </div>
              <div className="pt-2 border-t">
                <span className="font-medium">Precio total:</span>
                <span className="text-lg font-bold text-red-600 ml-2">
                  ${promotion.price.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!canConfirm()}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
          >
            Agregar al Carrito
          </Button>
        </div>
      </div>
    </div>
  )
}
