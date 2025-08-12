import { db } from './firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export interface ColorConfig {
  backgroundColor: string
  sectionBackground: string
  navbarBackground: string
  textColor: string
  accentColor: string
  primaryButtonColor: string
  secondaryButtonColor: string
  outlineButtonColor: string
}

export interface ThemeConfig {
  light: ColorConfig
  dark: ColorConfig
}

export interface Config {
  site: {
    title: string
    tagline: string
    heroTitle?: string
    heroSubtitle?: string
    heroImageUrl?: string
    sessionsTitle?: string
    sessionsSubtitle?: string
    aboutTitle?: string
    testimonialsTitle?: string
    testimonialsSubtitle?: string
    ctaTitle?: string
    ctaSubtitle?: string
  }
  buttons?: {
    heroButton?: string
    sessionsButton?: string
    courseButton?: string
    aboutButton?: string
    ctaButton?: string
    heroButtons?: Array<{
      id: string
      text: string
      type: 'url' | 'section' | 'modal'
      url?: string
      sectionId?: string
      modalTitle?: string
      modalContent?: string
      variant?: 'default' | 'outline' | 'secondary'
      icon?: string
      order: number
    }>
    aboutButtons?: Array<{
      id: string
      text: string
      type: 'url' | 'section' | 'modal'
      url?: string
      sectionId?: string
      modalTitle?: string
      modalContent?: string
      variant?: 'default' | 'outline' | 'secondary'
      icon?: string
      order: number
    }>
  }
  integrations: {
    calendlyUrl: string
    hotmartBaseUrl: string
  }
  theme?: ThemeConfig
  currentTemplate?: string
  sessions: Array<{
    id: string
    name: string
    summary: string
    duration: string
    price: string
    features: string[]
    hotmartUrl: string
  }>
  course: {
    title: string
    blurb: string
    price: string
    hotmartUrl: string
    videoUrl: string
    bullets: string[]
  }
  about: {
    photoUrl: string
    videoUrl: string
    story: string
    whyMe: string
  }
  testimonials: Array<{
    quote: string
    author: string
    role: string
  }>
  contact: {
    email: string
  }
  legal: {
    termsUrl: string
    privacyUrl: string
  }
  // Campos específicos para la tienda
  shopConfig?: {
    storeName: string
    storeTagline: string
    navigation: string[]
    categories: string[]
    searchPlaceholder: string
    filterButtonText: string
    bestSellersTitle: string
    breadcrumbText: string
    resultsText: string
    sortOptions: { value: string; label: string }[]
    addToCartText: string
    outOfStockText: string
    cartTitle: string
    emptyCartText: string
    checkoutText: string
    totalText: string
  }
  products?: Array<{
    id: string
    name: string
    brand: string
    price: number
    originalPrice?: number
    image: string
    rating: number
    reviews: number
    category: string
    inStock: boolean
    description: string
    features: string[]
  }>
}

// Función para obtener el tenant ID basado en el dominio
export function getTenantId(): string {
  if (typeof window === 'undefined') {
    // Server-side: usar header o variable de entorno
    return process.env.NEXT_PUBLIC_DEFAULT_TENANT || 'default'
  }
  
  // Client-side: usar el dominio actual
  const hostname = window.location.hostname
  
  // Mapeo de dominios a tenant IDs
  const domainToTenant: Record<string, string> = {
    'localhost': 'default',
    'landing-six-gold.vercel.app': 'gold',
    'marcamia.com': 'marcamia',
    'tumarca.com': 'tumarca',
    'controldoc.app': 'controldoc',
    // Agregar más dominios según necesites
  }
  
  // Buscar coincidencia exacta
  if (domainToTenant[hostname]) {
    return domainToTenant[hostname]
  }
  
  // IMPORTANTE: Para subdominios de Vercel, extraer el tenant base
  // Ejemplo: plantilla-5dqaylk9f-loctimes-projects.vercel.app -> plantilla
  if (hostname.includes('.vercel.app')) {
    const parts = hostname.split('.')
    if (parts.length >= 3) {
      const firstPart = parts[0]
      // Si el primer parte contiene guiones, tomar solo la parte antes del primer guión
      if (firstPart.includes('-')) {
        const baseTenant = firstPart.split('-')[0]
        console.log(`🔍 Detectado subdominio Vercel: ${hostname} -> tenant: ${baseTenant}`)
        return baseTenant
      }
      return firstPart
    }
  }
  
  // Buscar coincidencia por subdominio (solo para dominios no-Vercel)
  const subdomain = hostname.split('.')[0]
  if (subdomain && subdomain !== 'www') {
    return subdomain
  }
  
  // Fallback al dominio completo como tenant ID
  return hostname.replace(/[^a-zA-Z0-9]/g, '-')
}

