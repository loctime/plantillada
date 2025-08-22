"use client"

import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Search, Filter, ChevronDown, Star, X } from 'lucide-react'
import { useState } from 'react'

interface ShopFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  priceRange: number[]
  setPriceRange: (range: number[]) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  categories: string[]
  selectedRating: number
  setSelectedRating: (rating: number) => void
  sortBy: string
  setSortBy: (sort: string) => void
  sortOptions: { value: string; label: string }[]
  resultsText: string
  filteredProductsCount: number
  totalProductsCount: number
  onClearFilters: () => void
}

export function ShopFilters({
  searchTerm,
  setSearchTerm,
  priceRange,
  setPriceRange,
  selectedCategory,
  setSelectedCategory,
  categories,
  selectedRating,
  setSelectedRating,
  sortBy,
  setSortBy,
  sortOptions,
  resultsText,
  filteredProductsCount,
  totalProductsCount,
  onClearFilters
}: ShopFiltersProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const hasActiveFilters = selectedCategory !== 'all' || selectedRating > 0 || priceRange[0] > 0 || priceRange[1] < 1500

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      {/* Filtros principales */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4">
        {/* Búsqueda */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Categoría */}
        <div className="relative min-w-[150px]">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          >
            <option value="all">Todas las categorías</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Ordenar */}
        <div className="relative min-w-[150px]">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Botón de filtros avanzados */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className={`flex items-center gap-2 ${hasActiveFilters ? 'border-blue-500 text-blue-600' : ''}`}
        >
          <Filter className="h-4 w-4" />
          Filtros
          {hasActiveFilters && (
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          )}
        </Button>

        {/* Resultados */}
        <div className="text-sm text-gray-600 whitespace-nowrap">
          {resultsText
            .replace('{count}', filteredProductsCount.toString())
            .replace('{total}', totalProductsCount.toString())}
        </div>
      </div>

      {/* Filtros avanzados */}
      {showAdvancedFilters && (
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <div className="flex flex-wrap items-center gap-6">
            {/* Rango de precios */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rango de precios
              </label>
              <div className="px-2">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={1500}
                  min={0}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Calificación */}
            <div className="min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calificación mínima
              </label>
              <div className="space-y-1">
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
                      <span className="text-xs text-gray-700 ml-1">+</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Limpiar filtros */}
            <div className="flex items-end">
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Limpiar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
