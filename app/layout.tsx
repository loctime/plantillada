import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { AdminProvider } from '@/lib/admin-context'
import { DesignApplier } from '@/components/design-applier'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: 'Landing Page - Hotmart + Calendly',
  description: 'Landing page profesional para servicios de coaching/consultoría con integración de Hotmart y Calendly',
  generator: 'Next.js',
  keywords: 'landing page, coaching, consultoría, hotmart, calendly, panel de administración',
  authors: [{ name: 'Tu Nombre' }],
  creator: 'Tu Nombre',
  publisher: 'Tu Marca',
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
            <DesignApplier currentTemplate="landing" />
            {children}
            <Toaster />
          </AdminProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
