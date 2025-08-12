"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { EditableText } from "@/components/editable-text"
import { EditableImage } from "@/components/editable-image"
import { EditableUrl } from "@/components/editable-url"
import { EditableList } from "@/components/editable-list"
import { useAdmin } from "@/lib/admin-context"
import { 
  ExternalLink, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Facebook,
  Globe,
  Mail,
  Phone,
  MapPin,
  Heart,
  Share2,
  Plus,
  Trash2,
  Settings,
  GripVertical,
  Eye,
  EyeOff
} from "lucide-react"
import { Config, loadConfig, saveConfig } from "@/lib/config-loader"
import { cn } from "@/lib/utils"

interface LinkItem {
  id: string
  title: string
  url: string
  icon?: string
  category?: string
  isActive?: boolean
}

interface LinkHubConfig {
  profile: {
    name: string
    bio: string
    avatar: string
    location?: string
    email?: string
    phone?: string
  }
  links: LinkItem[]
  theme: {
    primaryColor: string
    backgroundColor: string
    textColor: string
    accentColor: string
  }
  social: {
    instagram?: string
    twitter?: string
    linkedin?: string
    youtube?: string
    facebook?: string
    website?: string
  }
}

const defaultConfig: LinkHubConfig = {
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
      category: "principal"
    },
    {
      id: "portfolio",
      title: "Portfolio",
      url: "https://portfolio.com",
      icon: "💼",
      category: "trabajo"
    },
    {
      id: "blog",
      title: "Blog",
      url: "https://blog.com",
      icon: "✍️",
      category: "contenido"
    },
    {
      id: "contact",
      title: "Contacto",
      url: "mailto:tu@email.com",
      icon: "📧",
      category: "contacto"
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
    website: "https://tusitio.com"
  }
}

const socialIcons: Record<string, React.ReactNode> = {
  instagram: <Instagram className="h-5 w-5" />,
  twitter: <Twitter className="h-5 w-5" />,
  linkedin: <Linkedin className="h-5 w-5" />,
  youtube: <Youtube className="h-5 w-5" />,
  facebook: <Facebook className="h-5 w-5" />,
  website: <Globe className="h-5 w-5" />
}

