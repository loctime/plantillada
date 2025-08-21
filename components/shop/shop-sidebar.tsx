"use client"

import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'

interface ShopSidebarProps {
  priceRange: number[]
  setPriceRange: (range: number[]) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  categories: string[]
  selectedRating: number
  setSelectedRating: (rating: number) => void
  onClearFilters: () => void
}

export function ShopSidebar({
  priceRange,
  setPriceRange,
  selectedCategory,
  setSelectedCategory,
  categories,
  selectedRating,
  setSelectedRating,
  onClearFilters
}: ShopSidebarProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <aside className="w-64 bg-white p-6 border-r">
      <div className="space-y-6">
        {/* Título */}
        <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>

        {/* Categorías */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Categorías</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                value="all"
                checked={selectedCategory === 'all'}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Todas las categorías</span>
            </label>
            {categories.map(category => (
              <label key={category} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={selectedCategory === category}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Rango de precios */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Rango de precios</h3>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={1500}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Calificación */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Calificación mínima</h3>
          <div className="space-y-2">
            {[4, 3, 2, 1].map(rating => (
              <label key={rating} className="flex items-center">
                <input
                  type="radio"
                  name="rating"
                  value={rating}
                  checked={selectedRating === rating}
                  onChange={(e) => setSelectedRating(Number(e.target.value))}
                  className="mr-2"
                />
                <div className="flex items-center">
                  {renderStars(rating)}
                  <span className="text-sm text-gray-700 ml-2">y superior</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Limpiar filtros */}
        <Button
          variant="outline"
          onClick={onClearFilters}
          className="w-full"
        >
          Limpiar filtros
        </Button>
      </div>
    </aside>
  )
}
