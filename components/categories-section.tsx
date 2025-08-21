"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, ChevronDown, ChevronUp, FolderOpen } from 'lucide-react'
import { Product } from '@/components/shop/types'
import { useAdmin } from '@/lib/admin-context'

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
}

export function CategoriesSection({ 
  categories, 
  onAddCategory, 
  onToggleCategory,
  onAddProductToCategory,
  availableProducts 
}: CategoriesSectionProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryDescription, setNewCategoryDescription] = useState('')
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

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return

    const newCategory: Category = {
      id: `category-${Date.now()}`,
      name: newCategoryName.trim(),
      description: newCategoryDescription.trim(),
      isExpanded: true,
      products: [],
      isActive: true
    }

    onAddCategory(newCategory)
    setNewCategoryName('')
    setNewCategoryDescription('')
    setShowAddModal(false)
  }

  return (
    <div className="mb-8">
      {/* Header de la sección */}
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Categorías de Productos</h2>
            <p className="text-gray-600">Organiza tus productos por categorías</p>
          </div>
          {isAdminMode && (
            <Button 
              onClick={() => setShowAddModal(true)}
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
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4">
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleCategory(category.id)}
                    className="text-gray-600 hover:text-gray-800 hover:bg-gray-200"
                  >
                    {category.isExpanded ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Contenido de la categoría */}
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                category.isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="p-4 bg-white">
                  {category.products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.products.map((product) => (
                        <div key={product.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{product.name}</h4>
                              <p className="text-sm text-gray-600">${product.price}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FolderOpen className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>No hay productos en esta categoría</p>
                      {isAdminMode && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => {/* TODO: Implementar agregar productos */}}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Agregar Productos
                        </Button>
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
    </div>
  )
}
