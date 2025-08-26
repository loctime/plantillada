"use client"

import { useState, useEffect, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { ImageUpload } from '@/components/image-upload'
import { Product } from './types'
import { X, Save, Upload, Link } from 'lucide-react'
import { generateUniqueId } from '@/lib/utils'

interface Category {
  id: string
  name: string
  description: string
  isExpanded: boolean
  products: Product[]
  isActive: boolean
}

interface ProductEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (product: Product) => void
  product: Product | null
  categories: Category[] // Cambiado de string[] a Category[]
}

export function ProductEditModal({ 
  isOpen, 
  onClose, 
  onSave, 
  product, 
  categories 
}: ProductEditModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    id: '',
    name: '',
    brand: '',
    price: 0,
    originalPrice: 0,
    image: '',
    rating: 0,
    reviews: 0,
    category: '',
    inStock: true,
    description: '',
    features: []
  })
  const [features, setFeatures] = useState<string>('')
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Obtener nombres de categorías para el selector (memoizado)
  const categoryNames = useMemo(() => 
    categories
      .filter(cat => cat.isActive)
      .map(cat => cat.name)
      .sort(),
    [categories]
  )

  // Inicializar formulario cuando se abre el modal
  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        features: [...product.features]
      })
      setFeatures(product.features.join(', '))
    } else {
      // Nuevo producto - Usar función utilitaria para ID único
      setFormData({
        id: generateUniqueId('product'),
        name: '',
        brand: '',
        price: 0,
        originalPrice: 0,
        image: '',
        rating: 0,
        reviews: 0,
        category: categoryNames[0] || '',
        inStock: true,
        description: '',
        features: []
      })
      setFeatures('')
    }
  }, [product, categoryNames])

  const handleInputChange = (field: keyof Product, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFeaturesChange = (value: string) => {
    setFeatures(value)
    const featuresArray = value.split(',').map(f => f.trim()).filter(f => f.length > 0)
    setFormData(prev => ({
      ...prev,
      features: featuresArray
    }))
  }

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({
      ...prev,
      image: url
    }))
    setShowImageUpload(false)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.brand || formData.price <= 0) {
      alert('Por favor completa los campos obligatorios: Nombre, Marca y Precio')
      return
    }

    setIsSaving(true)
    try {
      const productToSave: Product = {
        id: formData.id || `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: formData.name || '',
        brand: formData.brand || '',
        price: formData.price || 0,
        originalPrice: formData.originalPrice || 0,
        image: formData.image || '',
        rating: formData.rating || 0,
        reviews: formData.reviews || 0,
        category: formData.category || '',
        inStock: formData.inStock || true,
        description: formData.description || '',
        features: formData.features || []
      }

      await onSave(productToSave)
      onClose()
    } catch (error) {
      console.error('Error guardando producto:', error)
      alert('Error al guardar el producto')
    } finally {
      setIsSaving(false)
    }
  }

  const handleClose = () => {
    if (!isSaving) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{product ? 'Editar Producto' : 'Nuevo Producto'}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={isSaving}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre del Producto *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ej: iPhone 15 Pro"
              />
            </div>
            
            <div>
              <Label htmlFor="brand">Marca *</Label>
              <Input
                id="brand"
                value={formData.brand || ''}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                placeholder="Ej: Apple"
              />
            </div>
          </div>

          {/* Precios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Precio Actual *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price || ''}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
            
            <div>
              <Label htmlFor="originalPrice">Precio Original (opcional)</Label>
              <Input
                id="originalPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.originalPrice || ''}
                onChange={(e) => handleInputChange('originalPrice', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Categoría y Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Categoría</Label>
              <Select
                value={formData.category || ''}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categoryNames.map((categoryName) => (
                    <SelectItem key={categoryName} value={categoryName}>
                      {categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="inStock"
                checked={formData.inStock || false}
                onCheckedChange={(checked) => handleInputChange('inStock', checked)}
              />
              <Label htmlFor="inStock">En Stock</Label>
            </div>
          </div>

          {/* Calificaciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rating">Calificación (0-5)</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating || ''}
                onChange={(e) => handleInputChange('rating', parseFloat(e.target.value) || 0)}
                placeholder="4.5"
              />
            </div>
            
            <div>
              <Label htmlFor="reviews">Número de Reseñas</Label>
              <Input
                id="reviews"
                type="number"
                min="0"
                value={formData.reviews || ''}
                onChange={(e) => handleInputChange('reviews', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe el producto..."
              rows={3}
            />
          </div>

          {/* Características */}
          <div>
            <Label htmlFor="features">Características (separadas por comas)</Label>
            <Input
              id="features"
              value={features}
              onChange={(e) => handleFeaturesChange(e.target.value)}
              placeholder="Ej: 128GB, 5G, Cámara Pro"
            />
          </div>

          {/* Imagen */}
          <div>
            <Label>Imagen del Producto</Label>
            <div className="space-y-4">
              {/* Vista previa de la imagen */}
              {formData.image && (
                <div className="relative">
                  <img
                    src={formData.image}
                    alt="Vista previa"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0"
                    onClick={() => handleInputChange('image', '')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}

              {/* Opciones para agregar imagen */}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowImageUpload(true)}
                  className="flex items-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>Subir Imagen</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    const url = prompt('Ingresa la URL de la imagen:')
                    if (url) {
                      handleInputChange('image', url)
                    }
                  }}
                  className="flex items-center space-x-2"
                >
                  <Link className="h-4 w-4" />
                  <span>URL de Imagen</span>
                </Button>
              </div>

              {/* Input directo para URL */}
              <div className="flex items-center gap-2">
                <Input
                  value={formData.image || ''}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="flex-1"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowImageUpload(true)}
                  className="h-10 w-10 p-0 bg-blue-50 hover:bg-blue-100 border-blue-200"
                  title="Subir imagen"
                >
                  <Upload className="h-4 w-4 text-blue-600" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Guardando...' : 'Guardar Producto'}</span>
          </Button>
        </div>

        {/* Modal de subida de imagen */}
        {showImageUpload && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowImageUpload(false)}
          >
            <div 
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Subir Imagen</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowImageUpload(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <ImageUpload
                onUpload={handleImageUpload}
                onCancel={() => setShowImageUpload(false)}
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