export function LinkHubSection() {
  const { isAdminMode } = useAdmin()
  const [config, setConfig] = useState<LinkHubConfig>(defaultConfig)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showLinkManager, setShowLinkManager] = useState(false)

  useEffect(() => {
    const loadLinkHubConfig = async () => {
      try {
        const siteConfig = await loadConfig()
        if (siteConfig.linkHub) {
          setConfig({ ...defaultConfig, ...siteConfig.linkHub })
        }
      } catch (error) {
        console.log("Usando configuración por defecto del Link Hub")
      } finally {
        setIsLoading(false)
      }
    }

    loadLinkHubConfig()
  }, [])

  const saveLinkHubConfig = async (newConfig: LinkHubConfig) => {
    setIsSaving(true)
    try {
      const siteConfig = await loadConfig()
      const updatedConfig = {
        ...siteConfig,
        linkHub: newConfig
      }
      await saveConfig(updatedConfig)
      setConfig(newConfig)
      console.log("✅ Configuración del Link Hub guardada exitosamente")
    } catch (error) {
      console.error("❌ Error guardando configuración del Link Hub:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const updateProfile = async (field: keyof LinkHubConfig['profile'], value: string) => {
    const newConfig = {
      ...config,
      profile: {
        ...config.profile,
        [field]: value
      }
    }
    await saveLinkHubConfig(newConfig)
  }

  const updateLink = async (linkId: string, field: keyof LinkItem, value: string | boolean) => {
    const newConfig = {
      ...config,
      links: config.links.map(link => 
        link.id === linkId 
          ? { ...link, [field]: value }
          : link
      )
    }
    await saveLinkHubConfig(newConfig)
  }

  const addLink = async () => {
    const newLink: LinkItem = {
      id: `link-${Date.now()}`,
      title: "Nuevo Enlace",
      url: "https://ejemplo.com",
      icon: "🔗",
      category: "general",
      isActive: true
    }
    const newConfig = {
      ...config,
      links: [...config.links, newLink]
    }
    await saveLinkHubConfig(newConfig)
  }

  const removeLink = async (linkId: string) => {
    const newConfig = {
      ...config,
      links: config.links.filter(link => link.id !== linkId)
    }
    await saveLinkHubConfig(newConfig)
  }

  const toggleLinkVisibility = async (linkId: string) => {
    const link = config.links.find(l => l.id === linkId)
    if (link) {
      await updateLink(linkId, 'isActive', !link.isActive)
    }
  }

  const reorderLinks = async (fromIndex: number, toIndex: number) => {
    const newLinks = [...config.links]
    const [movedLink] = newLinks.splice(fromIndex, 1)
    newLinks.splice(toIndex, 0, movedLink)
    
    const newConfig = {
      ...config,
      links: newLinks
    }
    await saveLinkHubConfig(newConfig)
  }

  const updateSocial = async (platform: keyof LinkHubConfig['social'], value: string) => {
    const newConfig = {
      ...config,
      social: {
        ...config.social,
        [platform]: value
      }
    }
    await saveLinkHubConfig(newConfig)
  }

  const handleLinkClick = (url: string) => {
    if (!isAdminMode) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  if (isLoading) {
    return (
      <section className="w-full py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="max-w-md mx-auto space-y-6">
          {/* Botón de gestión del LinkHub */}
          {isAdminMode && (
            <div className="flex justify-center mb-4">
              <Button
                onClick={() => setShowLinkManager(!showLinkManager)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                {showLinkManager ? "Ocultar Gestión" : "Gestionar LinkHub"}
              </Button>
            </div>
          )}

          {/* Panel de gestión */}
          {isAdminMode && showLinkManager && (
            <Card className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">Gestión del LinkHub</h3>
              
              {/* Gestión de enlaces */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Enlaces ({config.links.length})</h4>
                  <Button onClick={addLink} size="sm" disabled={isSaving}>
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar
                  </Button>
                </div>
                
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {config.links.map((link, index) => (
                    <div key={link.id} className="flex items-center gap-2 p-2 border rounded">
                      <GripVertical className="h-4 w-4 text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <EditableText
                            value={link.title}
                            onSave={(value) => updateLink(link.id, 'title', value)}
                            className="font-medium text-sm"
                            placeholder="Título"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleLinkVisibility(link.id)}
                            className="h-6 w-6 p-0"
                          >
                            {link.isActive !== false ? (
                              <Eye className="h-3 w-3 text-green-500" />
                            ) : (
                              <EyeOff className="h-3 w-3 text-gray-400" />
                            )}
                          </Button>
                        </div>
                        <EditableUrl
                          value={link.url}
                          onSave={(value) => updateLink(link.id, 'url', value)}
                          className="text-xs text-gray-500"
                          placeholder="URL"
                          showPreview={false}
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeLink(link.id)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Header con perfil */}
          <div className="text-center space-y-4">
            <div className="relative">
              <Avatar className="w-24 h-24 mx-auto border-4 border-white shadow-lg">
                <AvatarImage src={config.profile.avatar} alt={config.profile.name} />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-400 to-pink-400 text-white">
                  {config.profile.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              {isAdminMode && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <EditableImage
                    value={config.profile.avatar}
                    onSave={(value) => updateProfile('avatar', value)}
                    className="w-24 h-24 rounded-full"
                    placeholder="https://ejemplo.com/avatar.jpg"
                    label="Avatar"
                    width={96}
                    height={96}
                    alt="Avatar del perfil"
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <EditableText
                value={config.profile.name}
                onSave={(value) => updateProfile('name', value)}
                className="text-2xl font-bold"
                tag="h2"
                placeholder="Tu Nombre"
              />
              <EditableText
                value={config.profile.bio}
                onSave={(value) => updateProfile('bio', value)}
                className="text-sm text-gray-600 leading-relaxed"
                tag="p"
                placeholder="Descripción personal o profesional..."
                multiline
              />
            </div>

            {/* Información de contacto */}
            {(config.profile.location || config.profile.email || config.profile.phone || isAdminMode) && (
              <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
                {isAdminMode ? (
                  <>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <EditableText
                        value={config.profile.location || ""}
                        onSave={(value) => updateProfile('location', value)}
                        className="text-xs"
                        placeholder="Ciudad, País"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      <EditableText
                        value={config.profile.email || ""}
                        onSave={(value) => updateProfile('email', value)}
                        className="text-xs"
                        placeholder="tu@email.com"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <EditableText
                        value={config.profile.phone || ""}
                        onSave={(value) => updateProfile('phone', value)}
                        className="text-xs"
                        placeholder="+34 600 000 000"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {config.profile.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {config.profile.location}
                      </div>
                    )}
                    {config.profile.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {config.profile.email}
                      </div>
                    )}
                    {config.profile.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {config.profile.phone}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Enlaces principales */}
          <div className="space-y-3">
            {config.links
              .filter(link => link.isActive !== false)
              .map((link) => (
                <Card 
                  key={link.id}
                  className={cn(
                    "transition-all duration-200 hover:shadow-md hover:scale-[1.02] border-0 shadow-sm",
                    !isAdminMode && "cursor-pointer"
                  )}
                  style={{ 
                    backgroundColor: config.theme.accentColor,
                    borderColor: config.theme.primaryColor
                  }}
                  onClick={() => handleLinkClick(link.url)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {isAdminMode ? (
                          <EditableText
                            value={link.icon || ""}
                            onSave={(value) => updateLink(link.id, 'icon', value)}
                            className="text-lg"
                            placeholder="🔗"
                          />
                        ) : (
                          link.icon && <span className="text-lg">{link.icon}</span>
                        )}
                        
                        {isAdminMode ? (
                          <div className="flex-1 space-y-1">
                            <EditableText
                              value={link.title}
                              onSave={(value) => updateLink(link.id, 'title', value)}
                              className="font-medium"
                              placeholder="Título del enlace"
                            />
                            <EditableUrl
                              value={link.url}
                              onSave={(value) => updateLink(link.id, 'url', value)}
                              className="text-xs text-gray-500"
                              placeholder="https://ejemplo.com"
                              showPreview={false}
                            />
                          </div>
                        ) : (
                          <span className="font-medium">{link.title}</span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {isAdminMode && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleLinkVisibility(link.id)
                              }}
                              className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                            >
                              {link.isActive !== false ? (
                                <Eye className="h-3 w-3" />
                              ) : (
                                <EyeOff className="h-3 w-3" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeLink(link.id)
                              }}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            
            {isAdminMode && !showLinkManager && (
              <Button
                onClick={addLink}
                variant="outline"
                className="w-full"
                disabled={isSaving}
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Enlace
              </Button>
            )}
          </div>

          {/* Redes sociales */}
          {(Object.keys(config.social).length > 0 || isAdminMode) && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-center text-gray-600">
                Sígueme en redes sociales
              </h3>
              <div className="flex justify-center gap-3 flex-wrap">
                {Object.entries(config.social).map(([platform, url]) => {
                  if (!url && !isAdminMode) return null
                  
                  return (
                    <div key={platform} className="relative">
                      {isAdminMode ? (
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-12 h-12 p-0 rounded-full"
                            disabled={!url}
                            onClick={() => url && handleLinkClick(url)}
                          >
                            {socialIcons[platform]}
                          </Button>
                          <EditableUrl
                            value={url || ""}
                            onSave={(value) => updateSocial(platform as keyof LinkHubConfig['social'], value)}
                            className="text-xs"
                            placeholder={`https://${platform}.com/tuusuario`}
                            showPreview={false}
                          />
                        </div>
                      ) : (
                        url && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-12 h-12 p-0 rounded-full"
                            onClick={() => handleLinkClick(url)}
                          >
                            {socialIcons[platform]}
                          </Button>
                        )
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
