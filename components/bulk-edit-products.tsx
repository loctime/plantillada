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
  Upload,
  ChevronUp,
  ChevronDown,
  GripVertical
} from 'lucide-react'
import * as XLSX from 'xlsx'
import { useToast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Product } from '@/components/shop/types'
import { ImageUpload } from '@/components/image-upload'

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

interface SortConfig {
  key: string
  direction: 'asc' | 'desc'
}

interface ColumnConfig {
  key: string
  label: string
  width: number
  minWidth: number
  sortable: boolean
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
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeStartX, setResizeStartX] = useState(0)
  const [resizeColumnIndex, setResizeColumnIndex] = useState<number | null>(null)
  const [showResizeIndicator, setShowResizeIndicator] = useState(false)
  const [resizeIndicatorPosition, setResizeIndicatorPosition] = useState({ x: 0, y: 0 })
  const [initialColumnWidth, setInitialColumnWidth] = useState(0)
  const [showImageUploadModal, setShowImageUploadModal] = useState(false)
  const [currentImageUploadProduct, setCurrentImageUploadProduct] = useState<string | null>(null)
  
  // Configuración de columnas con anchos iniciales
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: 'nombre', label: 'Nombre *', width: 200, minWidth: 120, sortable: true },
    { key: 'descripcion', label: 'Descripción', width: 250, minWidth: 150, sortable: true },
    { key: 'categoria', label: 'Categoría', width: 150, minWidth: 100, sortable: true },
    { key: 'precio', label: 'Precio *', width: 100, minWidth: 80, sortable: true },
    { key: 'precioOriginal', label: 'Precio Original', width: 120, minWidth: 80, sortable: true },
    { key: 'marca', label: 'Marca', width: 120, minWidth: 80, sortable: true },
    { key: 'opciones1', label: 'Opciones 1', width: 150, minWidth: 100, sortable: false },
    { key: 'variedades1', label: 'Variedades 1', width: 200, minWidth: 150, sortable: false },
    { key: 'opciones2', label: 'Opciones 2', width: 150, minWidth: 100, sortable: false },
    { key: 'variedades2', label: 'Variedades 2', width: 200, minWidth: 150, sortable: false },
    { key: 'opciones3', label: 'Opciones 3', width: 150, minWidth: 100, sortable: false },
    { key: 'variedades3', label: 'Variedades 3', width: 200, minWidth: 150, sortable: false },
    { key: 'opciones4', label: 'Opciones 4', width: 150, minWidth: 100, sortable: false },
    { key: 'variedades4', label: 'Variedades 4', width: 200, minWidth: 150, sortable: false },
    { key: 'adicionales', label: 'Adicionales', width: 200, minWidth: 150, sortable: false },
    { key: 'precioAdicional', label: 'Precio Adicional', width: 120, minWidth: 80, sortable: true },
    { key: 'urlImagen', label: 'URL Imagen', width: 200, minWidth: 150, sortable: false },
    { key: 'rating', label: 'Rating', width: 80, minWidth: 60, sortable: true },
    { key: 'reviews', label: 'Reviews', width: 80, minWidth: 60, sortable: true },
    { key: 'enStock', label: 'En Stock', width: 80, minWidth: 60, sortable: true },
    { key: 'caracteristicas', label: 'Características', width: 200, minWidth: 150, sortable: false },
    { key: 'acciones', label: 'Acciones', width: 80, minWidth: 60, sortable: false }
  ])
  
  // Historial para deshacer
  const [history, setHistory] = useState<{ products: any[], categories: Category[] }[]>([])
  const [historyIndex, setHistoryIndex] = useState(0)
  
  const { toast } = useToast()
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})
  const tableRef = useRef<HTMLTableElement>(null)

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
      opciones1: product.options?.option1 || '',
      variedades1: product.varieties?.variety1?.join(', ') || '',
      opciones2: product.options?.option2 || '',
      variedades2: product.varieties?.variety2?.join(', ') || '',
      opciones3: product.options?.option3 || '',
      variedades3: product.varieties?.variety3?.join(', ') || '',
      opciones4: product.options?.option4 || '',
      variedades4: product.varieties?.variety4?.join(', ') || '',
      adicionales: product.addons?.map(addon => addon.name).join(', ') || '',
      precioAdicional: product.addons?.[0]?.price?.toString() || '',
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
      opciones1: '',
      variedades1: '',
      opciones2: '',
      variedades2: '',
      opciones3: '',
      variedades3: '',
      opciones4: '',
      variedades4: '',
      adicionales: '',
      precioAdicional: '',
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
      const fields = ['nombre', 'descripcion', 'categoria', 'precio', 'marca', 'opciones1', 'variedades1', 'opciones2', 'variedades2', 'opciones3', 'variedades3', 'opciones4', 'variedades4', 'adicionales', 'precioAdicional', 'urlImagen', 'rating', 'reviews', 'caracteristicas', 'precioOriginal']
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
                opciones1: '',
                variedades1: '',
                opciones2: '',
                variedades2: '',
                opciones3: '',
                variedades3: '',
                opciones4: '',
                variedades4: '',
                adicionales: '',
                precioAdicional: '',
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
        features: product.caracteristicas ? product.caracteristicas.split(',').map((f: string) => f.trim()).filter(Boolean) : [],
        // Procesar opciones y variedades
        options: {
          option1: product.opciones1?.trim() || undefined,
          option2: product.opciones2?.trim() || undefined,
          option3: product.opciones3?.trim() || undefined,
          option4: product.opciones4?.trim() || undefined
        },
        varieties: {
          variety1: product.variedades1 ? product.variedades1.split(',').map((v: string) => v.trim()).filter(Boolean) : undefined,
          variety2: product.variedades2 ? product.variedades2.split(',').map((v: string) => v.trim()).filter(Boolean) : undefined,
          variety3: product.variedades3 ? product.variedades3.split(',').map((v: string) => v.trim()).filter(Boolean) : undefined,
          variety4: product.variedades4 ? product.variedades4.split(',').map((v: string) => v.trim()).filter(Boolean) : undefined
        },
        // Procesar adicionales
        addons: product.adicionales ? product.adicionales.split(',').map((addon: string) => ({
          name: addon.trim(),
          price: parseFloat(product.precioAdicional) || 0
        })).filter((addon: { name: string; price: number }) => addon.name) : undefined
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

  // Función para ordenar productos
  const sortProducts = React.useCallback((products: any[], config: SortConfig | null) => {
    if (!config) return products

    return [...products].sort((a, b) => {
      let aValue = a[config.key]
      let bValue = b[config.key]

      // Manejar valores especiales
      if (config.key === 'precio' || config.key === 'precioOriginal' || config.key === 'precioAdicional' || config.key === 'rating' || config.key === 'reviews') {
        aValue = parseFloat(aValue) || 0
        bValue = parseFloat(bValue) || 0
      } else if (config.key === 'enStock') {
        aValue = aValue ? 1 : 0
        bValue = bValue ? 1 : 0
      } else {
        aValue = String(aValue || '').toLowerCase()
        bValue = String(bValue || '').toLowerCase()
      }

      if (aValue < bValue) {
        return config.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return config.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }, [])

  // Función para manejar el ordenamiento
  const handleSort = (key: string) => {
    const column = columns.find(col => col.key === key)
    if (!column?.sortable) return

    setSortConfig(prev => {
      if (prev?.key === key) {
        return prev.direction === 'asc' 
          ? { key, direction: 'desc' as const }
          : null
      }
      return { key, direction: 'asc' as const }
    })
  }

  // Función para obtener el icono de ordenamiento
  const getSortIcon = (key: string) => {
    if (sortConfig?.key !== key) {
      return <ChevronUp className="h-4 w-4 opacity-30" />
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="h-4 w-4" />
      : <ChevronDown className="h-4 w-4" />
  }

  // Funciones para redimensionamiento de columnas
  const handleResizeStart = (e: React.MouseEvent, columnIndex: number) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    setResizeStartX(e.clientX)
    setResizeColumnIndex(columnIndex)
    setInitialColumnWidth(columns[columnIndex].width)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  const handleResizeMove = React.useCallback((e: globalThis.MouseEvent) => {
    if (!isResizing || resizeColumnIndex === null) return

    const deltaX = e.clientX - resizeStartX
    const newWidth = Math.max(columns[resizeColumnIndex].minWidth, initialColumnWidth + deltaX)
    
    setColumns(prevColumns => {
      const newColumns = [...prevColumns]
      newColumns[resizeColumnIndex] = { ...newColumns[resizeColumnIndex], width: newWidth }
      return newColumns
    })
    
    // Mostrar indicador de redimensionamiento
    setShowResizeIndicator(true)
    setResizeIndicatorPosition({ x: e.clientX, y: e.clientY })
  }, [isResizing, resizeColumnIndex, resizeStartX, initialColumnWidth, columns])

  const handleResizeEnd = React.useCallback(() => {
    setIsResizing(false)
    setResizeColumnIndex(null)
    setShowResizeIndicator(false)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [])

  // Manejar subida de imagen
  const handleImageUpload = (url: string) => {
    if (currentImageUploadProduct) {
      updateProduct(currentImageUploadProduct, 'urlImagen', url)
    }
    setShowImageUploadModal(false)
    setCurrentImageUploadProduct(null)
  }

  const openImageUpload = (productId: string) => {
    setCurrentImageUploadProduct(productId)
    setShowImageUploadModal(true)
  }

  // Event listeners para redimensionamiento
  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove)
      document.addEventListener('mouseup', handleResizeEnd)
      return () => {
        document.removeEventListener('mousemove', handleResizeMove)
        document.removeEventListener('mouseup', handleResizeEnd)
      }
    }
  }, [isResizing, handleResizeMove, handleResizeEnd])

  // Productos ordenados
  const sortedProducts = sortProducts(products, sortConfig)

  // Función para resetear anchos de columnas
  const resetColumnWidths = () => {
    const defaultColumns: ColumnConfig[] = [
      { key: 'nombre', label: 'Nombre *', width: 200, minWidth: 120, sortable: true },
      { key: 'descripcion', label: 'Descripción', width: 250, minWidth: 150, sortable: true },
      { key: 'categoria', label: 'Categoría', width: 150, minWidth: 100, sortable: true },
      { key: 'precio', label: 'Precio *', width: 100, minWidth: 80, sortable: true },
      { key: 'precioOriginal', label: 'Precio Original', width: 120, minWidth: 80, sortable: true },
      { key: 'marca', label: 'Marca', width: 120, minWidth: 80, sortable: true },
      { key: 'opciones1', label: 'Opciones 1', width: 150, minWidth: 100, sortable: false },
      { key: 'variedades1', label: 'Variedades 1', width: 200, minWidth: 150, sortable: false },
      { key: 'opciones2', label: 'Opciones 2', width: 150, minWidth: 100, sortable: false },
      { key: 'variedades2', label: 'Variedades 2', width: 200, minWidth: 150, sortable: false },
      { key: 'opciones3', label: 'Opciones 3', width: 150, minWidth: 100, sortable: false },
      { key: 'variedades3', label: 'Variedades 3', width: 200, minWidth: 150, sortable: false },
      { key: 'opciones4', label: 'Opciones 4', width: 150, minWidth: 100, sortable: false },
      { key: 'variedades4', label: 'Variedades 4', width: 200, minWidth: 150, sortable: false },
      { key: 'adicionales', label: 'Adicionales', width: 200, minWidth: 150, sortable: false },
      { key: 'precioAdicional', label: 'Precio Adicional', width: 120, minWidth: 80, sortable: true },
      { key: 'urlImagen', label: 'URL Imagen', width: 200, minWidth: 150, sortable: false },
      { key: 'rating', label: 'Rating', width: 80, minWidth: 60, sortable: true },
      { key: 'reviews', label: 'Reviews', width: 80, minWidth: 60, sortable: true },
      { key: 'enStock', label: 'En Stock', width: 80, minWidth: 60, sortable: true },
      { key: 'caracteristicas', label: 'Características', width: 200, minWidth: 150, sortable: false },
      { key: 'acciones', label: 'Acciones', width: 80, minWidth: 60, sortable: false }
    ]
    setColumns(defaultColumns)
    toast({
      title: 'Anchos reseteados',
      description: 'Los anchos de las columnas han sido restaurados a sus valores por defecto'
    })
  }

  const exportData = () => {
    try {
      // Crear workbook y worksheet para productos
      const workbook = XLSX.utils.book_new()
      
      // Preparar datos de productos para Excel
      const productsData = products.map(product => ({
        'Nombre': product.nombre || '',
        'Descripción': product.descripcion || '',
        'Categoría': product.categoria || '',
        'Precio': product.precio || '',
        'Precio Original': product.precioOriginal || '',
        'Marca': product.marca || '',
        'Opciones 1': product.opciones1 || '',
        'Variedades 1': product.variedades1 || '',
        'Opciones 2': product.opciones2 || '',
        'Variedades 2': product.variedades2 || '',
        'Opciones 3': product.opciones3 || '',
        'Variedades 3': product.variedades3 || '',
        'Opciones 4': product.opciones4 || '',
        'Variedades 4': product.variedades4 || '',
        'Adicionales': product.adicionales || '',
        'Precio Adicional': product.precioAdicional || '',
        'URL Imagen': product.urlImagen || '',
        'Rating': product.rating || '',
        'Reviews': product.reviews || '',
        'En Stock': product.enStock ? 'Sí' : 'No',
        'Características': product.caracteristicas || ''
      }))
      
      // Crear worksheet de productos
      const productsWorksheet = XLSX.utils.json_to_sheet(productsData)
      XLSX.utils.book_append_sheet(workbook, productsWorksheet, 'Productos')
      
      // Preparar datos de categorías para Excel
      const categoriesData = categories.map(category => ({
        'ID': category.id,
        'Nombre': category.name || '',
        'Descripción': category.description || '',
        'Productos': category.products?.length || 0,
        'Activa': category.isActive ? 'Sí' : 'No'
      }))
      
      // Crear worksheet de categorías
      const categoriesWorksheet = XLSX.utils.json_to_sheet(categoriesData)
      XLSX.utils.book_append_sheet(workbook, categoriesWorksheet, 'Categorías')
      
      // Generar archivo Excel
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'productos-categorias.xlsx'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast({
        title: 'Datos exportados',
        description: 'Archivo Excel descargado exitosamente'
      })
    } catch (error) {
      console.error('Error al exportar:', error)
      toast({
        title: 'Error al exportar',
        description: 'No se pudo generar el archivo Excel',
        variant: 'destructive'
      })
    }
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        
        let importedProducts: any[] = []
        let importedCategories: Category[] = []
        
        // Procesar hoja de productos
        const productsSheet = workbook.Sheets['Productos']
        if (productsSheet) {
          const productsData = XLSX.utils.sheet_to_json(productsSheet)
          importedProducts = productsData.map((row: any) => ({
            id: `temp-${Date.now()}-${Math.random()}`,
            nombre: row['Nombre'] || '',
            descripcion: row['Descripción'] || '',
            categoria: row['Categoría'] || '',
            precio: row['Precio']?.toString() || '',
            precioOriginal: row['Precio Original']?.toString() || '',
            marca: row['Marca'] || '',
            opciones1: row['Opciones 1'] || '',
            variedades1: row['Variedades 1'] || '',
            opciones2: row['Opciones 2'] || '',
            variedades2: row['Variedades 2'] || '',
            opciones3: row['Opciones 3'] || '',
            variedades3: row['Variedades 3'] || '',
            opciones4: row['Opciones 4'] || '',
            variedades4: row['Variedades 4'] || '',
            adicionales: row['Adicionales'] || '',
            precioAdicional: row['Precio Adicional']?.toString() || '',
            urlImagen: row['URL Imagen'] || '/placeholder.jpg',
            rating: row['Rating']?.toString() || '4.0',
            reviews: row['Reviews']?.toString() || '0',
            enStock: row['En Stock'] === 'Sí',
            caracteristicas: row['Características'] || ''
          }))
        }
        
        // Procesar hoja de categorías
        const categoriesSheet = workbook.Sheets['Categorías']
        if (categoriesSheet) {
          const categoriesData = XLSX.utils.sheet_to_json(categoriesSheet)
          importedCategories = categoriesData.map((row: any) => ({
            id: row['ID'] || `cat-${Date.now()}-${Math.random()}`,
            name: row['Nombre'] || '',
            description: row['Descripción'] || '',
            isExpanded: false,
            products: [],
            isActive: row['Activa'] === 'Sí'
          }))
        }
        
        // Si no hay datos en Excel, intentar procesar como JSON (compatibilidad)
        if (importedProducts.length === 0 && importedCategories.length === 0) {
          const jsonText = new TextDecoder().decode(data)
          const jsonData = JSON.parse(jsonText)
          if (jsonData.products && jsonData.categories) {
            importedProducts = jsonData.products
            importedCategories = jsonData.categories
          }
        }
        
        if (importedProducts.length > 0 || importedCategories.length > 0) {
          setProducts(importedProducts.length > 0 ? importedProducts : products)
          setCategories(importedCategories.length > 0 ? importedCategories : categories)
          addToHistory({ 
            products: importedProducts.length > 0 ? importedProducts : products, 
            categories: importedCategories.length > 0 ? importedCategories : categories 
          })
          
          toast({
            title: 'Datos importados',
            description: `${importedProducts.length} productos y ${importedCategories.length} categorías importados`
          })
        } else {
          throw new Error('No se encontraron datos válidos')
        }
      } catch (error) {
        console.error('Error al importar:', error)
        toast({
          title: 'Error al importar',
          description: 'El archivo no tiene el formato correcto. Usa un archivo Excel (.xlsx) o JSON.',
          variant: 'destructive'
        })
      }
    }
    reader.readAsArrayBuffer(file)
  }

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
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
                      Exportar Excel
                    </Button>
                    <input
                      type="file"
                      accept=".xlsx,.json"
                      onChange={importData}
                      className="hidden"
                      id="import-excel-input-edit"
                    />
                    <label htmlFor="import-excel-input-edit" className="cursor-pointer">
                      <Button size="sm" variant="outline" asChild>
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          Importar Excel
                        </span>
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
                    <Button onClick={resetColumnWidths} size="sm" variant="outline" title="Resetear anchos de columnas">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Reset Columnas
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
                 <div className="overflow-x-auto" style={{ minWidth: '100%' }}>
                   <div 
                     className="inline-block min-w-full"
                     style={{ 
                       cursor: isResizing ? 'col-resize' : 'default',
                       userSelect: isResizing ? 'none' : 'auto'
                     }}
                   >
                     <table 
                       ref={tableRef}
                       className="border-collapse border border-gray-200"
                       style={{ 
                         width: 'max-content',
                         minWidth: '100%'
                       }}
                     >
                    <thead>
                      <tr className="bg-gray-50">
                        {columns.map((column, index) => (
                          <th
                            key={column.key}
                            className="border border-gray-200 p-2 text-left text-sm font-medium relative"
                            style={{
                              width: column.width,
                              minWidth: column.minWidth,
                              cursor: column.sortable ? 'pointer' : 'default',
                              userSelect: column.sortable ? 'none' : 'auto'
                            }}
                            onClick={() => handleSort(column.key)}
                          >
                            <div className="flex items-center gap-1">
                              {column.label}
                              {column.sortable && getSortIcon(column.key)}
                            </div>
                                                         {/* Handle de redimensionamiento */}
                             <div
                               className={`absolute right-0 top-0 bottom-0 w-3 cursor-col-resize transition-colors ${
                                 isResizing && resizeColumnIndex === index 
                                   ? 'bg-blue-500' 
                                   : 'hover:bg-blue-300'
                               }`}
                               onMouseDown={(e) => handleResizeStart(e, index)}
                               title="Arrastra para redimensionar la columna"
                               style={{ zIndex: 10 }}
                             />
                          </th>
                        ))}
                      </tr>
                    </thead>
                                                             <tbody>
                      {sortedProducts.map((product, index) => (
                        <tr key={product.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          {columns.map((column) => {
                            const field = column.key;
                            const value = product[field];
                            const inputRefKey = `${product.id}-${field}`;

                            return (
                              <td
                                key={field}
                                className="border border-gray-200 p-2"
                                style={{
                                  width: column.width,
                                  minWidth: column.minWidth
                                }}
                              >
                                {column.key === 'acciones' ? (
                                  <div className="flex items-center gap-1">
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
                                  </div>
                                ) : column.key === 'enStock' ? (
                                  <input
                                    type="checkbox"
                                    checked={product.enStock}
                                    onChange={(e) => updateProduct(product.id, 'enStock', e.target.checked)}
                                    className="h-4 w-4"
                                  />
                                ) : column.key === 'urlImagen' ? (
                                  <div className="flex items-center gap-1">
                                    <Input
                                      ref={(el) => {
                                        inputRefs.current[inputRefKey] = el
                                      }}
                                      value={value}
                                      onChange={(e) => updateProduct(product.id, field, e.target.value)}
                                      onKeyDown={(e) => handleKeyDown(e, product.id, field)}
                                      onPaste={(e) => handlePaste(e, product.id, field)}
                                      placeholder={`${column.label}...`}
                                      className="border-0 p-0 h-8 text-sm flex-1"
                                    />
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => openImageUpload(product.id)}
                                      className="h-6 w-6 p-0"
                                      title="Subir imagen"
                                    >
                                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                      </svg>
                                    </Button>
                                  </div>
                                ) : (
                                  <Input
                                    ref={(el) => {
                                      inputRefs.current[inputRefKey] = el
                                    }}
                                    value={value}
                                    onChange={(e) => updateProduct(product.id, field, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, product.id, field)}
                                    onPaste={(e) => handlePaste(e, product.id, field)}
                                    placeholder={`${column.label}...`}
                                    className="border-0 p-0 h-8 text-sm"
                                  />
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                                         </tbody>
                   </table>
                   </div>
                 </div>
                
                <div className="mt-4 text-sm text-gray-600">
                  <p>💡 <strong>Consejo:</strong> Usa las flechas del teclado para navegar entre campos. Enter para nueva fila. Pega múltiples líneas para crear filas automáticamente. <strong>Ctrl+Z</strong> para deshacer y <strong>Ctrl+Y</strong> para rehacer.</p>
                  <p>📊 <strong>Ordenamiento:</strong> Haz clic en los encabezados de las columnas para ordenar. <strong>Redimensionamiento:</strong> Arrastra el borde derecho de los encabezados para ajustar el ancho de las columnas.</p>
                  <p>📁 <strong>Importar/Exportar:</strong> Los botones de Excel crean archivos con dos hojas: "Productos" y "Categorías". También puedes importar archivos JSON existentes.</p>
                  <p>⚙️ <strong>Opciones y Variedades:</strong> En "Opciones X" escribe el nombre de la opción (ej: "Tipo de masa"). En "Variedades X" escribe las opciones separadas por coma (ej: "Masa fina, Masa gruesa, Media masa").</p>
                  <p>➕ <strong>Adicionales:</strong> En "Adicionales" escribe los nombres separados por coma (ej: "Queso extra, Aceitunas"). En "Precio Adicional" escribe el precio que se sumará por cada adicional.</p>
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
        
                 {/* Indicador de redimensionamiento */}
         {showResizeIndicator && (
           <div
             className="fixed z-[9999] bg-blue-500 text-white px-3 py-2 rounded-md text-sm font-medium pointer-events-none shadow-lg"
             style={{
               left: resizeIndicatorPosition.x + 15,
               top: resizeIndicatorPosition.y - 40
             }}
           >
             {resizeColumnIndex !== null && columns[resizeColumnIndex]?.width}px
           </div>
         )}
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

      {/* Modal de subida de imagen */}
      {showImageUploadModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
          onClick={() => {
            setShowImageUploadModal(false)
            setCurrentImageUploadProduct(null)
          }}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Subir Imagen</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowImageUploadModal(false)
                  setCurrentImageUploadProduct(null)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ImageUpload
              onUpload={handleImageUpload}
              onCancel={() => {
                setShowImageUploadModal(false)
                setCurrentImageUploadProduct(null)
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}
