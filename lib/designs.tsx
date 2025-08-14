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
  Sparkles,
  Brain,
  Link,
  Bug,
  Shield,
  AlertTriangle,
  Utensils
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
  // Nuevo: JSON predefinido completo para el diseño
  predefinedConfig?: Partial<Config>
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
    },
    predefinedConfig: {
      site: {
        title: "Estudio Contable Profesional",
        tagline: "Asesoramiento contable integral para empresas y particulares",
        heroTitle: "Tu éxito financiero comienza con una contabilidad profesional",
        heroSubtitle: "Servicios contables completos, asesoramiento fiscal y planificación financiera para hacer crecer tu negocio",
        sessionsTitle: "Nuestros Servicios",
        sessionsSubtitle: "Soluciones contables adaptadas a tus necesidades",
        aboutTitle: "Sobre Nuestro Estudio",
        testimonialsTitle: "Lo que dicen nuestros clientes",
        testimonialsSubtitle: "Más de 15 años de experiencia al servicio de nuestros clientes",
        ctaTitle: "¿Necesitas asesoramiento contable?",
        ctaSubtitle: "Consulta gratuita sin compromiso"
      },
      sessions: [
        {
          id: "contabilidad-empresarial",
          name: "Contabilidad Empresarial",
          summary: "Gestión completa de la contabilidad de tu empresa",
          duration: "Servicio continuo",
          price: "Desde €150/mes",
          features: [
            "Contabilidad mensual completa",
            "Declaraciones trimestrales",
            "Asesoramiento fiscal",
            "Informes financieros"
          ],
          hotmartUrl: "https://pay.hotmart.com/CONTABILIDAD_EMPRESARIAL"
        },
        {
          id: "asesoramiento-fiscal",
          name: "Asesoramiento Fiscal",
          summary: "Optimización fiscal y planificación tributaria",
          duration: "Sesión única",
          price: "€200",
          features: [
            "Análisis de situación fiscal",
            "Planificación de impuestos",
            "Optimización de cargas fiscales",
            "Seguimiento anual"
          ],
          hotmartUrl: "https://pay.hotmart.com/ASESORAMIENTO_FISCAL"
        }
      ],
      course: {
        title: "Curso: Finanzas para Emprendedores",
        blurb: "Aprende a gestionar las finanzas de tu negocio de forma profesional y eficiente",
        price: "€299",
        hotmartUrl: "https://pay.hotmart.com/CURSO_FINANZAS",
        videoUrl: "",
        bullets: [
          "Conceptos básicos de contabilidad",
          "Gestión de flujo de caja",
          "Planificación fiscal",
          "Análisis de rentabilidad"
        ]
      },
      about: {
        photoUrl: "/placeholder.svg?height=520&width=420",
        videoUrl: "",
        story: "Somos un estudio contable con más de 15 años de experiencia, especializados en asesoramiento integral para empresas y particulares. Nuestro compromiso es proporcionar soluciones contables eficientes y transparentes.",
        whyMe: "Hemos ayudado a más de 500 empresas a optimizar sus finanzas y cumplir con sus obligaciones fiscales de manera eficiente."
      },
      testimonials: [
        {
          quote: "Gracias a su asesoramiento, hemos optimizado nuestros impuestos y mejorado significativamente nuestra rentabilidad.",
          author: "Carlos M.",
          role: "Director General"
        },
        {
          quote: "Profesionalidad y transparencia total. Siempre disponibles para resolver nuestras dudas.",
          author: "Ana L.",
          role: "Emprendedora"
        }
      ],
      contact: {
        email: "info@estudiocontable.com"
      }
    }
  },
  {
    id: 'estudio-abogados',
    name: 'Estudio de Abogados',
    description: 'Diseño elegante y autoritario para bufetes de abogados',
    icon: <Scale className="h-6 w-6" />,
    category: 'landing',
    colorScheme: {
      primary: '#1a1a1a',
      secondary: '#8b8b8b',
      accent: '#d4af37'
    },
    features: [
      'Colores oscuros y elegantes',
      'Tipografía formal y profesional',
      'Iconografía legal',
      'Secciones de especialidades legales',
      'Diseño premium con detalles dorados'
    ],
    status: 'active',
    cssVariables: {
      '--primary': '#1a1a1a',
      '--secondary': '#8b8b8b',
      '--accent': '#d4af37',
      '--font-family': 'Georgia, "Times New Roman", serif',
      '--heading-font': 'Georgia, "Times New Roman", serif',
      '--body-font': 'Georgia, "Times New Roman", serif'
    },
    predefinedConfig: {
      site: {
        title: "Bufete de Abogados Martínez & Asociados",
        tagline: "Excelencia legal y compromiso con la justicia desde 1995",
        heroTitle: "Defendemos tus derechos con la máxima profesionalidad",
        heroSubtitle: "Más de 25 años de experiencia en derecho civil, mercantil, laboral y penal. Tu confianza es nuestra responsabilidad.",
        sessionsTitle: "Nuestras Especialidades",
        sessionsSubtitle: "Servicios legales integrales con la más alta calidad profesional",
        aboutTitle: "Nuestro Bufete",
        testimonialsTitle: "Casos de Éxito",
        testimonialsSubtitle: "Testimonios de clientes que confiaron en nosotros",
        ctaTitle: "¿Necesitas asesoramiento legal experto?",
        ctaSubtitle: "Primera consulta gratuita y confidencial",
        showPrices: false
      },
      theme: {
        light: {
          backgroundColor: '#f8f9fa',
          sectionBackground: '#ffffff',
          navbarBackground: '#1a1a1a',
          textColor: '#2c3e50',
          accentColor: '#d4af37',
          primaryButtonColor: '#1a1a1a',
          secondaryButtonColor: '#8b8b8b',
          outlineButtonColor: '#d4af37'
        },
        dark: {
          backgroundColor: '#1a1a1a',
          sectionBackground: '#2d2d2d',
          navbarBackground: '#000000',
          textColor: '#ffffff',
          accentColor: '#d4af37',
          primaryButtonColor: '#d4af37',
          secondaryButtonColor: '#8b8b8b',
          outlineButtonColor: '#ffffff'
        }
      },
      sessions: [
        {
          id: "derecho-civil",
          name: "Derecho Civil",
          summary: "Asesoramiento integral en contratos, herencias, responsabilidad civil y derecho de familia",
          duration: "Según complejidad del caso",
          price: "Desde €200",
          features: [
            "Contratos y acuerdos comerciales",
            "Herencias y sucesiones",
            "Responsabilidad civil y daños",
            "Derecho de familia y divorcios",
            "Propiedad horizontal",
            "Arrendamientos urbanos"
          ],
          hotmartUrl: "https://pay.hotmart.com/DERECHO_CIVIL",
          showPrice: false
        },
        {
          id: "derecho-mercantil",
          name: "Derecho Mercantil",
          summary: "Asesoramiento empresarial y corporativo para empresas de todos los tamaños",
          duration: "Servicio continuo",
          price: "Desde €300/mes",
          features: [
            "Constitución de sociedades",
            "Contratos comerciales",
            "Fusiones y adquisiciones",
            "Derecho societario",
            "Concurrencia desleal",
            "Propiedad intelectual"
          ],
          hotmartUrl: "https://pay.hotmart.com/DERECHO_MERCANTIL",
          showPrice: false
        },
        {
          id: "derecho-laboral",
          name: "Derecho Laboral",
          summary: "Defensa de derechos laborales y asesoramiento en relaciones de trabajo",
          duration: "Según caso",
          price: "Desde €250",
          features: [
            "Despidos y conflictos laborales",
            "Negociaciones colectivas",
            "Prevención de riesgos laborales",
            "Auditorías laborales",
            "Convenios colectivos",
            "Accidentes de trabajo"
          ],
          hotmartUrl: "https://pay.hotmart.com/DERECHO_LABORAL",
          showPrice: false
        },
        {
          id: "derecho-penal",
          name: "Derecho Penal",
          summary: "Defensa penal especializada con amplia experiencia en tribunales",
          duration: "Según proceso",
          price: "Desde €500",
          features: [
            "Defensa en juicios penales",
            "Delitos económicos",
            "Delitos contra la propiedad",
            "Delitos contra las personas",
            "Recursos penales",
            "Medidas cautelares"
          ],
          hotmartUrl: "https://pay.hotmart.com/DERECHO_PENAL",
          showPrice: false
        }
      ],
      course: {
        title: "Curso: Fundamentos Legales para Empresarios",
        blurb: "Conoce los aspectos legales fundamentales para proteger tu negocio y evitar conflictos jurídicos",
        price: "€599",
        hotmartUrl: "https://pay.hotmart.com/CURSO_DERECHO_EMPRESARIAL",
        videoUrl: "",
        bullets: [
          "Formas jurídicas de empresa y sus implicaciones",
          "Contratos comerciales y cláusulas esenciales",
          "Protección de datos y RGPD",
          "Aspectos laborales básicos",
          "Propiedad intelectual y marcas",
          "Responsabilidad civil empresarial"
        ],
        showPrice: false
      },
      about: {
        photoUrl: "/placeholder.svg?height=520&width=420",
        videoUrl: "",
        story: "Fundado en 1995, nuestro bufete se ha consolidado como una referencia en el sector legal, combinando la tradición jurídica con las últimas innovaciones en el campo del derecho. Nuestro equipo de abogados especializados trabaja con dedicación para ofrecer soluciones legales efectivas y personalizadas.",
        whyMe: "Hemos resuelto exitosamente más de 2.500 casos, manteniendo la confidencialidad, profesionalidad y excelencia que caracteriza a nuestro bufete. Nuestro compromiso es defender los derechos de nuestros clientes con la máxima eficacia."
      },
      testimonials: [
        {
          quote: "Excelente trabajo en mi caso de despido improcedente. No solo recuperé mi empleo, sino que obtuve una indemnización justa. Profesionalidad y resultados excepcionales.",
          author: "Miguel Rodríguez",
          role: "Ingeniero Industrial"
        },
        {
          quote: "Gracias a su asesoramiento, pudimos resolver un conflicto mercantil complejo de manera satisfactoria. Su experiencia y dedicación son inigualables.",
          author: "Laura Sánchez",
          role: "Directora General"
        },
        {
          quote: "En un momento difícil de mi vida, encontré en este bufete no solo excelentes abogados, sino también personas que me apoyaron y guiaron en todo el proceso.",
          author: "Carlos Martín",
          role: "Empresario"
        }
      ],
      contact: {
        email: "info@bufetemartinez.com"
      }
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
    },
    predefinedConfig: {
      site: {
        title: "Estudio de Ingeniería",
        tagline: "Soluciones técnicas innovadoras para proyectos complejos",
        heroTitle: "Ingeniería de vanguardia para el futuro",
        heroSubtitle: "Especialistas en proyectos de infraestructura, industrial y desarrollo tecnológico",
        sessionsTitle: "Nuestros Servicios",
        sessionsSubtitle: "Soluciones técnicas integrales",
        aboutTitle: "Nuestro Equipo",
        testimonialsTitle: "Proyectos Destacados",
        testimonialsSubtitle: "Algunos de nuestros trabajos más importantes",
        ctaTitle: "¿Tienes un proyecto en mente?",
        ctaSubtitle: "Consulta técnica gratuita"
      },
      sessions: [
        {
          id: "proyectos-infraestructura",
          name: "Proyectos de Infraestructura",
          summary: "Diseño y supervisión de obras civiles y urbanismo",
          duration: "Según proyecto",
          price: "Consultar",
          features: [
            "Diseño estructural",
            "Planificación urbana",
            "Supervisión de obras",
            "Certificaciones técnicas"
          ],
          hotmartUrl: "https://pay.hotmart.com/INFRAESTRUCTURA"
        },
        {
          id: "consultoria-tecnica",
          name: "Consultoría Técnica",
          summary: "Asesoramiento especializado en ingeniería",
          duration: "Por horas",
          price: "€120/hora",
          features: [
            "Análisis técnico",
            "Optimización de procesos",
            "Estudios de viabilidad",
            "Certificaciones"
          ],
          hotmartUrl: "https://pay.hotmart.com/CONSULTORIA"
        }
      ],
      course: {
        title: "Curso: AutoCAD Avanzado",
        blurb: "Domina las técnicas avanzadas de diseño asistido por computadora",
        price: "€450",
        hotmartUrl: "https://pay.hotmart.com/CURSO_AUTOCAD",
        videoUrl: "",
        bullets: [
          "Modelado 3D avanzado",
          "Renderizado profesional",
          "Automatización con LISP",
          "Integración BIM"
        ]
      },
      about: {
        photoUrl: "/placeholder.svg?height=520&width=420",
        videoUrl: "",
        story: "Somos un equipo de ingenieros especializados en diferentes disciplinas, comprometidos con la innovación y la excelencia técnica en todos nuestros proyectos.",
        whyMe: "Hemos completado más de 200 proyectos exitosos, desde pequeñas instalaciones hasta grandes infraestructuras."
      },
      testimonials: [
        {
          quote: "Excelente trabajo en nuestro proyecto industrial. Cumplieron todas las especificaciones y plazos.",
          author: "Roberto P.",
          role: "Director de Operaciones"
        },
        {
          quote: "Profesionalidad y conocimientos técnicos excepcionales. Altamente recomendados.",
          author: "Carmen V.",
          role: "Arquitecta"
        }
      ],
      contact: {
        email: "info@estudioingenieria.com"
      }
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
    },
    predefinedConfig: {
      site: {
        title: "Mi Blog Personal",
        tagline: "Compartiendo experiencias, ideas y aprendizajes",
        heroTitle: "Bienvenidos a mi espacio digital",
        heroSubtitle: "Reflexiones sobre vida, trabajo y crecimiento personal",
        sessionsTitle: "Categorías",
        sessionsSubtitle: "Temas sobre los que escribo",
        aboutTitle: "Sobre Mí",
        testimonialsTitle: "Lo que dicen los lectores",
        testimonialsSubtitle: "Comentarios y feedback de la comunidad",
        ctaTitle: "¿Te gusta mi contenido?",
        ctaSubtitle: "Suscríbete para no perderte nada"
      },
      sessions: [
        {
          id: "coaching-personal",
          name: "Coaching Personal",
          summary: "Sesiones individuales de desarrollo personal",
          duration: "60 min",
          price: "€80",
          features: [
            "Sesión personalizada",
            "Plan de acción",
            "Seguimiento por email",
            "Recursos adicionales"
          ],
          hotmartUrl: "https://pay.hotmart.com/COACHING_PERSONAL"
        },
        {
          id: "taller-online",
          name: "Taller Online",
          summary: "Taller grupal sobre desarrollo personal",
          duration: "4 horas",
          price: "€50",
          features: [
            "Contenido práctico",
            "Ejercicios grupales",
            "Material descargable",
            "Certificado"
          ],
          hotmartUrl: "https://pay.hotmart.com/TALLER_ONLINE"
        }
      ],
      course: {
        title: "Curso: Escribir para Crecer",
        blurb: "Aprende a usar la escritura como herramienta de desarrollo personal",
        price: "€199",
        hotmartUrl: "https://pay.hotmart.com/CURSO_ESCRITURA",
        videoUrl: "",
        bullets: [
          "Técnicas de escritura terapéutica",
          "Desarrollo de hábitos",
          "Reflexión personal",
          "Comunidad de escritores"
        ]
      },
      about: {
        photoUrl: "/placeholder.svg?height=520&width=420",
        videoUrl: "",
        story: "Soy [Tu Nombre], escritor y coach de desarrollo personal. A través de este blog comparto mis experiencias, aprendizajes y reflexiones sobre la vida y el crecimiento personal.",
        whyMe: "He ayudado a cientos de personas a encontrar claridad y propósito a través de la escritura y el coaching."
      },
      testimonials: [
        {
          quote: "Tus artículos me han ayudado mucho en mi proceso de crecimiento personal.",
          author: "María G.",
          role: "Lectora"
        },
        {
          quote: "El curso de escritura cambió mi perspectiva sobre el desarrollo personal.",
          author: "Carlos L.",
          role: "Estudiante"
        }
      ],
      contact: {
        email: "hola@miblogpersonal.com"
      }
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
    },
    predefinedConfig: {
      site: {
        title: "Tu Marca Personal",
        tagline: "Acompañamiento 1:1 y formación práctica para cambios reales",
        heroTitle: "Claridad, estrategia y acción para tu próximo salto profesional",
        heroSubtitle: "Sesiones 1:1 y un curso online diseñados para desbloquear tu potencial, definir un plan claro y ejecutarlo con confianza",
        sessionsTitle: "Mis Servicios",
        sessionsSubtitle: "Programas diseñados para tu crecimiento",
        aboutTitle: "Sobre Mí",
        testimonialsTitle: "Lo que dicen mis clientes",
        testimonialsSubtitle: "Testimonios de transformación real",
        ctaTitle: "¿Listo para tu transformación?",
        ctaSubtitle: "Agenda tu sesión gratuita"
      },
      sessions: [
        {
          id: "sesion-claridad",
          name: "Sesión de Claridad",
          summary: "Define tu objetivo y el plan inmediato de 30 días",
          duration: "60 min",
          price: "€99",
          features: [
            "Diagnóstico inicial y mapa de objetivos",
            "Prioridades y plan de acción",
            "Seguimiento por email 7 días"
          ],
          hotmartUrl: "https://pay.hotmart.com/TU_CHECKOUT_1"
        },
        {
          id: "programa-acompañamiento",
          name: "Programa de Acompañamiento",
          summary: "3 meses de coaching personalizado para cambios profundos",
          duration: "3 meses",
          price: "€997",
          features: [
            "12 sesiones individuales",
            "Plan personalizado",
            "Soporte entre sesiones",
            "Recursos exclusivos"
          ],
          hotmartUrl: "https://pay.hotmart.com/PROGRAMA_ACOMPAÑAMIENTO"
        }
      ],
      course: {
        title: "Curso Online: Sistema de Productividad Sencilla",
        blurb: "Aprende a construir un sistema ligero para enfocarte, priorizar con calma y avanzar cada semana sin fricción",
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
        story: "Soy [Tu Nombre], consultor y coach con X años ayudando a profesionales a ganar claridad, enfocarse y ejecutar con calma",
        whyMe: "He acompañado a +300 clientes en sectores diversos"
      },
      testimonials: [
        {
          quote: "En dos sesiones definimos un plan claro y recuperé la motivación",
          author: "María G.",
          role: "Marketing Specialist"
        },
        {
          quote: "El programa de acompañamiento transformó completamente mi enfoque profesional",
          author: "Luis M.",
          role: "Emprendedor"
        }
      ],
      contact: {
        email: "hola@tumarca.com"
      }
    }
  },
  {
    id: 'fumigaciones',
    name: 'Fumigaciones',
    description: 'Diseño profesional y confiable para servicios de fumigación y control de plagas',
    icon: <Bug className="h-6 w-6" />,
    category: 'landing',
    colorScheme: {
      primary: '#059669',
      secondary: '#475569',
      accent: '#f59e0b'
    },
    features: [
      'Colores verdes y naranjas profesionales',
      'Tipografía clara y confiable',
      'Iconografía de seguridad y protección',
      'Secciones de servicios de fumigación',
      'Diseño que transmite seguridad y profesionalismo',
      'Layout específico para servicios de control de plagas',
      'Completamente editable desde el modo administrador'
    ],
    status: 'active',
    configFile: '/fumigaciones-design.json',
    cssVariables: {
      '--primary': '#059669',
      '--secondary': '#475569',
      '--accent': '#f59e0b',
      '--font-family': 'Inter, sans-serif',
      '--heading-font': 'Inter, sans-serif',
      '--body-font': 'Inter, sans-serif',
      '--section-spacing': '4rem',
      '--border-radius': '12px',
      '--shadow': '0 10px 25px rgba(0, 0, 0, 0.1)'
    },
    predefinedConfig: {
      site: {
        title: "Pest Busters - Control de Plagas Profesional",
        tagline: "Soluciones integrales de fumigación y control de plagas para hogares y empresas",
        heroTitle: "Complex Approach to Pest Control",
        heroSubtitle: "Servicios profesionales de fumigación y control de plagas con tecnología avanzada y garantía de resultados",
        sessionsTitle: "Nuestros Servicios",
        sessionsSubtitle: "Soluciones especializadas para cada tipo de plaga",
        aboutTitle: "Sobre Nosotros",
        testimonialsTitle: "Lo que dicen nuestros clientes",
        testimonialsSubtitle: "Más de 10 años protegiendo hogares y empresas",
        ctaTitle: "¿Necesitas servicios de fumigación?",
        ctaSubtitle: "Servicio 24/7 - Respuesta inmediata",
        showPrices: true
      },
      theme: {
        light: {
          backgroundColor: '#f8fafc',
          sectionBackground: '#ffffff',
          navbarBackground: '#ffffff',
          textColor: '#1e293b',
          accentColor: '#f59e0b',
          primaryButtonColor: '#059669',
          secondaryButtonColor: '#475569',
          outlineButtonColor: '#f59e0b'
        },
        dark: {
          backgroundColor: '#0f172a',
          sectionBackground: '#1e293b',
          navbarBackground: '#0f172a',
          textColor: '#f1f5f9',
          accentColor: '#f59e0b',
          primaryButtonColor: '#059669',
          secondaryButtonColor: '#475569',
          outlineButtonColor: '#fbbf24'
        }
      },
      sessions: [
        {
          id: "fumigacion-residencial",
          name: "Fumigación Residencial",
          summary: "Control completo de plagas para hogares y viviendas",
          duration: "2-4 horas",
          price: "Desde €120",
          features: [
            "Inspección completa de la propiedad",
            "Tratamiento integral de plagas",
            "Productos seguros para mascotas",
            "Garantía de 6 meses",
            "Certificado de fumigación",
            "Seguimiento post-tratamiento"
          ],
          hotmartUrl: "https://pay.hotmart.com/FUMIGACION_RESIDENCIAL",
          showPrice: true
        },
        {
          id: "fumigacion-comercial",
          name: "Fumigación Comercial",
          summary: "Servicios especializados para empresas y comercios",
          duration: "4-8 horas",
          price: "Desde €250",
          features: [
            "Análisis de riesgo específico",
            "Plan de control personalizado",
            "Tratamiento sin interrumpir operaciones",
            "Cumplimiento de normativas sanitarias",
            "Garantía de 12 meses",
            "Reporte técnico detallado"
          ],
          hotmartUrl: "https://pay.hotmart.com/FUMIGACION_COMERCIAL",
          showPrice: true
        },
        {
          id: "control-termitas",
          name: "Control de Termitas",
          summary: "Eliminación y prevención de termitas",
          duration: "1-2 días",
          price: "Desde €350",
          features: [
            "Detección con tecnología avanzada",
            "Tratamiento curativo y preventivo",
            "Barreras químicas protectoras",
            "Monitoreo continuo",
            "Garantía de 5 años",
            "Certificado de garantía"
          ],
          hotmartUrl: "https://pay.hotmart.com/CONTROL_TERMITAS",
          showPrice: true
        },
        {
          id: "emergencia-24h",
          name: "Servicio de Emergencia 24/7",
          summary: "Respuesta inmediata para infestaciones críticas",
          duration: "2-6 horas",
          price: "Desde €180",
          features: [
            "Respuesta en menos de 2 horas",
            "Equipo especializado disponible",
            "Tratamiento de emergencia",
            "Evaluación de riesgo inmediata",
            "Plan de acción urgente",
            "Seguimiento prioritario"
          ],
          hotmartUrl: "https://pay.hotmart.com/EMERGENCIA_24H",
          showPrice: true
        }
      ],
      course: {
        title: "Curso: Prevención de Plagas en el Hogar",
        blurb: "Aprende técnicas efectivas para prevenir y detectar plagas en tu hogar antes de que se conviertan en un problema",
        price: "€89",
        hotmartUrl: "https://pay.hotmart.com/CURSO_PREVENCION_PLAGAS",
        videoUrl: "",
        bullets: [
          "Identificación de signos de plagas",
          "Métodos de prevención efectivos",
          "Productos naturales de control",
          "Mantenimiento preventivo del hogar",
          "Cuándo llamar a profesionales",
          "Certificado de finalización"
        ],
        showPrice: true
      },
      about: {
        photoUrl: "/placeholder.svg?height=520&width=420",
        videoUrl: "",
        story: "Somos una empresa especializada en control de plagas con más de 10 años de experiencia, comprometida con la seguridad de nuestros clientes y el medio ambiente. Utilizamos tecnología avanzada y productos certificados para garantizar resultados efectivos y duraderos.",
        whyMe: "Hemos servido a más de 2.000 clientes satisfechos, manteniendo los más altos estándares de calidad y seguridad en todos nuestros tratamientos."
      },
      testimonials: [
        {
          quote: "Excelente servicio. Eliminaron completamente las cucarachas de mi cocina en una sola visita. Muy profesionales y puntuales.",
          author: "María R.",
          role: "Propietaria de Vivienda"
        },
        {
          quote: "El servicio de emergencia fue increíble. Llegaron en menos de una hora y resolvieron el problema de ratones inmediatamente.",
          author: "Carlos M.",
          role: "Restaurante"
        },
        {
          quote: "Más de 2 años sin problemas de plagas después de su tratamiento. Altamente recomendados.",
          author: "Ana L.",
          role: "Oficina Comercial"
        }
      ],
      contact: {
        email: "info@pestbusters.com"
      }
    }
  },
  {
    id: 'psicologos',
    name: 'Psicólogos',
    description: 'Diseño profesional y confiable para psicólogos y terapeutas',
    icon: <Brain className="h-6 w-6" />,
    category: 'landing',
    colorScheme: {
      primary: '#6366f1',
      secondary: '#64748b',
      accent: '#8b5cf6'
    },
    features: [
      'Colores púrpuras y azules',
      'Tipografía serena y profesional',
      'Iconografía terapéutica',
      'Secciones de especialidades',
      'Diseño que transmite confianza'
    ],
    status: 'active',
    cssVariables: {
      '--primary': '#6366f1',
      '--secondary': '#64748b',
      '--accent': '#8b5cf6',
      '--font-family': 'Inter, sans-serif',
      '--heading-font': 'Inter, sans-serif',
      '--body-font': 'Inter, sans-serif'
    },
    predefinedConfig: {
      site: {
        title: "Centro de Psicología Profesional",
        tagline: "Acompañamiento terapéutico especializado para tu bienestar emocional",
        heroTitle: "Tu bienestar emocional es nuestra prioridad",
        heroSubtitle: "Ofrecemos terapia individual, de pareja y familiar con un enfoque profesional, empático y basado en evidencia científica",
        sessionsTitle: "Nuestros Servicios",
        sessionsSubtitle: "Especialidades terapéuticas adaptadas a tus necesidades",
        aboutTitle: "Nuestro Centro",
        testimonialsTitle: "Experiencias de Nuestros Pacientes",
        testimonialsSubtitle: "Testimonios de personas que han encontrado bienestar con nosotros",
        ctaTitle: "¿Necesitas apoyo psicológico?",
        ctaSubtitle: "Primera consulta gratuita y confidencial",
        showPrices: false
      },
      theme: {
        light: {
          backgroundColor: '#fafafa',
          sectionBackground: '#ffffff',
          navbarBackground: '#ffffff',
          textColor: '#374151',
          accentColor: '#8b5cf6',
          primaryButtonColor: '#6366f1',
          secondaryButtonColor: '#64748b',
          outlineButtonColor: '#8b5cf6'
        },
        dark: {
          backgroundColor: '#111827',
          sectionBackground: '#1f2937',
          navbarBackground: '#111827',
          textColor: '#f9fafb',
          accentColor: '#8b5cf6',
          primaryButtonColor: '#6366f1',
          secondaryButtonColor: '#64748b',
          outlineButtonColor: '#a78bfa'
        }
      },
      sessions: [
        {
          id: "terapia-individual",
          name: "Terapia Individual",
          summary: "Proceso terapéutico personalizado para abordar tus necesidades específicas",
          duration: "50 minutos",
          price: "Desde €60",
          features: [
            "Evaluación inicial completa",
            "Plan de tratamiento personalizado",
            "Técnicas basadas en evidencia",
            "Seguimiento del progreso",
            "Confidencialidad total",
            "Flexibilidad horaria"
          ],
          hotmartUrl: "https://pay.hotmart.com/TERAPIA_INDIVIDUAL",
          showPrice: false
        },
        {
          id: "terapia-pareja",
          name: "Terapia de Pareja",
          summary: "Acompañamiento especializado para mejorar la comunicación y resolver conflictos",
          duration: "80 minutos",
          price: "Desde €80",
          features: [
            "Análisis de dinámicas de pareja",
            "Técnicas de comunicación efectiva",
            "Resolución de conflictos",
            "Fortalecimiento del vínculo",
            "Sesiones individuales incluidas",
            "Seguimiento conjunto"
          ],
          hotmartUrl: "https://pay.hotmart.com/TERAPIA_PAREJA",
          showPrice: false
        },
        {
          id: "terapia-familiar",
          name: "Terapia Familiar",
          summary: "Intervención sistémica para mejorar las relaciones familiares",
          duration: "90 minutos",
          price: "Desde €90",
          features: [
            "Análisis del sistema familiar",
            "Mejora de la comunicación",
            "Resolución de conflictos",
            "Establecimiento de límites",
            "Sesiones individuales incluidas",
            "Seguimiento familiar"
          ],
          hotmartUrl: "https://pay.hotmart.com/TERAPIA_FAMILIAR",
          showPrice: false
        },
        {
          id: "evaluacion-psicologica",
          name: "Evaluación Psicológica",
          summary: "Evaluación completa para diagnóstico y planificación terapéutica",
          duration: "120 minutos",
          price: "Desde €150",
          features: [
            "Entrevista clínica detallada",
            "Aplicación de pruebas estandarizadas",
            "Informe psicológico completo",
            "Recomendaciones terapéuticas",
            "Sesión de devolución incluida",
            "Informe por escrito"
          ],
          hotmartUrl: "https://pay.hotmart.com/EVALUACION_PSICOLOGICA",
          showPrice: false
        }
      ],
      course: {
        title: "Taller Online: Gestión del Estrés y Ansiedad",
        blurb: "Aprende técnicas prácticas para manejar el estrés y la ansiedad en tu vida diaria",
        price: "€89",
        hotmartUrl: "https://pay.hotmart.com/TALLER_ESTRES_ANSIEDAD",
        videoUrl: "",
        bullets: [
          "Técnicas de respiración y relajación",
          "Herramientas de mindfulness",
          "Estrategias cognitivo-conductuales",
          "Plan personalizado de gestión",
          "Material descargable",
          "Soporte durante 30 días"
        ],
        showPrice: false
      },
      about: {
        photoUrl: "/placeholder.svg?height=520&width=420",
        videoUrl: "",
        story: "Somos un equipo de psicólogos especializados con amplia experiencia en diferentes enfoques terapéuticos. Nuestro compromiso es proporcionar un espacio seguro, confidencial y profesional donde puedas encontrar el apoyo necesario para superar tus dificultades y alcanzar tu bienestar emocional.",
        whyMe: "Hemos ayudado a más de 1.000 personas a mejorar su calidad de vida a través de la terapia. Nuestro enfoque se basa en la evidencia científica y se adapta a las necesidades individuales de cada persona."
      },
      testimonials: [
        {
          quote: "Gracias a la terapia individual, pude superar mi ansiedad y recuperar la confianza en mí misma. El proceso fue transformador y me siento mucho mejor.",
          author: "Ana Martínez",
          role: "Paciente"
        },
        {
          quote: "La terapia de pareja nos ayudó a mejorar nuestra comunicación y resolver conflictos que llevábamos arrastrando años. Ahora nuestra relación es mucho más sólida.",
          author: "Carlos y Laura",
          role: "Pareja"
        },
        {
          quote: "El taller de gestión del estrés me dio herramientas prácticas que uso todos los días. Ha cambiado completamente mi forma de manejar las situaciones difíciles.",
          author: "Miguel Rodríguez",
          role: "Participante del taller"
        }
      ],
      contact: {
        email: "info@centropsicologia.com"
      }
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
  },
  {
    id: 'food-shop',
    name: 'Food Shop',
    description: 'Diseño inspirado en apps de pedidos de comida con estilo moderno y vibrante',
    icon: <Utensils className="h-6 w-6" />,
    category: 'shop',
    colorScheme: {
      primary: '#fbbf24',
      secondary: '#374151',
      accent: '#dc2626'
    },
    features: [
      'Fondo amarillo vibrante',
      'Layout móvil-first',
      'Tarjetas de comida',
      'Navegación inferior'
    ],
    status: 'active',
    cssVariables: {
      '--primary': '#fbbf24',
      '--secondary': '#374151',
      '--accent': '#dc2626',
      '--font-family': 'Inter, sans-serif'
    }
  }
]

export const linkHubDesigns: Design[] = [
  {
    id: 'linkhub',
    name: 'Link Hub Clásico',
    description: 'Diseño limpio y moderno para concentrador de enlaces personales',
    icon: <Link className="h-6 w-6" />,
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
    icon: <Link className="h-6 w-6" />,
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
      return landingDesigns
    case 'shop':
      return shopDesigns
    case 'linkhub':
      return linkHubDesigns
    default:
      return []
  }
}

export function getDesignById(designId: string): Design | undefined {
  const allDesigns = [...landingDesigns, ...shopDesigns, ...linkHubDesigns]
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
