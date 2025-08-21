"use client"

import React, { useState, useRef } from 'react'
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
  Save
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface BulkUploadProductsProps {
  onProductsUploaded: (products: any[]) => void
  onClose: () => void
}

export function BulkUploadProducts({ onProductsUploaded, onClose }: BulkUploadProductsProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [products, setProducts] = useState<any[]>([
    {
      id: Date.now().toString(),
      nombre: '',
      descripcion: '',
      categoria: '',
      precio: '',
      marca: '',
      urlImagen: '',
      rating: '4.0',
      reviews: '0',
      enStock: true,
      caracteristicas: ''
    }
  ])
  
  // Historial para deshacer
  const [history, setHistory] = useState<any[][]>([[
    {
      id: Date.now().toString(),
      nombre: '',
      descripcion: '',
      categoria: '',
      precio: '',
      marca: '',
      urlImagen: '',
      rating: '4.0',
      reviews: '0',
      enStock: true,
      caracteristicas: ''
    }
  ]])
  const [historyIndex, setHistoryIndex] = useState(0)
  
  const { toast } = useToast()
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  const addRow = () => {
    const newProduct = {
      id: Date.now().toString(),
      nombre: '',
      descripcion: '',
      categoria: '',
      precio: '',
      marca: '',
      urlImagen: '',
      rating: '4.0',
      reviews: '0',
      enStock: true,
      caracteristicas: ''
    }
    const newProducts = [...products, newProduct]
    setProducts(newProducts)
    addToHistory(newProducts)
    
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
      addToHistory(newProducts)
    }
  }

  // Función para agregar al historial
  const addToHistory = (newProducts: any[]) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(JSON.parse(JSON.stringify(newProducts))) // Deep copy
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  // Función para deshacer
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setProducts(JSON.parse(JSON.stringify(history[newIndex])))
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
      setProducts(JSON.parse(JSON.stringify(history[newIndex])))
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
    addToHistory(newProducts)
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
      const fields = ['nombre', 'descripcion', 'categoria', 'precio', 'marca', 'urlImagen', 'rating', 'reviews', 'caracteristicas']
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
      
      console.log('📋 Paste detected:', lines.length, 'lines')
      console.log('📋 Lines:', lines)
      console.log('📋 Current index:', currentIndex)
      console.log('📋 Current products count:', products.length)
      
      if (lines.length > 1) {
        let newProducts = [...products]
        
        // Si hay suficientes filas existentes desde la posición actual, actualizar las existentes
        if (currentIndex + lines.length <= products.length) {
          console.log('📋 Updating existing rows from position', currentIndex)
          
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
          console.log('📋 Creating new rows or extending existing ones')
          
          // Si necesitamos más filas, crear las que faltan
          const neededRows = currentIndex + lines.length - products.length
          if (neededRows > 0) {
            for (let i = 0; i < neededRows; i++) {
              const newProduct = {
                id: Date.now().toString() + '-' + (products.length + i),
                nombre: '',
                descripcion: '',
                categoria: '',
                precio: '',
                marca: '',
                urlImagen: '',
                rating: '4.0',
                reviews: '0',
                enStock: true,
                caracteristicas: ''
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
        
        console.log('📋 Final products array:', newProducts.length, 'products')
        
        setProducts(newProducts)
        addToHistory(newProducts)
        
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

    setIsProcessing(true)

    const formattedProducts = products
      .filter(product => product.nombre?.trim()) // Solo productos con nombre
      .map(product => ({
        id: product.id,
        name: product.nombre.trim(),
        brand: product.marca?.trim() || 'Sin marca',
        price: parseFloat(product.precio) || 0,
        originalPrice: product.precioActual && parseFloat(product.precioActual) > parseFloat(product.precio) ? parseFloat(product.precioActual) : undefined,
        image: product.urlImagen?.trim() || '',
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

    console.log('📤 BulkUploadProducts - Sending formatted products:', formattedProducts.length)
    console.log('📤 BulkUploadProducts - First product:', formattedProducts[0])
    
    onProductsUploaded(formattedProducts)
    
    toast({
      title: 'Productos cargados',
      description: `${formattedProducts.length} productos agregados exitosamente`
    })
    
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">Agregar Productos Masivamente</h2>
            <p className="text-gray-600">Escribe múltiples productos en la tabla. Presiona Enter para agregar una nueva fila.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Tabla de Productos</CardTitle>
                                 <div className="flex gap-2">
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
                     Agregar Fila
                   </Button>
                   <Button onClick={handleSave} size="sm" disabled={isProcessing}>
                     <Save className="h-4 w-4 mr-2" />
                     {isProcessing ? 'Guardando...' : 'Guardar Productos'}
                   </Button>
                 </div>
              </div>
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
                    {products.map((product, index) => (
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
  )
}
