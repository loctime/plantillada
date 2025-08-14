"use client"

import { Calendar, Check, Quote, ShoppingCart, Menu, X, Settings } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ScheduleButton } from "@/components/schedule-dialog"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Config } from "@/lib/config-loader"
import { useAdmin } from "@/lib/admin-context"
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

interface DefaultLayoutProps {
  config: Config
}

export function DefaultLayout({ config }: DefaultLayoutProps) {
  const { isAdminMode, updateConfig } = useAdmin()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [sections, setSections] = useState([
    {
      id: 'hero',
      title: 'Sección Hero',
      visible: true,
      description: 'Título principal, subtítulo y botones de acción',
      type: 'hero',
      component: <Hero config={config} />
    },
    {
      id: 'sessions',
      title: 'Sesiones 1:1',
      visible: true,
      description: 'Servicios de coaching y consultoría personalizada',
      type: 'content',
      component: <Sessions config={config} />
    },
    {
      id: 'course',
      title: 'Curso Online',
      visible: true,
      description: 'Producto digital con video de presentación',
      type: 'content',
      component: <Course config={config} />
    },
    {
      id: 'about',
      title: 'Sobre Mí',
      visible: true,
      description: 'Historia personal y propuesta de valor',
      type: 'content',
      component: <About config={config} />
    },
    {
      id: 'testimonials',
      title: 'Testimonios',
      visible: true,
      description: 'Opiniones y comentarios de clientes',
      type: 'testimonials',
      component: <Testimonials config={config} />
    },
    {
      id: 'linkhub',
      title: 'LinkHub',
      visible: false,
      description: 'Página de enlaces personales y redes sociales',
      type: 'linkhub',
      component: <LinkHubSection config={config} />
    },
    {
      id: 'cta',
      title: 'Call to Action',
      visible: true,
      description: 'Botón de acción principal',
      type: 'cta',
      component: <CTABanner config={config} />
    }
  ])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="font-semibold text-lg theme-text-primary">
                  <EditableText
                    value={config.site.title}
                    onSave={(value) => updateConfig({ site: { ...config.site, title: value } })}
                    className="font-semibold text-lg"
                  />
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <DynamicNavigation config={config} />
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <ThemeSwitch />
              <AdminToggle />
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-2">
              <DynamicNavigation config={config} isMobile />
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        {/* Admin Notifications */}
        <AdminNotifications />
        
        {/* Admin Debug */}
        {isAdminMode && <AdminDebug />}

        {/* Sections */}
        {sections.map((section) => (
          <DynamicSection
            key={section.id}
            section={section}
            config={config}
            isVisible={section.visible}
          />
        ))}

        {/* Section Manager */}
        {isAdminMode && (
          <SectionManager
            sections={sections}
            onSectionsChange={setSections}
            config={config}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold theme-text-primary mb-4">
                <EditableText
                  value={config.site.title}
                  onSave={(value) => updateConfig({ site: { ...config.site, title: value } })}
                />
              </h3>
              <p className="text-gray-600">
                <EditableText
                  value={config.site.tagline}
                  onSave={(value) => updateConfig({ site: { ...config.site, tagline: value } })}
                />
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold theme-text-primary mb-4">Contacto</h4>
              <p className="text-gray-600">
                <EditableText
                  value={config.contact.email}
                  onSave={(value) => updateConfig({ contact: { ...config.contact, email: value } })}
                />
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold theme-text-primary mb-4">Legal</h4>
              <div className="space-y-2">
                {config.legal.termsUrl && (
                  <Link href={config.legal.termsUrl} className="block text-gray-600 hover:text-gray-900">
                    Términos y Condiciones
                  </Link>
                )}
                {config.legal.privacyUrl && (
                  <Link href={config.legal.privacyUrl} className="block text-gray-600 hover:text-gray-900">
                    Política de Privacidad
                  </Link>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p>&copy; 2024 {config.site.title}. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Componentes de secciones
function Hero({ config }: { config: Config }) {
  const { isAdminMode, updateConfig } = useAdmin()
  
  return (
    <section className="relative bg-gradient-to-br from-primary/5 to-secondary/5 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold theme-text-primary">
            <EditableText
              value={config.site.heroTitle || "Claridad, estrategia y acción para tu próximo salto profesional"}
              onSave={(value) => updateConfig({ site: { ...config.site, heroTitle: value } })}
              className="text-4xl md:text-6xl font-bold"
            />
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            <EditableText
              value={config.site.heroSubtitle || "Sesiones 1:1 y un curso online diseñados para desbloquear tu potencial, definir un plan claro y ejecutarlo con confianza."}
              onSave={(value) => updateConfig({ site: { ...config.site, heroSubtitle: value } })}
              className="text-xl md:text-2xl"
            />
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ScheduleButton />
            <Link
              href="#sessions"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50 transition-colors"
            >
              Ver Servicios
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function Sessions({ config }: { config: Config }) {
  return <SessionManager config={config} />
}

function Course({ config }: { config: Config }) {
  const { isAdminMode, updateConfig } = useAdmin()
  
  return (
    <section id="course" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold theme-text-primary mb-4">
            <EditableText
              value={config.course.title}
              onSave={(value) => updateConfig({ course: { ...config.course, title: value } })}
              className="text-3xl md:text-4xl font-bold"
            />
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            <EditableText
              value={config.course.blurb}
              onSave={(value) => updateConfig({ course: { ...config.course, blurb: value } })}
              className="text-xl"
            />
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold theme-text-primary mb-2">
                  <EditableText
                    value={config.course.title}
                    onSave={(value) => updateConfig({ course: { ...config.course, title: value } })}
                  />
                </h3>
                <p className="text-3xl font-bold text-primary">
                  <EditableText
                    value={config.course.price}
                    onSave={(value) => updateConfig({ course: { ...config.course, price: value } })}
                  />
                </p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <EditableList
                  items={config.course.bullets}
                  onSave={(value) => updateConfig({ course: { ...config.course, bullets: value } })}
                  itemClassName="flex items-start space-x-3"
                  bulletClassName="flex-shrink-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center mt-0.5"
                  bulletContent={<Check className="w-3 h-3 text-white" />}
                />
              </ul>
              
              <EditableUrl
                value={config.course.hotmartUrl}
                onSave={(value) => updateConfig({ course: { ...config.course, hotmartUrl: value } })}
                className="w-full bg-primary text-white py-3 px-6 rounded-md font-medium hover:bg-primary/90 transition-colors text-center block"
                placeholder="URL de Hotmart"
              >
                Comprar Curso
              </EditableUrl>
            </div>
          </div>
          
          <div>
            {config.course.videoUrl ? (
              <EditableMedia
                value={config.course.videoUrl}
                onSave={(value) => updateConfig({ course: { ...config.course, videoUrl: value } })}
                type="video"
                className="w-full aspect-video rounded-lg shadow-lg"
              />
            ) : (
              <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
                <p className="text-gray-500">Video de presentación</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function About({ config }: { config: Config }) {
  const { isAdminMode, updateConfig } = useAdmin()
  
  return (
    <section id="about" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold theme-text-primary mb-4">
            <EditableText
              value={config.site.aboutTitle || "Sobre Mí"}
              onSave={(value) => updateConfig({ site: { ...config.site, aboutTitle: value } })}
              className="text-3xl md:text-4xl font-bold"
            />
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <EditableImage
              value={config.about.photoUrl}
              onSave={(value) => updateConfig({ about: { ...config.about, photoUrl: value } })}
              className="w-full rounded-lg shadow-lg"
              alt="Foto de perfil"
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold theme-text-primary mb-3">Mi Historia</h3>
              <p className="text-gray-600 leading-relaxed">
                <EditableText
                  value={config.about.story}
                  onSave={(value) => updateConfig({ about: { ...config.about, story: value } })}
                  className="leading-relaxed"
                />
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold theme-text-primary mb-3">¿Por qué trabajar conmigo?</h3>
              <p className="text-gray-600 leading-relaxed">
                <EditableText
                  value={config.about.whyMe}
                  onSave={(value) => updateConfig({ about: { ...config.about, whyMe: value } })}
                  className="leading-relaxed"
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Testimonials({ config }: { config: Config }) {
  return <TestimonialManager config={config} />
}

function CTABanner({ config }: { config: Config }) {
  const { isAdminMode, updateConfig } = useAdmin()
  
  return (
    <section className="py-20 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          <EditableText
            value={config.site.ctaTitle || "¿Necesitas ayuda para alcanzar tus objetivos?"}
            onSave={(value) => updateConfig({ site: { ...config.site, ctaTitle: value } })}
            className="text-3xl md:text-4xl font-bold"
          />
        </h2>
        <p className="text-xl mb-8 opacity-90">
          <EditableText
            value={config.site.ctaSubtitle || "Agenda una sesión gratuita y descubre cómo puedo ayudarte"}
            onSave={(value) => updateConfig({ site: { ...config.site, ctaSubtitle: value } })}
            className="text-xl opacity-90"
          />
        </p>
        <ScheduleButton />
      </div>
    </section>
  )
}
