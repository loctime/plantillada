"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Globe, 
  ShoppingCart, 
  MessageSquare, 
  Layers, 
  CheckCircle,
  ExternalLink,
  Settings
} from "lucide-react"

interface Template {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  features: string[]
  status: 'active' | 'coming-soon' | 'beta'
  route: string
  color: string
}

const templates: Template[] = [
  {
    id: 'landing',
    name: 'Landing Page',
    description: 'Página de aterrizaje profesional con formularios de contacto y conversión',
    icon: <Globe className="h-6 w-6" />,
    features: [
      'Formularios de contacto',
      'Secciones editables',
      'Integración con Calendly',
      'Testimonios dinámicos',
      'SEO optimizado'
    ],
    status: 'active',
    route: '/',
    color: 'bg-blue-500'
  },
  {
    id: 'shop',
    name: 'Tienda Online',
    description: 'E-commerce completo con carrito, pagos y sistema de clonación de productos',
    icon: <ShoppingCart className="h-6 w-6" />,
    features: [
      'Catálogo de productos',
      'Carrito de compras',
      'Sistema de clonación',
      'Gestión de inventario',
      'Procesamiento de pagos',
      'Sistema de delivery'
    ],
    status: 'active',
    route: '/shop',
    color: 'bg-green-500'
  },
  {
    id: 'multi-page',
    name: 'Sitio Multi-Página',
    description: 'Combinación de landing, tienda y otras secciones en un solo sitio',
    icon: <Layers className="h-6 w-6" />,
    features: [
      'Landing page principal',
      'Tienda integrada',
      'Blog/Foro (próximamente)',
      'Páginas adicionales',
      'Navegación unificada'
    ],
    status: 'beta',
    route: '/multi',
    color: 'bg-purple-500'
  },
  {
    id: 'forum',
    name: 'Foro Comunitario',
    description: 'Plataforma de discusión y comunidad con moderación',
    icon: <MessageSquare className="h-6 w-6" />,
    features: [
      'Foros por categorías',
      'Sistema de usuarios',
      'Moderación de contenido',
      'Notificaciones',
      'Búsqueda avanzada'
    ],
    status: 'coming-soon',
    route: '/forum',
    color: 'bg-orange-500'
  }
]

interface TemplateSelectorProps {
  onTemplateSelect: (template: Template) => void
  currentTemplate?: string
}

export function TemplateSelector({ onTemplateSelect, currentTemplate }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(currentTemplate || null)

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template.id)
    onTemplateSelect(template)
  }

  const getStatusBadge = (status: Template['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Activo</Badge>
      case 'beta':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Beta</Badge>
      case 'coming-soon':
        return <Badge variant="outline" className="text-gray-500">Próximamente</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Selecciona tu Plantilla</h2>
        <p className="text-muted-foreground">
          Elige el tipo de sitio web que mejor se adapte a tus necesidades
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedTemplate === template.id 
                ? 'ring-2 ring-primary border-primary' 
                : 'hover:border-gray-300'
            }`}
            onClick={() => handleTemplateSelect(template)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${template.color} text-white`}>
                    {template.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    {getStatusBadge(template.status)}
                  </div>
                </div>
                {selectedTemplate === template.id && (
                  <CheckCircle className="h-5 w-5 text-primary" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-sm">
                {template.description}
              </CardDescription>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Características:</h4>
                <ul className="space-y-1">
                  {template.features.map((feature, index) => (
                    <li key={index} className="text-xs text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 bg-primary rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(template.route, '_blank')
                  }}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Ver Demo
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1"
                  disabled={template.status === 'coming-soon'}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleTemplateSelect(template)
                  }}
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Configurar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTemplate && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Plantilla seleccionada: <strong>{templates.find(t => t.id === selectedTemplate)?.name}</strong>
          </p>
        </div>
      )}
    </div>
  )
}
