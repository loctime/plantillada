"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { 
  Save, Eye, EyeOff, Settings, User, ShoppingCart, Calendar, Quote, 
  Globe, Plus, Edit, Trash2, Copy, ExternalLink, Search
} from "lucide-react"
import { Config } from "@/lib/config-loader"

interface TenantConfig {
  id: string
  name: string
  domain: string
  config: Config
  lastModified?: string
  isActive: boolean
}

export default function SuperAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [tenants, setTenants] = useState<TenantConfig[]>([])
  const [selectedTenant, setSelectedTenant] = useState<TenantConfig | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTenant, setNewTenant] = useState({
    id: "",
    name: "",
    domain: "",
    isActive: true
  })

  // Cargar todos los tenants al montar el componente
  useEffect(() => {
    if (isAuthenticated) {
      loadAllTenants()
    }
  }, [isAuthenticated])

  const loadAllTenants = async () => {
    try {
      const response = await fetch('/api/super-admin/tenants')
      if (response.ok) {
        const data = await response.json()
        const tenantsWithConfig = await Promise.all(
          data.tenants.map(async (tenant: any) => {
            try {
              const configResponse = await fetch(`/api/super-admin/tenants/${tenant.id}`)
              if (configResponse.ok) {
                const configData = await configResponse.json()
                return configData.tenant
              }
            } catch (error) {
              console.error(`Error loading config for tenant ${tenant.id}:`, error)
            }
            return tenant
          })
        )
        setTenants(tenantsWithConfig)
      }
    } catch (error) {
      console.error('Error loading tenants:', error)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Credenciales hardcodeadas por simplicidad
    if (username === "superadmin" && password === "super123") {
      setIsAuthenticated(true)
      setMessage("")
    } else {
      setMessage("Credenciales incorrectas")
    }
  }

  const handleCreateTenant = async () => {
    if (!newTenant.id || !newTenant.name || !newTenant.domain) {
      setMessage("❌ Todos los campos son requeridos")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/super-admin/tenants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTenant),
      })

      if (response.ok) {
        setMessage("✅ Tenant creado exitosamente")
        setShowCreateForm(false)
        setNewTenant({ id: "", name: "", domain: "", isActive: true })
        loadAllTenants()
      } else {
        const error = await response.json()
        setMessage(`❌ Error: ${error.error}`)
      }
    } catch (error) {
      setMessage("❌ Error de conexión")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateTenant = async (tenantId: string, config: Config) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/super-admin/tenants/${tenantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      })

      if (response.ok) {
        setMessage("✅ Configuración actualizada exitosamente")
        loadAllTenants()
      } else {
        const error = await response.json()
        setMessage(`❌ Error: ${error.error}`)
      }
    } catch (error) {
      setMessage("❌ Error de conexión")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTenant = async (tenantId: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el tenant "${tenantId}"?`)) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/super-admin/tenants/${tenantId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setMessage("✅ Tenant eliminado exitosamente")
        setSelectedTenant(null)
        loadAllTenants()
      } else {
        const error = await response.json()
        setMessage(`❌ Error: ${error.error}`)
      }
    } catch (error) {
      setMessage("❌ Error de conexión")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Super Admin Panel
            </CardTitle>
            <CardDescription>
              Acceso exclusivo para gestión de todos los tenants
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
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Super Admin Panel</h1>
              <p className="text-muted-foreground">
                Gestión centralizada de todos los tenants
              </p>
            </div>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Nuevo Tenant
            </Button>
          </div>
        </div>

        {message && (
          <Alert className="mb-6">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Tenants */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Tenants ({filteredTenants.length})
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar tenants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredTenants.map((tenant) => (
                    <div
                      key={tenant.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedTenant?.id === tenant.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => setSelectedTenant(tenant)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{tenant.name}</h4>
                          <p className="text-sm opacity-80">{tenant.domain}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={tenant.isActive ? "default" : "secondary"}>
                            {tenant.isActive ? "Activo" : "Inactivo"}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteTenant(tenant.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Configuración del Tenant Seleccionado */}
          <div className="lg:col-span-2">
            {selectedTenant ? (
              <TenantConfigEditor
                tenant={selectedTenant}
                onSave={handleUpdateTenant}
                isLoading={isLoading}
              />
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center text-muted-foreground">
                    <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Selecciona un tenant para editar su configuración</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Modal para Crear Nuevo Tenant */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Crear Nuevo Tenant</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>ID del Tenant</Label>
                  <Input
                    value={newTenant.id}
                    onChange={(e) => setNewTenant({ ...newTenant, id: e.target.value })}
                    placeholder="ej: gold, marcamia"
                  />
                </div>
                <div>
                  <Label>Nombre</Label>
                  <Input
                    value={newTenant.name}
                    onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                    placeholder="Gold Coaching"
                  />
                </div>
                <div>
                  <Label>Dominio</Label>
                  <Input
                    value={newTenant.domain}
                    onChange={(e) => setNewTenant({ ...newTenant, domain: e.target.value })}
                    placeholder="landing-six-gold.vercel.app"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateTenant} disabled={isLoading}>
                    {isLoading ? "Creando..." : "Crear Tenant"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

// Componente para editar la configuración de un tenant
function TenantConfigEditor({ 
  tenant, 
  onSave, 
  isLoading 
}: { 
  tenant: TenantConfig
  onSave: (tenantId: string, config: Config) => Promise<void>
  isLoading: boolean
}) {
  const [formData, setFormData] = useState<Config>(tenant.config)

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

  const handleSave = () => {
    onSave(tenant.id, formData)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              {tenant.name}
            </CardTitle>
            <CardDescription>
              Configuración para {tenant.domain}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver Sitio
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="integrations">Integraciones</TabsTrigger>
            <TabsTrigger value="sessions">Sesiones 1:1</TabsTrigger>
            <TabsTrigger value="course">Curso Online</TabsTrigger>
            <TabsTrigger value="about">Sobre Mí</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonios</TabsTrigger>
            <TabsTrigger value="legal">Legal</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="calendlyUrl">URL de Calendly</Label>
                <Input
                  id="calendlyUrl"
                  type="url"
                  placeholder="https://calendly.com/tu-usuario/sesion"
                  value={formData.integrations.calendlyUrl}
                  onChange={(e) => handleInputChange("integrations.calendlyUrl", e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <div className="space-y-4">
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
            </div>
          </TabsContent>

          <TabsContent value="course" className="space-y-6">
            <div className="space-y-4">
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
            </div>
          </TabsContent>

          <TabsContent value="about" className="space-y-6">
            <div className="space-y-4">
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
            </div>
          </TabsContent>

          <TabsContent value="testimonials" className="space-y-6">
            <div className="space-y-4">
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
            </div>
          </TabsContent>

          <TabsContent value="legal" className="space-y-6">
            <div className="space-y-4">
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
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
