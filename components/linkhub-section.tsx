"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
  Share2
} from "lucide-react"
import { Config, loadConfig } from "@/lib/config-loader"
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
  const [config, setConfig] = useState<LinkHubConfig>(defaultConfig)
  const [isLoading, setIsLoading] = useState(true)

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

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
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
          {/* Header con perfil */}
          <div className="text-center space-y-4">
            <Avatar className="w-24 h-24 mx-auto border-4 border-white shadow-lg">
              <AvatarImage src={config.profile.avatar} alt={config.profile.name} />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-400 to-pink-400 text-white">
                {config.profile.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{config.profile.name}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {config.profile.bio}
              </p>
            </div>

            {/* Información de contacto */}
            {(config.profile.location || config.profile.email || config.profile.phone) && (
              <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
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
                  className="transition-all duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer border-0 shadow-sm"
                  style={{ 
                    backgroundColor: config.theme.accentColor,
                    borderColor: config.theme.primaryColor
                  }}
                  onClick={() => handleLinkClick(link.url)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {link.icon && (
                          <span className="text-lg">{link.icon}</span>
                        )}
                        <span className="font-medium">{link.title}</span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Redes sociales */}
          {Object.keys(config.social).length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-center text-gray-600">
                Sígueme en redes sociales
              </h3>
              <div className="flex justify-center gap-3">
                {Object.entries(config.social).map(([platform, url]) => {
                  if (!url) return null
                  return (
                    <Button
                      key={platform}
                      variant="outline"
                      size="sm"
                      className="w-12 h-12 p-0 rounded-full"
                      onClick={() => handleLinkClick(url)}
                    >
                      {socialIcons[platform]}
                    </Button>
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
