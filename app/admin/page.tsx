"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Save, Eye, EyeOff, Settings, User, ShoppingCart, Calendar, Quote, Globe, Layers, Palette, Download, LogOut } from "lucide-react"
import { Config, getTenantId } from "@/lib/config-loader"
import { useAdmin } from "@/lib/admin-context"
import { TemplateSelector } from "@/components/template-selector"
import { DesignSelector } from "@/components/design-selector"
import BackupManager from "@/components/backup-manager"
import { PriceVisibilityToggle } from "@/components/price-visibility-toggle"
import { NavigationManager } from "@/components/navigation-manager"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { useRouter } from "next/navigation"
import { AdminLoginModal } from "@/components/admin-login-modal"

type LinkHubProfile = {
  name: string
  bio: string
  avatar: string
  location?: string
  email?: string
  phone?: string
}

type LinkHubLink = {
  id: string
  title: string
  url: string
  icon?: string
  category?: string
  isActive?: boolean
}

type LinkHubTheme = {
  primaryColor: string
  backgroundColor: string
  textColor: string
  accentColor: string
}

type LinkHubSocial = {
  instagram?: string
  twitter?: string
  linkedin?: string
  youtube?: string
  facebook?: string
  website?: string
}

type AdminFormData = Omit<Config, 'linkHub'> & {
  linkHub?: {
    profile?: Partial<LinkHubProfile>
    links?: LinkHubLink[]
    theme?: Partial<LinkHubTheme>
    social?: Partial<LinkHubSocial>
  }
}

