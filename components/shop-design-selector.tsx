"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Palette, 
  CheckCircle, 
  Layout, 
  Smartphone, 
  Monitor,
  Grid3X3,
  List,
  Menu,
  Sidebar,
  Settings,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { shopDesigns, Design } from "@/lib/designs"

interface ShopDesignSelectorProps {
  selectedDesign?: string
  onDesignSelect?: (design: Design) => void
  onLayoutChange?: (layout: 'mobile-first' | 'web-first') => void
  onProductStyleChange?: (style: 'cards-square' | 'list-horizontal' | 'menu-vertical') => void
  onSidebarChange?: (sidebar: boolean) => void
  className?: string
  fullWidth?: boolean
}

interface LayoutConfig {
  design: string
  layout: 'mobile-first' | 'web-first'
  productStyle: 'cards-square' | 'list-horizontal' | 'menu-vertical'
  sidebar: boolean
}

export function ShopDesignSelector({ 
  selectedDesign, 
  onDesignSelect,
  onLayoutChange,
  onProductStyleChange,
  onSidebarChange,
  className = "",
  fullWidth = false
}: ShopDesignSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>({
    design: selectedDesign || 'food-shop',
    layout: 'mobile-first',
    productStyle: 'cards-square',
    sidebar: false
  })

  const currentDesign = shopDesigns.find(d => d.id === layoutConfig.design)

  const handleDesignSelect = (designId: string) => {
    const design = shopDesigns.find(d => d.id === designId)
    if (design) {
      setLayoutConfig(prev => ({ ...prev, design: designId }))
      onDesignSelect?.(design)
    }
  }

  const handleLayoutChange = (layout: 'mobile-first' | 'web-first') => {
    setLayoutConfig(prev => ({ ...prev, layout }))
    onLayoutChange?.(layout)
  }

  const handleProductStyleChange = (style: 'cards-square' | 'list-horizontal' | 'menu-vertical') => {
    setLayoutConfig(prev => ({ ...prev, productStyle: style }))
    onProductStyleChange?.(style)
  }

  const handleSidebarChange = (sidebar: boolean) => {
    setLayoutConfig(prev => ({ ...prev, sidebar }))
    onSidebarChange?.(sidebar)
  }

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section)
  }

  const getLayoutIcon = () => {
    return layoutConfig.layout === 'mobile-first' ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />
  }

  const getProductStyleIcon = () => {
    return layoutConfig.productStyle === 'cards-square' ? <Grid3X3 className="h-4 w-4" /> : <List className="h-4 w-4" />
  }

  return (
    <div className={`relative ${className}`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className={`justify-between ${fullWidth ? 'w-full' : ''}`}
          >
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span>Configurar Diseño</span>
            </div>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0" align="end">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-sm">Configuración de Diseño</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Personaliza la apariencia de tu tienda
            </p>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {/* Sección 1: Selección de Diseño */}
            <div className="border-b">
              <button
                onClick={() => toggleSection('design')}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Palette className="h-5 w-5 text-blue-500" />
                  <div className="text-left">
                    <p className="font-medium text-sm">Diseño Principal</p>
                    <p className="text-xs text-muted-foreground">
                      {currentDesign?.name}
                    </p>
                  </div>
                </div>
                {activeSection === 'design' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              
              {activeSection === 'design' && (
                <div className="px-4 pb-4 space-y-2">
                  {shopDesigns.map((design) => (
                    <Card 
                      key={design.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        layoutConfig.design === design.id 
                          ? 'ring-2 ring-blue-500 border-blue-500' 
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => handleDesignSelect(design.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="text-blue-500">
                            {design.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{design.name}</h4>
                            <p className="text-xs text-muted-foreground">{design.description}</p>
                          </div>
                          {layoutConfig.design === design.id && (
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Sección 2: Enfoque de Dispositivo */}
            <div className="border-b">
              <button
                onClick={() => toggleSection('device')}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  {getLayoutIcon()}
                  <div className="text-left">
                    <p className="font-medium text-sm">Enfoque de Dispositivo</p>
                    <p className="text-xs text-muted-foreground">
                      {layoutConfig.layout === 'mobile-first' ? 'Mobile-First' : 'Web-First'}
                    </p>
                  </div>
                </div>
                {activeSection === 'device' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              
              {activeSection === 'device' && (
                <div className="px-4 pb-4 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Card 
                      className={`cursor-pointer transition-all ${
                        layoutConfig.layout === 'mobile-first' 
                          ? 'ring-2 ring-blue-500 border-blue-500' 
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => handleLayoutChange('mobile-first')}
                    >
                      <CardContent className="p-3 text-center">
                        <Smartphone className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                        <p className="font-medium text-sm">Mobile-First</p>
                        <p className="text-xs text-muted-foreground">Optimizado para móviles</p>
                      </CardContent>
                    </Card>
                    
                    <Card 
                      className={`cursor-pointer transition-all ${
                        layoutConfig.layout === 'web-first' 
                          ? 'ring-2 ring-blue-500 border-blue-500' 
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => handleLayoutChange('web-first')}
                    >
                      <CardContent className="p-3 text-center">
                        <Monitor className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                        <p className="font-medium text-sm">Web-First</p>
                        <p className="text-xs text-muted-foreground">Optimizado para desktop</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>

            {/* Sección 3: Estilo de Productos */}
            <div className="border-b">
              <button
                onClick={() => toggleSection('products')}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  {getProductStyleIcon()}
                  <div className="text-left">
                    <p className="font-medium text-sm">Estilo de Productos</p>
                    <p className="text-xs text-muted-foreground">
                      {layoutConfig.productStyle === 'cards-square' ? 'Tarjetas Cuadradas' : 'Lista Horizontal'}
                    </p>
                  </div>
                </div>
                {activeSection === 'products' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              
              {activeSection === 'products' && (
                <div className="px-4 pb-4 space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <Card 
                      className={`cursor-pointer transition-all ${
                        layoutConfig.productStyle === 'cards-square' 
                          ? 'ring-2 ring-blue-500 border-blue-500' 
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => handleProductStyleChange('cards-square')}
                    >
                      <CardContent className="p-3 text-center">
                        <Grid3X3 className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                        <p className="font-medium text-sm">Tarjetas</p>
                        <p className="text-xs text-muted-foreground">Grid compacto</p>
                      </CardContent>
                    </Card>
                    
                    <Card 
                      className={`cursor-pointer transition-all ${
                        layoutConfig.productStyle === 'list-horizontal' 
                          ? 'ring-2 ring-blue-500 border-blue-500' 
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => handleProductStyleChange('list-horizontal')}
                    >
                      <CardContent className="p-3 text-center">
                        <List className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                        <p className="font-medium text-sm">Lista</p>
                        <p className="text-xs text-muted-foreground">Lista elegante</p>
                      </CardContent>
                    </Card>

                    <Card 
                      className={`cursor-pointer transition-all ${
                        layoutConfig.productStyle === 'menu-vertical' 
                          ? 'ring-2 ring-blue-500 border-blue-500' 
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => handleProductStyleChange('menu-vertical')}
                    >
                      <CardContent className="p-3 text-center">
                        <Menu className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                        <p className="font-medium text-sm">Menú</p>
                        <p className="text-xs text-muted-foreground">Ancho completo</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>

            {/* Sección 4: Sidebar */}
            <div className="border-b">
              <button
                onClick={() => toggleSection('sidebar')}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Sidebar className="h-5 w-5 text-blue-500" />
                  <div className="text-left">
                    <p className="font-medium text-sm">Sidebar</p>
                    <p className="text-xs text-muted-foreground">
                      {layoutConfig.sidebar ? 'Activado' : 'Desactivado'}
                    </p>
                  </div>
                </div>
                {activeSection === 'sidebar' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              
              {activeSection === 'sidebar' && (
                <div className="px-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Mostrar Sidebar</p>
                      <p className="text-xs text-muted-foreground">
                        Panel lateral con filtros y navegación
                      </p>
                    </div>
                    <Button
                      variant={layoutConfig.sidebar ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSidebarChange(!layoutConfig.sidebar)}
                    >
                      {layoutConfig.sidebar ? "Activado" : "Desactivado"}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Resumen de Configuración */}
            <div className="p-4 bg-gray-50">
              <h4 className="font-medium text-sm mb-2">Configuración Actual</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Diseño:</span>
                  <Badge variant="secondary">{currentDesign?.name}</Badge>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Enfoque:</span>
                  <Badge variant="secondary">
                    {layoutConfig.layout === 'mobile-first' ? 'Mobile-First' : 'Web-First'}
                  </Badge>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Productos:</span>
                  <Badge variant="secondary">
                    {layoutConfig.productStyle === 'cards-square' ? 'Tarjetas' : 
                     layoutConfig.productStyle === 'list-horizontal' ? 'Lista' : 'Menú'}
                  </Badge>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Sidebar:</span>
                  <Badge variant={layoutConfig.sidebar ? "default" : "secondary"}>
                    {layoutConfig.sidebar ? 'Sí' : 'No'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
