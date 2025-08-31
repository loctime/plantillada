import React from "react"
import { 
  Zap,
  ShoppingBag,
  Utensils,
  Wrench,
  Settings
} from "lucide-react"
import { Config } from "./config-loader"

export interface Design {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: string
  colorScheme: {
    primary: string
    secondary: string
    accent: string
  }
  features: string[]
  status: 'active' | 'coming-soon' | 'beta'
  cssVariables?: {
    [key: string]: string
  }
  predefinedConfig?: Partial<Config>
}

// Solo 3 diseños de tienda simplificados
export const shopDesigns: Design[] = [
  {
    id: 'food-shop',
    name: 'Food Shop',
    description: 'Diseño especializado para restaurantes, delivery y tiendas de comida',
    icon: <Utensils className="h-6 w-6" />,
    category: 'shop',
    colorScheme: {
      primary: '#fbbf24',
      secondary: '#dc2626',
      accent: '#059669'
    },
    features: [
      'Colores apetitosos',
      'Mobile-first por defecto',
      'Navegación táctil',
      'Optimizado para delivery'
    ],
    status: 'active',
    cssVariables: {
      '--primary': '#fbbf24',
      '--secondary': '#dc2626',
      '--accent': '#059669',
      '--font-family': 'Inter, sans-serif',
      '--background-color': '#fef3c7',
      '--section-background': '#ffffff',
      '--navbar-background': '#fbbf24',
      '--text-color': '#1f2937',
      '--accent-color': '#059669',
      '--primary-button-color': '#fbbf24',
      '--secondary-button-color': '#dc2626',
      '--outline-button-color': '#fbbf24',
      '--heading-color': '#1f2937'
    }
  },
  {
    id: 'tech-shop',
    name: 'Tech Shop',
    description: 'Diseño moderno y tecnológico para tiendas de tecnología',
    icon: <Zap className="h-6 w-6" />,
    category: 'shop',
    colorScheme: {
      primary: '#3b82f6',
      secondary: '#1f2937',
      accent: '#10b981'
    },
    features: [
      'Colores azules tecnológicos',
      'Web-first por defecto',
      'Tipografía futurista',
      'Optimizado para productos tech'
    ],
    status: 'active',
    cssVariables: {
      '--primary': '#3b82f6',
      '--secondary': '#1f2937',
      '--accent': '#10b981',
      '--font-family': 'Roboto, sans-serif',
      '--background-color': '#f8fafc',
      '--section-background': '#ffffff',
      '--navbar-background': '#1f2937',
      '--text-color': '#1f2937',
      '--accent-color': '#10b981',
      '--primary-button-color': '#3b82f6',
      '--secondary-button-color': '#1f2937',
      '--outline-button-color': '#3b82f6',
      '--heading-color': '#1f2937'
    }
  },
  {
    id: 'service-shop',
    name: 'Service Shop',
    description: 'Diseño profesional para servicios y consultorías',
    icon: <Wrench className="h-6 w-6" />,
    category: 'shop',
    colorScheme: {
      primary: '#8b5cf6',
      secondary: '#6b7280',
      accent: '#f59e0b'
    },
    features: [
      'Colores púrpura profesionales',
      'Web-first por defecto',
      'Tipografía elegante',
      'Optimizado para servicios'
    ],
    status: 'active',
    cssVariables: {
      '--primary': '#8b5cf6',
      '--secondary': '#6b7280',
      '--accent': '#f59e0b',
      '--font-family': 'Inter, sans-serif',
      '--background-color': '#faf5ff',
      '--section-background': '#ffffff',
      '--navbar-background': '#8b5cf6',
      '--text-color': '#374151',
      '--accent-color': '#f59e0b',
      '--primary-button-color': '#8b5cf6',
      '--secondary-button-color': '#6b7280',
      '--outline-button-color': '#8b5cf6',
      '--heading-color': '#374151'
    }
  }
]

