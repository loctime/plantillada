"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Link, ExternalLink, Hash, MessageSquare } from "lucide-react"
import { useAdmin } from "@/lib/admin-context"

interface CustomNavigationItem {
  id: string
  name: string
  route: string
  icon: string
  type: 'internal' | 'external' | 'section'
}

const iconOptions = [
  { value: '🏠', label: 'Inicio' },
  { value: '🛒', label: 'Tienda' },
  { value: '📄', label: 'Página' },
  { value: '📞', label: 'Contacto' },
  { value: 'ℹ️', label: 'Información' },
  { value: '📝', label: 'Blog' },
  { value: '👥', label: 'Equipo' },
  { value: '💼', label: 'Servicios' },
  { value: '📚', label: 'Recursos' },
  { value: '🎯', label: 'Objetivos' },
  { value: '⭐', label: 'Destacado' },
  { value: '🔗', label: 'Enlace' }
]

interface NavigationManagerProps {
  className?: string
}

export function NavigationManager({ className }: NavigationManagerProps) {
  const { config, updateConfig } = useAdmin()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<CustomNavigationItem | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    route: '',
    icon: '🔗',
    type: 'external' as 'internal' | 'external' | 'section'
  })

  const customItems = config?.navigation?.customItems || []

  const handleAddItem = () => {
    setEditingItem(null)
    setFormData({
      name: '',
      route: '',
      icon: '🔗',
      type: 'external'
    })
    setIsDialogOpen(true)
  }

  const handleEditItem = (item: CustomNavigationItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      route: item.route,
      icon: item.icon,
      type: item.type
    })
    setIsDialogOpen(true)
  }

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = customItems.filter(item => item.id !== itemId)
    updateConfig({
      navigation: {
        ...config?.navigation,
        customItems: updatedItems
      }
    })
  }

  const handleSaveItem = () => {
    if (!formData.name.trim() || !formData.route.trim()) return

    const newItem: CustomNavigationItem = {
      id: editingItem?.id || `nav-${Date.now()}`,
      name: formData.name.trim(),
      route: formData.route.trim(),
      icon: formData.icon,
      type: formData.type
    }

    let updatedItems: CustomNavigationItem[]
    
    if (editingItem) {
      // Editar elemento existente
      updatedItems = customItems.map(item => 
        item.id === editingItem.id ? newItem : item
      )
    } else {
      // Agregar nuevo elemento
      updatedItems = [...customItems, newItem]
    }

    updateConfig({
      navigation: {
        ...config?.navigation,
        customItems: updatedItems
      }
    })

    setIsDialogOpen(false)
    setEditingItem(null)
    setFormData({
      name: '',
      route: '',
      icon: '🔗',
      type: 'external'
    })
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Navegación Personalizada
          </CardTitle>
          <CardDescription>
            Agrega enlaces personalizados a la barra de navegación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Lista de elementos existentes */}
            {customItems.length > 0 ? (
              <div className="space-y-2">
                {customItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{item.icon}</span>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          {item.type === 'external' && <ExternalLink className="h-3 w-3" />}
                          {item.type === 'internal' && <Hash className="h-3 w-3" />}
                          {item.type === 'section' && <MessageSquare className="h-3 w-3" />}
                          {item.route}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditItem(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Link className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No hay elementos de navegación personalizados</p>
                <p className="text-sm">Agrega enlaces para personalizar tu navegación</p>
              </div>
            )}

            {/* Botón para agregar nuevo elemento */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAddItem} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Elemento de Navegación
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? 'Editar' : 'Agregar'} Elemento de Navegación
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ej: Contacto, Servicios, Blog..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="type">Tipo</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: 'internal' | 'external' | 'section') => 
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="external">Enlace Externo</SelectItem>
                        <SelectItem value="internal">Página Interna</SelectItem>
                        <SelectItem value="section">Sección de la Página</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="route">
                      {formData.type === 'external' ? 'URL' : 
                       formData.type === 'internal' ? 'Ruta Interna' : 'ID de Sección'}
                    </Label>
                    <Input
                      id="route"
                      value={formData.route}
                      onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                      placeholder={
                        formData.type === 'external' ? 'https://ejemplo.com' :
                        formData.type === 'internal' ? '/mi-pagina' :
                        '#seccion-id'
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="icon">Icono</Label>
                    <Select
                      value={formData.icon}
                      onValueChange={(value) => setFormData({ ...formData, icon: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <span className="flex items-center gap-2">
                              <span>{option.value}</span>
                              <span>{option.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSaveItem} className="flex-1">
                      {editingItem ? 'Actualizar' : 'Agregar'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
