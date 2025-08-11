"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ShoppingCart, 
  Package, 
  Plus, 
  Search, 
  Filter,
  Download,
  Upload,
  Globe,
  Settings,
  Copy,
  Trash2,
  Edit
} from "lucide-react"
import { CloningStats } from "@/components/cloning-stats"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  stock: number
  status: 'active' | 'draft' | 'out-of-stock'
  originalUrl?: string
  clonedAt?: Date
}

interface CloningStats {
  totalProducts: number
  successfulClones: number
  failedClones: number
  averageProcessingTime: number
  imagesProcessed: number
  storageUsed: number
  lastClonedAt: Date
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [cloningUrl, setCloningUrl] = useState("")
  const [isCloning, setIsCloning] = useState(false)
  const [cloningStats, setCloningStats] = useState<CloningStats>({
    totalProducts: 0,
    successfulClones: 0,
    failedClones: 0,
    averageProcessingTime: 0,
    imagesProcessed: 0,
    storageUsed: 0,
    lastClonedAt: new Date()
  })

  // Mock data - en producción vendría de la API
  const mockProducts: Product[] = [
    {
      id: "1",
      name: "Producto Ejemplo 1",
      description: "Descripción del producto clonado desde sitio externo",
      price: 29.99,
      category: "Electrónicos",
      image: "/placeholder.jpg",
      stock: 10,
      status: 'active',
      originalUrl: "https://ejemplo.com/producto/1",
      clonedAt: new Date()
    },
    {
      id: "2",
      name: "Producto Ejemplo 2",
      description: "Otro producto clonado exitosamente",
      price: 49.99,
      category: "Ropa",
      image: "/placeholder.jpg",
      stock: 5,
      status: 'active',
      originalUrl: "https://ejemplo.com/producto/2",
      clonedAt: new Date()
    }
  ]

  const categories = ["all", "Electrónicos", "Ropa", "Hogar", "Deportes"]

  useEffect(() => {
    setProducts(mockProducts)
    loadCloningStats()
  }, [])

  const loadCloningStats = async () => {
    try {
      const response = await fetch('/api/cloning-stats')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setCloningStats({
            totalProducts: result.stats.totalProducts,
            successfulClones: result.stats.successfulClones,
            failedClones: result.stats.failedClones,
            averageProcessingTime: result.stats.averageProcessingTime,
            imagesProcessed: result.stats.imagesProcessed,
            storageUsed: result.stats.storageUsed,
            lastClonedAt: new Date(result.stats.lastClonedAt)
          })
        }
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error)
      // Fallback a datos mock
      setCloningStats({
        totalProducts: mockProducts.length,
        successfulClones: mockProducts.length,
        failedClones: 0,
        averageProcessingTime: 2.5,
        imagesProcessed: mockProducts.length * 3,
        storageUsed: 15.2,
        lastClonedAt: new Date()
      })
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCloneProduct = async () => {
    if (!cloningUrl.trim()) return
    
    setIsCloning(true)
    try {
      const response = await fetch('/api/clone-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: cloningUrl }),
      })
      
      const result = await response.json()
      
      if (response.ok && result.success) {
        const clonedProduct: Product = {
          id: result.product.id,
          name: result.product.name,
          description: result.product.description,
          price: result.product.price,
          category: result.product.category || 'Sin categoría',
          image: result.product.images[0] || "/placeholder.jpg",
          stock: Math.floor(Math.random() * 20) + 1,
          status: 'active',
          originalUrl: result.product.originalUrl,
          clonedAt: new Date(result.product.clonedAt)
        }
        
        setProducts([...products, clonedProduct])
        setCloningUrl("")
        
        // Actualizar estadísticas
        setCloningStats(prev => ({
          ...prev,
          totalProducts: prev.totalProducts + 1,
          successfulClones: prev.successfulClones + 1,
          imagesProcessed: prev.imagesProcessed + result.product.images.length,
          lastClonedAt: new Date()
        }))
        
        // Registrar actividad
        await fetch('/api/cloning-stats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'product_cloned',
            details: `Producto "${clonedProduct.name}" clonado desde ${cloningUrl}`
          })
        })
        
      } else {
        throw new Error(result.error || 'Error al clonar producto')
      }
      
    } catch (error) {
      console.error('Error clonando producto:', error)
      setCloningStats(prev => ({
        ...prev,
        failedClones: prev.failedClones + 1
      }))
      
      // Registrar error
      await fetch('/api/cloning-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'clone_failed',
          details: `Error al clonar desde ${cloningUrl}: ${error instanceof Error ? error.message : 'Error desconocido'}`
        })
      })
    } finally {
      setIsCloning(false)
    }
  }

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId))
    setCloningStats(prev => ({
      ...prev,
      totalProducts: prev.totalProducts - 1
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tienda Online</h1>
          <p className="text-muted-foreground">
            Gestiona tu catálogo de productos y configura la tienda
          </p>
        </div>

        {/* Stats Component */}
        <div className="mb-8">
          <CloningStats />
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="cloning">Clonación</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            {/* Actions */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === "all" ? "Todas las categorías" : category}
                    </option>
                  ))}
                </select>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Producto
              </Button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                        {product.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-lg">€{product.price}</span>
                      <span className="text-sm text-muted-foreground">
                        Stock: {product.stock}
                      </span>
                    </div>
                    {product.originalUrl && (
                      <div className="text-xs text-muted-foreground mb-3">
                        Clonado desde: {product.originalUrl}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Copy className="h-3 w-3 mr-1" />
                        Clonar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay productos</h3>
                  <p className="text-muted-foreground mb-4">
                    Comienza agregando tu primer producto o clonando desde otro sitio
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Producto
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="cloning" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Clonación de Productos
                </CardTitle>
                <CardDescription>
                  Clona automáticamente productos desde sitios web externos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cloningUrl">URL del Producto a Clonar</Label>
                  <div className="flex gap-2">
                    <Input
                      id="cloningUrl"
                      type="url"
                      placeholder="https://ejemplo.com/producto/123"
                      value={cloningUrl}
                      onChange={(e) => setCloningUrl(e.target.value)}
                    />
                    <Button 
                      onClick={handleCloneProduct}
                      disabled={isCloning || !cloningUrl.trim()}
                    >
                      {isCloning ? (
                        <>
                          <Upload className="h-4 w-4 mr-2 animate-spin" />
                          Clonando...
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Clonar
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Ingresa la URL de cualquier producto de e-commerce para clonarlo automáticamente
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Estadísticas de Clonación</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Productos clonados:</span>
                        <span className="font-medium">{cloningStats.successfulClones}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fallos:</span>
                        <span className="font-medium text-red-600">{cloningStats.failedClones}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tiempo promedio:</span>
                        <span className="font-medium">{cloningStats.averageProcessingTime}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Última clonación:</span>
                        <span className="font-medium">
                          {cloningStats.lastClonedAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Características del Sistema</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Extracción automática de datos</li>
                      <li>• Procesamiento de imágenes</li>
                      <li>• Rate limiting inteligente</li>
                      <li>• Respeto a robots.txt</li>
                      <li>• Optimización automática</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuración de la Tienda
                </CardTitle>
                <CardDescription>
                  Configura los parámetros de tu tienda online
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Aquí podrás configurar la moneda, impuestos, métodos de pago,
                  zonas de envío y otras configuraciones de la tienda.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
