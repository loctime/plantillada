import React from "react"
import { 
  Building2,
  Scale,
  Wrench,
  BookOpen,
  Heart,
  Zap,
  ShoppingBag,
  Dumbbell,
  Sparkles
} from "lucide-react"

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
}

export const landingDesigns: Design[] = [
  {
    id: 'estudio-contable',
    name: 'Estudio Contable',
    description: 'Diseño profesional y confiable para estudios contables',
    icon: <Building2 className="h-6 w-6" />,
    category: 'landing',
    colorScheme: {
      primary: '#1e40af',
      secondary: '#64748b',
      accent: '#f59e0b'
    },
    features: [
      'Colores azules profesionales',
      'Tipografía serif elegante',
      'Iconografía financiera',
      'Secciones de servicios contables'
    ],
    status: 'active',
    cssVariables: {
      '--primary': '#1e40af',
      '--secondary': '#64748b',
      '--accent': '#f59e0b',
      '--font-family': 'Georgia, serif'
    }
  },
  {
    id: 'estudio-abogados',
    name: 'Estudio de Abogados',
    description: 'Diseño elegante y autoritario para bufetes de abogados',
    icon: <Scale className="h-6 w-6" />,
    category: 'landing',
    colorScheme: {
      primary: '#1f2937',
      secondary: '#6b7280',
      accent: '#dc2626'
    },
    features: [
      'Colores oscuros y elegantes',
      'Tipografía formal',
      'Iconografía legal',
      'Secciones de especialidades'
    ],
    status: 'active',
    cssVariables: {
      '--primary': '#1f2937',
      '--secondary': '#6b7280',
      '--accent': '#dc2626',
      '--font-family': 'Times New Roman, serif'
    }
  },
  {
    id: 'ingenieros',
    name: 'Ingenieros',
    description: 'Diseño técnico y moderno para estudios de ingeniería',
    icon: <Wrench className="h-6 w-6" />,
    category: 'landing',
    colorScheme: {
      primary: '#059669',
      secondary: '#374151',
      accent: '#3b82f6'
    },
    features: [
      'Colores verdes y azules',
      'Tipografía técnica',
      'Iconografía industrial',
      'Secciones de proyectos'
    ],
    status: 'active',
    cssVariables: {
      '--primary': '#059669',
      '--secondary': '#374151',
      '--accent': '#3b82f6',
      '--font-family': 'Courier New, monospace'
    }
  },
  {
    id: 'blog-personal',
    name: 'Blog Personal',
    description: 'Diseño creativo y personal para blogs individuales',
    icon: <BookOpen className="h-6 w-6" />,
    category: 'landing',
    colorScheme: {
      primary: '#7c3aed',
      secondary: '#6b7280',
      accent: '#ec4899'
    },
    features: [
      'Colores vibrantes',
      'Tipografía moderna',
      'Iconografía creativa',
      'Secciones de blog'
    ],
    status: 'active',
    cssVariables: {
      '--primary': '#7c3aed',
      '--secondary': '#6b7280',
      '--accent': '#ec4899',
      '--font-family': 'Inter, sans-serif'
    }
  },
  {
    id: 'coach-personal',
    name: 'Coach Personal',
    description: 'Diseño motivacional y cercano para coaches',
    icon: <Heart className="h-6 w-6" />,
    category: 'landing',
    colorScheme: {
      primary: '#dc2626',
      secondary: '#6b7280',
      accent: '#f59e0b'
    },
    features: [
      'Colores cálidos',
      'Tipografía amigable',
      'Iconografía motivacional',
      'Secciones de testimonios'
    ],
    status: 'active',
    cssVariables: {
      '--primary': '#dc2626',
      '--secondary': '#6b7280',
      '--accent': '#f59e0b',
      '--font-family': 'Poppins, sans-serif'
    }
  }
]

export const shopDesigns: Design[] = [
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
      'Tipografía futurista',
      'Iconografía tech',
      'Catálogo de productos tech'
    ],
    status: 'active',
    cssVariables: {
      '--primary': '#3b82f6',
      '--secondary': '#1f2937',
      '--accent': '#10b981',
      '--font-family': 'Roboto, sans-serif'
    }
  },
  {
    id: 'moda-shop',
    name: 'Moda Shop',
    description: 'Diseño elegante y fashion para tiendas de moda',
    icon: <ShoppingBag className="h-6 w-6" />,
    category: 'shop',
    colorScheme: {
      primary: '#ec4899',
      secondary: '#6b7280',
      accent: '#f59e0b'
    },
    features: [
      'Colores rosas y dorados',
      'Tipografía elegante',
      'Iconografía fashion',
      'Catálogo de ropa'
    ],
    status: 'active',
    cssVariables: {
      '--primary': '#ec4899',
      '--secondary': '#6b7280',
      '--accent': '#f59e0b',
      '--font-family': 'Playfair Display, serif'
    }
  },
  {
    id: 'gym-shop',
    name: 'Gym Shop',
    description: 'Diseño deportivo y energético para tiendas de fitness',
    icon: <Dumbbell className="h-6 w-6" />,
    category: 'shop',
    colorScheme: {
      primary: '#dc2626',
      secondary: '#1f2937',
      accent: '#f59e0b'
    },
    features: [
      'Colores rojos energéticos',
      'Tipografía deportiva',
      'Iconografía fitness',
      'Catálogo de equipos'
    ],
    status: 'active',
    cssVariables: {
      '--primary': '#dc2626',
      '--secondary': '#1f2937',
      '--accent': '#f59e0b',
      '--font-family': 'Bebas Neue, sans-serif'
    }
  },
  {
    id: 'lifestyle-shop',
    name: 'Lifestyle Shop',
    description: 'Diseño moderno y minimalista para tiendas de lifestyle',
    icon: <Sparkles className="h-6 w-6" />,
    category: 'shop',
    colorScheme: {
      primary: '#059669',
      secondary: '#6b7280',
      accent: '#8b5cf6'
    },
    features: [
      'Colores verdes naturales',
      'Tipografía minimalista',
      'Iconografía lifestyle',
      'Catálogo variado'
    ],
    status: 'active',
    cssVariables: {
      '--primary': '#059669',
      '--secondary': '#6b7280',
      '--accent': '#8b5cf6',
      '--font-family': 'Montserrat, sans-serif'
    }
  }
]

export function getDesignsForTemplate(templateType: string): Design[] {
  switch (templateType) {
    case 'landing':
      return landingDesigns
    case 'shop':
      return shopDesigns
    default:
      return []
  }
}

export function getDesignById(designId: string): Design | undefined {
  const allDesigns = [...landingDesigns, ...shopDesigns]
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
