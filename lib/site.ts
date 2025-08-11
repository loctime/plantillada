import { loadConfig } from './config-loader'

// Función para obtener la configuración del sitio
export async function getSiteConfig() {
  const config = await loadConfig()
  
  return {
    title: config.site.title,
    tagline: config.site.tagline,
    calendlyUrl: config.integrations.calendlyUrl,
    hero: {
      title: "Claridad, estrategia y acción para tu próximo salto profesional",
      subtitle:
        "Sesiones 1:1 y un curso online diseñados para desbloquear tu potencial, definir un plan claro y ejecutarlo con confianza.",
    },
    sessions: config.sessions,
    course: config.course,
    about: config.about,
    testimonials: config.testimonials,
    contact: config.contact,
    legal: config.legal,
  }
}

// Configuración por defecto para SSR
export const site = {
  title: "Tu Marca Personal",
  tagline: "Acompañamiento 1:1 y formación práctica para cambios reales.",
  calendlyUrl: "https://calendly.com/tu-usuario/sesion",
  hero: {
    title: "Claridad, estrategia y acción para tu próximo salto profesional",
    subtitle:
      "Sesiones 1:1 y un curso online diseñados para desbloquear tu potencial, definir un plan claro y ejecutarlo con confianza.",
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
        "Seguimiento por email 7 días",
      ],
      hotmartUrl: "https://pay.hotmart.com/TU_CHECKOUT_1",
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
      "Casos prácticos y ejercicios guiados",
    ],
  },
  about: {
    photoUrl: "/placeholder.svg?height=520&width=420",
    videoUrl: "",
    story: "Soy [Tu Nombre], consultor y coach con X años ayudando a profesionales a ganar claridad, enfocarse y ejecutar con calma.",
    whyMe: "He acompañado a +300 clientes en sectores diversos.",
  },
  testimonials: [
    {
      quote: "En dos sesiones definimos un plan claro y recuperé la motivación.",
      author: "María G.",
      role: "Marketing Specialist",
    }
  ],
  contact: { email: "hola@tumarca.com" },
  legal: { terms: "", privacy: "" },
}
