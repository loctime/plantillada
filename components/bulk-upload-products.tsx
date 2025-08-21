"use client"

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  X, 
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface BulkUploadProductsProps {
  onProductsUploaded: (products: any[]) => void
  onClose: () => void
}

const CSV_HEADERS = [
  'categoria',
  'nombre', 
  'descripcion',
  'urlImagen',
  'precio',
  'precioActual',
  'marca',
  'rating',
  'reviews',
  'enStock',
  'caracteristicas'
]

export function BulkUploadProducts({ onProductsUploaded, onClose }: BulkUploadProductsProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const downloadTemplate = () => {
    // Intentar descargar desde la carpeta public primero
    const a = document.createElement('a')
    a.href = '/plantilla_productos.csv'
    a.download = 'plantilla_productos.csv'
    a.click()
    
    toast({
      title: 'Plantilla descargada',
      description: 'Archivo CSV descargado. Llénalo con tus productos y súbelo.'
    })
  }

  const parseCSV = (csvText: string): any[] => {
    const lines = csvText.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    
    const products: any[] = []
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      const product: any = { id: `bulk_${Date.now()}_${i}` }
      
      headers.forEach((header, index) => {
        if (values[index]) {
          switch (header) {
            case 'precio':
            case 'precioactual':
            case 'rating':
            case 'reviews':
              product[header] = parseFloat(values[index]) || 0
              break
            case 'enstock':
              product[header] = values[index].toLowerCase() === 'true' || values[index] === '1'
              break
            default:
              product[header] = values[index]
          }
        }
      })
      
      products.push(product)
    }
    
    return products
  }

  const validateProducts = (products: any[]): string[] => {
    const errors: string[] = []
    
    products.forEach((product, index) => {
      const rowNumber = index + 2
      
      if (!product.categoria) {
        errors.push(`Fila ${rowNumber}: Categoría es requerida`)
      }
      if (!product.nombre) {
        errors.push(`Fila ${rowNumber}: Nombre es requerido`)
      }
      if (!product.descripcion) {
        errors.push(`Fila ${rowNumber}: Descripción es requerida`)
      }
      if (!product.urlImagen) {
        errors.push(`Fila ${rowNumber}: URL de imagen es requerida`)
      }
      if (!product.precio || product.precio <= 0) {
        errors.push(`Fila ${rowNumber}: Precio debe ser mayor a 0`)
      }
    })
    
    return errors
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      toast({
        title: 'Error',
        description: 'Por favor sube un archivo CSV',
        variant: 'destructive'
      })
      return
    }

    setIsProcessing(true)
    
    try {
      const content = await file.text()
      const products = parseCSV(content)
      
      if (products.length === 0) {
        toast({
          title: 'Error',
          description: 'El archivo CSV no contiene productos válidos',
          variant: 'destructive'
        })
        return
      }

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

      const formattedProducts = products.map(product => ({
        id: product.id,
        name: product.nombre,
        brand: product.marca || 'Sin marca',
        price: product.precio,
        originalPrice: product.precioActual && product.precioActual > product.precio ? product.precioActual : undefined,
        image: product.urlImagen,
        rating: product.rating || 4.0,
        reviews: product.reviews || 0,
        category: product.categoria.toLowerCase(),
        inStock: product.enStock !== false,
        description: product.descripcion,
        features: product.caracteristicas ? product.caracteristicas.split(',').map((f: string) => f.trim()) : []
      }))

      onProductsUploaded(formattedProducts)
      
      toast({
        title: 'Productos cargados',
        description: `${formattedProducts.length} productos agregados exitosamente`
      })
      
      onClose()
      
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al procesar el archivo CSV',
        variant: 'destructive'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">Carga Masiva de Productos</h2>
            <p className="text-gray-600">Sube múltiples productos usando un archivo CSV</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                Instrucciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600 space-y-2">
                <p>1. Descarga la plantilla CSV con el formato correcto</p>
                <p>2. Llena los datos de tus productos en el archivo</p>
                <p>3. Guarda el archivo y súbelo aquí</p>
                <p className="font-medium">Columnas requeridas: {CSV_HEADERS.join(', ')}</p>
              </div>
              
              <div className="flex gap-4">
                <Button onClick={downloadTemplate} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Plantilla
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subir Archivo CSV</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isProcessing ? 'Procesando...' : 'Seleccionar Archivo CSV'}
              </Button>
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
