"use client"

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X, Edit, Settings, Image as ImageIcon, Upload, Clock, Palette, Type, Zap, Layers, ChevronDown, ChevronUp, Star, ShoppingCart, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAdmin } from '@/lib/admin-context'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { ImageUpload } from '@/components/image-upload'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

interface Promotion {
  id: string
  name: string
  productType: 'choice' | 'fixed'
  selectedProducts: string[]
  beverageType: 'choice' | 'fixed'
  selectedBeverages: string[]
  description: string
  price: number
  originalPrice: number
  image: string
  isActive: boolean
}

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
    // Nuevas propiedades
    displayTime?: number
    transitionEffect?: string
    textPosition?: string
    textAnimation?: string
    overlayOpacity?: number
    borderRadius?: number
    shadow?: boolean
    blur?: boolean
    scale?: boolean
    // Propiedades de promociones
    showPromotions?: boolean
    selectedPromotions?: string[]
    promotionLayout?: 'grid' | 'carousel' | 'featured'
    promotionStyle?: 'cards' | 'minimal' | 'highlight'
  }>
  autoPlay?: boolean
  interval?: number
  showControls?: boolean
  showIndicators?: boolean
  onBannersUpdate?: (banners: any[]) => void
  // Props para promociones
  availablePromotions?: Promotion[]
  onPromotionClick?: (promotion: Promotion) => void
}

