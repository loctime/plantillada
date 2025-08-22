"use client"

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X, Edit, Settings, Image as ImageIcon, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAdmin } from '@/lib/admin-context'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ImageUpload } from '@/components/image-upload'

interface ShopBannerProps {
  banners?: Array<{
    id: string
    title: string
    subtitle?: string
    image?: string
    backgroundColor?: string
    textColor?: string
    ctaText?: string
    ctaUrl?: string
    isActive?: boolean
  }>
  autoPlay?: boolean
  interval?: number
  showControls?: boolean
  showIndicators?: boolean
  onBannersUpdate?: (banners: any[]) => void
}

export function ShopBanner({ 
  banners = [], 
  autoPlay = true, 
  interval = 5000, 
  showControls = true,
  showIndicators = true,
  onBannersUpdate
}: ShopBannerProps) {
  const { isAdminMode } = useAdmin()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingBanners, setEditingBanners] = useState<any[]>([])

  // Banners por defecto si no hay ninguno configurado
  const defaultBanners = [
    {
      id: 'default-1',
      title: '¡Ofertas Especiales!',
      subtitle: 'Descuentos de hasta 50% en productos seleccionados',
      backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      textColor: '#ffffff',
      ctaText: 'Ver Ofertas',
      ctaUrl: '#',
      image: '',
      isActive: true
    },
    {
      id: 'default-2',
      title: 'Envío Gratis',
      subtitle: 'En pedidos superiores a $50',
      backgroundColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      textColor: '#ffffff',
      ctaText: 'Comprar Ahora',
      ctaUrl: '#',
      image: '',
      isActive: true
    }
  ]

  const activeBanners = banners.length > 0 ? banners.filter(b => b.isActive !== false) : defaultBanners

  useEffect(() => {
    if (!autoPlay || activeBanners.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, activeBanners.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length)
  }

  const handleEditBanners = () => {
    setEditingBanners([...activeBanners])
    setShowEditModal(true)
  }

  const handleSaveBanners = () => {
    if (onBannersUpdate) {
      onBannersUpdate(editingBanners)
    }
    setShowEditModal(false)
  }

  const handleAddBanner = () => {
    const newBanner = {
      id: `banner-${Date.now()}`,
      title: 'Nuevo Banner',
      subtitle: 'Descripción del banner',
      backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      textColor: '#ffffff',
      ctaText: 'Acción',
      ctaUrl: '#',
      isActive: true
    }
    setEditingBanners([...editingBanners, newBanner])
  }

  const handleDeleteBanner = (index: number) => {
    const updatedBanners = editingBanners.filter((_, i) => i !== index)
    setEditingBanners(updatedBanners)
  }

  const handleUpdateBanner = (index: number, field: string, value: any) => {
    const updatedBanners = [...editingBanners]
    updatedBanners[index] = { ...updatedBanners[index], [field]: value }
    setEditingBanners(updatedBanners)
  }

  const handleImageUpload = (index: number, imageUrl: string) => {
    handleUpdateBanner(index, 'image', imageUrl)
  }

  // Función para manejar la subida de imagen
  const handleImageUploaded = (index: number) => (url: string) => {
    handleUpdateBanner(index, 'image', url)
  }

  if (!isVisible || activeBanners.length === 0) {
    return null
  }

  const currentBanner = activeBanners[currentIndex]

  return (
    <>
      <div className="relative w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
        {/* Botones de administración */}
        {isAdminMode && (
          <div className="absolute top-2 right-2 z-10 flex space-x-2">
            <button
              onClick={handleEditBanners}
              className="p-1 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
              title="Editar Banners"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
              title="Ocultar Banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="relative">
          {/* Banner principal */}
          <div 
            className="relative h-32 md:h-40 flex items-center justify-center px-4 overflow-hidden"
            style={{
              background: currentBanner.backgroundColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            {/* Imagen de fondo si existe */}
            {currentBanner.image && (
              <div className="absolute inset-0 z-0">
                <img
                  src={currentBanner.image}
                  alt={currentBanner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
            )}

            <div className="text-center max-w-4xl mx-auto relative z-10">
              <h2 className="text-xl md:text-2xl font-bold mb-2">
                {currentBanner.title}
              </h2>
              {currentBanner.subtitle && (
                <p className="text-sm md:text-base opacity-90 mb-4">
                  {currentBanner.subtitle}
                </p>
              )}
              {currentBanner.ctaText && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white text-gray-900 hover:bg-gray-100"
                  onClick={() => {
                    if (currentBanner.ctaUrl && currentBanner.ctaUrl !== '#') {
                      window.location.href = currentBanner.ctaUrl
                    }
                  }}
                >
                  {currentBanner.ctaText}
                </Button>
              )}
            </div>
          </div>

          {/* Controles de navegación */}
          {showControls && activeBanners.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors z-20"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors z-20"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Indicadores */}
          {showIndicators && activeBanners.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
              {activeBanners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de edición */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Editar Banners de la Tienda
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {editingBanners.map((banner, index) => (
              <div key={banner.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Banner {index + 1}</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={banner.isActive}
                        onCheckedChange={(checked) => handleUpdateBanner(index, 'isActive', checked)}
                      />
                      <Label>Activo</Label>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteBanner(index)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`title-${index}`}>Título *</Label>
                    <Input
                      id={`title-${index}`}
                      value={banner.title}
                      onChange={(e) => handleUpdateBanner(index, 'title', e.target.value)}
                      placeholder="Título del banner"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`subtitle-${index}`}>Subtítulo</Label>
                    <Input
                      id={`subtitle-${index}`}
                      value={banner.subtitle || ''}
                      onChange={(e) => handleUpdateBanner(index, 'subtitle', e.target.value)}
                      placeholder="Subtítulo del banner"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`ctaText-${index}`}>Texto del Botón</Label>
                    <Input
                      id={`ctaText-${index}`}
                      value={banner.ctaText || ''}
                      onChange={(e) => handleUpdateBanner(index, 'ctaText', e.target.value)}
                      placeholder="Ej: Ver Ofertas"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`ctaUrl-${index}`}>URL del Botón</Label>
                    <Input
                      id={`ctaUrl-${index}`}
                      value={banner.ctaUrl || ''}
                      onChange={(e) => handleUpdateBanner(index, 'ctaUrl', e.target.value)}
                      placeholder="Ej: #ofertas o https://..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor={`backgroundColor-${index}`}>Color de Fondo (CSS)</Label>
                    <Input
                      id={`backgroundColor-${index}`}
                      value={banner.backgroundColor || ''}
                      onChange={(e) => handleUpdateBanner(index, 'backgroundColor', e.target.value)}
                      placeholder="Ej: linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    />
                  </div>

                  {/* Sección de imagen */}
                  <div className="md:col-span-2">
                    <Label className="flex items-center gap-2 mb-2">
                      <ImageIcon className="h-4 w-4" />
                      Imagen de Fondo (Opcional)
                    </Label>
                    
                    {banner.image ? (
                      <div className="space-y-2">
                        <div className="relative">
                          <img
                            src={banner.image}
                            alt="Vista previa"
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => handleUpdateBanner(index, 'image', '')}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500">
                          URL actual: {banner.image}
                        </p>
                      </div>
                                         ) : (
                       <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                         <div className="flex flex-col items-center space-y-2">
                           <Upload className="h-8 w-8 text-gray-400" />
                           <p className="text-sm text-gray-500">
                             Haz clic para subir una imagen
                           </p>
                           <p className="text-xs text-gray-400">
                             PNG, JPG hasta 5MB
                           </p>
                         </div>
                         <ImageUpload
                           onUpload={(url: string) => handleImageUpload(index, url)}
                           className="w-full mt-2"
                         />
                       </div>
                     )}
                  </div>
                </div>

                {/* Vista previa del banner */}
                <div className="border-t pt-4">
                  <Label className="text-sm font-medium">Vista Previa:</Label>
                  <div 
                    className="mt-2 h-24 rounded-lg flex items-center justify-center px-4 relative overflow-hidden"
                    style={{
                      background: banner.backgroundColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}
                  >
                    {/* Imagen de fondo en vista previa */}
                    {banner.image && (
                      <>
                        <img
                          src={banner.image}
                          alt="Vista previa"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30"></div>
                      </>
                    )}
                    
                    <div className="text-center text-white relative z-10">
                      <h4 className="font-bold text-sm">{banner.title}</h4>
                      {banner.subtitle && (
                        <p className="text-xs opacity-90">{banner.subtitle}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Button onClick={handleAddBanner} className="w-full">
              + Agregar Nuevo Banner
            </Button>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setShowEditModal(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveBanners}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            >
              Guardar Cambios
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
