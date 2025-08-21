"use client"

import { useState, useEffect } from 'react'
import { Config, loadConfig } from '@/lib/config-loader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingCart, 
  Star, 
  Heart,
  Eye,
  ShoppingBag
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Product {
  id: string
  name: string
  brand: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  category: string
  inStock: boolean
  description: string
  features: string[]
}

export function ShopSection() {
  const [config, setConfig] = useState<Config | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadShopConfig = async () => {
      try {
        const siteConfig = await loadConfig()
        setConfig(siteConfig)
        if (siteConfig.products && siteConfig.products.length > 0) {
          setProducts(siteConfig.products)
        } else {
          // Productos de ejemplo si no hay configuración
          setProducts([
            {
              id: '1',
              name: 'iPad 11th (A16)',
              brand: 'iPad',
              price: 899.00,
              originalPrice: 999.00,
              image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
              rating: 4.5,
              reviews: 128,
              category: 'tablets',
              inStock: true,
              description: 'iPad de 11 pulgadas con chip A16, perfecto para productividad y creatividad.',
              features: ['Chip A16 Bionic', '11 pulgadas', '128GB', 'WiFi + Cellular']
            },
            {
              id: '2',
              name: 'iPad Mini (A17)',
              brand: 'iPad',
              price: 599.00,
              originalPrice: 699.00,
              image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
              rating: 4.3,
              reviews: 89,
              category: 'tablets',
              inStock: true,
              description: 'iPad Mini compacto con chip A17, ideal para uso portátil.',
              features: ['Chip A17 Pro', '8.3 pulgadas', '64GB', 'WiFi']
            }
          ])
        }
      } catch (error) {
        console.log("Usando configuración por defecto de la tienda")
      } finally {
        setIsLoading(false)
      }
    }

    loadShopConfig()
  }, [])

  const handleProductClick = (product: Product) => {
    // Aquí podrías abrir un modal con detalles del producto
    // o navegar a una página específica del producto
    console.log('Producto clickeado:', product.name)
  }

  const handleAddToCart = (product: Product) => {
    // Aquí podrías implementar la lógica del carrito
    console.log('Agregado al carrito:', product.name)
  }

  if (isLoading) {
    return (
      <section className="w-full py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            {config?.shopConfig?.storeName || 'Nuestra Tienda'}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {config?.shopConfig?.storeTagline || 'Descubre nuestros productos y servicios de calidad'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card 
              key={product.id} 
              className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 space-y-2">
                  {product.originalPrice && product.originalPrice > product.price && (
                    <Badge className="bg-red-500 text-white">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </Badge>
                  )}
                  {!product.inStock && (
                    <Badge variant="secondary" className="bg-gray-500 text-white">
                      Sin Stock
                    </Badge>
                  )}
                </div>

                {/* Action buttons */}
                <div className="absolute top-3 right-3 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-8 h-8 p-0 rounded-full bg-white/80 hover:bg-white"
                    onClick={() => handleProductClick(product)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-8 h-8 p-0 rounded-full bg-white/80 hover:bg-white"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-2">
                  {/* Brand */}
                  <p className="text-sm text-muted-foreground font-medium">
                    {product.brand}
                  </p>
                  
                  {/* Name */}
                  <h3 className="font-semibold text-lg leading-tight">
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < Math.floor(product.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({product.reviews})
                    </span>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">
                      €{product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        €{product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  {/* Add to cart button */}
                  <Button
                    className="w-full mt-3"
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    {product.inStock ? 'Agregar al Carrito' : 'Sin Stock'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Ver más productos button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8">
            Ver Todos los Productos
          </Button>
        </div>
      </div>
    </section>
  )
}
