"use client"

import { Calendar, Check, Quote, ShoppingCart, Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ScheduleButton } from "@/components/schedule-dialog"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Config } from "@/lib/config-loader"
import { AdminProvider, useAdmin } from "@/lib/admin-context"
import { AdminToggle } from "@/components/admin-toggle"
import { EditableText } from "@/components/editable-text"
import { EditableList } from "@/components/editable-list"
import { EditableUrl } from "@/components/editable-url"
import { EditableImage } from "@/components/editable-image"
import { EditableMedia } from "@/components/editable-media"
import { SectionManager } from "@/components/section-manager"
import { DynamicSection } from "@/components/dynamic-section"
import { SessionManager } from "@/components/session-manager"
import { TestimonialManager } from "@/components/testimonial-manager"
import { AdminNotifications } from "@/components/admin-notifications"
import { AdminDebug } from "@/components/admin-debug"
import { ThemeSwitch } from "@/components/theme-switch"
import { DynamicNavigation } from "@/components/dynamic-navigation"

export default function Page() {
  return <PageContent />
}

function PageContent() {
  const [config, setConfig] = useState<Config | null>(null)
  const [loading, setLoading] = useState(true)
  const { updateConfig } = useAdmin()
  const [sections, setSections] = useState([
    {
      id: 'hero',
      title: 'Sección Hero',
      visible: true,
      description: 'Título principal, subtítulo y botones de acción',
      type: 'hero',
      component: <Hero />
    },
    {
      id: 'sessions',
      title: 'Sesiones 1:1',
      visible: true,
      description: 'Servicios de coaching y consultoría personalizada',
      type: 'content',
      component: <Sessions />
    },
    {
      id: 'course',
      title: 'Curso Online',
      visible: true,
      description: 'Producto digital con video de presentación',
      type: 'content',
      component: <Course />
    },
    {
      id: 'about',
      title: 'Sobre Mí',
      visible: true,
      description: 'Historia personal y propuesta de valor',
      type: 'content',
      component: <About />
    },
    {
      id: 'testimonials',
      title: 'Testimonios',
      visible: true,
      description: 'Opiniones y comentarios de clientes',
      type: 'testimonials',
      component: <Testimonials />
    },
    {
      id: 'cta',
      title: 'Call to Action',
      visible: true,
      description: 'Botón de acción principal',
      type: 'cta',
      component: <CTABanner />
    }
  ])

  // Cargar configuración
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/config')
        if (response.ok) {
          const data = await response.json()
          setConfig(data)
        }
      } catch (error) {
        console.error('Error loading config:', error)
      } finally {
        setLoading(false)
      }
    }

    loadConfig()
  }, [])

  // Cargar secciones guardadas al iniciar
  useEffect(() => {
    try {
      const savedSections = localStorage.getItem('landing-sections')
      if (savedSections) {
        const parsedSections = JSON.parse(savedSections)
        // Actualizar solo las propiedades de configuración, mantener los componentes
        setSections(prevSections => 
          prevSections.map(section => {
            const savedSection = parsedSections.find((s: any) => s.id === section.id)
            if (savedSection) {
              return {
                ...section,
                title: savedSection.title,
                visible: savedSection.visible,
                description: savedSection.description,
                type: savedSection.type
              }
            }
            return section
          })
        )
      }
    } catch (error) {
      console.warn('Error al cargar secciones guardadas:', error)
    }
  }, [])

  if (loading || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  const handleSectionsChange = (newSections: any[]) => {
    // Actualizar las secciones con los componentes correctos
    const updatedSections = newSections.map(section => {
      // Si es una sección dinámica (nueva), crear el componente DynamicSection
      if (section.type && section.content) {
        return {
          ...section,
          component: (
            <DynamicSection 
              section={section}
              onUpdate={(newContent: any) => {
                const updatedSections = newSections.map(s =>
                  s.id === section.id 
                    ? { ...s, content: newContent }
                    : s
                )
                handleSectionsChange(updatedSections)
              }}
            />
          )
        }
      }
      return section
    })
    
    setSections(updatedSections)
    
    // Guardar en localStorage
    try {
      localStorage.setItem('landing-sections', JSON.stringify(updatedSections))
    } catch (error) {
      console.warn('No se pudo guardar en localStorage:', error)
    }
  }

  return (
    <div className="min-h-[100dvh] flex flex-col custom-bg">
      <Header />
      <main className="flex-1">
        <SectionManager 
          sections={sections}
          onSectionsChange={handleSectionsChange}
        />
      </main>
      <Footer />
      <AdminToggle />
      <AdminNotifications />
      <AdminDebug />
    </div>
  )
}

