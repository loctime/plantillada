"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  X, 
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Save,
  FolderPlus,
  Edit3,
  Download,
  Upload
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Product } from '@/components/shop/types'

interface Category {
  id: string
  name: string
  description: string
  isExpanded: boolean
  products: Product[]
  isActive: boolean
}

interface BulkEditProductsProps {
  onProductsUpdated: (products: Product[], categories: Category[]) => void
  onClose: () => void
  existingProducts: Product[]
  existingCategories: Category[]
}

interface CategoryConfirmation {
  originalName: string
  finalName: string
  productCount: number
  products: any[]
}

export function BulkEditProducts({ 
  onProductsUpdated, 
  onClose, 
  existingProducts, 
  existingCategories 
}: BulkEditProductsProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [categoryConfirmations, setCategoryConfirmations] = useState<CategoryConfirmation[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  
  // Historial para deshacer
  const [history, setHistory] = useState<{ products: any[], categories: Category[] }[]>([])
  const [historyIndex, setHistoryIndex] = useState(0)
  
  const { toast } = useToast()
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  // Inicializar productos y categorías al cargar el componente
  useEffect(() => {
    // Combinar productos de la tabla principal y de las categorías
    const allProducts = [...existingProducts]
    
    // Agregar productos de las categorías
    existingCategories.forEach(category => {
      if (category.products && category.products.length > 0) {
        allProducts.push(...category.products)
      }
    })

    const formattedProducts = allProducts.map(product => ({
      id: product.id,
      nombre: product.name,
      descripcion: product.description,
      categoria: product.category,
      precio: product.price.toString(),
      marca: product.brand,
      urlImagen: product.image,
      rating: product.rating.toString(),
      reviews: product.reviews.toString(),
      enStock: product.inStock,
      caracteristicas: product.features.join(', '),
      precioOriginal: product.originalPrice?.toString() || ''
    }))

    setProducts(formattedProducts)
    setCategories(existingCategories)
    
    // Inicializar historial
    const initialState = { products: formattedProducts, categories: existingCategories }
    setHistory([initialState])
    setHistoryIndex(0)
  }, [existingProducts, existingCategories])

  // Función para detectar categorías nuevas
  const detectNewCategories = (products: any[]) => {
    const categoriesWithProducts = new Map<string, { count: number, products: any[] }>()
    
    products.forEach(product => {
      if (product.nombre?.trim() && product.categoria?.trim()) {
        const categoryName = product.categoria.trim().toLowerCase()
        const existing = categoriesWithProducts.get(categoryName)
        
        if (existing) {
          existing.count++
          existing.products.push(product)
        } else {
          categoriesWithProducts.set(categoryName, {
            count: 1,
            products: [product]
          })
        }
      }
    })
    
    // Filtrar solo las categorías que no existen
    const newCategories: CategoryConfirmation[] = []
    categoriesWithProducts.forEach((data, categoryName) => {
      const normalizedCategoryName = categoryName.toLowerCase().trim()
      
      // Comparar con las categorías existentes
      const exists = categories.some(existing => 
        existing.name.toLowerCase().trim() === normalizedCategoryName
      )
      
      if (!exists) {
        newCategories.push({
          originalName: categoryName,
          finalName: categoryName.charAt(0).toUpperCase() + categoryName.slice(1), // Capitalizar
          productCount: data.count,
          products: data.products
        })
      }
    })
    
    return newCategories
  }

  // Función para actualizar el nombre de una categoría en todos los productos relacionados
  const updateCategoryInProducts = (oldName: string, newName: string) => {
    const newProducts = products.map(product => {
      if (product.categoria?.toLowerCase() === oldName.toLowerCase()) {
        return { ...product, categoria: newName }
      }
      return product
    })
    setProducts(newProducts)
    addToHistory({ products: newProducts, categories })
  }

  const addRow = () => {
    const newProduct = {
      id: `temp-${Date.now()}`,
      nombre: '',
      descripcion: '',
      categoria: '',
      precio: '',
      marca: '',
      urlImagen: '/placeholder.jpg',
      rating: '4.0',
      reviews: '0',
      enStock: true,
      caracteristicas: '',
      precioOriginal: ''
    }
    const newProducts = [...products, newProduct]
    setProducts(newProducts)
    addToHistory({ products: newProducts, categories })
    
    // Enfocar el primer campo de la nueva fila después de un pequeño delay
    setTimeout(() => {
      const newInputRef = inputRefs.current[`${newProduct.id}-nombre`]
      if (newInputRef) {
        newInputRef.focus()
      }
    }, 100)
  }

  const removeRow = (id: string) => {
    if (products.length > 1) {
      const newProducts = products.filter(p => p.id !== id)
      setProducts(newProducts)
      addToHistory({ products: newProducts, categories })
    }
  }

  // Función para agregar al historial
  const addToHistory = (newState: { products: any[], categories: Category[] }) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(JSON.parse(JSON.stringify(newState))) // Deep copy
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  // Función para deshacer
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      const previousState = JSON.parse(JSON.stringify(history[newIndex]))
      setProducts(previousState.products)
      setCategories(previousState.categories)
      toast({
        title: 'Deshacer',
        description: 'Cambio deshecho'
      })
    }
  }

  // Función para rehacer
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      const nextState = JSON.parse(JSON.stringify(history[newIndex]))
      setProducts(nextState.products)
      setCategories(nextState.categories)
      toast({
        title: 'Rehacer',
        description: 'Cambio rehecho'
      })
    }
  }

  const updateProduct = (id: string, field: string, value: any) => {
    const newProducts = products.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    )
    setProducts(newProducts)
    addToHistory({ products: newProducts, categories })
  }

  const updateCategory = (id: string, field: string, value: any) => {
    const newCategories = categories.map(cat => 
      cat.id === id ? { ...cat, [field]: value } : cat
    )
    setCategories(newCategories)
    addToHistory({ products, categories: newCategories })
  }



  const handleKeyDown = (e: React.KeyboardEvent, productId: string, field: string) => {
    // Manejar Ctrl+Z para deshacer
    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault()
      undo()
      return
    }
    
    // Manejar Ctrl+Y para rehacer
    if (e.ctrlKey && e.key === 'y') {
      e.preventDefault()
      redo()
      return
    }
    
    if (e.key === 'Enter') {
      e.preventDefault()
      
      // Si estamos en la última fila, agregar una nueva
      const currentIndex = products.findIndex(p => p.id === productId)
      if (currentIndex === products.length - 1) {
        addRow()
      } else {
        // Si no es la última fila, mover el foco a la siguiente fila
        const nextProduct = products[currentIndex + 1]
        if (nextProduct) {
          const nextInputRef = inputRefs.current[`${nextProduct.id}-nombre`]
          if (nextInputRef) {
            nextInputRef.focus()
          }
        }
      }
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault()
      
      const currentIndex = products.findIndex(p => p.id === productId)
      const fields = ['nombre', 'descripcion', 'categoria', 'precio', 'marca', 'urlImagen', 'rating', 'reviews', 'caracteristicas', 'precioOriginal']
      const currentFieldIndex = fields.indexOf(field)
      
      let nextProductIndex = currentIndex
      let nextFieldIndex = currentFieldIndex
      
      if (e.key === 'ArrowUp') {
        if (currentIndex > 0) {
          nextProductIndex = currentIndex - 1
        }
      } else if (e.key === 'ArrowDown') {
        if (currentIndex < products.length - 1) {
          nextProductIndex = currentIndex + 1
        } else {
          // Si estamos en la última fila, agregar una nueva
          addRow()
          return
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentFieldIndex > 0) {
          nextFieldIndex = currentFieldIndex - 1
        } else if (currentIndex > 0) {
          // Ir al último campo de la fila anterior
          nextProductIndex = currentIndex - 1
          nextFieldIndex = fields.length - 1
        }
      } else if (e.key === 'ArrowRight') {
        if (currentFieldIndex < fields.length - 1) {
          nextFieldIndex = currentFieldIndex + 1
        } else if (currentIndex < products.length - 1) {
          // Ir al primer campo de la siguiente fila
          nextProductIndex = currentIndex + 1
          nextFieldIndex = 0
        } else {
          // Si estamos en la última fila y último campo, agregar una nueva fila
          addRow()
          return
        }
      }
      
      const nextProduct = products[nextProductIndex]
      const nextField = fields[nextFieldIndex]
      
      if (nextProduct && nextField) {
        const nextInputRef = inputRefs.current[`${nextProduct.id}-${nextField}`]
        if (nextInputRef) {
          nextInputRef.focus()
          // Seleccionar todo el texto para facilitar la edición
          nextInputRef.select()
        }
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent, productId: string, field: string) => {
    const pastedText = e.clipboardData.getData('text')
    
    // Verificar si el texto pegado contiene múltiples líneas
    if (pastedText.includes('\n')) {
      e.preventDefault()
      
      const lines = pastedText.split('\n').filter(line => line.trim() !== '')
      const currentIndex = products.findIndex(p => p.id === productId)
      
      if (lines.length > 1) {
        let newProducts = [...products]
        
        // Si hay suficientes filas existentes desde la posición actual, actualizar las existentes
        if (currentIndex + lines.length <= products.length) {
          // Actualizar las filas existentes desde la posición actual
          lines.forEach((line, lineIndex) => {
            const targetIndex = currentIndex + lineIndex
            if (newProducts[targetIndex]) {
              newProducts[targetIndex] = {
                ...newProducts[targetIndex],
                [field]: line.trim()
              }
            }
          })
        } else {
          // Si necesitamos más filas, crear las que faltan
          const neededRows = currentIndex + lines.length - products.length
          if (neededRows > 0) {
            for (let i = 0; i < neededRows; i++) {
              const newProduct = {
                id: `temp-${Date.now()}-${products.length + i}`,
                nombre: '',
                descripcion: '',
                categoria: '',
                precio: '',
                marca: '',
                urlImagen: '/placeholder.jpg',
                rating: '4.0',
                reviews: '0',
                enStock: true,
                caracteristicas: '',
                precioOriginal: ''
              }
              newProducts.push(newProduct)
            }
          }
          
          // Ahora actualizar las filas desde la posición actual
          lines.forEach((line, lineIndex) => {
            const targetIndex = currentIndex + lineIndex
            if (newProducts[targetIndex]) {
              newProducts[targetIndex] = {
                ...newProducts[targetIndex],
                [field]: line.trim()
              }
            }
          })
        }
        
        setProducts(newProducts)
        addToHistory({ products: newProducts, categories })
        
        // Mostrar notificación
        toast({
          title: 'Datos pegados',
          description: `${lines.length} líneas pegadas desde la posición ${currentIndex + 1}`
        })
      }
    }
  }

  const validateProducts = (products: any[]): string[] => {
    const errors: string[] = []
    
    products.forEach((product, index) => {
      const rowNumber = index + 1
      
      if (!product.nombre?.trim()) {
        errors.push(`Fila ${rowNumber}: Nombre es requerido`)
      }
      if (!product.precio || parseFloat(product.precio) <= 0) {
        errors.push(`Fila ${rowNumber}: Precio debe ser mayor a 0`)
      }
    })
    
    return errors
  }

  const handleSave = () => {
    const errors = validateProducts(products)
    setValidationErrors(errors)
    
    if (errors.length > 0) {
      toast({
        title: 'Errores de validación',
        description: `Se encontraron ${errors.length} errores. Revisa los detalles.`,
        variant: 'destructive'
      })
      return
    }

    // Detectar categorías nuevas
    const newCategories = detectNewCategories(products)
    
    if (newCategories.length > 0) {
      // Mostrar modal de confirmación de categorías
      setCategoryConfirmations(newCategories)
      setShowCategoryModal(true)
    } else {
      // No hay categorías nuevas, proceder directamente
      proceedWithSave()
    }
  }

  const proceedWithSave = () => {
    setIsProcessing(true)

    // Obtener productos de la tabla principal
    const formattedProducts: Product[] = products
      .filter(product => product.nombre?.trim()) // Solo productos con nombre
      .map(product => ({
        id: product.id,
        name: product.nombre.trim(),
        brand: product.marca?.trim() || 'Sin marca',
        price: parseFloat(product.precio) || 0,
        originalPrice: product.precioOriginal && parseFloat(product.precioOriginal) > parseFloat(product.precio) ? parseFloat(product.precioOriginal) : undefined,
        image: product.urlImagen?.trim() || '/placeholder.jpg',
        rating: parseFloat(product.rating) || 4.0,
        reviews: parseInt(product.reviews) || 0,
        category: product.categoria?.trim().toLowerCase() || 'general',
        inStock: product.enStock !== false,
        description: product.descripcion?.trim() || '',
        features: product.caracteristicas ? product.caracteristicas.split(',').map((f: string) => f.trim()).filter(Boolean) : []
      }))

    if (formattedProducts.length === 0) {
      toast({
        title: 'Error',
        description: 'Agrega al menos un producto con nombre',
        variant: 'destructive'
      })
      setIsProcessing(false)
      return
    }

    console.log('📤 BulkEditProducts - Sending products:', formattedProducts.length)
    
    onProductsUpdated(formattedProducts, categories)
    
    toast({
      title: 'Productos actualizados',
      description: `${formattedProducts.length} productos actualizados exitosamente`
    })
    
    onClose()
  }

  const handleCategoryConfirm = () => {
    // Actualizar los productos con los nombres finales de las categorías
    categoryConfirmations.forEach(confirmation => {
      if (confirmation.originalName !== confirmation.finalName) {
        updateCategoryInProducts(confirmation.originalName, confirmation.finalName)
      }
    })
    
    setShowCategoryModal(false)
    proceedWithSave()
  }

  const updateCategoryName = (index: number, newName: string) => {
    const updated = [...categoryConfirmations]
    updated[index] = { ...updated[index], finalName: newName }
    setCategoryConfirmations(updated)
  }

  const exportData = () => {
    const data = {
      products: products,
      categories: categories
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'productos-categorias.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast({
      title: 'Datos exportados',
      description: 'Archivo JSON descargado exitosamente'
    })
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (data.products && data.categories) {
          setProducts(data.products)
          setCategories(data.categories)
          addToHistory({ products: data.products, categories: data.categories })
          
          toast({
            title: 'Datos importados',
            description: `${data.products.length} productos y ${data.categories.length} categorías importados`
          })
        }
      } catch (error) {
        toast({
          title: 'Error al importar',
          description: 'El archivo no tiene el formato correcto',
          variant: 'destructive'
        })
      }
    }
    reader.readAsText(file)
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold">Editar Productos y Categorías Masivamente</h2>
              <p className="text-gray-600">Edita todos los productos y categorías existentes. Presiona Enter para agregar una nueva fila.</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-6 space-y-6">
            {/* Botones de acción */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Acciones</CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      onClick={exportData} 
                      size="sm" 
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".json"
                        onChange={importData}
                        className="hidden"
                      />
                      <Button size="sm" variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Importar
                      </Button>
                    </label>
                    <Button 
                      onClick={undo} 
                      size="sm" 
                      variant="outline"
                      disabled={historyIndex === 0}
                      title="Deshacer (Ctrl+Z)"
                    >
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                      Deshacer
                    </Button>
                    <Button 
                      onClick={redo} 
                      size="sm" 
                      variant="outline"
                      disabled={historyIndex === history.length - 1}
                      title="Rehacer (Ctrl+Y)"
                    >
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                      </svg>
                      Rehacer
                    </Button>
                                         <Button onClick={addRow} size="sm" variant="outline">
                       <Plus className="h-4 w-4 mr-2" />
                       Agregar Producto
                     </Button>
                    <Button onClick={handleSave} size="sm" disabled={isProcessing}>
                      <Save className="h-4 w-4 mr-2" />
                      {isProcessing ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            

                         {/* Tabla de Productos */}
             <Card>
               <CardHeader>
                 <CardTitle>Todos los Productos ({products.length})</CardTitle>
                 <p className="text-sm text-gray-600">Todos los productos ordenados por categoría</p>
               </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 p-2 text-left text-sm font-medium">Nombre *</th>
                        <th className="border border-gray-200 p-2 text-left text-sm font-medium">Descripción</th>
                        <th className="border border-gray-200 p-2 text-left text-sm font-medium">Categoría</th>
                        <th className="border border-gray-200 p-2 text-left text-sm font-medium">Precio *</th>
                        <th className="border border-gray-200 p-2 text-left text-sm font-medium">Precio Original</th>
                        <th className="border border-gray-200 p-2 text-left text-sm font-medium">Marca</th>
                        <th className="border border-gray-200 p-2 text-left text-sm font-medium">URL Imagen</th>
                        <th className="border border-gray-200 p-2 text-left text-sm font-medium">Rating</th>
                        <th className="border border-gray-200 p-2 text-left text-sm font-medium">Reviews</th>
                        <th className="border border-gray-200 p-2 text-left text-sm font-medium">En Stock</th>
                        <th className="border border-gray-200 p-2 text-left text-sm font-medium">Características</th>
                        <th className="border border-gray-200 p-2 text-left text-sm font-medium">Acciones</th>
                      </tr>
                    </thead>
                                         <tbody>
                       {products
                         .sort((a, b) => (a.categoria || '').localeCompare(b.categoria || ''))
                         .map((product, index) => (
                        <tr key={product.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-200 p-2">
                            <Input
                              ref={(el) => {
                                inputRefs.current[`${product.id}-nombre`] = el
                              }}
                              value={product.nombre}
                              onChange={(e) => updateProduct(product.id, 'nombre', e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, product.id, 'nombre')}
                              onPaste={(e) => handlePaste(e, product.id, 'nombre')}
                              placeholder="iPhone 15, Samsung Galaxy..."
                              className="border-0 p-0 h-8 text-sm"
                            />
                          </td>
                          <td className="border border-gray-200 p-2">
                            <Input
                              ref={(el) => {
                                inputRefs.current[`${product.id}-descripcion`] = el
                              }}
                              value={product.descripcion}
                              onChange={(e) => updateProduct(product.id, 'descripcion', e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, product.id, 'descripcion')}
                              onPaste={(e) => handlePaste(e, product.id, 'descripcion')}
                              placeholder="Descripción del producto"
                              className="border-0 p-0 h-8 text-sm"
                            />
                          </td>
                          <td className="border border-gray-200 p-2">
                            <Input
                              ref={(el) => {
                                inputRefs.current[`${product.id}-categoria`] = el
                              }}
                              value={product.categoria}
                              onChange={(e) => updateProduct(product.id, 'categoria', e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, product.id, 'categoria')}
                              onPaste={(e) => handlePaste(e, product.id, 'categoria')}
                              placeholder="smartphones, tablets..."
                              className="border-0 p-0 h-8 text-sm"
                            />
                          </td>
                          <td className="border border-gray-200 p-2">
                            <Input
                              ref={(el) => {
                                inputRefs.current[`${product.id}-precio`] = el
                              }}
                              type="number"
                              step="0.01"
                              value={product.precio}
                              onChange={(e) => updateProduct(product.id, 'precio', e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, product.id, 'precio')}
                              onPaste={(e) => handlePaste(e, product.id, 'precio')}
                              placeholder="0.00"
                              className="border-0 p-0 h-8 text-sm"
                            />
                          </td>
                          <td className="border border-gray-200 p-2">
                            <Input
                              ref={(el) => {
                                inputRefs.current[`${product.id}-precioOriginal`] = el
                              }}
                              type="number"
                              step="0.01"
                              value={product.precioOriginal}
                              onChange={(e) => updateProduct(product.id, 'precioOriginal', e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, product.id, 'precioOriginal')}
                              onPaste={(e) => handlePaste(e, product.id, 'precioOriginal')}
                              placeholder="0.00"
                              className="border-0 p-0 h-8 text-sm"
                            />
                          </td>
                          <td className="border border-gray-200 p-2">
                            <Input
                              ref={(el) => {
                                inputRefs.current[`${product.id}-marca`] = el
                              }}
                              value={product.marca}
                              onChange={(e) => updateProduct(product.id, 'marca', e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, product.id, 'marca')}
                              onPaste={(e) => handlePaste(e, product.id, 'marca')}
                              placeholder="Apple, Samsung..."
                              className="border-0 p-0 h-8 text-sm"
                            />
                          </td>
                          <td className="border border-gray-200 p-2">
                            <Input
                              ref={(el) => {
                                inputRefs.current[`${product.id}-urlImagen`] = el
                              }}
                              value={product.urlImagen}
                              onChange={(e) => updateProduct(product.id, 'urlImagen', e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, product.id, 'urlImagen')}
                              onPaste={(e) => handlePaste(e, product.id, 'urlImagen')}
                              placeholder="https://..."
                              className="border-0 p-0 h-8 text-sm"
                            />
                          </td>
                          <td className="border border-gray-200 p-2">
                            <Input
                              ref={(el) => {
                                inputRefs.current[`${product.id}-rating`] = el
                              }}
                              type="number"
                              step="0.1"
                              min="0"
                              max="5"
                              value={product.rating}
                              onChange={(e) => updateProduct(product.id, 'rating', e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, product.id, 'rating')}
                              onPaste={(e) => handlePaste(e, product.id, 'rating')}
                              className="border-0 p-0 h-8 text-sm"
                            />
                          </td>
                          <td className="border border-gray-200 p-2">
                            <Input
                              ref={(el) => {
                                inputRefs.current[`${product.id}-reviews`] = el
                              }}
                              type="number"
                              value={product.reviews}
                              onChange={(e) => updateProduct(product.id, 'reviews', e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, product.id, 'reviews')}
                              onPaste={(e) => handlePaste(e, product.id, 'reviews')}
                              className="border-0 p-0 h-8 text-sm"
                            />
                          </td>
                          <td className="border border-gray-200 p-2">
                            <input
                              type="checkbox"
                              checked={product.enStock}
                              onChange={(e) => updateProduct(product.id, 'enStock', e.target.checked)}
                              className="h-4 w-4"
                            />
                          </td>
                          <td className="border border-gray-200 p-2">
                            <Input
                              ref={(el) => {
                                inputRefs.current[`${product.id}-caracteristicas`] = el
                              }}
                              value={product.caracteristicas}
                              onChange={(e) => updateProduct(product.id, 'caracteristicas', e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, product.id, 'caracteristicas')}
                              onPaste={(e) => handlePaste(e, product.id, 'caracteristicas')}
                              placeholder="128GB, 5G, etc..."
                              className="border-0 p-0 h-8 text-sm"
                            />
                          </td>
                          <td className="border border-gray-200 p-2">
                            {products.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeRow(product.id)}
                                className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 text-sm text-gray-600">
                  <p>💡 <strong>Consejo:</strong> Usa las flechas del teclado para navegar entre campos. Enter para nueva fila. Pega múltiples líneas para crear filas automáticamente. <strong>Ctrl+Z</strong> para deshacer y <strong>Ctrl+Y</strong> para rehacer.</p>
                </div>
              </CardContent>
            </Card>

            {validationErrors.length > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-700 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Errores de Validación ({validationErrors.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {validationErrors.map((error, index) => (
                      <div key={index} className="text-sm text-red-600 bg-red-100 p-2 rounded">
                        {error}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación de categorías */}
      <Dialog open={showCategoryModal} onOpenChange={setShowCategoryModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderPlus className="h-5 w-5 text-blue-600" />
              Confirmar Nuevas Categorías
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Se detectaron {categoryConfirmations.length} categoría(s) nueva(s)</strong> en los productos que vas a guardar. 
                Revisa y edita los nombres si es necesario antes de proceder.
              </p>
            </div>

            {categoryConfirmations.map((category, index) => (
              <Card key={index} className="border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Edit3 className="h-4 w-4 text-blue-600" />
                        <Label htmlFor={`category-${index}`} className="text-sm font-medium">
                          Nombre de la categoría:
                        </Label>
                      </div>
                      <Input
                        id={`category-${index}`}
                        value={category.finalName}
                        onChange={(e) => updateCategoryName(index, e.target.value)}
                        className="mb-2"
                        placeholder="Nombre de la categoría"
                      />
                      <div className="text-sm text-gray-600">
                        <p><strong>Productos en esta categoría:</strong> {category.productCount}</p>
                        <p><strong>Productos:</strong> {category.products.map(p => p.nombre).join(', ')}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowCategoryModal(false)}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleCategoryConfirm}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirmar y Guardar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
