"use client"

import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Search, Filter, ChevronDown } from 'lucide-react'

interface ShopFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  priceRange: number[]
  setPriceRange: (range: number[]) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  categories: string[]
  sortBy: string
  setSortBy: (sort: string) => void
  sortOptions: { value: string; label: string }[]
  resultsText: string
  filteredProductsCount: number
  totalProductsCount: number
}

export function ShopFilters({
  searchTerm,
  setSearchTerm,
  priceRange,
  setPriceRange,
  selectedCategory,
  setSelectedCategory,
  categories,
  sortBy,
  setSortBy,
  sortOptions,
  resultsText,
  filteredProductsCount,
  totalProductsCount
}: ShopFiltersProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="text-sm text-gray-600">
        {resultsText
          .replace('{count}', filteredProductsCount.toString())
          .replace('{total}', totalProductsCount.toString())}
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  )
}
