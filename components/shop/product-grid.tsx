"use client"

import { ProductCard } from './product-card'
import { Product } from './types'

interface ProductGridProps {
  products: Product[]
  layoutConfig: any
  onAddToCart?: (product: Product) => void
}

export function ProductGrid({ products, layoutConfig, onAddToCart }: ProductGridProps) {
  console.log('📦 ProductGrid render - Products count:', products.length)
  
  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          layoutConfig={layoutConfig}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  )
}