function Header() {
  const { config, updateConfig } = useAdmin()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  if (!config) return null

  return (
    <header className="sticky top-0 z-50 custom-navbar-bg-transparent backdrop-blur-md border-b">
      <div className="container px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Lado izquierdo: Título */}
        <div className="flex items-center">
          <EditableText
            value={config.site.title}
            onSave={(newValue) => updateConfig({ site: { ...config.site, title: newValue } })}
            className="font-semibold tracking-tight text-lg"
            tag="span"
          />
        </div>
        
        {/* Centro: Navegación (solo desktop) */}
        <div className="hidden md:flex items-center">
          <DynamicNavigation config={config} isMobile={false} />
        </div>
        
        {/* Lado derecho: Botones y controles */}
        <div className="flex items-center gap-3">
          <ThemeSwitch />
          <ScheduleButton 
            url={config.integrations.calendlyUrl} 
            label={config.buttons?.heroButton || "Agendar"} 
            onLabelChange={(newValue) => updateConfig({ buttons: { ...config.buttons, heroButton: newValue } })}
          />
          
          {/* Botón de menú móvil */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Abrir menú de navegación"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      
      {/* Menú móvil */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t custom-bg">
          <div className="container px-4 py-4">
            <DynamicNavigation config={config} isMobile={true} />
          </div>
        </div>
      )}
    </header>
  )
}

function Hero() {
  const { config, updateConfig } = useAdmin()

  if (!config) return null

  return (
    <section className="w-full py-16 md:py-24 lg:py-28">
      <div className="container px-4 md:px-6 grid gap-10 lg:grid-cols-2 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
            <EditableText
              value={config.site.tagline}
              onSave={(newValue) => updateConfig({ site: { ...config.site, tagline: newValue } })}
              placeholder="Tagline del sitio..."
            />
          </div>
          <EditableText
            value={config.site.heroTitle || "Claridad, estrategia y acción para tu próximo salto profesional"}
            onSave={(newValue) => updateConfig({ site: { ...config.site, heroTitle: newValue } })}
            className="text-4xl/tight sm:text-5xl/tight font-bold tracking-tighter"
            tag="h1"
          />
          <EditableText
            value={config.site.heroSubtitle || "Sesiones 1:1 y un curso online diseñados para desbloquear tu potencial, definir un plan claro y ejecutarlo con confianza."}
            onSave={(newValue) => updateConfig({ site: { ...config.site, heroSubtitle: newValue } })}
            className="text-muted-foreground text-lg"
            tag="p"
            multiline
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <ScheduleButton
              url={config.integrations.calendlyUrl}
              label={config.buttons?.heroButton || "Agendar una sesión"}
              onLabelChange={(newValue) => updateConfig({ buttons: { ...config.buttons, heroButton: newValue } })}
              className="custom-primary-button-bg hover:opacity-90 text-white"
            />
            <a
              href="#curso"
              className={cn(
                "inline-flex h-10 items-center justify-center rounded-md border bg-white px-6 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground custom-outline-button-bg custom-outline-button-text",
              )}
            >
              Ver curso online
            </a>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              <span>{"Agenda en 2 minutos"}</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <Check className="h-4 w-4" aria-hidden="true" />
              <span>{"Pago seguro en Hotmart"}</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <EditableMedia
            value={config.site.heroImageUrl || `/placeholder.svg?height=520&width=720&query=hero%20coaching%20profesional%20minimal`}
            onSave={(newValue) => updateConfig({ site: { ...config.site, heroImageUrl: newValue } })}
            label="Contenido Hero"
            placeholder="https://ejemplo.com/imagen-o-video.jpg"
            width={720}
            height={520}
            alt="Contenido representativo del servicio"
          />
        </div>
      </div>
    </section>
  )
}