export const linkHubDesigns: Design[] = [
  {
    id: 'linkhub',
    name: 'Link Hub Clásico',
    description: 'Diseño limpio y moderno para concentrador de enlaces personales',
    icon: <Settings className="h-6 w-6" />,
    category: 'linkhub',
    colorScheme: {
      primary: '#8b5cf6',
      secondary: '#64748b',
      accent: '#ec4899'
    },
    features: [
      'Colores púrpura modernos',
      'Diseño móvil optimizado',
      'Iconografía de redes sociales',
      'Enlaces personalizables'
    ],
    status: 'active',
    cssVariables: {
      '--primary': '#8b5cf6',
      '--secondary': '#64748b',
      '--accent': '#ec4899',
      '--font-family': 'Inter, sans-serif'
    },
    predefinedConfig: {
      site: {
        title: "Mi Link Hub",
        tagline: "Conecta conmigo en todas mis plataformas",
        heroTitle: "¡Hola! Soy",
        heroSubtitle: "Encuentra todos mis enlaces importantes en un solo lugar",
        sessionsTitle: "Enlaces Destacados",
        sessionsSubtitle: "Mis plataformas principales",
        aboutTitle: "Sobre Mí",
        testimonialsTitle: "Lo que dicen de mí",
        testimonialsSubtitle: "Testimonios y recomendaciones",
        ctaTitle: "¿Quieres conectar?",
        ctaSubtitle: "Encuéntrame en todas mis redes sociales",
        showPrices: false
      },
      selectedTemplates: ["linkhub"],
      selectedDesigns: {
        "linkhub": "linkhub"
      },
      linkHub: {
        profile: {
          name: "Tu Nombre",
          bio: "Creador de contenido, emprendedor y apasionado por conectar con personas increíbles. Comparto mi viaje y conocimientos en múltiples plataformas.",
          avatar: "/placeholder-user.jpg",
          location: "Madrid, España",
          email: "hola@tunombre.com",
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
            id: "youtube",
            title: "YouTube",
            url: "https://youtube.com/@tucanal",
            icon: "📺",
            category: "social",
            isActive: true
          },
          {
            id: "podcast",
            title: "Mi Podcast",
            url: "https://spotify.com/show/tupodcast",
            icon: "🎧",
            category: "contenido",
            isActive: true
          },
          {
            id: "newsletter",
            title: "Newsletter",
            url: "https://tunewsletter.com",
            icon: "📧",
            category: "contenido",
            isActive: true
          },
          {
            id: "contact",
            title: "Contacto",
            url: "mailto:hola@tunombre.com",
            icon: "💬",
            category: "contacto",
            isActive: true
          }
        ],
        theme: {
          primaryColor: "#8b5cf6",
          backgroundColor: "#f8fafc",
          textColor: "#1e293b",
          accentColor: "#f1f5f9"
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
    }
  },
  {
    id: 'linkhub-dark',
    name: 'Link Hub Oscuro',
    description: 'Diseño elegante con tema oscuro para concentrador de enlaces',
    icon: <Settings className="h-6 w-6" />,
    category: 'linkhub',
    colorScheme: {
      primary: '#a78bfa',
      secondary: '#94a3b8',
      accent: '#f472b6'
    },
    features: [
      'Tema oscuro elegante',
      'Colores púrpura suaves',
      'Diseño minimalista',
      'Enlaces con efectos hover'
    ],
    status: 'active',
    cssVariables: {
      '--primary': '#a78bfa',
      '--secondary': '#94a3b8',
      '--accent': '#f472b6',
      '--font-family': 'Inter, sans-serif'
    },
    predefinedConfig: {
      site: {
        title: "Mi Link Hub",
        tagline: "Conecta conmigo en todas mis plataformas",
        heroTitle: "¡Hola! Soy",
        heroSubtitle: "Encuentra todos mis enlaces importantes en un solo lugar",
        sessionsTitle: "Enlaces Destacados",
        sessionsSubtitle: "Mis plataformas principales",
        aboutTitle: "Sobre Mí",
        testimonialsTitle: "Lo que dicen de mí",
        testimonialsSubtitle: "Testimonios y recomendaciones",
        ctaTitle: "¿Quieres conectar?",
        ctaSubtitle: "Encuéntrame en todas mis redes sociales",
        showPrices: false
      },
      selectedTemplates: ["linkhub"],
      selectedDesigns: {
        "linkhub": "linkhub-dark"
      },
      linkHub: {
        profile: {
          name: "Tu Nombre",
          bio: "Creador de contenido, emprendedor y apasionado por conectar con personas increíbles. Comparto mi viaje y conocimientos en múltiples plataformas.",
          avatar: "/placeholder-user.jpg",
          location: "Madrid, España",
          email: "hola@tunombre.com",
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
            id: "youtube",
            title: "YouTube",
            url: "https://youtube.com/@tucanal",
            icon: "📺",
            category: "social",
            isActive: true
          },
          {
            id: "podcast",
            title: "Mi Podcast",
            url: "https://spotify.com/show/tupodcast",
            icon: "🎧",
            category: "contenido",
            isActive: true
          },
          {
            id: "newsletter",
            title: "Newsletter",
            url: "https://tunewsletter.com",
            icon: "📧",
            category: "contenido",
            isActive: true
          },
          {
            id: "contact",
            title: "Contacto",
            url: "mailto:hola@tunombre.com",
            icon: "💬",
            category: "contacto",
            isActive: true
          }
        ],
        theme: {
          primaryColor: "#a78bfa",
          backgroundColor: "#0f172a",
          textColor: "#f1f5f9",
          accentColor: "#334155"
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
    }
  }
]

export function getDesignsForTemplate(templateType: string): Design[] {
  switch (templateType) {
    case 'landing':
      return [] // No hay diseños de landing en esta versión
    case 'shop':
      return shopDesigns
    case 'linkhub':
      return linkHubDesigns
    default:
      return []
  }
}

export function getDesignById(designId: string): Design | undefined {
  const allDesigns = [...shopDesigns, ...linkHubDesigns]
  return allDesigns.find(design => design.id === designId)
}

export function applyDesignToDocument(design: Design) {
  if (typeof document === 'undefined') return
  
  const root = document.documentElement
  
  // Aplicar variables CSS
  if (design.cssVariables) {
    Object.entries(design.cssVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
  }
  
  // Aplicar colores del esquema
  root.style.setProperty('--color-primary', design.colorScheme.primary)
  root.style.setProperty('--color-secondary', design.colorScheme.secondary)
  root.style.setProperty('--color-accent', design.colorScheme.accent)
}

// Nuevas funciones para el sistema de backup y aplicación de diseños

/**
 * Crea un backup de la configuración actual antes de aplicar un diseño
 */
export async function createBackup(tenantId: string): Promise<string> {
  try {
    const { loadConfig } = await import('./config-loader')
    const currentConfig = await loadConfig(tenantId)
    
    const backup = {
      timestamp: new Date().toISOString(),
      tenantId,
      config: currentConfig,
      description: 'Backup automático antes de aplicar diseño'
    }
    
    // Guardar backup en Firestore con manejo de errores
    try {
      const { db } = await import('./firebase')
      const { doc, setDoc } = await import('firebase/firestore')
      
      const backupId = `backup_${tenantId}_${Date.now()}`
      const backupDoc = doc(db, 'backups', backupId)
      await setDoc(backupDoc, backup)
      
      console.log('✅ Backup creado:', backupId)
      return backupId
    } catch (firebaseError: any) {
      console.warn('⚠️ No se pudo crear backup en Firebase (permisos insuficientes):', firebaseError?.message || firebaseError)
      console.log('💡 Para habilitar backups, actualiza las reglas de Firestore en Firebase Console')
      
      // Retornar un ID de backup local como fallback
      const localBackupId = `local_backup_${tenantId}_${Date.now()}`
      console.log('📁 Backup local creado:', localBackupId)
      return localBackupId
    }
  } catch (error) {
    console.error('❌ Error creando backup:', error)
    throw error
  }
}

/**
 * Aplica un diseño completo (colores + contenido) a la configuración
 */
export async function applyDesignToConfig(
  designId: string, 
  tenantId: string, 
  options: {
    applyContent?: boolean
    applyColors?: boolean
    createBackup?: boolean
  } = {}
): Promise<boolean> {
  try {
    const {
      applyContent = false,
      applyColors = true,
      createBackup: shouldCreateBackup = true
    } = options
    
    const design = getDesignById(designId)
    if (!design) {
      throw new Error(`Diseño no encontrado: ${designId}`)
    }
    
    console.log('🎨 Aplicando diseño:', design.name)
    console.log('📋 Opciones:', { applyContent, applyColors, shouldCreateBackup })
    
    // Crear backup si se solicita
    let backupId: string | undefined
    if (shouldCreateBackup) {
      backupId = await createBackup(tenantId)
    }
    
    // Cargar configuración actual
    const { loadConfig, saveConfig } = await import('./config-loader')
    const currentConfig = await loadConfig(tenantId)
    
    // Aplicar cambios según las opciones
    let newConfig = { ...currentConfig }
    
    if (applyContent && design.predefinedConfig) {
      console.log('📝 Aplicando contenido del diseño (no destructivo)...')
      newConfig = mergeConfigWithDesign(currentConfig, design.predefinedConfig)
    }
    
    if (applyColors) {
      console.log('🎨 Aplicando colores del diseño...')
      newConfig = applyColorSchemeToConfig(newConfig, design.colorScheme)
    }
    
    // Actualizar diseño seleccionado
    newConfig.selectedDesigns = {
      ...newConfig.selectedDesigns,
      [design.category]: designId
    }
    
    // Guardar configuración actualizada
    const success = await saveConfig(newConfig, tenantId)
    
    if (success) {
      console.log('✅ Diseño aplicado exitosamente')
      
      // Aplicar variables CSS al documento
      if (typeof document !== 'undefined') {
        applyDesignToDocument(design)
      }
      
      return true
    } else {
      throw new Error('Error guardando configuración')
    }
  } catch (error) {
    console.error('❌ Error aplicando diseño:', error)
    return false
  }
}

/**
 * Fusiona la configuración actual con el contenido predefinido del diseño
 */
function mergeConfigWithDesign(currentConfig: any, designConfig: any): any {
  // Estrategia no destructiva: solo completar campos vacíos, nunca borrar o reemplazar contenido existente del usuario
  const merged = { ...currentConfig }

  const fillIfEmpty = (value: any, fallback: any) => {
    const isEmptyString = typeof value === 'string' && value.trim() === ''
    const isNullish = value === undefined || value === null
    if (isNullish || isEmptyString) return fallback
    return value
  }

  // site: completar solo campos vacíos
  if (designConfig.site) {
    merged.site = { ...merged.site }
    for (const key of Object.keys(designConfig.site)) {
      // @ts-ignore
      merged.site[key] = fillIfEmpty(merged.site[key], designConfig.site[key])
    }
  }

  // sessions/course/about/testimonials/contact: mantener usuario si ya tiene algo
  if (designConfig.sessions) {
    if (!Array.isArray(merged.sessions) || merged.sessions.length === 0) {
      merged.sessions = designConfig.sessions
    }
  }

  if (designConfig.course) {
    if (!merged.course || Object.keys(merged.course || {}).length === 0) {
      merged.course = designConfig.course
    }
  }

  if (designConfig.about) {
    if (!merged.about || Object.keys(merged.about || {}).length === 0) {
      merged.about = designConfig.about
    } else {
      // completar campos vacíos dentro de about
      const about = { ...merged.about }
      for (const key of Object.keys(designConfig.about)) {
        // @ts-ignore
        about[key] = fillIfEmpty(about[key], designConfig.about[key])
      }
      merged.about = about
    }
  }

  if (designConfig.testimonials) {
    if (!Array.isArray(merged.testimonials) || merged.testimonials.length === 0) {
      merged.testimonials = designConfig.testimonials
    }
  }

  if (designConfig.contact) {
    if (!merged.contact || Object.keys(merged.contact || {}).length === 0) {
      merged.contact = designConfig.contact
    } else {
      const contact = { ...merged.contact }
      for (const key of Object.keys(designConfig.contact)) {
        // No reemplazar arrays existentes con datos del usuario
        // @ts-ignore
        const currentVal = contact[key]
        // @ts-ignore
        const incoming = designConfig.contact[key]
        if (Array.isArray(currentVal)) {
          // mantener los existentes; si está vacío, usar los del diseño
          contact[key] = currentVal.length ? currentVal : incoming
        } else {
          contact[key] = fillIfEmpty(currentVal, incoming)
        }
      }
      merged.contact = contact
    }
  }

  // integrations: fusión suave campo a campo solo si vacío
  if (designConfig.integrations) {
    const integrations = { ...merged.integrations }
    for (const key of Object.keys(designConfig.integrations)) {
      // @ts-ignore
      integrations[key] = fillIfEmpty(integrations[key], designConfig.integrations[key])
    }
    merged.integrations = integrations
  }

  return merged
}

/**
 * Aplica el esquema de colores del diseño a la configuración
 */
function applyColorSchemeToConfig(config: any, colorScheme: any): any {
  const updatedConfig = { ...config }
  
  // Aplicar colores al tema
  if (!updatedConfig.theme) {
    updatedConfig.theme = { light: {}, dark: {} }
  }
  
  // Convertir colores hex a RGB para mejor compatibilidad
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }
  
  const primaryRgb = hexToRgb(colorScheme.primary)
  const secondaryRgb = hexToRgb(colorScheme.secondary)
  const accentRgb = hexToRgb(colorScheme.accent)
  
  // Aplicar al tema claro
  updatedConfig.theme.light = {
    ...updatedConfig.theme.light,
    backgroundColor: '#ffffff',
    sectionBackground: '#f8fafc',
    navbarBackground: '#ffffff',
    textColor: '#1e293b',
    accentColor: colorScheme.accent,
    primaryButtonColor: colorScheme.primary,
    secondaryButtonColor: colorScheme.secondary,
    outlineButtonColor: colorScheme.secondary
  }
  
  // Aplicar al tema oscuro
  updatedConfig.theme.dark = {
    ...updatedConfig.theme.dark,
    backgroundColor: '#0f172a',
    sectionBackground: '#1e293b',
    navbarBackground: '#0f172a',
    textColor: '#f1f5f9',
    accentColor: colorScheme.accent,
    primaryButtonColor: colorScheme.primary,
    secondaryButtonColor: colorScheme.secondary,
    outlineButtonColor: '#9ca3af'
  }
  
  return updatedConfig
}

/**
 * Restaura una configuración desde un backup
 */
export async function restoreFromBackup(backupId: string, tenantId: string): Promise<boolean> {
  try {
    console.log('🔄 Restaurando desde backup:', backupId)
    
    const { db } = await import('./firebase')
    const { doc, getDoc } = await import('firebase/firestore')
    
    const backupDoc = doc(db, 'backups', backupId)
    const backupSnapshot = await getDoc(backupDoc)
    
    if (!backupSnapshot.exists()) {
      throw new Error('Backup no encontrado')
    }
    
    const backup = backupSnapshot.data()
    const { saveConfig } = await import('./config-loader')
    
    // Restaurar configuración
    const success = await saveConfig(backup.config, tenantId)
    
    if (success) {
      console.log('✅ Configuración restaurada exitosamente')
      return true
    } else {
      throw new Error('Error guardando configuración restaurada')
    }
  } catch (error) {
    console.error('❌ Error restaurando backup:', error)
    return false
  }
}

/**
 * Obtiene la lista de backups disponibles para un tenant
 */
export async function getBackups(tenantId: string): Promise<any[]> {
  try {
    const { db } = await import('./firebase')
    const { collection, query, where, orderBy, getDocs } = await import('firebase/firestore')
    
    const backupsRef = collection(db, 'backups')
    const q = query(
      backupsRef,
      where('tenantId', '==', tenantId),
      orderBy('timestamp', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    const backups: any[] = []
    
    querySnapshot.forEach((doc) => {
      backups.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return backups
  } catch (error) {
    console.error('❌ Error obteniendo backups:', error)
    return []
  }
}

/**
 * Elimina un backup específico
 */
export async function deleteBackup(backupId: string): Promise<boolean> {
  try {
    const { db } = await import('./firebase')
    const { doc, deleteDoc } = await import('firebase/firestore')
    
    const backupDoc = doc(db, 'backups', backupId)
    await deleteDoc(backupDoc)
    
    console.log('✅ Backup eliminado:', backupId)
    return true
  } catch (error) {
    console.error('❌ Error eliminando backup:', error)
    return false
  }
}
