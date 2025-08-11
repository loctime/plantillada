// Configuración del sitio con variables de entorno
export const config = {
  // Configuración básica
  title: process.env.NEXT_PUBLIC_SITE_TITLE || "Tu Marca Personal",
  tagline: process.env.NEXT_PUBLIC_SITE_TAGLINE || "Acompañamiento 1:1 y formación práctica para cambios reales.",
  
  // URLs de integración
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/tu-usuario/sesion",
  hotmartBaseUrl: process.env.NEXT_PUBLIC_HOTMART_BASE_URL || "https://pay.hotmart.com",
  
  // Configuración de administración
  adminPassword: process.env.ADMIN_PASSWORD || "admin123",
  adminUsername: process.env.ADMIN_USERNAME || "admin",
  
  // Configuración de sesiones
  sessions: getSessionsConfig(),
  
  // Configuración del curso
  course: {
    title: process.env.COURSE_TITLE || "Curso Online: Sistema de Productividad Sencilla",
    blurb: process.env.COURSE_BLURB || "Aprende a construir un sistema ligero para enfocarte, priorizar con calma y avanzar cada semana sin fricción.",
    price: process.env.COURSE_PRICE || "€179",
    hotmartUrl: process.env.COURSE_HOTMART_URL || "https://pay.hotmart.com/TU_CHECKOUT_CURSO",
    videoUrl: process.env.COURSE_VIDEO_URL || "",
    bullets: [
      "Estructura de planificación semanal en 30 minutos",
      "Métricas simples para medir progreso",
      "Plantillas reutilizables y ejemplos",
      "Casos prácticos y ejercicios guiados",
    ],
  },
  
  // Información personal
  about: {
    photoUrl: process.env.ABOUT_PHOTO_URL || "/placeholder.svg?height=520&width=420",
    videoUrl: process.env.ABOUT_VIDEO_URL || "",
    story: process.env.ABOUT_STORY || "Soy [Tu Nombre], consultor y coach con X años ayudando a profesionales a ganar claridad, enfocarse y ejecutar con calma. Mi enfoque es práctico, humano y orientado a resultados medibles.",
    whyMe: process.env.ABOUT_WHY_ME || "He acompañado a +300 clientes en sectores diversos. Integro estrategia, hábitos y priorización para construir momentum sostenible.",
  },
  
  // Testimonios (por ahora estáticos, se pueden hacer dinámicos después)
  testimonials: [
    {
      quote: "En dos sesiones definimos un plan claro y recuperé la motivación. Pasé de la parálisis a entregar mi proyecto.",
      author: "María G.",
      role: "Marketing Specialist",
    },
    {
      quote: "Las herramientas son simples y efectivas. Mi semana ahora tiene foco y cierro lo importante.",
      author: "Javier R.",
      role: "Product Manager",
    },
    {
      quote: "El curso me dio estructura y las sesiones 1:1 me mantuvieron responsable. Muy recomendable.",
      author: "Lucía P.",
      role: "Emprendedora",
    },
  ],
  
  // Contacto
  contact: {
    email: process.env.CONTACT_EMAIL || "hola@tumarca.com",
  },
  
  // Enlaces legales
  legal: {
    terms: process.env.LEGAL_TERMS_URL || "",
    privacy: process.env.LEGAL_PRIVACY_URL || "",
  },
}

// Función para parsear configuración de sesiones desde variable de entorno
function getSessionsConfig() {
  try {
    if (process.env.SESSIONS_CONFIG) {
      return JSON.parse(process.env.SESSIONS_CONFIG)
    }
  } catch (error) {
    console.warn("Error parsing SESSIONS_CONFIG, using default")
  }
  
  // Configuración por defecto
  return [
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
    },
    {
      id: "sesion-estrategia",
      name: "Estrategia Pro",
      summary: "Estrategia personalizada y sistema semanal.",
      duration: "90 min",
      price: "€149",
      features: ["Auditoría de situación actual", "Diseño de sistema y métricas", "Plantillas y recursos"],
      hotmartUrl: "https://pay.hotmart.com/TU_CHECKOUT_2",
    },
    {
      id: "sesion-impulso",
      name: "Impulso y Ejecución",
      summary: "Implementación guiada y resolución de bloqueos.",
      duration: "60 min",
      price: "€129",
      features: ["Resolución de bloqueos clave", "Checklist de ejecución", "Revisión de resultados"],
      hotmartUrl: "https://pay.hotmart.com/TU_CHECKOUT_3",
    },
  ]
}
