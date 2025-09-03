import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { AdminProvider } from '@/lib/admin-context'

import { Toaster } from '@/components/ui/toaster'
import { loadConfig, getTenantId } from '@/lib/config-loader'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const tenantId = getTenantId()
    const config = await loadConfig(tenantId)
    const title = config?.site?.title || 'Tu Marca Personal'
    const description = config?.site?.tagline || 'Acompañamiento 1:1 y formación práctica para cambios reales.'

    const initial = (title.trim()[0] || 'T').toUpperCase()
    const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'>\n  <rect x='0' y='0' width='64' height='64' rx='12' fill='#10b981'/>\n  <text x='32' y='42' text-anchor='middle' font-family='Arial, Helvetica, sans-serif' font-size='36' fill='#ffffff'>${initial}</text>\n</svg>`
    const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`

    return {
      title,
      description,
      generator: 'Next.js',
      keywords: 'landing page, coaching, consultoría, hotmart, calendly, panel de administración',
      authors: [{ name: 'Tu Nombre' }],
      creator: 'Tu Nombre',
      publisher: 'Tu Marca',
      openGraph: {
        title,
        description,
        type: 'website',
      },
      twitter: {
        card: 'summary',
        title,
        description,
      },
      icons: {
        icon: dataUrl,
        shortcut: dataUrl,
        apple: dataUrl,
      },
    }
  } catch {
    return {
      title: 'Tu Marca Personal',
      description: 'Acompañamiento 1:1 y formación práctica para cambios reales.',
    }
  }
}

// Configuración por defecto para el AdminProvider
const defaultConfig = {
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AdminProvider initialConfig={defaultConfig}>
    
            {children}
            <Toaster />
          </AdminProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
