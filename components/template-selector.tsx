"use client"

import { useState, useEffect } from "react"
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
  Settings,
  Brain
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
  },
  {
    id: 'psicologos',
    name: 'Centro de Psicología',
    description: 'Sitio web profesional para psicólogos y terapeutas',
    icon: <Brain className="h-6 w-6" />,
    features: [
      'Terapia individual y grupal',
      'Especialidades terapéuticas',
      'Agendamiento de sesiones',
      'Testimonios de pacientes',
      'Información sobre servicios',
      'Contacto confidencial'
    ],
    status: 'active',
    route: '/psicologos',
    color: 'bg-purple-500'
  }
]

interface TemplateSelectorProps {
  onTemplateSelect: (templates: Template[]) => void
  selectedTemplates?: string[]
}

export function TemplateSelector({ onTemplateSelect, selectedTemplates = [] }: TemplateSelectorProps) {
  const [selectedTemplatesState, setSelectedTemplatesState] = useState<string[]>(selectedTemplates)

  // Sincronizar el estado interno con las props
  useEffect(() => {
    setSelectedTemplatesState(selectedTemplates)
  }, [selectedTemplates])

  const handleTemplateToggle = (template: Template, e: React.MouseEvent | React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    const newSelected = selectedTemplatesState.includes(template.id)
      ? selectedTemplatesState.filter(id => id !== template.id)
      : [...selectedTemplatesState, template.id]
    
    setSelectedTemplatesState(newSelected)
    const selectedTemplatesList = templates.filter(t => newSelected.includes(t.id))
    onTemplateSelect(selectedTemplatesList)
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

             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {templates.map((template) => (
           <Card 
             key={template.id}
             className={`transition-all duration-200 hover:shadow-lg ${
               selectedTemplatesState.includes(template.id)
                 ? 'ring-2 ring-primary border-primary' 
                 : 'hover:border-gray-300'
             }`}
           >
             <CardHeader className="pb-3">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <div className={`p-1.5 rounded-md ${template.color} text-white`}>
                     {template.icon}
                   </div>
                   <div>
                     <CardTitle className="text-sm">{template.name}</CardTitle>
                     {getStatusBadge(template.status)}
                   </div>
                 </div>
                 <div className="flex items-center gap-2">
                   <input
                     type="checkbox"
                     checked={selectedTemplatesState.includes(template.id)}
                     onChange={(e) => handleTemplateToggle(template, e)}
                     className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                   />
                 </div>
               </div>
             </CardHeader>
             <CardContent className="space-y-3 pt-0">
               <CardDescription className="text-xs">
                 {template.description}
               </CardDescription>
               
               <div className="space-y-1">
                 <h4 className="font-medium text-xs">Características:</h4>
                 <ul className="space-y-0.5">
                   {template.features.slice(0, 3).map((feature, index) => (
                     <li key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                       <div className="w-1 h-1 bg-primary rounded-full" />
                       {feature}
                     </li>
                   ))}
                   {template.features.length > 3 && (
                     <li className="text-xs text-muted-foreground">
                       +{template.features.length - 3} más...
                     </li>
                   )}
                 </ul>
               </div>

               <div className="flex gap-1 pt-1">
                 <Button 
                   variant="outline" 
                   size="sm" 
                   className="flex-1 text-xs h-7"
                   onClick={(e) => {
                     e.stopPropagation()
                     window.open(template.route, '_blank')
                   }}
                 >
                   <ExternalLink className="h-3 w-3 mr-1" />
                   Ver Página
                 </Button>
               </div>
             </CardContent>
           </Card>
         ))}
       </div>

             {selectedTemplatesState.length > 0 && (
         <div className="text-center">
           <p className="text-sm text-muted-foreground">
             Plantillas seleccionadas: <strong>{selectedTemplatesState.length}</strong>
           </p>
           <p className="text-xs text-muted-foreground mt-1">
             Estas plantillas aparecerán como enlaces en la navegación
           </p>
         </div>
       )}
    </div>
  )
}