function Sessions() {
  const { config, updateConfig } = useAdmin()

  if (!config) return null

  return (
    <section id="sesiones" className="w-full py-16 md:py-24 custom-section-bg">
      <div className="container px-4 md:px-6">
        <SessionManager 
          sessions={config.sessions}
          onSessionsChange={(newSessions) => updateConfig({ sessions: newSessions })}
        />
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <EditableText
            value={config.site.sessionsTitle || "Sesiones 1:1"}
            onSave={(newValue) => updateConfig({ site: { ...config.site, sessionsTitle: newValue } })}
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            tag="h2"
          />
          <EditableText
            value={config.site.sessionsSubtitle || "Elige la sesión que mejor se adapta a tu momento. Enfocadas, prácticas y orientadas a resultados."}
            onSave={(newValue) => updateConfig({ site: { ...config.site, sessionsSubtitle: newValue } })}
            className="text-muted-foreground mt-3"
            tag="p"
            multiline
          />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {config.sessions.map((session, index) => (
            <article key={session.id} className="rounded-xl border custom-bg p-6 flex flex-col">
              <div className="space-y-1">
                <EditableText
                  value={session.name}
                  onSave={(newValue) => {
                    const newSessions = [...config.sessions]
                    newSessions[index] = { ...session, name: newValue }
                    updateConfig({ sessions: newSessions })
                  }}
                  className="text-xl font-semibold"
                  tag="h3"
                />
                <EditableText
                  value={session.summary}
                  onSave={(newValue) => {
                    const newSessions = [...config.sessions]
                    newSessions[index] = { ...session, summary: newValue }
                    updateConfig({ sessions: newSessions })
                  }}
                  className="text-sm text-muted-foreground"
                  tag="p"
                  multiline
                />
              </div>
              <div className="flex items-baseline gap-2 mt-4">
                <EditableText
                  value={session.price}
                  onSave={(newValue) => {
                    const newSessions = [...config.sessions]
                    newSessions[index] = { ...session, price: newValue }
                    updateConfig({ sessions: newSessions })
                  }}
                  className="text-3xl font-bold"
                  tag="span"
                />
                <span className="text-sm text-muted-foreground">· </span>
                <EditableText
                  value={session.duration}
                  onSave={(newValue) => {
                    const newSessions = [...config.sessions]
                    newSessions[index] = { ...session, duration: newValue }
                    updateConfig({ sessions: newSessions })
                  }}
                  className="text-sm text-muted-foreground"
                  tag="span"
                />
              </div>
              <EditableList
                items={session.features}
                onSave={(newFeatures) => {
                  const newSessions = [...config.sessions]
                  newSessions[index] = { ...session, features: newFeatures }
                  updateConfig({ sessions: newSessions })
                }}
                className="mt-6 space-y-2 text-sm"
              />
              <div className="mt-6 grid gap-3">
                <EditableUrl
                  value={session.hotmartUrl}
                  onSave={(newValue) => {
                    const newSessions = [...config.sessions]
                    newSessions[index] = { ...session, hotmartUrl: newValue }
                    updateConfig({ sessions: newSessions })
                  }}
                  label="URL de Hotmart"
                  showPreview={false}
                />
                <ScheduleButton 
                url={config.integrations.calendlyUrl} 
                label={config.buttons?.sessionsButton || "Agendar por Calendly"} 
                onLabelChange={(newValue) => updateConfig({ buttons: { ...config.buttons, sessionsButton: newValue } })}
                variant="outline" 
              />
                <p className="text-xs text-muted-foreground">
                  Pagos gestionados por Hotmart. Se abrirá en una nueva pestaña.
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Course() {
  const { config, updateConfig } = useAdmin()

  if (!config) return null

  const course = config.course

  return (
    <section id="curso" className="w-full py-16 md:py-24">
      <div className="container px-4 md:px-6 grid gap-10 lg:grid-cols-[1.2fr_1fr] items-center">
        <div className="space-y-6">
          <div className="space-y-2">
            <EditableText
              value={course.title}
              onSave={(newValue) => updateConfig({ course: { ...course, title: newValue } })}
              className="text-3xl sm:text-4xl font-bold tracking-tight"
              tag="h2"
            />
            <EditableText
              value={course.blurb}
              onSave={(newValue) => updateConfig({ course: { ...course, blurb: newValue } })}
              className="text-muted-foreground text-lg"
              tag="p"
              multiline
            />
          </div>
          <EditableList
            items={course.bullets}
            onSave={(newBullets) => updateConfig({ course: { ...course, bullets: newBullets } })}
            className="grid gap-2"
          />
          <div className="flex items-baseline gap-2">
            <EditableText
              value={course.price}
              onSave={(newValue) => updateConfig({ course: { ...course, price: newValue } })}
              className="text-3xl font-bold"
              tag="span"
            />
            <span className="text-sm text-muted-foreground">Acceso completo</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <EditableUrl
              value={course.hotmartUrl}
              onSave={(newValue) => updateConfig({ course: { ...course, hotmartUrl: newValue } })}
              label="URL de Hotmart"
              showPreview={false}
            />
                          <ScheduleButton 
                url={config.integrations.calendlyUrl} 
                label={config.buttons?.courseButton || "¿Dudas? Agenda 10'"} 
                onLabelChange={(newValue) => updateConfig({ buttons: { ...config.buttons, courseButton: newValue } })}
                variant="outline" 
              />
          </div>
          <p className="text-xs text-muted-foreground">Pago seguro en Hotmart. Enlace externo.</p>
        </div>
        <div className="relative">
          <EditableMedia
            value={course.videoUrl || `/placeholder.svg?height=360&width=640&query=curso%20online%20preview`}
            onSave={(newValue) => updateConfig({ course: { ...course, videoUrl: newValue } })}
            label="Contenido del Curso"
            placeholder="https://ejemplo.com/video-o-imagen.jpg"
            width={640}
            height={360}
            alt="Vista previa del curso"
          />
        </div>
      </div>
    </section>
  )
}

function About() {
  const { config, updateConfig } = useAdmin()

  if (!config) return null

  const about = config.about

  return (
    <section id="sobre-mi" className="w-full py-16 md:py-24 custom-section-bg">
      <div className="container px-4 md:px-6 grid gap-10 lg:grid-cols-[420px_1fr] items-start">
        <div className="space-y-4">
          <EditableMedia
            value={about.photoUrl}
            onSave={(newValue) => updateConfig({ about: { ...about, photoUrl: newValue } })}
            label="Contenido Personal"
            placeholder="https://ejemplo.com/foto-o-video.jpg"
            width={420}
            height={520}
            alt="Contenido personal"
          />
          <EditableMedia
            value={about.videoUrl || `/placeholder.svg?height=280&width=420&query=video%20presentacion%20personal`}
            onSave={(newValue) => updateConfig({ about: { ...about, videoUrl: newValue } })}
            label="Video de Presentación"
            placeholder="https://ejemplo.com/video-o-imagen.jpg"
            width={420}
            height={280}
            alt="Video de presentación personal"
          />
        </div>
        <div className="space-y-6">
          <EditableText
            value={config.site.aboutTitle || "Sobre mí"}
            onSave={(newValue) => updateConfig({ site: { ...config.site, aboutTitle: newValue } })}
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            tag="h2"
          />
          <div className="prose prose-neutral max-w-none">
            <EditableText
              value={about.story}
              onSave={(newValue) => updateConfig({ about: { ...about, story: newValue } })}
              className="text-foreground"
              tag="p"
              multiline
            />
            <EditableText
              value={about.whyMe}
              onSave={(newValue) => updateConfig({ about: { ...about, whyMe: newValue } })}
              className="text-muted-foreground"
              tag="p"
              multiline
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <ScheduleButton
              url={config.integrations.calendlyUrl}
              label={config.buttons?.aboutButton || "Agendar una sesión"}
              onLabelChange={(newValue) => updateConfig({ buttons: { ...config.buttons, aboutButton: newValue } })}
              className="custom-primary-button-bg hover:opacity-90 text-white"
            />
            <a
              href="#sesiones"
              className="inline-flex h-10 items-center justify-center rounded-md border bg-white px-6 text-sm font-medium shadow-sm hover:bg-accent custom-outline-button-bg custom-outline-button-text"
            >
              Ver sesiones 1:1
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  const { config, updateConfig } = useAdmin()

  if (!config) return null

  return (
    <section id="testimonios" className="w-full py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <TestimonialManager 
          testimonials={config.testimonials}
          onTestimonialsChange={(newTestimonials) => updateConfig({ testimonials: newTestimonials })}
        />
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <EditableText
            value={config.site.testimonialsTitle || "Testimonios"}
            onSave={(newValue) => updateConfig({ site: { ...config.site, testimonialsTitle: newValue } })}
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            tag="h2"
          />
          <EditableText
            value={config.site.testimonialsSubtitle || "Historias reales de clientes que transformaron su situación."}
            onSave={(newValue) => updateConfig({ site: { ...config.site, testimonialsSubtitle: newValue } })}
            className="text-muted-foreground mt-3"
            tag="p"
            multiline
          />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {config.testimonials.map((testimonial, index) => (
            <figure key={index} className="rounded-xl border bg-white p-6">
              <Quote className="h-6 w-6 custom-accent mb-3" aria-hidden="true" />
              <EditableText
                value={testimonial.quote}
                onSave={(newValue) => {
                  const newTestimonials = [...config.testimonials]
                  newTestimonials[index] = { ...testimonial, quote: newValue }
                  updateConfig({ testimonials: newTestimonials })
                }}
                className="text-sm leading-relaxed"
                tag="p"
                multiline
              />
              <EditableText
                value={testimonial.author}
                onSave={(newValue) => {
                  const newTestimonials = [...config.testimonials]
                  newTestimonials[index] = { ...testimonial, author: newValue }
                  updateConfig({ testimonials: newTestimonials })
                }}
                className="mt-4 text-sm font-medium"
                tag="p"
              />
              <EditableText
                value={testimonial.role}
                onSave={(newValue) => {
                  const newTestimonials = [...config.testimonials]
                  newTestimonials[index] = { ...testimonial, role: newValue }
                  updateConfig({ testimonials: newTestimonials })
                }}
                className="text-xs text-muted-foreground"
                tag="span"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTABanner() {
  const { config, updateConfig } = useAdmin()

  if (!config) return null

  return (
    <section className="w-full py-12 md:py-16 custom-accent-bg">
      <div className="container px-4 md:px-6 text-center text-white space-y-4">
        <EditableText
          value={config.site.ctaTitle || "¿Listo para dar el siguiente paso?"}
          onSave={(newValue) => updateConfig({ site: { ...config.site, ctaTitle: newValue } })}
          className="text-2xl sm:text-3xl font-semibold"
          tag="h3"
        />
        <EditableText
          value={config.site.ctaSubtitle || "Agenda tu sesión o adquiere el curso y comienza hoy mismo."}
          onSave={(newValue) => updateConfig({ site: { ...config.site, ctaSubtitle: newValue } })}
          className="opacity-90"
          tag="p"
          multiline
        />
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <ScheduleButton
            url={config.integrations.calendlyUrl}
            label={config.buttons?.ctaButton || "Agendar ahora"}
            onLabelChange={(newValue) => updateConfig({ buttons: { ...config.buttons, ctaButton: newValue } })}
            className="bg-white custom-primary-button-text hover:bg-white/90"
          />
          <a
            href={config.course.hotmartUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center rounded-md custom-secondary-button-bg hover:opacity-90 px-6 text-sm font-medium shadow"
          >
            Comprar el curso
          </a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const { config, updateConfig } = useAdmin()

  if (!config) return null

  return (
    <footer className="border-t">
      <div className="container px-4 md:px-6 py-8 flex flex-col sm:flex-row items-center gap-4">
        <div className="text-sm text-muted-foreground">
          {"© "} {new Date().getFullYear()} {config.site.title}. Todos los derechos reservados.
        </div>
        <nav className="sm:ml-auto flex items-center gap-4 text-sm">
          {config.contact.email && (
            <a href={`mailto:${config.contact.email}`} className="hover:underline">
              Contacto
            </a>
          )}
          {config.legal.termsUrl && (
            <Link href={config.legal.termsUrl} className="hover:underline">
              Términos
            </Link>
          )}
          {config.legal.privacyUrl && (
            <Link href={config.legal.privacyUrl} className="hover:underline">
              Privacidad
            </Link>
          )}
        </nav>
      </div>
    </footer>
  )
}