// Función para cargar configuración desde Firestore (multi-tenant)
export async function loadConfig(tenantId?: string, template?: string | null): Promise<Config> {
  try {
    const tenant = tenantId || getTenantId()
    console.log('🔍 Cargando configuración para tenant:', tenant, 'template:', template)
    
    // Si se especifica un template, usar una configuración específica para ese template
    if (template) {
      const templateConfig = getTemplateConfig(template, tenant)
      console.log('📋 Usando configuración específica para template:', template)
      return templateConfig
    }
    
    const configDoc = doc(db, 'config', tenant)
    const configSnapshot = await getDoc(configDoc)
    
    if (configSnapshot.exists()) {
      const data = configSnapshot.data()
      
      // Si los datos están en el campo 'data' como string JSON
      if (data.data && typeof data.data === 'string') {
        try {
          const config = JSON.parse(data.data) as Config
          // IMPORTANTE: No aplicar template automáticamente si hay configuración personalizada
          // Solo aplicar template si se solicita explícitamente
          if (template && config.currentTemplate) {
            console.log('📋 Aplicando template solicitado:', template)
            return getTemplateConfig(template, tenant)
          }
          // Si no hay template solicitado, devolver la configuración personalizada
          console.log('✅ Cargando configuración personalizada guardada')
          console.log('📋 Título cargado:', config.site?.title)
          console.log('📋 Tagline cargada:', config.site?.tagline)
          return config
        } catch (parseError) {
          console.error('Error parsing JSON from data field:', parseError)
          console.error('🔍 Datos que causaron el error:', data.data)
          // En lugar de devolver configuración por defecto, intentar usar los datos directamente
          console.log('🔄 Intentando usar datos directamente...')
          return data as Config
        }
      }
      
      // Si los datos están directamente en el documento
      const config = data as Config
      // IMPORTANTE: No aplicar template automáticamente si hay configuración personalizada
      // Solo aplicar template si se solicita explícitamente
      if (template && config.currentTemplate) {
        console.log('📋 Aplicando template solicitado:', template)
        return getTemplateConfig(template, tenant)
      }
      // Si no hay template solicitado, devolver la configuración personalizada
      console.log('✅ Cargando configuración personalizada guardada')
      return config
    } else {
      // Si no existe, crear configuración por defecto para este tenant
      console.log('📝 Creando configuración por defecto para tenant:', tenant)
      const defaultConfig = getDefaultConfig(tenant)
      await saveConfig(defaultConfig, tenant)
      return defaultConfig
    }
  } catch (error) {
    console.error('Error loading config from Firestore:', error)
    // En caso de error, devolver configuración por defecto
    return getDefaultConfig(tenantId || getTenantId())
  }
}

// Función para guardar configuración en Firestore (multi-tenant)
export async function saveConfig(config: Config, tenantId?: string): Promise<boolean> {
  try {
    const tenant = tenantId || getTenantId()
    console.log('🔄 Iniciando guardado en Firestore para tenant:', tenant)
    console.log('📁 Colección: config, Documento:', tenant)
    
    const configDoc = doc(db, 'config', tenant)
    console.log('📄 Referencia del documento creada')
    
    // IMPORTANTE: Limpiar currentTemplate cuando se guarda configuración personalizada
    // para evitar que se aplique automáticamente al cargar
    const configToSave = { ...config }
    if (configToSave.currentTemplate) {
      console.log('🧹 Limpiando currentTemplate para evitar aplicación automática')
      delete configToSave.currentTemplate
    }
    
    // Guardar como JSON string en el campo 'data'
    const dataToSave = { data: JSON.stringify(configToSave) }
    console.log('💾 Datos a guardar:', JSON.stringify(dataToSave, null, 2))
    
    await setDoc(configDoc, dataToSave)
    console.log('✅ Documento guardado exitosamente en Firestore para tenant:', tenant)
    return true
  } catch (error) {
    console.error('❌ Error saving config to Firestore:', error)
    console.error('🔍 Detalles del error:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any)?.code || 'No code',
      stack: error instanceof Error ? error.stack : 'No stack'
    })
    return false
  }
}

// Función para guardar un template específico (mantiene currentTemplate)
export async function saveTemplate(templateId: string, tenantId?: string): Promise<boolean> {
  try {
    const tenant = tenantId || getTenantId()
    console.log('🔄 Guardando template:', templateId, 'para tenant:', tenant)
    
    const templateConfig = getTemplateConfig(templateId, tenant)
    // Agregar el currentTemplate para que se aplique automáticamente
    templateConfig.currentTemplate = templateId
    
    const configDoc = doc(db, 'config', tenant)
    const dataToSave = { data: JSON.stringify(templateConfig) }
    
    await setDoc(configDoc, dataToSave)
    console.log('✅ Template guardado exitosamente:', templateId)
    return true
  } catch (error) {
    console.error('❌ Error saving template:', error)
    return false
  }
}

