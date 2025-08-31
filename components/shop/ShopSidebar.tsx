"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Filter, 
  X,
  ChevronDown,
  ChevronUp,
  Star,
  DollarSign
} from "lucide-react"

interface ShopSidebarProps {
  categories: string[]
  isOpen: boolean
  onClose: () => void
  onCategorySelect?: (category: string) => void
  onPriceRangeChange?: (min: number, max: number) => void
  onRatingFilter?: (rating: number) => void
  className?: string
}

export function ShopSidebar({
  categories,
  isOpen,
  onClose,
  onCategorySelect,
  onPriceRangeChange,
  onRatingFilter,
  className = ""
}: ShopSidebarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos")
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
  const [selectedRating, setSelectedRating] = useState<number>(0)
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    rating: true
  })

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    onCategorySelect?.(category)
  }

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || 0
    const newRange = { ...priceRange, [type]: numValue }
    setPriceRange(newRange)
    onPriceRangeChange?.(newRange.min, newRange.max)
  }

  const handleRatingSelect = (rating: number) => {
    setSelectedRating(rating)
    onRatingFilter?.(rating)
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay para móviles */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${className}
      `}>
        
        {/* Header del Sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Filtros</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Contenido del Sidebar */}
        <div className="p-4 space-y-6 overflow-y-auto h-full">
          
          {/* Categorías */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('categories')}
              className="flex items-center justify-between w-full text-left font-medium text-gray-900"
            >
              Categorías
              {expandedSections.categories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            
            {expandedSections.categories && (
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Rango de Precios */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full text-left font-medium text-gray-900"
            >
              Rango de Precios
              {expandedSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            
            {expandedSections.price && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Mín"
                    value={priceRange.min}
                    onChange={(e) => handlePriceChange('min', e.target.value)}
                    className="text-sm"
                  />
                  <span className="text-gray-500">-</span>
                  <Input
                    type="number"
                    placeholder="Máx"
                    value={priceRange.max}
                    onChange={(e) => handlePriceChange('max', e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="h-4 w-4" />
                  <span>${priceRange.min} - ${priceRange.max}</span>
                </div>
              </div>
            )}
          </div>

          {/* Calificación */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('rating')}
              className="flex items-center justify-between w-full text-left font-medium text-gray-900"
            >
              Calificación
              {expandedSections.rating ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            
            {expandedSections.rating && (
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRatingSelect(rating)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedRating === rating
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      {renderStars(rating)}
                    </div>
                    <span>y más</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filtros Activos */}
          {(selectedCategory !== "Todos" || selectedRating > 0 || priceRange.min > 0 || priceRange.max < 1000) && (
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-900">Filtros Activos</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCategory !== "Todos" && (
                  <Badge variant="secondary" className="text-xs">
                    {selectedCategory}
                    <button
                      onClick={() => handleCategorySelect("Todos")}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {selectedRating > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {selectedRating}+ estrellas
                    <button
                      onClick={() => handleRatingSelect(0)}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {(priceRange.min > 0 || priceRange.max < 1000) && (
                  <Badge variant="secondary" className="text-xs">
                    ${priceRange.min}-${priceRange.max}
                    <button
                      onClick={() => {
                        setPriceRange({ min: 0, max: 1000 })
                        onPriceRangeChange?.(0, 1000)
                      }}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCategory("Todos")
                  setSelectedRating(0)
                  setPriceRange({ min: 0, max: 1000 })
                  onCategorySelect?.("Todos")
                  onRatingFilter?.(0)
                  onPriceRangeChange?.(0, 1000)
                }}
                className="w-full"
              >
                Limpiar Filtros
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
