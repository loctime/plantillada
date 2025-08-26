"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { X, Plus, Trash2 } from 'lucide-react'
import { Product } from '@/components/shop/types'

interface PromotionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (promotion: any) => void
  availableProducts: Product[]
}

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

export function PromotionModal({ isOpen, onClose, onSave, availableProducts }: PromotionModalProps) {
  const [promotion, setPromotion] = useState<Partial<Promotion>>({
    name: '',
    productType: 'choice',
    selectedProducts: [],
    beverageType: 'choice',
    selectedBeverages: [],
    description: '',
    price: 0,
    originalPrice: 0,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop',
    isActive: true
  })

  const [showProductSelector, setShowProductSelector] = useState(false)
  const [showBeverageSelector, setShowBeverageSelector] = useState(false)

  // Filtrar productos por categoría (bebidas)
  const beverages = availableProducts.filter(product => 
    product.category.toLowerCase().includes('bebida') || 
    product.category.toLowerCase().includes('drink') ||
    product.name.toLowerCase().includes('bebida') ||
    product.name.toLowerCase().includes('drink')
  )

  const handleSave = () => {
    if (!promotion.name || promotion.price === 0) {
      alert('Por favor completa todos los campos obligatorios')
      return
    }

    const newPromotion: Promotion = {
      id: `promo-${Date.now()}`,
      name: promotion.name!,
      productType: promotion.productType!,
      selectedProducts: promotion.selectedProducts || [],
      beverageType: promotion.beverageType!,
      selectedBeverages: promotion.selectedBeverages || [],
      description: promotion.description || '',
      price: promotion.price!,
      originalPrice: promotion.originalPrice || promotion.price!,
      image: promotion.image!,
      isActive: promotion.isActive!
    }

    onSave(newPromotion)
    handleClose()
  }

  const handleClose = () => {
    setPromotion({
      name: '',
      productType: 'choice',
      selectedProducts: [],
      beverageType: 'choice',
      selectedBeverages: [],
      description: '',
      price: 0,
      originalPrice: 0,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop',
      isActive: true
    })
    onClose()
  }

  const toggleProduct = (productId: string) => {
    setPromotion(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts?.includes(productId)
        ? prev.selectedProducts.filter(id => id !== productId)
        : [...(prev.selectedProducts || []), productId]
    }))
  }

  const toggleBeverage = (beverageId: string) => {
    setPromotion(prev => ({
      ...prev,
      selectedBeverages: prev.selectedBeverages?.includes(beverageId)
        ? prev.selectedBeverages.filter(id => id !== beverageId)
        : [...(prev.selectedBeverages || []), beverageId]
    }))
  }

  const getSelectedProductNames = () => {
    return promotion.selectedProducts?.map(id => 
      availableProducts.find(p => p.id === id)?.name
    ).filter(Boolean).join(', ') || 'Ninguno seleccionado'
  }

  const getSelectedBeverageNames = () => {
    return promotion.selectedBeverages?.map(id => 
      beverages.find(b => b.id === id)?.name
    ).filter(Boolean).join(', ') || 'Ninguna seleccionada'
  }

  if (!isOpen) return null

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
          <h2 className="text-2xl font-bold text-gray-900">Crear Nueva Promoción</h2>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Nombre de la promoción */}
          <div>
            <Label htmlFor="name">Nombre de la Promoción *</Label>
            <Input
              id="name"
              value={promotion.name}
              onChange={(e) => setPromotion(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ej: Combo Familiar, Promo 2x1, etc."
              className="mt-1"
            />
          </div>

          {/* Descripción */}
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={promotion.description}
              onChange={(e) => setPromotion(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe la promoción..."
              className="mt-1"
              rows={3}
            />
          </div>

          {/* Precios */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Precio de Promoción *</Label>
              <Input
                id="price"
                type="number"
                value={promotion.price}
                onChange={(e) => setPromotion(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="originalPrice">Precio Original</Label>
              <Input
                id="originalPrice"
                type="number"
                value={promotion.originalPrice}
                onChange={(e) => setPromotion(prev => ({ ...prev, originalPrice: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
                className="mt-1"
              />
            </div>
          </div>

          {/* Productos */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Productos</h3>
            
            <div className="mb-4">
              <Label>Tipo de Productos</Label>
              <Select
                value={promotion.productType}
                onValueChange={(value: 'choice' | 'fixed') => 
                  setPromotion(prev => ({ ...prev, productType: value }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="choice">Productos a elección</SelectItem>
                  <SelectItem value="fixed">Producto fijo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                {promotion.productType === 'choice' ? 'Productos disponibles:' : 'Producto seleccionado:'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProductSelector(!showProductSelector)}
              >
                {showProductSelector ? 'Ocultar' : 'Seleccionar'}
              </Button>
            </div>

            <div className="text-sm text-gray-500 mb-2">
              {getSelectedProductNames()}
            </div>

            {showProductSelector && (
              <div className="border rounded-lg p-3 max-h-40 overflow-y-auto">
                {availableProducts.map(product => (
                  <div key={product.id} className="flex items-center space-x-2 py-1">
                    <Checkbox
                      id={`product-${product.id}`}
                      checked={promotion.selectedProducts?.includes(product.id)}
                      onCheckedChange={() => toggleProduct(product.id)}
                    />
                    <Label htmlFor={`product-${product.id}`} className="text-sm cursor-pointer">
                      {product.name} - ${product.price}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bebidas */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Bebidas</h3>
            
            <div className="mb-4">
              <Label>Tipo de Bebidas</Label>
              <Select
                value={promotion.beverageType}
                onValueChange={(value: 'choice' | 'fixed') => 
                  setPromotion(prev => ({ ...prev, beverageType: value }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="choice">Bebidas a elección</SelectItem>
                  <SelectItem value="fixed">Bebida fija</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                {promotion.beverageType === 'choice' ? 'Bebidas disponibles:' : 'Bebida seleccionada:'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBeverageSelector(!showBeverageSelector)}
              >
                {showBeverageSelector ? 'Ocultar' : 'Seleccionar'}
              </Button>
            </div>

            <div className="text-sm text-gray-500 mb-2">
              {getSelectedBeverageNames()}
            </div>

            {showBeverageSelector && (
              <div className="border rounded-lg p-3 max-h-40 overflow-y-auto">
                {beverages.length > 0 ? (
                  beverages.map(beverage => (
                    <div key={beverage.id} className="flex items-center space-x-2 py-1">
                      <Checkbox
                        id={`beverage-${beverage.id}`}
                        checked={promotion.selectedBeverages?.includes(beverage.id)}
                        onCheckedChange={() => toggleBeverage(beverage.id)}
                      />
                      <Label htmlFor={`beverage-${beverage.id}`} className="text-sm cursor-pointer">
                        {beverage.name} - ${beverage.price}
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No hay bebidas disponibles</p>
                )}
              </div>
            )}
          </div>

          {/* Estado activo */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={promotion.isActive}
              onCheckedChange={(checked) => 
                setPromotion(prev => ({ ...prev, isActive: checked as boolean }))
              }
            />
            <Label htmlFor="isActive">Promoción activa</Label>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Crear Promoción
          </Button>
        </div>
      </div>
    </div>
  )
}
