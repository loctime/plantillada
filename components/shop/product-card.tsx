"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, Heart, Eye, Edit3 } from 'lucide-react'
import { useAdmin } from '@/lib/admin-context'
import { useImageModal } from '@/hooks/use-image-modal'
import { Product } from './types'

interface ProductCardProps {
  product: Product
  layoutConfig: any
  onAddToCart?: (product: Product) => void
}

export function ProductCard({ product, layoutConfig, onAddToCart }: ProductCardProps) {
  const { isAdminMode } = useAdmin()
  const { openImageModal } = useImageModal()

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

  return (
    <Card className="product-card group hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="relative group">
          <img
            src={product.image}
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
          {/* Botón para editar imagen (solo en modo admin) */}
          {isAdminMode && (
            <Button
              size="sm"
              variant="secondary"
              className="absolute bottom-2 right-2 h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => openImageModal(product)}
            >
              <Edit3 className="h-4 w-4" />
            </Button>
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
          
          <Button 
            className="w-full mt-2" 
            disabled={!product.inStock}
            onClick={() => onAddToCart?.(product)}
          >
            {product.inStock ? 'Agregar al Carrito' : 'Sin Stock'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
