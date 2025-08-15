"use client"

import { Calendar, Check, Quote, ShoppingCart, Menu, X, Settings, Palette } from "lucide-react"
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
import { LinkHubSection } from "@/components/linkhub-section"
import { ShopSection } from "@/components/shop-section"
import { SessionManager } from "@/components/session-manager"
import { TestimonialManager } from "@/components/testimonial-manager"
import { AdminNotifications } from "@/components/admin-notifications"
import { AdminDebug } from "@/components/admin-debug"
import { ThemeSwitch } from "@/components/theme-switch"
import { DynamicNavigation } from "@/components/dynamic-navigation"
import { SectionButtonManager } from "@/components/section-button-manager"
import { FumigacionesLayout } from "@/components/layouts/fumigaciones-layout"
import { useGlobalColors } from "@/hooks/use-global-colors"
import { useDynamicTitle } from "@/hooks/use-dynamic-title"
import { Button } from "@/components/ui/button"
import { DesignQuickPicker } from "@/components/design-quick-picker"


export default function Page() {
  return <PageContent />
}

function PageContent() {
  const { config, updateConfig, isLoading } = useAdmin()
  
  // Aplicar colores globales
  useGlobalColors()
  
  // Actualizar dinámicamente el título de la página
  useDynamicTitle()
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
      id: 'linkhub',
      title: 'LinkHub',
      visible: false,
      description: 'Página de enlaces personales y redes sociales',
      type: 'linkhub',
      component: <LinkHubSection />
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

  // Config se obtiene de useAdmin() de forma reactiva

  // Cargar secciones reactivamente desde config o localStorage
  useEffect(() => {
    try {
      if (config?.sections && config.sections.length > 0) {
        const sectionsWithComponents = config.sections.map((section: any) => {
          let component: React.ReactNode
          switch (section.id) {
            case 'hero':
              component = <Hero />
              break
            case 'sessions':
              component = <Sessions />
              break
            case 'course':
              component = <Course />
              break
            case 'about':
              component = <About />
              break
            case 'testimonials':
              component = <Testimonials />
              break
            case 'linkhub':
              component = <LinkHubSection />
              break
            case 'cta':
              component = <CTABanner />
              break
            default:
              if (section.type) {
                switch (section.type) {
                  case 'linkhub':
                    component = <LinkHubSection />
                    break
                  case 'shop':
                    component = <ShopSection />
                    break
                  default:
                    component = (
                      <DynamicSection 
                        section={section}
                        onUpdate={(newContent: any) => {
                          const updatedSections = (config.sections || []).map((s: any) =>
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
          }
          return { ...section, component }
        })
        setSections(sectionsWithComponents)
        return
      }

      // Si no hay configuración global, cargar desde localStorage
      const savedSections = localStorage.getItem('landing-sections')
      if (savedSections) {
        const parsedSections = JSON.parse(savedSections)
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
  }, [config])

  if (isLoading || !config) {
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
      // Si es una sección dinámica (nueva), crear el componente correspondiente
      if (section.type && section.content) {
        let component: React.ReactNode
        
        switch (section.type) {
          case 'linkhub':
            component = <LinkHubSection />
            break
          case 'shop':
            component = <ShopSection />
            break
          default:
            component = (
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
        
        return {
          ...section,
          component
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

  // Verificar si se debe usar el layout específico de fumigaciones
  const shouldUseFumigacionesLayout = config.selectedDesigns?.landing === 'fumigaciones'

  // Si es el diseño de fumigaciones, usar el layout específico
  if (shouldUseFumigacionesLayout) {
    return (
      <div className="min-h-[100dvh] flex flex-col">
        <FumigacionesLayout />
        <AdminToggle />
        <AdminNotifications />
        <AdminDebug />
      </div>
    )
  }

  // Layout estándar para otros diseños
  return (
    <div className="min-h-[100dvh] flex flex-col theme-bg-primary">
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
    <header className="sticky top-0 z-50 theme-bg-navbar-transparent theme-backdrop-blur theme-border theme-transition">
      <div className="container px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Lado izquierdo: Título */}
        <div className="flex items-center">
          <EditableText
            value={config.site?.title || ""}
            onSave={(newValue) => updateConfig({ site: { ...config.site, title: newValue } })}
            className="font-semibold tracking-tight text-lg theme-text-heading"
            tag="span"
          />
        </div>
        
        {/* Centro: Navegación (solo desktop) */}
        <div className="hidden md:flex items-center gap-2">
          <DynamicNavigation config={config} isMobile={false} />
          {/* Selector rápido de diseños (admin) */}
          <DesignQuickPicker />
        </div>
        
        {/* Lado derecho: Botones y controles */}
        <div className="flex items-center gap-3">
          <ThemeSwitch />
          <ScheduleButton 
            url={config.integrations.calendlyUrl} 
            label={config.buttons?.heroButton || "Agendar"} 
            onLabelChange={(newValue) => updateConfig({ buttons: { ...config.buttons, heroButton: newValue } })}
          />
          
          {/* Enlace al Panel de Administración */}
          <Link
            href="/admin"
            className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium theme-text-subtitle theme-hover-text theme-transition"
          >
            <Settings className="h-4 w-4" />
            Admin
          </Link>
          
          {/* Botón de menú móvil */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md theme-hover-bg theme-transition"
            aria-label="Abrir menú de navegación"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 theme-text-primary" />
            ) : (
              <Menu className="h-5 w-5 theme-text-primary" />
            )}
          </button>
        </div>
      </div>
      
      {/* Menú móvil */}
      {isMobileMenuOpen && (
        <div className="md:hidden theme-border-t theme-bg-primary">
          <div className="container px-4 py-4">
            <DynamicNavigation config={config} isMobile={true} />
            <div className="mt-3">
              <DesignQuickPicker fullWidth />
            </div>
            <div className="mt-4 pt-4 theme-border-t">
              <Link
                href="/admin"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium theme-text-subtitle theme-hover-text theme-transition"
              >
                <Settings className="h-4 w-4" />
                Panel de Administración
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

// Eliminado: reemplazado por DesignQuickPicker

function Hero() {
  const { config, updateConfig } = useAdmin()

  if (!config) return null

  return (
    <section className="w-full py-16 md:py-24 lg:py-28 theme-bg-section hero-section">
      <div className="container px-4 md:px-6 grid gap-10 lg:grid-cols-2 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full theme-border px-3 py-1 text-xs theme-text-subtitle">
            <EditableText
              value={config.site.tagline}
              onSave={(newValue) => updateConfig({ site: { ...config.site, tagline: newValue } })}
              placeholder="Tagline del sitio..."
              textColor={config.site?.taglineColor}
              onColorChange={(color) => updateConfig({ site: { ...config.site, taglineColor: color } as any } as any)}
              showColorPicker={true}
            />
          </div>
          <EditableText
            value={config.site.heroTitle || "Claridad, estrategia y acción para tu próximo salto profesional"}
            onSave={(newValue) => updateConfig({ site: { ...config.site, heroTitle: newValue } })}
            className="text-4xl/tight sm:text-5xl/tight font-bold tracking-tighter theme-text-heading"
            tag="h1"
            textColor={config.site?.heroTitleColor}
            onColorChange={(color) => updateConfig({ site: { ...config.site, heroTitleColor: color } as any } as any)}
            showColorPicker={true}
          />
          <EditableText
            value={config.site.heroSubtitle || "Sesiones 1:1 y un curso online diseñados para desbloquear tu potencial, definir un plan claro y ejecutarlo con confianza."}
            onSave={(newValue) => updateConfig({ site: { ...config.site, heroSubtitle: newValue } })}
            className="theme-text-subtitle text-lg"
            tag="p"
            multiline
            textColor={config.site?.heroSubtitleColor}
            onColorChange={(color) => updateConfig({ site: { ...config.site, heroSubtitleColor: color } as any } as any)}
            showColorPicker={true}
          />
          {/* Gestión de botones del Hero */}
          <SectionButtonManager
            buttons={config.buttons?.heroButtons || []}
            onButtonsChange={(newButtons) => updateConfig({ 
              buttons: { 
                ...config.buttons, 
                heroButtons: newButtons
              } 
            })}
            sectionId="hero"
            sectionName="Hero"
          />
          
          {/* Botones legacy (para compatibilidad) */}
          {(!config.buttons?.heroButtons || config.buttons.heroButtons.length === 0) && (
            <div className="flex flex-col sm:flex-row gap-3">
              <ScheduleButton
                url={config.integrations.calendlyUrl}
                label={config.buttons?.heroButton || "Agendar una sesión"}
                onLabelChange={(newValue) => updateConfig({ buttons: { ...config.buttons, heroButton: newValue } })}
                className="theme-btn-primary theme-opacity-90"
              />
              <a
                href="#curso"
                className={cn(
                  "inline-flex h-10 items-center justify-center rounded-md theme-border theme-bg-card px-6 text-sm font-medium theme-shadow theme-transition theme-hover-bg theme-btn-outline",
                )}
              >
                Ver curso online
              </a>
            </div>
          )}
          <div className="flex items-center gap-4 text-sm theme-text-subtitle">
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
    <section id="sesiones" className="w-full py-16 md:py-24 theme-bg-section">
      <div className="container px-4 md:px-6">
        <SessionManager 
          sessions={config.sessions}
          onSessionsChange={(newSessions) => updateConfig({ sessions: newSessions })}
        />
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <EditableText
            value={config.site.sessionsTitle || "Sesiones 1:1"}
            onSave={(newValue) => updateConfig({ site: { ...config.site, sessionsTitle: newValue } })}
            className="text-3xl sm:text-4xl font-bold tracking-tight theme-text-heading"
            tag="h2"
            textColor={config.site?.sessionsTitleColor}
            onColorChange={(color) => updateConfig({ site: { ...config.site, sessionsTitleColor: color } as any } as any)}
            showColorPicker={true}
          />
          <EditableText
            value={config.site.sessionsSubtitle || "Elige la sesión que mejor se adapta a tu momento. Enfocadas, prácticas y orientadas a resultados."}
            onSave={(newValue) => updateConfig({ site: { ...config.site, sessionsSubtitle: newValue } })}
            className="theme-text-subtitle mt-3"
            tag="p"
            multiline
            textColor={config.site?.sessionsSubtitleColor}
            onColorChange={(color) => updateConfig({ site: { ...config.site, sessionsSubtitleColor: color } as any } as any)}
            showColorPicker={true}
          />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {config.sessions.map((session, index) => (
            <article key={session.id} className="rounded-xl theme-border theme-bg-card p-6 flex flex-col theme-shadow">
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
                {(config.site?.showPrices !== false && session.showPrice !== false) && (
                  <>
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
                  </>
                )}
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
        
        {/* Gestión de botones de Sessions */}
        <SectionButtonManager
          buttons={config.buttons?.sessionsButtons || []}
          onButtonsChange={(newButtons) => updateConfig({ 
            buttons: { 
              ...config.buttons, 
              sessionsButtons: newButtons
            } 
          })}
          sectionId="sessions"
          sectionName="Sesiones"
        />
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
          {(config.site?.showPrices !== false && course.showPrice !== false) && (
            <div className="flex items-baseline gap-2">
              <EditableText
                value={course.price}
                onSave={(newValue) => updateConfig({ course: { ...course, price: newValue } })}
                className="text-3xl font-bold"
                tag="span"
              />
              <span className="text-sm text-muted-foreground">Acceso completo</span>
            </div>
          )}
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
          
          {/* Gestión de botones de Course */}
          <SectionButtonManager
            buttons={config.buttons?.courseButtons || []}
            onButtonsChange={(newButtons) => updateConfig({ 
              buttons: { 
                ...config.buttons, 
                courseButtons: newButtons
              } 
            })}
            sectionId="course"
            sectionName="Curso Online"
          />
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
          {/* Gestión de botones de About */}
          <SectionButtonManager
            buttons={config.buttons?.aboutButtons || []}
            onButtonsChange={(newButtons) => updateConfig({ 
              buttons: { 
                ...config.buttons, 
                aboutButtons: newButtons
              } 
            })}
            sectionId="about"
            sectionName="Sobre Mí"
          />
          
          {/* Botones legacy (para compatibilidad) */}
          {(!config.buttons?.aboutButtons || config.buttons.aboutButtons.length === 0) && (
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
          )}
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
        
        {/* Gestión de botones de Testimonials */}
        <SectionButtonManager
          buttons={config.buttons?.testimonialsButtons || []}
          onButtonsChange={(newButtons) => updateConfig({ 
            buttons: { 
              ...config.buttons, 
              testimonialsButtons: newButtons
            } 
          })}
          sectionId="testimonials"
          sectionName="Testimonios"
        />
      </div>
    </section>
  )
}

function CTABanner() {
  const { config, updateConfig } = useAdmin()

  if (!config) return null

  return (
    <section className="w-full py-12 md:py-16 theme-bg-accent">
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
          className="theme-opacity-90"
          tag="p"
          multiline
        />
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <ScheduleButton
            url={config.integrations.calendlyUrl}
            label={config.buttons?.ctaButton || "Agendar ahora"}
            onLabelChange={(newValue) => updateConfig({ buttons: { ...config.buttons, ctaButton: newValue } })}
            className="theme-btn-primary theme-opacity-90"
          />
          <a
            href={config.course.hotmartUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center rounded-md theme-btn-secondary theme-opacity-90 px-6 text-sm font-medium theme-shadow"
          >
            Comprar el curso
          </a>
        </div>
        
        {/* Gestión de botones de CTA */}
        <SectionButtonManager
          buttons={config.buttons?.ctaButtons || []}
          onButtonsChange={(newButtons) => updateConfig({ 
            buttons: { 
              ...config.buttons, 
              ctaButtons: newButtons
            } 
          })}
          sectionId="cta"
          sectionName="Call to Action"
        />
      </div>
    </section>
  )
}

function Footer() {
  const { config, updateConfig } = useAdmin()

  if (!config) return null

  return (
    <footer className="theme-border-t theme-bg-footer">
      <div className="container px-4 md:px-6 py-8 flex flex-col sm:flex-row items-center gap-4">
        <div className="text-sm theme-text-subtitle">
          {"© "} {new Date().getFullYear()} {config.site.title}. Todos los derechos reservados.
        </div>
        <nav className="sm:ml-auto flex items-center gap-4 text-sm">
          {config.contact.email && (
            <a href={`mailto:${config.contact.email}`} className="theme-text-link theme-hover-text theme-transition">
              Contacto
            </a>
          )}
          {config.legal.termsUrl && (
            <Link href={config.legal.termsUrl} className="theme-text-link theme-hover-text theme-transition">
              Términos
            </Link>
          )}
          {config.legal.privacyUrl && (
            <Link href={config.legal.privacyUrl} className="theme-text-link theme-hover-text theme-transition">
              Privacidad
            </Link>
          )}
        </nav>
      </div>
    </footer>
  )
}