export default function AdminPage() {
  const { updateConfig, config: adminCtxConfig } = useAdmin()
  const { isAuthenticated, logout } = useAdminAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [currentTenant, setCurrentTenant] = useState("")
  const [activeTemplates, setActiveTemplates] = useState<string[]>(['landing'])
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [showDesignSelector, setShowDesignSelector] = useState(false)
  const [selectedDesigns, setSelectedDesigns] = useState<{[key: string]: string}>({})

  // Función helper para validar y completar configuración con valores por defecto
  const validateAndCompleteConfig = (config: any): AdminFormData => {
    return {
      site: {
        title: "Tu Marca Personal",
        tagline: "Acompañamiento 1:1 y formación práctica para cambios reales.",
        ...config.site
      },
      integrations: {
        calendlyUrl: "https://calendly.com/tu-usuario/sesion",
        hotmartBaseUrl: "https://pay.hotmart.com",
        ...config.integrations
      },
      sessions: config.sessions || [
        {
          id: "sesion-claridad",
          name: "Sesión de Claridad",
          summary: "Define tu objetivo y el plan inmediato de 30 días.",
          duration: "60 min",
          price: "€99",
          features: [
            "Diagnóstico inicial y mapa de objetivos",
            "Prioridades y plan de acción",
            "Seguimiento por email 7 días"
          ],
          hotmartUrl: "https://pay.hotmart.com/TU_CHECKOUT_1"
        }
      ],
      course: {
        title: "Curso Online: Sistema de Productividad Sencilla",
        blurb: "Aprende a construir un sistema ligero para enfocarte, priorizar con calma y avanzar cada semana sin fricción.",
        price: "€179",
        hotmartUrl: "https://pay.hotmart.com/TU_CHECKOUT_CURSO",
        videoUrl: "",
        bullets: [
          "Estructura de planificación semanal en 30 minutos",
          "Métricas simples para medir progreso",
          "Plantillas reutilizables y ejemplos",
          "Casos prácticos y ejercicios guiados"
        ],
        ...config.course
      },
      about: {
        photoUrl: "/placeholder.svg?height=520&width=420",
        videoUrl: "",
        story: "Soy [Tu Nombre], consultor y coach con X años ayudando a profesionales a ganar claridad, enfocarse y ejecutar con calma.",
        whyMe: "He acompañado a +300 clientes en sectores diversos.",
        ...config.about
      },
      testimonials: config.testimonials || [
        {
          quote: "En dos sesiones definimos un plan claro y recuperé la motivación.",
          author: "María G.",
          role: "Marketing Specialist"
        }
      ],
      contact: {
        email: "hola@tumarca.com",
        emails: [],
        phones: [],
        addresses: [],
        cbus: [],
        cuits: [],
        urls: [],
        ...config.contact
      },
      legal: {
        termsUrl: "",
        privacyUrl: "",
        ...config.legal
      },
      linkHub: config.linkHub,
      ...config
    }
  }
  const [formData, setFormData] = useState<AdminFormData>({
    site: {
      title: "Tu Marca Personal",
      tagline: "Acompañamiento 1:1 y formación práctica para cambios reales."
    },
    integrations: {
      calendlyUrl: "https://calendly.com/tu-usuario/sesion",
      hotmartBaseUrl: "https://pay.hotmart.com"
    },
    sessions: [
      {
        id: "sesion-claridad",
        name: "Sesión de Claridad",
        summary: "Define tu objetivo y el plan inmediato de 30 días.",
        duration: "60 min",
        price: "€99",
        features: [
          "Diagnóstico inicial y mapa de objetivos",
          "Prioridades y plan de acción",
          "Seguimiento por email 7 días"
        ],
        hotmartUrl: "https://pay.hotmart.com/TU_CHECKOUT_1"
      }
    ],
    course: {
      title: "Curso Online: Sistema de Productividad Sencilla",
      blurb: "Aprende a construir un sistema ligero para enfocarte, priorizar con calma y avanzar cada semana sin fricción.",
      price: "€179",
      hotmartUrl: "https://pay.hotmart.com/TU_CHECKOUT_CURSO",
      videoUrl: "",
      bullets: [
        "Estructura de planificación semanal en 30 minutos",
        "Métricas simples para medir progreso",
        "Plantillas reutilizables y ejemplos",
        "Casos prácticos y ejercicios guiados"
      ]
    },
    about: {
      photoUrl: "/placeholder.svg?height=520&width=420",
      videoUrl: "",
      story: "Soy [Tu Nombre], consultor y coach con X años ayudando a profesionales a ganar claridad, enfocarse y ejecutar con calma.",
      whyMe: "He acompañado a +300 clientes en sectores diversos."
    },
    testimonials: [
      {
        quote: "En dos sesiones definimos un plan claro y recuperé la motivación.",
        author: "María G.",
        role: "Marketing Specialist"
      }
    ],
          contact: {
        email: "hola@tumarca.com",
        emails: [],
        phones: [],
        whatsappPhone: "",
        addresses: [],
        cbus: [],
        cuits: [],
        urls: []
      },
    legal: {
      termsUrl: "",
      privacyUrl: ""
    },
    linkHub: {
      profile: {
        name: "Tu Nombre",
        bio: "Descripción personal o profesional. Comparte tu historia, pasiones o lo que haces.",
        avatar: "/placeholder-user.jpg",
        location: "Ciudad, País",
        email: "tu@email.com",
        phone: "+34 600 000 000"
      },
      links: [
        {
          id: "website",
          title: "Mi Sitio Web",
          url: "https://tusitio.com",
          icon: "🌐",
          category: "principal",
          isActive: true
        },
        {
          id: "portfolio",
          title: "Portfolio",
          url: "https://portfolio.com",
          icon: "💼",
          category: "trabajo",
          isActive: true
        },
        {
          id: "blog",
          title: "Blog",
          url: "https://blog.com",
          icon: "✍️",
          category: "contenido",
          isActive: true
        },
        {
          id: "contact",
          title: "Contacto",
          url: "mailto:tu@email.com",
          icon: "📧",
          category: "contacto",
          isActive: true
        }
      ],
      theme: {
        primaryColor: "#8b5cf6",
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
        accentColor: "#f3f4f6"
      },
      social: {
        instagram: "https://instagram.com/tuusuario",
        twitter: "https://twitter.com/tuusuario",
        linkedin: "https://linkedin.com/in/tuusuario",
        youtube: "https://youtube.com/@tucanal",
        facebook: "https://facebook.com/tupagina",
        website: "https://tusitio.com"
      }
    }
  })

  // Función reutilizable para cargar configuración guardada
  const loadInitialConfig = async () => {
    try {
      const response = await fetch('/api/config')
      if (response.ok) {
        const config = await response.json()
        
        // Validar y completar propiedades faltantes con valores por defecto
        const validatedConfig = validateAndCompleteConfig(config)
        
        setFormData(validatedConfig)
        if (config.activeTemplates) setActiveTemplates(config.activeTemplates)
        else if (config.selectedTemplates) setActiveTemplates(config.selectedTemplates)
        if (config.selectedDesigns) setSelectedDesigns(config.selectedDesigns)
      }
    } catch (error) {
      console.error('Error loading config:', error)
    }
  }

  // Cargar configuración al montar el componente
  useEffect(() => {
    const tenant = getTenantId()
    setCurrentTenant(tenant)
    loadInitialConfig()
  }, [])

  // Sincronizar con la configuración del contexto para evitar sobrescribir
  // cambios hechos desde otros lugares (selector rápido, editor de colores, etc.)
  useEffect(() => {
    try {
      if (adminCtxConfig) {
        // Validar y completar propiedades faltantes con valores por defecto
        const validatedConfig = validateAndCompleteConfig(adminCtxConfig)
        
        setFormData(validatedConfig)
        if (adminCtxConfig.selectedDesigns) setSelectedDesigns(adminCtxConfig.selectedDesigns)
      }
    } catch (error) {
      console.error('Error syncing with admin context:', error)
    }
  }, [adminCtxConfig])

  const handleTemplateSelect = async (templates: any[]) => {
    const templateIds = templates.map(t => t.id)
    setActiveTemplates(templateIds)
    // No cerrar el selector automáticamente - setShowTemplateSelector(false)
    
    // Guardar automáticamente la configuración con las plantillas seleccionadas
    const updatedConfig = {
      ...formData,
      activeTemplates: templateIds
    }
    setFormData(updatedConfig)
    
    // Guardar en Firestore
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedConfig),
      })
      
      if (response.ok) {
        const templateNames = templates.map(t => t.name).join(', ')
        setMessage(`✅ Plantillas seleccionadas: ${templateNames}`)
      } else {
        setMessage("❌ Error al guardar las plantillas")
      }
    } catch (error) {
      console.error('Error saving templates:', error)
      setMessage("❌ Error al guardar las plantillas")
    }
  }

  const handleDesignSelect = async (design: any) => {
    const newSelectedDesigns = {
      ...selectedDesigns,
      [design.category]: design.id
    }
    setSelectedDesigns(newSelectedDesigns)
    
    // Guardar en Firestore y sincronizar el contexto (evita que otros editores lo sobreescriban)
    try {
      await updateConfig({ selectedDesigns: newSelectedDesigns } as any)
      setFormData(prev => ({ ...prev, selectedDesigns: newSelectedDesigns }))
      setMessage(`✅ Diseño seleccionado: ${design.name}`)
    } catch (error) {
      console.error('Error saving design:', error)
      setMessage("❌ Error al guardar el diseño")
    }
  }

  const loadTemplateConfig = async (templateId: string) => {
    try {
      const response = await fetch(`/api/config?template=${templateId}`)
      if (response.ok) {
        const config = await response.json()
        setFormData(config)
      }
    } catch (error) {
      console.error('Error loading template config:', error)
    }
  }



  const handleLogout = () => {
    logout()
    router.push('/')
  }

  // Función para recargar la configuración desde Firebase
  const reloadConfig = async () => {
    try {
      const response = await fetch('/api/config')
      if (response.ok) {
        const freshConfig = await response.json()
        updateConfig(freshConfig)
        console.log('🔄 Configuración recargada desde Firebase')
      }
    } catch (error) {
      console.error('❌ Error recargando configuración:', error)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    setMessage("")
    
    try {
      // Usar formData para guardar los cambios del formulario
      const payload = formData
      console.log('Enviando configuración del formulario:', payload)
      
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      
      console.log('Respuesta recibida:', response.status, response.statusText)
      
      let result
      try {
        result = await response.json()
        console.log('Resultado parseado:', result)
      } catch (parseError) {
        console.error('Error parseando respuesta:', parseError)
        setMessage("❌ Error: Respuesta inválida del servidor")
        return
      }
      
      if (response.ok) {
        setMessage(result.message || "✅ Configuración guardada exitosamente")
        console.log('✅ Guardado exitoso')
        
        // Actualizar el contexto global para que se refleje inmediatamente en toda la app
        updateConfig(payload)
        
        // Recargar la configuración desde Firebase para asegurar sincronización
        await reloadConfig()
        
        // Mostrar mensaje adicional sobre la actualización del título
        setTimeout(() => {
          setMessage("✅ Configuración guardada. El título de la página se ha actualizado automáticamente.")
        }, 1000)
        
      } else {
        setMessage(`❌ Error: ${result.error || result.details || 'Error al guardar la configuración'}`)
        console.error('❌ Error en respuesta:', result)
      }
    } catch (error) {
      console.error('❌ Error de red:', error)
      setMessage(`❌ Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      setIsLoading(false)
      console.log('🔄 Estado de carga actualizado: false')
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev } as any
      const keys = field.split('.')
      let current = newData
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]] = value
      return newData
    })
  }

  // Estado para mostrar el modal de login
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false)
  
  useEffect(() => {
    // Esperar un poco para que useAdminAuth se inicialice completamente
    const timer = setTimeout(() => {
      setHasCheckedAuth(true)
      if (!isAuthenticated) {
        setShowLoginModal(true)
      }
    }, 500)
    
    return () => clearTimeout(timer)
  }, [isAuthenticated])

  // Actualizar dinámicamente el título de la pestaña y el favicon según el título del sitio en el panel
  useEffect(() => {
    if (typeof document === 'undefined') return
    const siteTitle = formData?.site?.title || 'Tu Marca Personal'
    document.title = siteTitle

    const initial = (siteTitle.trim()[0] || 'T').toUpperCase()
    const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'>\n  <rect x='0' y='0' width='64' height='64' rx='12' fill='#10b981'/>\n  <text x='32' y='42' text-anchor='middle' font-family='Arial, Helvetica, sans-serif' font-size='36' fill='#ffffff'>${initial}</text>\n</svg>`
    const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`

    let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null
    if (!link) {
      link = document.createElement('link')
      link.setAttribute('rel', 'icon')
      document.head.appendChild(link)
    }
    link.setAttribute('href', dataUrl)
  }, [formData?.site?.title])

  // Mostrar loading mientras se verifica la autenticación
  if (!hasCheckedAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  // Mostrar modal de login si no está autenticado
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4">
            <Settings className="h-12 w-12 mx-auto text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Panel de Administración</h1>
          <p className="text-muted-foreground mb-6">Necesitas autenticarte para acceder al panel</p>
          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Iniciar Sesión
          </button>
        </div>
        
        {/* Modal de login */}
        {showLoginModal && (
          <AdminLoginModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={() => setShowLoginModal(false)}
          />
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Panel de Administración</h1>
              <p className="text-muted-foreground">
                Configura tu sitio web desde aquí
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4" />
                <span>Tenant: <strong>{currentTenant}</strong></span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>

        

        {message && (
          <Alert className="mb-6">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

         <Tabs defaultValue="general" className="space-y-6">
                     <TabsList>
             <TabsTrigger value="general">General</TabsTrigger>
             <TabsTrigger value="designs">Diseños</TabsTrigger>
             <TabsTrigger value="integrations">Integraciones</TabsTrigger>
             <TabsTrigger value="sessions">Sesiones 1:1</TabsTrigger>
             <TabsTrigger value="course">Curso Online</TabsTrigger>
             <TabsTrigger value="about">Sobre Mí</TabsTrigger>
             <TabsTrigger value="testimonials">Testimonios</TabsTrigger>
             <TabsTrigger value="linkhub">Link Hub</TabsTrigger>
             <TabsTrigger value="legal">Legal</TabsTrigger>
             <TabsTrigger value="backups">Backups</TabsTrigger>
           </TabsList>

                     <TabsContent value="general" className="space-y-6">
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <Settings className="h-5 w-5" />
                   Configuración General
                 </CardTitle>
                 <CardDescription>
                   Información básica del sitio
                 </CardDescription>
               </CardHeader>
               <CardContent className="space-y-6">
                 <div className="space-y-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label htmlFor="title">Título del Sitio</Label>
                       <Input
                         id="title"
                         value={formData.site.title}
                         onChange={(e) => handleInputChange("site.title", e.target.value)}
                       />
                     </div>
                     <div className="space-y-2">
                       <Label htmlFor="tagline">Tagline</Label>
                       <Input
                         id="tagline"
                         value={formData.site.tagline}
                         onChange={(e) => handleInputChange("site.tagline", e.target.value)}
                       />
                     </div>
                   </div>
                   <div className="space-y-4">
                     <div className="space-y-2">
                       <Label htmlFor="contactEmail">Email de Contacto</Label>
                       <Input
                         id="contactEmail"
                         type="email"
                         value={formData.contact.email}
                         onChange={(e) => handleInputChange("contact.email", e.target.value)}
                       />
                     </div>
                     <div className="space-y-2">
                       <div className="flex items-center justify-between">
                         <Label>Emails</Label>
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => {
                             const current = formData.contact.emails || []
                             setFormData({
                               ...formData,
                               contact: { ...formData.contact, emails: [...current, ""] }
                             })
                           }}
                         >
                           Agregar Email
                         </Button>
                       </div>
                       <div className="space-y-2">
                         {(formData.contact.emails || []).map((email, index) => (
                           <div key={index} className="flex gap-2">
                             <Input
                               type="email"
                               value={email}
                               placeholder="contacto@ejemplo.com"
                               onChange={(e) => {
                                 const emails = [...(formData.contact.emails || [])]
                                 emails[index] = e.target.value
                                 setFormData({ ...formData, contact: { ...formData.contact, emails } })
                               }}
                             />
                             <Button
                               variant="outline"
                               onClick={() => {
                                 const emails = [...(formData.contact.emails || [])]
                                 emails.splice(index, 1)
                                 setFormData({ ...formData, contact: { ...formData.contact, emails } })
                               }}
                             >
                               Eliminar
                             </Button>
                           </div>
                         ))}
                       </div>
                     </div>
                     <Separator />
                     <div className="space-y-2">
                       <div className="flex items-center justify-between">
                         <Label>Teléfonos</Label>
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => {
                             const current = formData.contact.phones || []
                             setFormData({
                               ...formData,
                               contact: { ...formData.contact, phones: [...current, ""] }
                             })
                           }}
                         >
                           Agregar Teléfono
                         </Button>
                       </div>
                       <div className="space-y-2">
                         {(formData.contact.phones || []).map((phone, index) => (
                           <div key={index} className="flex gap-2">
                             <Input
                               value={phone}
                               placeholder="+54 9 11 1234 5678"
                               onChange={(e) => {
                                 const phones = [...(formData.contact.phones || [])]
                                 phones[index] = e.target.value
                                 setFormData({ ...formData, contact: { ...formData.contact, phones } })
                               }}
                             />
                             <Button
                               variant="outline"
                               onClick={() => {
                                 const phones = [...(formData.contact.phones || [])]
                                 phones.splice(index, 1)
                                 setFormData({ ...formData, contact: { ...formData.contact, phones } })
                               }}
                             >
                               Eliminar
                             </Button>
                           </div>
                         ))}
                       </div>
                     </div>
                     <Separator />
                     <div className="space-y-2">
                       <div className="flex items-center justify-between">
                         <Label>WhatsApp para Carrito</Label>
                       </div>
                       <div className="space-y-2">
                         <Label className="text-sm text-gray-600">
                           Selecciona qué número de teléfono usar para el carrito de compras
                         </Label>
                         <select
                           value={formData.contact.whatsappPhone || ""}
                           onChange={(e) => {
                             setFormData({
                               ...formData,
                               contact: { ...formData.contact, whatsappPhone: e.target.value }
                             })
                           }}
                           className="w-full p-2 border border-gray-300 rounded-md"
                         >
                           <option value="">-- Seleccionar número para WhatsApp --</option>
                           {(formData.contact.phones || []).map((phone, index) => (
                             <option key={index} value={phone}>
                               {phone || `Teléfono ${index + 1}`}
                             </option>
                           ))}
                         </select>
                         {formData.contact.whatsappPhone && (
                           <p className="text-xs text-green-600">
                             ✅ WhatsApp configurado: {formData.contact.whatsappPhone}
                           </p>
                         )}
                         {!formData.contact.whatsappPhone && (formData.contact.phones || []).length > 0 && (
                           <p className="text-xs text-orange-600">
                             ⚠️ Selecciona un número para que funcione el carrito de WhatsApp
                           </p>
                         )}
                         {(formData.contact.phones || []).length === 0 && (
                           <p className="text-xs text-red-600">
                             ❌ Agrega al menos un número de teléfono arriba
                           </p>
                         )}
                       </div>
                     </div>
                     <Separator />
                     <div className="space-y-2">
                       <div className="flex items-center justify-between">
                         <Label>Direcciones</Label>
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => {
                             const current = formData.contact.addresses || []
                             setFormData({
                               ...formData,
                               contact: { ...formData.contact, addresses: [...current, ""] }
                             })
                           }}
                         >
                           Agregar Dirección
                         </Button>
                       </div>
                       <div className="space-y-2">
                         {(formData.contact.addresses || []).map((address, index) => (
                           <div key={index} className="flex gap-2">
                             <Input
                               value={address}
                               placeholder="Calle 123, Ciudad, País"
                               onChange={(e) => {
                                 const addresses = [...(formData.contact.addresses || [])]
                                 addresses[index] = e.target.value
                                 setFormData({ ...formData, contact: { ...formData.contact, addresses } })
                               }}
                             />
                             <Button
                               variant="outline"
                               onClick={() => {
                                 const addresses = [...(formData.contact.addresses || [])]
                                 addresses.splice(index, 1)
                                 setFormData({ ...formData, contact: { ...formData.contact, addresses } })
                               }}
                             >
                               Eliminar
                             </Button>
                           </div>
                         ))}
                       </div>
                     </div>
                     <div className="space-y-2">
                       <div className="flex items-center justify-between">
                         <Label>CBU</Label>
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => {
                             const current = formData.contact.cbus || []
                             setFormData({
                               ...formData,
                               contact: { ...formData.contact, cbus: [...current, ""] }
                             })
                           }}
                         >
                           Agregar CBU
                         </Button>
                       </div>
                       <div className="space-y-2">
                         {(formData.contact.cbus || []).map((cbu, index) => (
                           <div key={index} className="flex gap-2">
                             <Input
                               value={cbu}
                               placeholder="00000000-00000000000000000000"
                               onChange={(e) => {
                                 const cbus = [...(formData.contact.cbus || [])]
                                 cbus[index] = e.target.value
                                 setFormData({ ...formData, contact: { ...formData.contact, cbus } })
                               }}
                             />
                             <Button
                               variant="outline"
                               onClick={() => {
                                 const cbus = [...(formData.contact.cbus || [])]
                                 cbus.splice(index, 1)
                                 setFormData({ ...formData, contact: { ...formData.contact, cbus } })
                               }}
                             >
                               Eliminar
                             </Button>
                           </div>
                         ))}
                       </div>
                     </div>
                     <div className="space-y-2">
                       <div className="flex items-center justify-between">
                         <Label>CUIT</Label>
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => {
                             const current = formData.contact.cuits || []
                             setFormData({
                               ...formData,
                               contact: { ...formData.contact, cuits: [...current, ""] }
                             })
                           }}
                         >
                           Agregar CUIT
                         </Button>
                       </div>
                       <div className="space-y-2">
                         {(formData.contact.cuits || []).map((cuit, index) => (
                           <div key={index} className="flex gap-2">
                             <Input
                               value={cuit}
                               placeholder="20-12345678-9"
                               onChange={(e) => {
                                 const cuits = [...(formData.contact.cuits || [])]
                                 cuits[index] = e.target.value
                                 setFormData({ ...formData, contact: { ...formData.contact, cuits } })
                               }}
                             />
                             <Button
                               variant="outline"
                               onClick={() => {
                                 const cuits = [...(formData.contact.cuits || [])]
                                 cuits.splice(index, 1)
                                 setFormData({ ...formData, contact: { ...formData.contact, cuits } })
                               }}
                             >
                               Eliminar
                             </Button>
                           </div>
                         ))}
                       </div>
                     </div>
                     <div className="space-y-2">
                       <div className="flex items-center justify-between">
                         <Label>URLs</Label>
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => {
                             const current = formData.contact.urls || []
                             setFormData({
                               ...formData,
                               contact: { ...formData.contact, urls: [...current, ""] }
                             })
                           }}
                         >
                           Agregar URL
                         </Button>
                       </div>
                       <div className="space-y-2">
                         {(formData.contact.urls || []).map((url, index) => (
                           <div key={index} className="flex gap-2">
                             <Input
                               type="url"
                               value={url}
                               placeholder="https://ejemplo.com"
                               onChange={(e) => {
                                 const urls = [...(formData.contact.urls || [])]
                                 urls[index] = e.target.value
                                 setFormData({ ...formData, contact: { ...formData.contact, urls } })
                               }}
                             />
                             <Button
                               variant="outline"
                               onClick={() => {
                                 const urls = [...(formData.contact.urls || [])]
                                 urls.splice(index, 1)
                                 setFormData({ ...formData, contact: { ...formData.contact, urls } })
                               }}
                             >
                               Eliminar
                             </Button>
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>
                 </div>

                 <Separator />

                 <div className="space-y-4">
                   <PriceVisibilityToggle 
                     tenantId={currentTenant}
                     onConfigUpdate={() => {
                       // Recargar configuración después de actualizar
                       loadInitialConfig()
                     }}
                   />
                 </div>

                 <Separator />

                 <div className="space-y-4">
                   <NavigationManager />
                 </div>
               </CardContent>
             </Card>
           </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Calendly
                </CardTitle>
                <CardDescription>
                  Configura la integración con Calendly
                </CardDescription>
              </CardHeader>
                             <CardContent>
                 <div className="space-y-2">
                   <Label htmlFor="calendlyUrl">URL de Calendly</Label>
                   <Input
                     id="calendlyUrl"
                     type="url"
                     placeholder="https://calendly.com/tu-usuario/sesion"
                     value={formData.integrations.calendlyUrl}
                     onChange={(e) => handleInputChange("integrations.calendlyUrl", e.target.value)}
                   />
                   <p className="text-sm text-muted-foreground">
                     Esta es la URL donde los usuarios agendarán sesiones
                   </p>
                 </div>
               </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Curso Online
                </CardTitle>
                <CardDescription>
                  Configura el curso online
                </CardDescription>
              </CardHeader>
                             <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="courseTitle">Título del Curso</Label>
                     <Input
                       id="courseTitle"
                       value={formData.course.title}
                       onChange={(e) => handleInputChange("course.title", e.target.value)}
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="coursePrice">Precio</Label>
                     <Input
                       id="coursePrice"
                       value={formData.course.price}
                       onChange={(e) => handleInputChange("course.price", e.target.value)}
                     />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="courseBlurb">Descripción</Label>
                   <Textarea
                     id="courseBlurb"
                     value={formData.course.blurb}
                     onChange={(e) => handleInputChange("course.blurb", e.target.value)}
                   />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="courseHotmartUrl">URL de Hotmart</Label>
                     <Input
                       id="courseHotmartUrl"
                       type="url"
                       value={formData.course.hotmartUrl}
                       onChange={(e) => handleInputChange("course.hotmartUrl", e.target.value)}
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="courseVideoUrl">URL del Video (YouTube/Vimeo)</Label>
                     <Input
                       id="courseVideoUrl"
                       type="url"
                       value={formData.course.videoUrl}
                       onChange={(e) => handleInputChange("course.videoUrl", e.target.value)}
                     />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <Label>Características del curso (una por línea)</Label>
                   <Textarea
                     value={formData.course.bullets.join('\n')}
                     onChange={(e) => handleInputChange("course.bullets", e.target.value.split('\n').filter(b => b.trim()))}
                     placeholder="Característica 1&#10;Característica 2&#10;Característica 3"
                   />
                 </div>
               </CardContent>
             </Card>
           </TabsContent>

           <TabsContent value="sessions" className="space-y-6">
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <Calendar className="h-5 w-5" />
                   Sesiones 1:1
                 </CardTitle>
                 <CardDescription>
                   Configura las sesiones individuales y sus precios
                 </CardDescription>
               </CardHeader>
               <CardContent className="space-y-6">
                 {formData.sessions.map((session, index) => (
                   <div key={session.id} className="border rounded-lg p-4 space-y-4">
                     <div className="flex items-center justify-between">
                       <h4 className="font-medium">Sesión {index + 1}</h4>
                       <Button
                         variant="outline"
                         size="sm"
                         onClick={() => {
                           const newSessions = [...formData.sessions]
                           newSessions.splice(index, 1)
                           setFormData({ ...formData, sessions: newSessions })
                         }}
                       >
                         Eliminar
                       </Button>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <Label>Nombre de la Sesión</Label>
                         <Input
                           value={session.name}
                           onChange={(e) => {
                             const newSessions = [...formData.sessions]
                             newSessions[index].name = e.target.value
                             setFormData({ ...formData, sessions: newSessions })
                           }}
                         />
                       </div>
                       <div className="space-y-2">
                         <Label>Precio</Label>
                         <Input
                           value={session.price}
                           onChange={(e) => {
                             const newSessions = [...formData.sessions]
                             newSessions[index].price = e.target.value
                             setFormData({ ...formData, sessions: newSessions })
                           }}
                         />
                       </div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <Label>Duración</Label>
                         <Input
                           value={session.duration}
                           onChange={(e) => {
                             const newSessions = [...formData.sessions]
                             newSessions[index].duration = e.target.value
                             setFormData({ ...formData, sessions: newSessions })
                           }}
                         />
                       </div>
                       <div className="space-y-2">
                         <Label>URL de Hotmart</Label>
                         <Input
                           type="url"
                           value={session.hotmartUrl}
                           onChange={(e) => {
                             const newSessions = [...formData.sessions]
                             newSessions[index].hotmartUrl = e.target.value
                             setFormData({ ...formData, sessions: newSessions })
                           }}
                         />
                       </div>
                     </div>
                     <div className="space-y-2">
                       <Label>Resumen</Label>
                       <Textarea
                         value={session.summary}
                         onChange={(e) => {
                           const newSessions = [...formData.sessions]
                           newSessions[index].summary = e.target.value
                           setFormData({ ...formData, sessions: newSessions })
                         }}
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>Características (una por línea)</Label>
                       <Textarea
                         value={session.features.join('\n')}
                         onChange={(e) => {
                           const newSessions = [...formData.sessions]
                           newSessions[index].features = e.target.value.split('\n').filter(f => f.trim())
                           setFormData({ ...formData, sessions: newSessions })
                         }}
                         placeholder="Característica 1&#10;Característica 2&#10;Característica 3"
                       />
                     </div>
                   </div>
                 ))}
                 <Button
                   variant="outline"
                   onClick={() => {
                     const newSession = {
                       id: `sesion-${Date.now()}`,
                       name: "Nueva Sesión",
                       summary: "Descripción de la sesión",
                       duration: "60 min",
                       price: "€99",
                       features: ["Característica 1", "Característica 2"],
                       hotmartUrl: "https://pay.hotmart.com/TU_CHECKOUT"
                     }
                     setFormData({
                       ...formData,
                       sessions: [...formData.sessions, newSession]
                     })
                   }}
                 >
                   Agregar Nueva Sesión
                 </Button>
               </CardContent>
             </Card>
           </TabsContent>

           <TabsContent value="course" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Sobre Mí
                </CardTitle>
                <CardDescription>
                  Información personal y profesional
                </CardDescription>
              </CardHeader>
                             <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="aboutPhotoUrl">URL de la Foto</Label>
                     <Input
                       id="aboutPhotoUrl"
                       type="url"
                       value={formData.about.photoUrl}
                       onChange={(e) => handleInputChange("about.photoUrl", e.target.value)}
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="aboutVideoUrl">URL del Video de Presentación</Label>
                     <Input
                       id="aboutVideoUrl"
                       type="url"
                       value={formData.about.videoUrl}
                       onChange={(e) => handleInputChange("about.videoUrl", e.target.value)}
                     />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="aboutStory">Mi Historia</Label>
                   <Textarea
                     id="aboutStory"
                     rows={4}
                     value={formData.about.story}
                     onChange={(e) => handleInputChange("about.story", e.target.value)}
                   />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="aboutWhyMe">¿Por qué elegirme?</Label>
                   <Textarea
                     id="aboutWhyMe"
                     rows={3}
                     value={formData.about.whyMe}
                     onChange={(e) => handleInputChange("about.whyMe", e.target.value)}
                   />
                 </div>
                              </CardContent>
             </Card>
           </TabsContent>

           <TabsContent value="testimonials" className="space-y-6">
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <Quote className="h-5 w-5" />
                   Testimonios
                 </CardTitle>
                 <CardDescription>
                   Gestiona los testimonios de clientes
                 </CardDescription>
               </CardHeader>
               <CardContent className="space-y-6">
                 {formData.testimonials.map((testimonial, index) => (
                   <div key={index} className="border rounded-lg p-4 space-y-4">
                     <div className="flex items-center justify-between">
                       <h4 className="font-medium">Testimonio {index + 1}</h4>
                       <Button
                         variant="outline"
                         size="sm"
                         onClick={() => {
                           const newTestimonials = [...formData.testimonials]
                           newTestimonials.splice(index, 1)
                           setFormData({ ...formData, testimonials: newTestimonials })
                         }}
                       >
                         Eliminar
                       </Button>
                     </div>
                     <div className="space-y-2">
                       <Label>Testimonio</Label>
                       <Textarea
                         value={testimonial.quote}
                         onChange={(e) => {
                           const newTestimonials = [...formData.testimonials]
                           newTestimonials[index].quote = e.target.value
                           setFormData({ ...formData, testimonials: newTestimonials })
                         }}
                         rows={3}
                       />
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <Label>Nombre del Cliente</Label>
                         <Input
                           value={testimonial.author}
                           onChange={(e) => {
                             const newTestimonials = [...formData.testimonials]
                             newTestimonials[index].author = e.target.value
                             setFormData({ ...formData, testimonials: newTestimonials })
                           }}
                         />
                       </div>
                       <div className="space-y-2">
                         <Label>Cargo/Profesión</Label>
                         <Input
                           value={testimonial.role}
                           onChange={(e) => {
                             const newTestimonials = [...formData.testimonials]
                             newTestimonials[index].role = e.target.value
                             setFormData({ ...formData, testimonials: newTestimonials })
                           }}
                         />
                       </div>
                     </div>
                   </div>
                 ))}
                 <Button
                   variant="outline"
                   onClick={() => {
                     const newTestimonial = {
                       quote: "Nuevo testimonio de cliente",
                       author: "Cliente",
                       role: "Profesión"
                     }
                     setFormData({
                       ...formData,
                       testimonials: [...formData.testimonials, newTestimonial]
                     })
                   }}
                 >
                   Agregar Nuevo Testimonio
                 </Button>
               </CardContent>
             </Card>
           </TabsContent>

           <TabsContent value="linkhub" className="space-y-6">
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <Globe className="h-5 w-5" />
                   Link Hub
                 </CardTitle>
                 <CardDescription>
                   Configura tu concentrador de enlaces personales
                 </CardDescription>
               </CardHeader>
               <CardContent className="space-y-6">
                 {/* Perfil */}
                 <div className="space-y-4">
                   <h4 className="font-medium">Perfil</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label>Nombre</Label>
                       <Input
                         value={formData.linkHub?.profile?.name || ""}
                         onChange={(e) => {
                           setFormData({
                             ...formData,
                             linkHub: {
                               ...formData.linkHub,
                               profile: {
                                 ...formData.linkHub?.profile,
                                 name: e.target.value
                               }
                             }
                           })
                         }}
                         placeholder="Tu nombre"
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>Avatar URL</Label>
                       <Input
                         value={formData.linkHub?.profile?.avatar || ""}
                         onChange={(e) => {
                           setFormData({
                             ...formData,
                             linkHub: {
                               ...formData.linkHub,
                               profile: {
                                 ...formData.linkHub?.profile,
                                 avatar: e.target.value
                               }
                             }
                           })
                         }}
                         placeholder="/placeholder-user.jpg"
                       />
                     </div>
                   </div>
                   <div className="space-y-2">
                     <Label>Biografía</Label>
                     <Textarea
                       value={formData.linkHub?.profile?.bio || ""}
                       onChange={(e) => {
                         setFormData({
                           ...formData,
                           linkHub: {
                             ...formData.linkHub,
                             profile: {
                               ...formData.linkHub?.profile,
                               bio: e.target.value
                             }
                           }
                         })
                       }}
                       placeholder="Descripción personal o profesional"
                       rows={3}
                     />
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="space-y-2">
                       <Label>Ubicación</Label>
                       <Input
                         value={formData.linkHub?.profile?.location || ""}
                         onChange={(e) => {
                           setFormData({
                             ...formData,
                             linkHub: {
                               ...formData.linkHub,
                               profile: {
                                 ...formData.linkHub?.profile,
                                 location: e.target.value
                               }
                             }
                           })
                         }}
                         placeholder="Ciudad, País"
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>Email</Label>
                       <Input
                         value={formData.linkHub?.profile?.email || ""}
                         onChange={(e) => {
                           setFormData({
                             ...formData,
                             linkHub: {
                               ...formData.linkHub,
                               profile: {
                                 ...formData.linkHub?.profile,
                                 email: e.target.value
                               }
                             }
                           })
                         }}
                         placeholder="tu@email.com"
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>Teléfono</Label>
                       <Input
                         value={formData.linkHub?.profile?.phone || ""}
                         onChange={(e) => {
                           setFormData({
                             ...formData,
                             linkHub: {
                               ...formData.linkHub,
                               profile: {
                                 ...formData.linkHub?.profile,
                                 phone: e.target.value
                               }
                             }
                           })
                         }}
                         placeholder="+34 600 000 000"
                       />
                     </div>
                   </div>
                 </div>

                 <Separator />

                 {/* Enlaces */}
                 <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <h4 className="font-medium">Enlaces</h4>
                     <Button
                       variant="outline"
                       size="sm"
                       onClick={() => {
                         const newLink = {
                           id: `link-${Date.now()}`,
                           title: "Nuevo Enlace",
                           url: "https://ejemplo.com",
                           icon: "🔗",
                           category: "general",
                           isActive: true
                         }
                         setFormData({
                           ...formData,
                           linkHub: {
                             ...formData.linkHub,
                             links: [...(formData.linkHub?.links || []), newLink]
                           }
                         })
                       }}
                     >
                       Agregar Enlace
                     </Button>
                   </div>
                   
                    {(formData.linkHub?.links || []).map((link: LinkHubLink, index: number) => (
                     <div key={link.id} className="border rounded-lg p-4 space-y-4">
                       <div className="flex items-center justify-between">
                         <h5 className="font-medium">Enlace {index + 1}</h5>
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => {
                             const newLinks = [...(formData.linkHub?.links || [])]
                             newLinks.splice(index, 1)
                             setFormData({
                               ...formData,
                               linkHub: {
                                 ...formData.linkHub,
                                 links: newLinks
                               }
                             })
                           }}
                         >
                           Eliminar
                         </Button>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-2">
                           <Label>Título</Label>
                           <Input
                             value={link.title}
                             onChange={(e) => {
                               const newLinks = [...(formData.linkHub?.links || [])]
                               newLinks[index].title = e.target.value
                               setFormData({
                                 ...formData,
                                 linkHub: {
                                   ...formData.linkHub,
                                   links: newLinks
                                 }
                               })
                             }}
                           />
                         </div>
                         <div className="space-y-2">
                           <Label>URL</Label>
                           <Input
                             value={link.url}
                             onChange={(e) => {
                               const newLinks = [...(formData.linkHub?.links || [])]
                               newLinks[index].url = e.target.value
                               setFormData({
                                 ...formData,
                                 linkHub: {
                                   ...formData.linkHub,
                                   links: newLinks
                                 }
                               })
                             }}
                           />
                         </div>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-2">
                           <Label>Icono (emoji)</Label>
                           <Input
                             value={link.icon || ""}
                             onChange={(e) => {
                               const newLinks = [...(formData.linkHub?.links || [])]
                               newLinks[index].icon = e.target.value
                               setFormData({
                                 ...formData,
                                 linkHub: {
                                   ...formData.linkHub,
                                   links: newLinks
                                 }
                               })
                             }}
                             placeholder="🔗"
                           />
                         </div>
                         <div className="space-y-2">
                           <Label>Categoría</Label>
                           <Input
                             value={link.category || ""}
                             onChange={(e) => {
                               const newLinks = [...(formData.linkHub?.links || [])]
                               newLinks[index].category = e.target.value
                               setFormData({
                                 ...formData,
                                 linkHub: {
                                   ...formData.linkHub,
                                   links: newLinks
                                 }
                               })
                             }}
                             placeholder="general"
                           />
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>

                 <Separator />

                 {/* Redes Sociales */}
                 <div className="space-y-4">
                   <h4 className="font-medium">Redes Sociales</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label>Instagram</Label>
                       <Input
                         value={formData.linkHub?.social?.instagram || ""}
                         onChange={(e) => {
                           setFormData({
                             ...formData,
                             linkHub: {
                               ...formData.linkHub,
                               social: {
                                 ...formData.linkHub?.social,
                                 instagram: e.target.value
                               }
                             }
                           })
                         }}
                         placeholder="https://instagram.com/tuusuario"
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>Twitter</Label>
                       <Input
                         value={formData.linkHub?.social?.twitter || ""}
                         onChange={(e) => {
                           setFormData({
                             ...formData,
                             linkHub: {
                               ...formData.linkHub,
                               social: {
                                 ...formData.linkHub?.social,
                                 twitter: e.target.value
                               }
                             }
                           })
                         }}
                         placeholder="https://twitter.com/tuusuario"
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>LinkedIn</Label>
                       <Input
                         value={formData.linkHub?.social?.linkedin || ""}
                         onChange={(e) => {
                           setFormData({
                             ...formData,
                             linkHub: {
                               ...formData.linkHub,
                               social: {
                                 ...formData.linkHub?.social,
                                 linkedin: e.target.value
                               }
                             }
                           })
                         }}
                         placeholder="https://linkedin.com/in/tuusuario"
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>YouTube</Label>
                       <Input
                         value={formData.linkHub?.social?.youtube || ""}
                         onChange={(e) => {
                           setFormData({
                             ...formData,
                             linkHub: {
                               ...formData.linkHub,
                               social: {
                                 ...formData.linkHub?.social,
                                 youtube: e.target.value
                               }
                             }
                           })
                         }}
                         placeholder="https://youtube.com/@tucanal"
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>Facebook</Label>
                       <Input
                         value={formData.linkHub?.social?.facebook || ""}
                         onChange={(e) => {
                           setFormData({
                             ...formData,
                             linkHub: {
                               ...formData.linkHub,
                               social: {
                                 ...formData.linkHub?.social,
                                 facebook: e.target.value
                               }
                             }
                           })
                         }}
                         placeholder="https://facebook.com/tupagina"
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>Sitio Web</Label>
                       <Input
                         value={formData.linkHub?.social?.website || ""}
                         onChange={(e) => {
                           setFormData({
                             ...formData,
                             linkHub: {
                               ...formData.linkHub,
                               social: {
                                 ...formData.linkHub?.social,
                                 website: e.target.value
                               }
                             }
                           })
                         }}
                         placeholder="https://tusitio.com"
                       />
                     </div>
                   </div>
                 </div>

                 <Separator />

                 {/* Tema */}
                 <div className="space-y-4">
                   <h4 className="font-medium">Tema</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label>Color Principal</Label>
                       <Input
                         type="color"
                         value={formData.linkHub?.theme?.primaryColor || "#8b5cf6"}
                         onChange={(e) => {
                           setFormData({
                             ...formData,
                             linkHub: {
                               ...formData.linkHub,
                               theme: {
                                 ...formData.linkHub?.theme,
                                 primaryColor: e.target.value
                               }
                             }
                           })
                         }}
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>Color de Fondo</Label>
                       <Input
                         type="color"
                         value={formData.linkHub?.theme?.backgroundColor || "#ffffff"}
                         onChange={(e) => {
                           setFormData({
                             ...formData,
                             linkHub: {
                               ...formData.linkHub,
                               theme: {
                                 ...formData.linkHub?.theme,
                                 backgroundColor: e.target.value
                               }
                             }
                           })
                         }}
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>Color de Texto</Label>
                       <Input
                         type="color"
                         value={formData.linkHub?.theme?.textColor || "#1f2937"}
                         onChange={(e) => {
                           setFormData({
                             ...formData,
                             linkHub: {
                               ...formData.linkHub,
                               theme: {
                                 ...formData.linkHub?.theme,
                                 textColor: e.target.value
                               }
                             }
                           })
                         }}
                       />
                     </div>
                     <div className="space-y-2">
                       <Label>Color de Acento</Label>
                       <Input
                         type="color"
                         value={formData.linkHub?.theme?.accentColor || "#f3f4f6"}
                         onChange={(e) => {
                           setFormData({
                             ...formData,
                             linkHub: {
                               ...formData.linkHub,
                               theme: {
                                 ...formData.linkHub?.theme,
                                 accentColor: e.target.value
                               }
                             }
                           })
                         }}
                       />
                     </div>
                   </div>
                 </div>
               </CardContent>
             </Card>
           </TabsContent>

           <TabsContent value="legal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Enlaces Legales</CardTitle>
                <CardDescription>
                  URLs de términos y condiciones y política de privacidad
                </CardDescription>
              </CardHeader>
                             <CardContent className="space-y-4">
                 <div className="space-y-2">
                   <Label htmlFor="legalTermsUrl">URL de Términos y Condiciones</Label>
                   <Input
                     id="legalTermsUrl"
                     type="url"
                     value={formData.legal.termsUrl}
                     onChange={(e) => handleInputChange("legal.termsUrl", e.target.value)}
                   />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="legalPrivacyUrl">URL de Política de Privacidad</Label>
                   <Input
                     id="legalPrivacyUrl"
                     type="url"
                     value={formData.legal.privacyUrl}
                     onChange={(e) => handleInputChange("legal.privacyUrl", e.target.value)}
                   />
                 </div>
               </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="designs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Tipo de sitio web
                </CardTitle>
                <CardDescription>
                  Elije las secciones y estilos para tu web!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Paginas web</h3>
                      <p className="text-sm text-muted-foreground">
                        Selecciona todas las paginas que quieras
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowTemplateSelector(!showTemplateSelector)}
                    >
                      <Layers className="h-4 w-4 mr-2" />
                      {showTemplateSelector ? "Ocultar" : "Ver páginas"}
                    </Button>
                  </div>
                  {showTemplateSelector && (
                    <TemplateSelector 
                      onTemplateSelect={handleTemplateSelect}
                      activeTemplates={activeTemplates}
                    />
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Diseño Visual</h3>
                      <p className="text-sm text-muted-foreground">
                        Personaliza el estilo visual según tu tipo de negocio
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowDesignSelector(!showDesignSelector)}
                    >
                      <Palette className="h-4 w-4 mr-2" />
                      {showDesignSelector ? "Ocultar" : "Seleccionar Diseño"}
                    </Button>
                  </div>
                  {showDesignSelector && activeTemplates.length > 0 && (
                    <div className="space-y-6">
                                              {activeTemplates.map((templateType: string) => (
                        <div key={templateType} className="space-y-4">
                          <div className="flex items-center gap-2">
                            <h4 className="text-md font-medium capitalize">
                              Diseño para {templateType === 'landing' ? 'Landing Page' : templateType === 'shop' ? 'Tienda Online' : templateType}
                            </h4>
                            {selectedDesigns[templateType] && (
                              <Badge variant="secondary" className="text-xs">
                                Diseño seleccionado
                              </Badge>
                            )}
                          </div>
                          <DesignSelector 
                            onDesignSelect={handleDesignSelect}
                            selectedDesign={selectedDesigns[templateType]}
                            templateType={templateType}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {showDesignSelector && activeTemplates.length === 0 && (
                    <div className="text-center py-8">
                      <Palette className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona una plantilla primero</h3>
                      <p className="text-gray-500">Necesitas seleccionar al menos una plantilla para poder elegir su diseño.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backups" className="space-y-6">
            <BackupManager />
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end">
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Guardando..." : "Guardar Configuración"}
          </Button>
        </div>
      </div>
    </div>
  )
}
