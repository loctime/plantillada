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
import { Save, Eye, EyeOff, Settings, User, ShoppingCart, Calendar, Quote, Globe, Layers, Palette, Download } from "lucide-react"
import { Config, getTenantId } from "@/lib/config-loader"
import { TemplateSelector } from "@/components/template-selector"
import { DesignSelector } from "@/components/design-selector"
import BackupManager from "@/components/backup-manager"

interface FormData extends Config {}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [currentTenant, setCurrentTenant] = useState("")
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>(['landing'])
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [showDesignSelector, setShowDesignSelector] = useState(false)
  const [selectedDesigns, setSelectedDesigns] = useState<{[key: string]: string}>({})
  const [formData, setFormData] = useState<FormData>({
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
      email: "hola@tumarca.com"
    },
    legal: {
      termsUrl: "",
      privacyUrl: ""
    }
  })

  // Cargar configuración al montar el componente
  useEffect(() => {
    const tenant = getTenantId()
    setCurrentTenant(tenant)
    
    const loadInitialConfig = async () => {
      try {
        const response = await fetch('/api/config')
        if (response.ok) {
          const config = await response.json()
          setFormData(config)
          
          // Cargar plantillas y diseños seleccionados
          if (config.selectedTemplates) {
            setSelectedTemplates(config.selectedTemplates)
          }
          if (config.selectedDesigns) {
            setSelectedDesigns(config.selectedDesigns)
          }
        }
      } catch (error) {
        console.error('Error loading config:', error)
      }
    }
    
    // Llamar la función async
    loadInitialConfig()
  }, [])

  const handleTemplateSelect = async (templates: any[]) => {
    const templateIds = templates.map(t => t.id)
    setSelectedTemplates(templateIds)
    // No cerrar el selector automáticamente - setShowTemplateSelector(false)
    
    // Guardar automáticamente la configuración con las plantillas seleccionadas
    const updatedConfig = {
      ...formData,
      selectedTemplates: templateIds
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
    
    // Guardar automáticamente la configuración con el diseño seleccionado
    const updatedConfig = {
      ...formData,
      selectedDesigns: newSelectedDesigns
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
        setMessage(`✅ Diseño seleccionado: ${design.name}`)
      } else {
        setMessage("❌ Error al guardar el diseño")
      }
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



  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Credenciales hardcodeadas por simplicidad
    if (username === "admin" && password === "admin123") {
      setIsAuthenticated(true)
      setMessage("")
    } else {
      setMessage("Credenciales incorrectas")
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    setMessage("")
    
    try {
      console.log('Enviando configuración:', formData)
      
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Panel de Administración
            </CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder a la configuración
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              {message && (
                <Alert>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full">
                Iniciar Sesión
              </Button>
            </form>
          </CardContent>
        </Card>
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
             <TabsTrigger value="integrations">Integraciones</TabsTrigger>
             <TabsTrigger value="sessions">Sesiones 1:1</TabsTrigger>
             <TabsTrigger value="course">Curso Online</TabsTrigger>
             <TabsTrigger value="about">Sobre Mí</TabsTrigger>
             <TabsTrigger value="testimonials">Testimonios</TabsTrigger>
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
                   <div className="space-y-2">
                     <Label htmlFor="contactEmail">Email de Contacto</Label>
                     <Input
                       id="contactEmail"
                       type="email"
                       value={formData.contact.email}
                       onChange={(e) => handleInputChange("contact.email", e.target.value)}
                     />
                   </div>
                 </div>

                 <Separator />

                 <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <div>
                       <h3 className="text-lg font-medium">Plantilla del Sitio</h3>
                       <p className="text-sm text-muted-foreground">
                         Selecciona el tipo de sitio web que mejor se adapte a tus necesidades
                       </p>
                     </div>
                     <Button 
                       variant="outline" 
                       onClick={() => setShowTemplateSelector(!showTemplateSelector)}
                     >
                       <Layers className="h-4 w-4 mr-2" />
                       {showTemplateSelector ? "Ocultar" : "Cambiar Plantilla"}
                     </Button>
                   </div>
                   
                   {showTemplateSelector && (
                     <TemplateSelector 
                       onTemplateSelect={handleTemplateSelect}
                       selectedTemplates={selectedTemplates}
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
                   
                   {showDesignSelector && selectedTemplates.length > 0 && (
                     <div className="space-y-6">
                       {selectedTemplates.map((templateType) => (
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
                   
                   {showDesignSelector && selectedTemplates.length === 0 && (
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