// Función para obtener configuración por defecto (personalizada por tenant)
function getDefaultConfig(tenantId: string): Config {
  const baseConfig = {
    site: {
      title: `Tu Marca Personal - ${tenantId}`,
      tagline: "Acompañamiento 1:1 y formación práctica para cambios reales."
    },
    integrations: {
      calendlyUrl: "https://calendly.com/tu-usuario/sesion",
      hotmartBaseUrl: "https://pay.hotmart.com"
    },
          theme: {
        light: {
          backgroundColor: '#ffffff',
          sectionBackground: '#f8fafc',
          navbarBackground: '#ffffff',
          textColor: '#1e293b',
          accentColor: '#10b981',
          primaryButtonColor: '#10b981',
          secondaryButtonColor: '#3b82f6',
          outlineButtonColor: '#6b7280'
        },
        dark: {
          backgroundColor: '#0f172a',
          sectionBackground: '#1e293b',
          navbarBackground: '#0f172a',
          textColor: '#f1f5f9',
          accentColor: '#10b981',
          primaryButtonColor: '#10b981',
          secondaryButtonColor: '#3b82f6',
          outlineButtonColor: '#9ca3af'
        }
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
  }

  // Personalizar según el tenant
  switch (tenantId) {
    case 'gold':
      baseConfig.site.title = "Gold Coaching"
      baseConfig.site.tagline = "Coaching premium para ejecutivos y emprendedores."
      break
    case 'marcamia':
      baseConfig.site.title = "Marcamia"
      baseConfig.site.tagline = "Transformación personal y profesional."
      break
    case 'tumarca':
      baseConfig.site.title = "Tu Marca"
      baseConfig.site.tagline = "Construye tu marca personal."
      break
    case 'controldoc':
      baseConfig.site.title = "ControlDoc"
      baseConfig.site.tagline = "Control y gestión documental profesional."
      break
    default:
      // Mantener configuración base
      break
  }

  return baseConfig
}

// Función para obtener configuración específica por template
function getTemplateConfig(templateId: string, tenantId: string): Config {
  const baseConfig = getDefaultConfig(tenantId)
  
  switch (templateId) {
    case 'landing':
      return {
        ...baseConfig,
        site: {
          ...baseConfig.site,
          title: `${baseConfig.site.title} - Landing Page`,
          tagline: "Página de aterrizaje profesional con formularios de contacto y conversión"
        },
        buttons: {
          heroButton: "Agendar Sesión",
          sessionsButton: "Ver Sesiones",
          courseButton: "Comprar Curso",
          aboutButton: "Conoce Más",
          ctaButton: "Empezar Ahora"
        }
      }
      
    case 'shop':
      return {
        ...baseConfig,
        site: {
          ...baseConfig.site,
          title: `${baseConfig.site.title} - Tienda Online`,
          tagline: "E-commerce completo con carrito, pagos y sistema de clonación de productos"
        },
        buttons: {
          heroButton: "Ver Productos",
          sessionsButton: "Comprar Sesión",
          courseButton: "Comprar Curso",
          aboutButton: "Sobre Nosotros",
          ctaButton: "Ir a la Tienda"
        },
        sessions: [
          ...baseConfig.sessions,
          {
            id: "sesion-avanzada",
            name: "Sesión Avanzada",
            summary: "Sesión intensiva de 2 horas para resultados rápidos.",
            duration: "120 min",
            price: "€199",
            features: [
              "Análisis profundo de objetivos",
              "Plan de acción detallado",
              "Seguimiento por 30 días",
              "Recursos adicionales"
            ],
            hotmartUrl: "https://pay.hotmart.com/TU_CHECKOUT_2"
          }
        ],
        shopConfig: {
          storeName: "TECH STORE",
          storeTagline: "Tu tienda de tecnología de confianza",
          navigation: ["TIENDA", "CELULARES", "APPLE", "DRONES DJI", "GAMING", "WAREHOUSE", "LISTA DE PRECIOS"],
          categories: ["Todos", "Tablets", "Smartphones", "Gaming"],
          searchPlaceholder: "Buscar productos...",
          filterButtonText: "FILTRAR",
          bestSellersTitle: "Our Best Sellers",
          breadcrumbText: "Inicio / STORE DE LA TIENDA",
          resultsText: "Mostrando 1-{count} de {total} resultados",
          sortOptions: [
            { value: "latest", label: "Ordenar por los últimos" },
            { value: "price-low", label: "Precio: Menor a Mayor" },
            { value: "price-high", label: "Precio: Mayor a Menor" },
            { value: "rating", label: "Mejor Valorados" }
          ],
          addToCartText: "Agregar al Carrito",
          outOfStockText: "Sin Stock",
          cartTitle: "Carrito de Compras",
          emptyCartText: "Tu carrito está vacío",
          checkoutText: "Proceder al Pago",
          totalText: "Total:"
        },
        products: [
          {
            id: '1',
            name: 'iPad 11th (A16)',
            brand: 'iPad',
            price: 899.00,
            originalPrice: 999.00,
            image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
            rating: 4.5,
            reviews: 128,
            category: 'tablets',
            inStock: true,
            description: 'iPad de 11 pulgadas con chip A16, perfecto para productividad y creatividad.',
            features: ['Chip A16 Bionic', '11 pulgadas', '128GB', 'WiFi + Cellular']
          },
          {
            id: '2',
            name: 'iPad Mini (A17)',
            brand: 'iPad',
            price: 599.00,
            originalPrice: 699.00,
            image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
            rating: 4.3,
            reviews: 89,
            category: 'tablets',
            inStock: true,
            description: 'iPad Mini compacto con chip A17, ideal para uso portátil.',
            features: ['Chip A17 Pro', '8.3 pulgadas', '64GB', 'WiFi']
          },
          {
            id: '3',
            name: 'iPad Air M2',
            brand: 'iPad',
            price: 799.00,
            originalPrice: 899.00,
            image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
            rating: 4.7,
            reviews: 156,
            category: 'tablets',
            inStock: true,
            description: 'iPad Air con chip M2, potencia profesional en formato ligero.',
            features: ['Chip M2', '10.9 pulgadas', '256GB', 'WiFi + Cellular']
          },
          {
            id: '4',
            name: 'NUBIA FLIP',
            brand: 'Nubia',
            price: 757.00,
            originalPrice: 899.00,
            image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
            rating: 4.2,
            reviews: 67,
            category: 'smartphones',
            inStock: true,
            description: 'Smartphone plegable con diseño innovador y tecnología avanzada.',
            features: ['Pantalla plegable', '6.9 pulgadas', '256GB', '5G']
          },
          {
            id: '5',
            name: 'ROG PHONE 8',
            brand: 'ASUS',
            price: 1299.00,
            originalPrice: 1499.00,
            image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
            rating: 4.6,
            reviews: 234,
            category: 'gaming',
            inStock: true,
            description: 'Smartphone gaming con refrigeración líquida y rendimiento extremo.',
            features: ['Snapdragon 8 Gen 3', '16GB RAM', '512GB', 'Gaming']
          },
          {
            id: '6',
            name: 'Nubia Red Magic 6',
            brand: 'Nubia',
            price: 757.00,
            originalPrice: 899.00,
            image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
            rating: 4.4,
            reviews: 189,
            category: 'gaming',
            inStock: true,
            description: 'Smartphone gaming con ventilador integrado y pantalla de alta frecuencia.',
            features: ['Snapdragon 888', '12GB RAM', '256GB', '165Hz']
          }
        ]
      }
      
    case 'multi-page':
      return {
        ...baseConfig,
        site: {
          ...baseConfig.site,
          title: `${baseConfig.site.title} - Sitio Multi-Página`,
          tagline: "Combinación de landing, tienda y otras secciones en un solo sitio"
        },
        buttons: {
          heroButton: "Explorar",
          sessionsButton: "Sesiones",
          courseButton: "Cursos",
          aboutButton: "Nosotros",
          ctaButton: "Contacto"
        },
        testimonials: [
          ...baseConfig.testimonials,
          {
            quote: "El sitio multi-página me permite tener todo en un lugar.",
            author: "Carlos R.",
            role: "Emprendedor"
          }
        ]
      }
      
    case 'forum':
      return {
        ...baseConfig,
        site: {
          ...baseConfig.site,
          title: `${baseConfig.site.title} - Foro Comunitario`,
          tagline: "Plataforma de discusión y comunidad con moderación"
        },
        buttons: {
          heroButton: "Unirse al Foro",
          sessionsButton: "Sesiones",
          courseButton: "Cursos",
          aboutButton: "Comunidad",
          ctaButton: "Registrarse"
        },
        testimonials: [
          {
            quote: "La comunidad me ha ayudado mucho en mi crecimiento.",
            author: "Ana L.",
            role: "Miembro Activo"
          }
        ]
      }
      
    default:
      return baseConfig
  }
}