export function ShopBanner({ 
  banners = [], 
  autoPlay = true, 
  interval = 5000, 
  showControls = true,
  showIndicators = true,
  onBannersUpdate,
  availablePromotions = [],
  onPromotionClick
}: ShopBannerProps) {
  const { isAdminMode } = useAdmin()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingBanners, setEditingBanners] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('general')

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
      isActive: true,
      displayTime: 4,
      transitionEffect: 'fade',
      textPosition: 'center',
      textAnimation: 'fadeIn',
      overlayOpacity: 30,
      borderRadius: 0,
      shadow: false,
      blur: false,
      scale: false,
      showPromotions: false,
      selectedPromotions: [],
      promotionLayout: 'grid',
      promotionStyle: 'cards'
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
      isActive: true,
      displayTime: 4,
      transitionEffect: 'slide',
      textPosition: 'center',
      textAnimation: 'slideIn',
      overlayOpacity: 25,
      borderRadius: 8,
      shadow: true,
      blur: false,
      scale: true,
      showPromotions: false,
      selectedPromotions: [],
      promotionLayout: 'grid',
      promotionStyle: 'cards'
    }
  ]

  const activeBanners = banners.length > 0 ? banners.filter(b => b.isActive !== false) : defaultBanners

  useEffect(() => {
    if (!autoPlay || activeBanners.length <= 1) return

    const currentBanner = activeBanners[currentIndex]
    const displayTime = currentBanner.displayTime || interval

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length)
    }, displayTime * 1000) // Convertir segundos a milisegundos

    return () => clearInterval(timer)
  }, [autoPlay, interval, activeBanners.length, currentIndex, activeBanners])

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
    setIsEditorOpen(true)
  }

  const handleSaveBanners = () => {
    if (onBannersUpdate) {
      onBannersUpdate(editingBanners)
    }
    setIsEditorOpen(false)
  }

  const handleCancelEdit = () => {
    setIsEditorOpen(false)
    setEditingBanners([])
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
      isActive: true,
      displayTime: 4,
      transitionEffect: 'fade',
      textPosition: 'center',
      textAnimation: 'fadeIn',
      overlayOpacity: 30,
      borderRadius: 0,
      shadow: false,
      blur: false,
      scale: false,
      showPromotions: false,
      selectedPromotions: [],
      promotionLayout: 'grid',
      promotionStyle: 'cards'
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

  // Obtener clases CSS para efectos
  const getBannerClasses = (banner: any) => {
    const classes = ['relative h-32 md:h-40 flex items-center justify-center px-4 overflow-hidden transition-all duration-500']
    
    // Posición del texto
    switch (banner.textPosition) {
      case 'left':
        classes.push('justify-start text-left')
        break
      case 'right':
        classes.push('justify-end text-right')
        break
      default:
        classes.push('justify-center text-center')
    }

    // Efectos visuales
    if (banner.shadow) classes.push('shadow-2xl')
    if (banner.blur) classes.push('backdrop-blur-sm')
    if (banner.scale) classes.push('transform transition-transform duration-300 hover:scale-105')

    return classes.join(' ')
  }

  // Obtener estilos CSS para efectos
  const getBannerStyles = (banner: any) => {
    const styles: any = {
      background: banner.backgroundColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }

    if (banner.borderRadius > 0) {
      styles.borderRadius = `${banner.borderRadius}px`
    }

    return styles
  }

  // Obtener clases de transición
  const getTransitionClasses = (banner: any) => {
    const transitionMap: { [key: string]: string } = {
      fade: 'transition-opacity duration-500',
      slide: 'transition-transform duration-500',
      zoom: 'transition-transform duration-500',
      flip: 'transition-transform duration-500'
    }
    return transitionMap[banner.transitionEffect] || 'transition-opacity duration-500'
  }

  // Obtener clases de animación del texto
  const getTextAnimationClasses = (banner: any, element: 'title' | 'subtitle' | 'button') => {
    const animation = banner.textAnimation || 'fadeIn'
    const delayMap = {
      title: '',
      subtitle: 'animation-delay-200',
      button: 'animation-delay-400'
    }
    
    const animationMap: { [key: string]: string } = {
      fadeIn: `animate-fade-in ${delayMap[element]}`,
      slideIn: `animate-slide-in ${delayMap[element]}`,
      bounce: 'animate-bounce',
      zoomIn: `animate-zoom-in ${delayMap[element]}`,
      flipIn: `animate-flip-in ${delayMap[element]}`,
      none: ''
    }
    
    return animationMap[animation] || animationMap.fadeIn
  }



  // Obtener promociones seleccionadas para un banner
  const getSelectedPromotions = (banner: any) => {
    if (!banner.showPromotions || !banner.selectedPromotions) return []
    return availablePromotions.filter(promo => 
      banner.selectedPromotions.includes(promo.id) && promo.isActive
    )
  }

  // Calcular descuento de una promoción
  const getDiscountPercentage = (originalPrice: number, currentPrice: number) => {
    if (originalPrice <= currentPrice) return 0
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
  }

  // Renderizar promociones en el banner
  const renderPromotions = (banner: any) => {
    const selectedPromotions = getSelectedPromotions(banner)
    if (selectedPromotions.length === 0) return null

    const layout = banner.promotionLayout || 'grid'
    const style = banner.promotionStyle || 'cards'

    if (layout === 'featured' && selectedPromotions.length > 0) {
      const featuredPromotion = selectedPromotions[0]
      const discount = getDiscountPercentage(featuredPromotion.originalPrice, featuredPromotion.price)
      
      return (
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={featuredPromotion.image || '/placeholder.jpg'}
                  alt={featuredPromotion.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                {discount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                    -{discount}%
                  </Badge>
                )}
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">{featuredPromotion.name}</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-red-600">${featuredPromotion.price}</span>
                  {featuredPromotion.originalPrice > featuredPromotion.price && (
                    <span className="text-sm text-gray-400 line-through">${featuredPromotion.originalPrice}</span>
                  )}
                </div>
              </div>
            </div>
            <Button
              size="sm"
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
              onClick={() => onPromotionClick?.(featuredPromotion)}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Comprar
            </Button>
          </div>
        </div>
      )
    }

    if (layout === 'carousel') {
      return (
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4">
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {selectedPromotions.map((promotion) => {
              const discount = getDiscountPercentage(promotion.originalPrice, promotion.price)
              return (
                <Card key={promotion.id} className="min-w-[200px] flex-shrink-0">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <img
                          src={promotion.image || '/placeholder.jpg'}
                          alt={promotion.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        {discount > 0 && (
                          <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs">
                            -{discount}%
                          </Badge>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-gray-900 truncate">{promotion.name}</h4>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-bold text-red-600">${promotion.price}</span>
                          {promotion.originalPrice > promotion.price && (
                            <span className="text-xs text-gray-400 line-through">${promotion.originalPrice}</span>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => onPromotionClick?.(promotion)}
                      >
                        <ShoppingCart className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )
    }

    // Layout grid por defecto
    return (
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {selectedPromotions.slice(0, 6).map((promotion) => {
            const discount = getDiscountPercentage(promotion.originalPrice, promotion.price)
            return (
              <div
                key={promotion.id}
                className="bg-white rounded-lg p-2 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onPromotionClick?.(promotion)}
              >
                <div className="relative">
                  <img
                    src={promotion.image || '/placeholder.jpg'}
                    alt={promotion.name}
                    className="w-full h-16 object-cover rounded"
                  />
                  {discount > 0 && (
                    <Badge className="top-1 left-1 bg-red-500 text-white text-xs">
                      -{discount}%
                    </Badge>
                  )}
                </div>
                <div className="mt-2">
                  <h4 className="font-semibold text-xs text-gray-900 truncate">{promotion.name}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-bold text-red-600">${promotion.price}</span>
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (!isVisible || activeBanners.length === 0) {
    return null
  }

  const currentBanner = activeBanners[currentIndex]

  return (
    <div className="w-full">
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
            className={getBannerClasses(currentBanner)}
            style={getBannerStyles(currentBanner)}
          >
            {/* Imagen de fondo si existe */}
            {currentBanner.image && (
              <div className="absolute inset-0 z-0">
                <img
                  src={currentBanner.image}
                  alt={currentBanner.title}
                  className="w-full h-full object-cover"
                />
                <div 
                  className="absolute inset-0"
                  style={{ backgroundColor: `rgba(0, 0, 0, ${(currentBanner.overlayOpacity || 30) / 100})` }}
                ></div>
              </div>
            )}

            <div className={`max-w-4xl mx-auto relative z-10 ${currentBanner.textPosition === 'left' ? 'ml-8' : currentBanner.textPosition === 'right' ? 'mr-8' : ''}`}>
              <h2 
                className={`text-xl md:text-2xl font-bold mb-2 ${getTextAnimationClasses(currentBanner, 'title')}`}
                style={{ color: currentBanner.textColor || '#ffffff' }}
              >
                {currentBanner.title}
              </h2>
              {currentBanner.subtitle && (
                <p 
                  className={`text-sm md:text-base opacity-90 mb-4 ${getTextAnimationClasses(currentBanner, 'subtitle')}`}
                  style={{ color: currentBanner.textColor || '#ffffff' }}
                >
                  {currentBanner.subtitle}
                </p>
              )}
              {currentBanner.ctaText && (
                <Button
                  variant="secondary"
                  size="sm"
                  className={`bg-white text-gray-900 hover:bg-gray-100 ${getTextAnimationClasses(currentBanner, 'button')}`}
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

            {/* Promociones */}
            {renderPromotions(currentBanner)}

            {/* Promociones */}
            {renderPromotions(currentBanner)}
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

      {/* Editor acordeón */}
      {isAdminMode && isEditorOpen && (
        <div className="bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-7xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Editor de Banners
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
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
            </div>
            
            <div className="space-y-6">
              {editingBanners.map((banner, index) => (
                <div key={banner.id} className="border rounded-lg p-4 space-y-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">Banner {index + 1}</h3>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={banner.isActive}
                          onCheckedChange={(checked) => handleUpdateBanner(index, 'isActive', checked)}
                        />
                        <Label className="text-sm">Activo</Label>
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

                  {/* Pestañas de configuración */}
                  <div className="flex space-x-1 border-b">
                    {[
                      { id: 'general', label: 'General', icon: Type },
                      { id: 'timing', label: 'Tiempo', icon: Clock },
                      { id: 'effects', label: 'Efectos', icon: Zap },
                      { id: 'style', label: 'Estilo', icon: Palette },
                      { id: 'image', label: 'Imagen', icon: ImageIcon },
                      { id: 'promotions', label: 'Promociones', icon: Tag }
                    ].map((tab) => {
                      const Icon = tab.icon
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                            activeTab === tab.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-white text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {tab.label}
                        </button>
                      )
                    })}
                  </div>

                  {/* Contenido de pestañas */}
                  <div className="min-h-[300px]">
                    {/* Pestaña General */}
                    {activeTab === 'general' && (
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

                        <div>
                          <Label htmlFor={`textColor-${index}`}>Color del Texto</Label>
                          <Input
                            id={`textColor-${index}`}
                            type="color"
                            value={banner.textColor || '#ffffff'}
                            onChange={(e) => handleUpdateBanner(index, 'textColor', e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor={`backgroundColor-${index}`}>Color de Fondo (CSS)</Label>
                          <Input
                            id={`backgroundColor-${index}`}
                            value={banner.backgroundColor || ''}
                            onChange={(e) => handleUpdateBanner(index, 'backgroundColor', e.target.value)}
                            placeholder="Ej: linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                          />
                        </div>
                      </div>
                    )}

                    {/* Pestaña Tiempo */}
                    {activeTab === 'timing' && (
                      <div className="space-y-6">
                        <div>
                          <Label>Tiempo de Visualización: {banner.displayTime || 4} segundos</Label>
                          <Slider
                            value={[banner.displayTime || 4]}
                            onValueChange={(value) => handleUpdateBanner(index, 'displayTime', value[0])}
                            max={10}
                            min={1}
                            step={1}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label>Efecto de Transición</Label>
                          <Select
                            value={banner.transitionEffect || 'fade'}
                            onValueChange={(value) => handleUpdateBanner(index, 'transitionEffect', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fade">Desvanecer</SelectItem>
                              <SelectItem value="slide">Deslizar</SelectItem>
                              <SelectItem value="zoom">Zoom</SelectItem>
                              <SelectItem value="flip">Voltear</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Animación del Texto</Label>
                          <Select
                            value={banner.textAnimation || 'fadeIn'}
                            onValueChange={(value) => handleUpdateBanner(index, 'textAnimation', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fadeIn">Aparecer</SelectItem>
                              <SelectItem value="slideIn">Deslizar</SelectItem>
                              <SelectItem value="bounce">Rebotar</SelectItem>
                              <SelectItem value="zoomIn">Zoom</SelectItem>
                              <SelectItem value="flipIn">Voltear</SelectItem>
                              <SelectItem value="none">Sin animación</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {/* Pestaña Efectos */}
                    {activeTab === 'effects' && (
                      <div className="space-y-6">
                        <div>
                          <Label>Posición del Texto</Label>
                          <Select
                            value={banner.textPosition || 'center'}
                            onValueChange={(value) => handleUpdateBanner(index, 'textPosition', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="left">Izquierda</SelectItem>
                              <SelectItem value="center">Centro</SelectItem>
                              <SelectItem value="right">Derecha</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={banner.shadow || false}
                              onCheckedChange={(checked) => handleUpdateBanner(index, 'shadow', checked)}
                            />
                            <Label>Sombra</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={banner.blur || false}
                              onCheckedChange={(checked) => handleUpdateBanner(index, 'blur', checked)}
                            />
                            <Label>Efecto Blur</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={banner.scale || false}
                              onCheckedChange={(checked) => handleUpdateBanner(index, 'scale', checked)}
                            />
                            <Label>Efecto Hover Scale</Label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Pestaña Estilo */}
                    {activeTab === 'style' && (
                      <div className="space-y-6">
                        <div>
                          <Label>Opacidad del Overlay: {banner.overlayOpacity || 30}%</Label>
                          <Slider
                            value={[banner.overlayOpacity || 30]}
                            onValueChange={(value) => handleUpdateBanner(index, 'overlayOpacity', value[0])}
                            max={80}
                            min={0}
                            step={5}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label>Radio de Borde: {banner.borderRadius || 0}px</Label>
                          <Slider
                            value={[banner.borderRadius || 0]}
                            onValueChange={(value) => handleUpdateBanner(index, 'borderRadius', value[0])}
                            max={20}
                            min={0}
                            step={2}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    )}

                    {/* Pestaña Imagen */}
                    {activeTab === 'image' && (
                      <div>
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
                    )}

                    {/* Pestaña Promociones */}
                    {activeTab === 'promotions' && (
                      <div className="space-y-6">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={banner.showPromotions || false}
                            onCheckedChange={(checked) => handleUpdateBanner(index, 'showPromotions', checked)}
                          />
                          <Label className="text-base font-medium">Mostrar Promociones en el Banner</Label>
                        </div>

                        {banner.showPromotions && (
                          <>
                            <div>
                              <Label>Layout de Promociones</Label>
                              <Select
                                value={banner.promotionLayout || 'grid'}
                                onValueChange={(value) => handleUpdateBanner(index, 'promotionLayout', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="grid">Grid (Cuadrícula)</SelectItem>
                                  <SelectItem value="carousel">Carousel (Carrusel)</SelectItem>
                                  <SelectItem value="featured">Featured (Destacada)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label>Estilo de Promociones</Label>
                              <Select
                                value={banner.promotionStyle || 'cards'}
                                onValueChange={(value) => handleUpdateBanner(index, 'promotionStyle', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="cards">Tarjetas</SelectItem>
                                  <SelectItem value="minimal">Minimalista</SelectItem>
                                  <SelectItem value="highlight">Destacado</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label className="text-base font-medium mb-3 block">
                                Seleccionar Promociones ({availablePromotions.filter(p => p.isActive).length} disponibles)
                              </Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                                {availablePromotions.filter(p => p.isActive).map((promotion) => {
                                  const isSelected = banner.selectedPromotions?.includes(promotion.id) || false
                                  const discount = getDiscountPercentage(promotion.originalPrice, promotion.price)
                                  
                                  return (
                                    <div
                                      key={promotion.id}
                                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                                        isSelected 
                                          ? 'border-blue-500 bg-blue-50' 
                                          : 'border-gray-200 hover:border-gray-300'
                                      }`}
                                      onClick={() => {
                                        const currentSelected = banner.selectedPromotions || []
                                        const newSelected = isSelected
                                          ? currentSelected.filter((id: string) => id !== promotion.id)
                                          : [...currentSelected, promotion.id]
                                        handleUpdateBanner(index, 'selectedPromotions', newSelected)
                                      }}
                                    >
                                      <div className="flex items-center space-x-3">
                                        <div className="relative">
                                          <img
                                            src={promotion.image || '/placeholder.jpg'}
                                            alt={promotion.name}
                                            className="w-12 h-12 rounded object-cover"
                                          />
                                          {discount > 0 && (
                                            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs">
                                              -{discount}%
                                            </Badge>
                                          )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <h4 className="font-semibold text-sm text-gray-900 truncate">
                                            {promotion.name}
                                          </h4>
                                          <p className="text-xs text-gray-600 truncate">
                                            {promotion.description}
                                          </p>
                                          <div className="flex items-center space-x-2 mt-1">
                                            <span className="text-sm font-bold text-red-600">
                                              ${promotion.price}
                                            </span>
                                            {promotion.originalPrice > promotion.price && (
                                              <span className="text-xs text-gray-400 line-through">
                                                ${promotion.originalPrice}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                          isSelected 
                                            ? 'border-blue-500 bg-blue-500' 
                                            : 'border-gray-300'
                                        }`}>
                                          {isSelected && (
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                              {availablePromotions.filter(p => p.isActive).length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                  <Tag className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                  <p>No hay promociones activas disponibles</p>
                                  <p className="text-sm">Crea promociones en la sección de promociones para mostrarlas aquí</p>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Pestaña Promociones */}
                    {activeTab === 'promotions' && (
                      <div className="space-y-6">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={banner.showPromotions || false}
                            onCheckedChange={(checked) => handleUpdateBanner(index, 'showPromotions', checked)}
                          />
                          <Label className="text-base font-medium">Mostrar Promociones en el Banner</Label>
                        </div>

                        {banner.showPromotions && (
                          <>
                            <div>
                              <Label>Layout de Promociones</Label>
                              <Select
                                value={banner.promotionLayout || 'grid'}
                                onValueChange={(value) => handleUpdateBanner(index, 'promotionLayout', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="grid">Grid (Cuadrícula)</SelectItem>
                                  <SelectItem value="carousel">Carousel (Carrusel)</SelectItem>
                                  <SelectItem value="featured">Featured (Destacada)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label>Estilo de Promociones</Label>
                              <Select
                                value={banner.promotionStyle || 'cards'}
                                onValueChange={(value) => handleUpdateBanner(index, 'promotionStyle', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="cards">Tarjetas</SelectItem>
                                  <SelectItem value="minimal">Minimalista</SelectItem>
                                  <SelectItem value="highlight">Destacado</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label className="text-base font-medium mb-3 block">
                                Seleccionar Promociones ({availablePromotions.filter(p => p.isActive).length} disponibles)
                              </Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                                {availablePromotions.filter(p => p.isActive).map((promotion) => {
                                  const isSelected = banner.selectedPromotions?.includes(promotion.id) || false
                                  const discount = getDiscountPercentage(promotion.originalPrice, promotion.price)
                                  
                                  return (
                                    <div
                                      key={promotion.id}
                                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                                        isSelected 
                                          ? 'border-blue-500 bg-blue-50' 
                                          : 'border-gray-200 hover:border-gray-300'
                                      }`}
                                      onClick={() => {
                                        const currentSelected = banner.selectedPromotions || []
                                        const newSelected = isSelected
                                          ? currentSelected.filter(id => id !== promotion.id)
                                          : [...currentSelected, promotion.id]
                                        handleUpdateBanner(index, 'selectedPromotions', newSelected)
                                      }}
                                    >
                                      <div className="flex items-center space-x-3">
                                        <div className="relative">
                                          <img
                                            src={promotion.image || '/placeholder.jpg'}
                                            alt={promotion.name}
                                            className="w-12 h-12 rounded object-cover"
                                          />
                                          {discount > 0 && (
                                            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs">
                                              -{discount}%
                                            </Badge>
                                          )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <h4 className="font-semibold text-sm text-gray-900 truncate">
                                            {promotion.name}
                                          </h4>
                                          <p className="text-xs text-gray-600 truncate">
                                            {promotion.description}
                                          </p>
                                          <div className="flex items-center space-x-2 mt-1">
                                            <span className="text-sm font-bold text-red-600">
                                              ${promotion.price}
                                            </span>
                                            {promotion.originalPrice > promotion.price && (
                                              <span className="text-xs text-gray-400 line-through">
                                                ${promotion.originalPrice}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                          isSelected 
                                            ? 'border-blue-500 bg-blue-500' 
                                            : 'border-gray-300'
                                        }`}>
                                          {isSelected && (
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                              {availablePromotions.filter(p => p.isActive).length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                  <Tag className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                  <p>No hay promociones activas disponibles</p>
                                  <p className="text-sm">Crea promociones en la sección de promociones para mostrarlas aquí</p>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Vista previa del banner */}
                  <div className="border-t pt-4">
                    <Label className="text-sm font-medium">Vista Previa:</Label>
                    <div 
                      className={`mt-2 h-24 rounded-lg flex items-center justify-center px-4 relative overflow-hidden transition-all duration-500 ${
                        banner.shadow ? 'shadow-2xl' : ''
                      } ${banner.blur ? 'backdrop-blur-sm' : ''}`}
                      style={{
                        background: banner.backgroundColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: banner.borderRadius ? `${banner.borderRadius}px` : '0px'
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
                          <div 
                            className="absolute inset-0"
                            style={{ backgroundColor: `rgba(0, 0, 0, ${(banner.overlayOpacity || 30) / 100})` }}
                          ></div>
                        </>
                      )}
                      
                      <div className={`text-center relative z-10 ${banner.textPosition === 'left' ? 'text-left' : banner.textPosition === 'right' ? 'text-right' : 'text-center'}`}>
                        <h4 
                          className="font-bold text-sm"
                          style={{ color: banner.textColor || '#ffffff' }}
                        >
                          {banner.title}
                        </h4>
                        {banner.subtitle && (
                          <p 
                            className="text-xs opacity-90"
                            style={{ color: banner.textColor || '#ffffff' }}
                          >
                            {banner.subtitle}
                          </p>
                        )}
                      </div>

                      {/* Vista previa de promociones */}
                      {banner.showPromotions && getSelectedPromotions(banner).length > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-white/80 p-1">
                          <div className="flex space-x-1">
                            {getSelectedPromotions(banner).slice(0, 3).map((promotion) => (
                              <div
                                key={promotion.id}
                                className="w-4 h-4 rounded bg-red-500 flex items-center justify-center"
                                title={promotion.name}
                              >
                                <Star className="h-2 w-2 text-white fill-current" />
                              </div>
                            ))}
                            {getSelectedPromotions(banner).length > 3 && (
                              <div className="w-4 h-4 rounded bg-gray-500 flex items-center justify-center">
                                <span className="text-xs text-white">+{getSelectedPromotions(banner).length - 3}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Vista previa de promociones */}
                      {banner.showPromotions && getSelectedPromotions(banner).length > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-white/80 p-1">
                          <div className="flex space-x-1">
                            {getSelectedPromotions(banner).slice(0, 3).map((promotion) => (
                              <div
                                key={promotion.id}
                                className="w-4 h-4 rounded bg-red-500 flex items-center justify-center"
                                title={promotion.name}
                              >
                                <Star className="h-2 w-2 text-white fill-current" />
                              </div>
                            ))}
                            {getSelectedPromotions(banner).length > 3 && (
                              <div className="w-4 h-4 rounded bg-gray-500 flex items-center justify-center">
                                <span className="text-xs text-white">+{getSelectedPromotions(banner).length - 3}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <Button onClick={handleAddBanner} className="w-full">
                + Agregar Nuevo Banner
              </Button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes zoom-in {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes flip-in {
          from { transform: rotateY(90deg); opacity: 0; }
          to { transform: rotateY(0deg); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-in-out;
        }
        .animate-slide-in {
          animation: slide-in 0.6s ease-out;
        }
        .animate-zoom-in {
          animation: zoom-in 0.5s ease-out;
        }
        .animate-flip-in {
          animation: flip-in 0.6s ease-out;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-200,
        .animation-delay-400 {
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  )
}
