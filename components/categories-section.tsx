"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  FolderOpen, 
  ChevronUp, 
  ChevronDown, 
  Plus, 
  Upload,
  Heart,
  Eye,
  Edit3,
  Star,
  ShoppingCart
} from 'lucide-react'
import { Product } from '@/components/shop/types'
import { useAdmin } from '@/lib/admin-context'
import { BulkUploadProducts } from '@/components/bulk-upload-products'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Category {
  id: string
  name: string
  description: string
  isExpanded: boolean
  products: Product[]
  isActive: boolean
}

interface CategoriesSectionProps {
  categories: Category[]
  onAddCategory: (category: Category) => void
  onToggleCategory: (categoryId: string) => void
  onAddProductToCategory: (categoryId: string, product: Product) => void
  availableProducts: Product[]
  showAddButton?: boolean
  onShowAddModal?: () => void
  onAddToCart?: (product: Product) => void
}

export function CategoriesSection({ 
  categories, 
  onAddCategory, 
  onToggleCategory,
  onAddProductToCategory,
  availableProducts,
  showAddButton,
  onShowAddModal,
  onAddToCart
}: CategoriesSectionProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false)
  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryDescription, setNewCategoryDescription] = useState('')
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    brand: '',
    image: '/placeholder.jpg',
    rating: '4.0',
    reviews: '0',
    inStock: true,
    features: ''
  })
  const { isAdminMode } = useAdmin()

  const activeCategories = categories.filter(c => c.isActive)

  // Cargar estado de expansión desde localStorage
  useEffect(() => {
    const savedStates = localStorage.getItem('categories-expanded')
    if (savedStates) {
      const states = JSON.parse(savedStates)
      Object.entries(states).forEach(([categoryId, isExpanded]) => {
        // Actualizar el estado de expansión de cada categoría
        if (categories.find(c => c.id === categoryId)) {
          onToggleCategory(categoryId)
        }
      })
    }
  }, [])

  // Guardar estado de expansión en localStorage
  const handleToggleCategory = (categoryId: string) => {
    onToggleCategory(categoryId)
    
    const savedStates = localStorage.getItem('categories-expanded') || '{}'
    const states = JSON.parse(savedStates)
    const category = categories.find(c => c.id === categoryId)
    
    if (category) {
      states[categoryId] = !category.isExpanded
      localStorage.setItem('categories-expanded', JSON.stringify(states))
    }
  }

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return

    const newCategory: Category = {
      id: `category-${Date.now()}`,
      name: newCategoryName.trim(),
      description: newCategoryDescription.trim(),
      isExpanded: true,
      products: [],
      isActive: true
    }

    await onAddCategory(newCategory)
    setNewCategoryName('')
    setNewCategoryDescription('')
    setShowAddModal(false)
  }

  const handleAddProductToCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId)
    setShowAddProductModal(true)
  }

  const handleBulkUploadToCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId)
    setShowBulkUploadModal(true)
  }

  const handleSaveProduct = async () => {
    if (!newProduct.name.trim() || !newProduct.price) return

    const selectedCategory = categories.find(c => c.id === selectedCategoryId)
    if (!selectedCategory) return

    const product: Product = {
      id: `product-${Date.now()}`,
      name: newProduct.name.trim(),
      brand: newProduct.brand.trim() || 'Sin marca',
      price: parseFloat(newProduct.price) || 0,
      image: newProduct.image.trim() || '/placeholder.jpg',
      rating: parseFloat(newProduct.rating) || 4.0,
      reviews: parseInt(newProduct.reviews) || 0,
      category: selectedCategory.name.toLowerCase(),
      inStock: newProduct.inStock,
      description: newProduct.description.trim() || '',
      features: newProduct.features ? newProduct.features.split(',').map(f => f.trim()).filter(Boolean) : []
    }

    await onAddProductToCategory(selectedCategoryId, product)
    
    // Reset form
    setNewProduct({
      name: '',
      description: '',
      price: '',
      brand: '',
      image: '/placeholder.jpg',
      rating: '4.0',
      reviews: '0',
      inStock: true,
      features: ''
    })
    setShowAddProductModal(false)
  }

  const handleBulkProductsUploaded = async (products: any[]) => {
    const selectedCategory = categories.find(c => c.id === selectedCategoryId)
    if (!selectedCategory) return

    // Agregar la categoría automáticamente a cada producto
    const productsWithCategory = products.map(product => ({
      ...product,
      category: selectedCategory.name.toLowerCase()
    }))

    // Agregar cada producto a la categoría
    for (const product of productsWithCategory) {
      await onAddProductToCategory(selectedCategoryId, product)
    }

    setShowBulkUploadModal(false)
  }

  return (
    <div className="mb-8">
      {/* Header de la sección */}
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex justify-between items-center">
          
          {showAddButton && (
            <Button 
              onClick={() => onShowAddModal ? onShowAddModal() : setShowAddModal(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Categoría
            </Button>
          )}
        </div>
      </div>

      {/* Lista de categorías */}
      {activeCategories.length > 0 ? (
        <div className="space-y-4">
          {activeCategories.map((category) => (
            <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Header de la categoría */}
              <div 
                className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 cursor-pointer hover:from-gray-100 hover:to-gray-200 transition-all duration-200"
                onClick={() => handleToggleCategory(category.id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <FolderOpen className="h-5 w-5 text-gray-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                      {category.description && (
                        <p className="text-sm text-gray-600">{category.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-gray-600">
                    {category.isExpanded ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </div>
              </div>

              {/* Contenido de la categoría */}
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                category.isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="p-4 bg-white">
                  {category.products.length > 0 ? (
                    <div className="space-y-3">
                      {category.products.map((product) => (
                        <div key={product.id} className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                          <div className="flex items-center space-x-4">
                            {/* Imagen del producto */}
                            <div className="relative flex-shrink-0">
                              <img 
                                src={product.image || '/placeholder.jpg'} 
                                alt={product.name}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                              {/* Badge de descuento */}
                              {product.originalPrice && product.originalPrice > product.price && (
                                <div className="absolute -top-2 -left-2">
                                  <span className="bg-blue-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-md">
                                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {/* Información del producto */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  {/* Nombre y marca */}
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h4 className="font-semibold text-gray-900 text-sm truncate">
                                      {product.name}
                                    </h4>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                      {product.brand || 'Sin marca'}
                                    </span>
                                  </div>
                                  
                                  {/* Descripción */}
                                  {product.description && (
                                    <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                                      {product.description}
                                    </p>
                                  )}
                                  
                                  {/* Características */}
                                  {product.features && product.features.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-2">
                                      {product.features.slice(0, 2).map((feature, index) => (
                                        <span
                                          key={index}
                                          className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                                        >
                                          {feature}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                  
                                  {/* Rating */}
                                  <div className="flex items-center space-x-2">
                                    <div className="flex items-center space-x-1">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                          key={star}
                                          className={`h-3 w-3 ${
                                            star <= product.rating
                                              ? 'text-yellow-400 fill-current'
                                              : 'text-gray-300'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-xs text-gray-500">({product.reviews || 0})</span>
                                  </div>
                                </div>
                                
                                {/* Precio y acciones */}
                                <div className="flex flex-col items-end space-y-2 ml-4">
                                  {/* Precio */}
                                  <div className="text-right">
                                    <div className="text-lg font-bold text-blue-600">
                                      ${product.price.toFixed(2)}
                                    </div>
                                    {product.originalPrice && product.originalPrice > product.price && (
                                      <div className="text-sm text-gray-500 line-through">
                                        ${product.originalPrice.toFixed(2)}
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Botones de acción */}
                                  <div className="flex items-center space-x-2">
                                    <button className="p-2 text-gray-400 hover:text-pink-500 transition-colors">
                                      <Heart className="h-4 w-4" />
                                    </button>
                                    <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                                      <Eye className="h-4 w-4" />
                                    </button>
                                    {isAdminMode && (
                                      <button className="p-2 text-gray-400 hover:text-green-500 transition-colors">
                                        <Edit3 className="h-4 w-4" />
                                      </button>
                                    )}
                                                                         <button 
                                       onClick={() => onAddToCart?.(product)}
                                       className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
                                     >
                                       <ShoppingCart className="h-3 w-3" />
                                       <span>Agregar</span>
                                     </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Botón para agregar más productos */}
                      {isAdminMode && (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-between hover:border-gray-400 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Plus className="h-6 w-6 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Agregar más productos</p>
                              <p className="text-xs text-gray-400">Individual o carga masiva</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleAddProductToCategory(category.id)}
                              className="flex items-center space-x-1"
                            >
                              <Plus className="h-4 w-4" />
                              <span>Individual</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleBulkUploadToCategory(category.id)}
                              className="flex items-center space-x-1"
                            >
                              <Upload className="h-4 w-4" />
                              <span>Masiva</span>
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FolderOpen className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>No hay productos en esta categoría</p>
                      {isAdminMode && (
                        <div className="flex justify-center space-x-2 mt-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleAddProductToCategory(category.id)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Agregar Producto
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleBulkUploadToCategory(category.id)}
                          >
                            <Upload className="h-4 w-4 mr-1" />
                            Carga Masiva
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-400 mb-4">
            <FolderOpen className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No hay categorías creadas
          </h3>
          <p className="text-gray-500 mb-4">
            Crea tu primera categoría para organizar tus productos
          </p>
          {isAdminMode && (
            <Button 
              onClick={() => setShowAddModal(true)}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear Primera Categoría
            </Button>
          )}
        </div>
      )}

      {/* Modal para agregar categoría */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Crear Nueva Categoría</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Categoría *
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ej: Electrónicos, Ropa, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Describe la categoría..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowAddModal(false)}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim()}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                Crear Categoría
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar producto individual */}
      {showAddProductModal && (
        <Dialog open={showAddProductModal} onOpenChange={setShowAddProductModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Producto a {categories.find(c => c.id === selectedCategoryId)?.name}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Precio
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="brand" className="text-right">
                  Marca
                </Label>
                <Input
                  id="brand"
                  value={newProduct.brand}
                  onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">
                  URL de Imagen
                </Label>
                <Input
                  id="image"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rating" className="text-right">
                  Calificación
                </Label>
                <Input
                  id="rating"
                  type="number"
                  value={newProduct.rating}
                  onChange={(e) => setNewProduct({ ...newProduct, rating: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reviews" className="text-right">
                  Reseñas
                </Label>
                <Input
                  id="reviews"
                  type="number"
                  value={newProduct.reviews}
                  onChange={(e) => setNewProduct({ ...newProduct, reviews: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="inStock" className="text-right">
                  En Stock
                </Label>
                <input
                  type="checkbox"
                  id="inStock"
                  checked={newProduct.inStock}
                  onChange={(e) => setNewProduct({ ...newProduct, inStock: e.target.checked })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Descripción
                </Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="features" className="text-right">
                  Características (separadas por coma)
                </Label>
                <Textarea
                  id="features"
                  value={newProduct.features}
                  onChange={(e) => setNewProduct({ ...newProduct, features: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowAddProductModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveProduct} disabled={!newProduct.name.trim() || !newProduct.price}>
                Agregar Producto
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal para carga masiva de productos */}
      {showBulkUploadModal && (
        <BulkUploadProducts
          onProductsUploaded={handleBulkProductsUploaded}
          onClose={() => setShowBulkUploadModal(false)}
          prefillCategory={categories.find(c => c.id === selectedCategoryId)?.name || ''}
          existingCategories={categories.map(c => c.name)}
        />
      )}
    </div>
  )
}
