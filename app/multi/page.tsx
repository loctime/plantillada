"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Globe, 
  ShoppingCart, 
  MessageSquare, 
  Settings,
  Plus,
  ExternalLink,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff
} from "lucide-react"

interface Page {
  id: string
  name: string
  description: string
  route: string
  status: 'active' | 'draft' | 'coming-soon'
  icon: React.ReactNode
  order: number
  visible: boolean
}

interface NavigationItem {
  id: string
  label: string
  url: string
  order: number
  visible: boolean
  children?: NavigationItem[]
}

export default function MultiPage() {
  const [pages, setPages] = useState<Page[]>([
    {
      id: 'landing',
      name: 'Landing Page',
      description: 'Página principal de aterrizaje',
      route: '/',
      status: 'active',
      icon: <Globe className="h-4 w-4" />,
      order: 1,
      visible: true
    },
    {
      id: 'shop',
      name: 'Tienda',
      description: 'Catálogo de productos y carrito',
      route: '/shop',
      status: 'active',
      icon: <ShoppingCart className="h-4 w-4" />,
      order: 2,
      visible: true
    },
    {
      id: 'forum',
      name: 'Foro',
      description: 'Comunidad y discusiones',
      route: '/forum',
      status: 'coming-soon',
      icon: <MessageSquare className="h-4 w-4" />,
      order: 3,
      visible: false
    }
  ])

  const [navigation, setNavigation] = useState<NavigationItem[]>([
    {
      id: 'home',
      label: 'Inicio',
      url: '/',
      order: 1,
      visible: true
    },
    {
      id: 'shop',
      label: 'Tienda',
      url: '/shop',
      order: 2,
      visible: true
    },
    {
      id: 'about',
      label: 'Sobre Nosotros',
      url: '/about',
      order: 3,
      visible: true
    },
    {
      id: 'contact',
      label: 'Contacto',
      url: '/contact',
      order: 4,
      visible: true
    }
  ])

  const [newPageName, setNewPageName] = useState("")
  const [newPageRoute, setNewPageRoute] = useState("")

  const getStatusBadge = (status: Page['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Activo</Badge>
      case 'draft':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Borrador</Badge>
      case 'coming-soon':
        return <Badge variant="outline" className="text-gray-500">Próximamente</Badge>
    }
  }

  const handleAddPage = () => {
    if (!newPageName.trim() || !newPageRoute.trim()) return

    const newPage: Page = {
      id: newPageRoute.replace('/', ''),
      name: newPageName,
      description: `Nueva página: ${newPageName}`,
      route: newPageRoute,
      status: 'draft',
      icon: <Globe className="h-4 w-4" />,
      order: pages.length + 1,
      visible: true
    }

    setPages([...pages, newPage])
    setNewPageName("")
    setNewPageRoute("")
  }

  const handleDeletePage = (pageId: string) => {
    setPages(pages.filter(p => p.id !== pageId))
  }

  const handleTogglePageVisibility = (pageId: string) => {
    setPages(pages.map(p => 
      p.id === pageId ? { ...p, visible: !p.visible } : p
    ))
  }

  const handleMovePage = (pageId: string, direction: 'up' | 'down') => {
    const currentIndex = pages.findIndex(p => p.id === pageId)
    if (currentIndex === -1) return

    const newPages = [...pages]
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (targetIndex >= 0 && targetIndex < newPages.length) {
      [newPages[currentIndex], newPages[targetIndex]] = [newPages[targetIndex], newPages[currentIndex]]
      newPages[currentIndex].order = currentIndex + 1
      newPages[targetIndex].order = targetIndex + 1
      setPages(newPages)
    }
  }

  const handleToggleNavigationVisibility = (itemId: string) => {
    setNavigation(navigation.map(item => 
      item.id === itemId ? { ...item, visible: !item.visible } : item
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Sitio Multi-Página</h1>
          <p className="text-muted-foreground">
            Gestiona todas las páginas de tu sitio web desde un solo lugar
          </p>
        </div>

        <Tabs defaultValue="pages" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pages">Páginas</TabsTrigger>
            <TabsTrigger value="navigation">Navegación</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="pages" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Páginas del Sitio</h2>
              <Button onClick={() => document.getElementById('addPageModal')?.classList.remove('hidden')}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Página
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pages.map((page) => (
                <Card key={page.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                          {page.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{page.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusBadge(page.status)}
                            <Badge variant="outline" className="text-xs">
                              Orden: {page.order}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTogglePageVisibility(page.id)}
                        >
                          {page.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription>
                      {page.description}
                    </CardDescription>
                    
                    <div className="text-sm text-muted-foreground">
                      Ruta: <code className="bg-gray-100 px-1 rounded">{page.route}</code>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => window.open(page.route, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        disabled={page.status === 'coming-soon'}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Configurar
                      </Button>
                    </div>

                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMovePage(page.id, 'up')}
                        disabled={page.order === 1}
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMovePage(page.id, 'down')}
                        disabled={page.order === pages.length}
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeletePage(page.id)}
                        className="flex-1"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add Page Modal */}
            <Card id="addPageModal" className="hidden">
              <CardHeader>
                <CardTitle>Agregar Nueva Página</CardTitle>
                <CardDescription>
                  Crea una nueva página para tu sitio web
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pageName">Nombre de la Página</Label>
                    <Input
                      id="pageName"
                      value={newPageName}
                      onChange={(e) => setNewPageName(e.target.value)}
                      placeholder="Mi Nueva Página"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pageRoute">Ruta</Label>
                    <Input
                      id="pageRoute"
                      value={newPageRoute}
                      onChange={(e) => setNewPageRoute(e.target.value)}
                      placeholder="/mi-pagina"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddPage}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Página
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => document.getElementById('addPageModal')?.classList.add('hidden')}
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="navigation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Navegación</CardTitle>
                <CardDescription>
                  Organiza el menú principal y la estructura de navegación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Menú Principal</h4>
                  <div className="space-y-2">
                    {navigation.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{item.label}</span>
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {item.url}
                          </code>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={item.visible ? 'default' : 'secondary'}>
                            {item.visible ? 'Visible' : 'Oculto'}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleNavigationVisibility(item.id)}
                          >
                            {item.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Vista Previa del Menú</h4>
                  <div className="flex flex-wrap gap-2">
                    {navigation.filter(item => item.visible).map((item) => (
                      <Button key={item.id} variant="outline" size="sm">
                        {item.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuración General
                </CardTitle>
                <CardDescription>
                  Configuración global del sitio multi-página
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteTitle">Título del Sitio</Label>
                    <Input
                      id="siteTitle"
                      placeholder="Mi Sitio Web"
                      defaultValue="Plantillada - Sitio Multi-Página"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siteDomain">Dominio</Label>
                    <Input
                      id="siteDomain"
                      placeholder="misitio.com"
                      defaultValue="plantillada.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Descripción</Label>
                  <Input
                    id="siteDescription"
                    placeholder="Descripción del sitio web"
                    defaultValue="Sitio web multi-página con landing, tienda y más"
                  />
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Configuraciones Avanzadas</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• SEO global y meta tags</p>
                    <p>• Analytics y tracking</p>
                    <p>• Configuración de caché</p>
                    <p>• Optimización de rendimiento</p>
                    <p>• Configuración de seguridad</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
