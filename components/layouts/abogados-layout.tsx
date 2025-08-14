"use client"

import { Calendar, Check, Quote, Menu, X, Scale, Building2, Shield } from "lucide-react"
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
import { SessionManager } from "@/components/session-manager"
import { TestimonialManager } from "@/components/testimonial-manager"
import { AdminNotifications } from "@/components/admin-notifications"
import { AdminDebug } from "@/components/admin-debug"
import { ThemeSwitch } from "@/components/theme-switch"
import { DynamicNavigation } from "@/components/dynamic-navigation"

interface AbogadosLayoutProps {
  config: Config
}

export function AbogadosLayout({ config }: AbogadosLayoutProps) {
  const { isAdminMode, updateConfig } = useAdmin()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header más formal para abogados */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo más formal */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Scale className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="font-bold text-xl text-gray-900">
                    <EditableText
                      value={config.site.title}
                      onSave={(value) => updateConfig({ site: { ...config.site, title: value } })}
                      className="font-bold text-xl"
                    />
                  </span>
                  <p className="text-xs text-gray-600">Estudio Jurídico</p>
                </div>
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

        {/* Hero Section - Más formal */}
        <section className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
                <Shield className="h-4 w-4" />
                <span>Asesoramiento Legal Profesional</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold">
                <EditableText
                  value={config.site.heroTitle || "Soluciones Legales Integrales"}
                  onSave={(value) => updateConfig({ site: { ...config.site, heroTitle: value } })}
                  className="text-5xl md:text-7xl font-bold"
                />
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto">
                <EditableText
                  value={config.site.heroSubtitle || "Protección legal experta para empresas y particulares. Más de 15 años de experiencia en derecho civil, mercantil y laboral."}
                  onSave={(value) => updateConfig({ site: { ...config.site, heroSubtitle: value } })}
                  className="text-xl md:text-2xl text-gray-300"
                />
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <ScheduleButton />
                <Link
                  href="#servicios"
                  className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-white hover:text-gray-900 transition-colors"
                >
                  Ver Servicios
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Servicios - Layout específico para abogados */}
        <section id="servicios" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                <EditableText
                  value={config.site.sessionsTitle || "Nuestros Servicios Legales"}
                  onSave={(value) => updateConfig({ site: { ...config.site, sessionsTitle: value } })}
                  className="text-4xl md:text-5xl font-bold"
                />
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                <EditableText
                  value={config.site.sessionsSubtitle || "Especialistas en derecho civil, mercantil, laboral y administrativo. Asesoramiento personalizado y representación legal efectiva."}
                  onSave={(value) => updateConfig({ site: { ...config.site, sessionsSubtitle: value } })}
                  className="text-xl text-gray-600"
                />
              </p>
            </div>
            
            <SessionManager config={config} />
          </div>
        </section>

        {/* Sobre Nosotros - Más formal */}
        <section id="sobre-nosotros" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <EditableImage
                  value={config.about.photoUrl}
                  onSave={(value) => updateConfig({ about: { ...config.about, photoUrl: value } })}
                  className="w-full rounded-lg shadow-xl"
                  alt="Estudio jurídico"
                />
              </div>
              
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">
                    <EditableText
                      value={config.site.aboutTitle || "Sobre Nuestro Estudio"}
                      onSave={(value) => updateConfig({ site: { ...config.site, aboutTitle: value } })}
                      className="text-4xl font-bold"
                    />
                  </h2>
                  
                  <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                    <p>
                      <EditableText
                        value={config.about.story}
                        onSave={(value) => updateConfig({ about: { ...config.about, story: value } })}
                        className="leading-relaxed"
                      />
                    </p>
                    
                    <p>
                      <EditableText
                        value={config.about.whyMe}
                        onSave={(value) => updateConfig({ about: { ...config.about, whyMe: value } })}
                        className="leading-relaxed"
                      />
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                    <Building2 className="h-8 w-8 text-gray-900 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-900">+500</h3>
                    <p className="text-sm text-gray-600">Casos Exitosos</p>
                  </div>
                  <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                    <Scale className="h-8 w-8 text-gray-900 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-900">15+</h3>
                    <p className="text-sm text-gray-600">Años de Experiencia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonios */}
        <section id="testimonios" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                <EditableText
                  value={config.site.testimonialsTitle || "Lo que dicen nuestros clientes"}
                  onSave={(value) => updateConfig({ site: { ...config.site, testimonialsTitle: value } })}
                  className="text-4xl md:text-5xl font-bold"
                />
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                <EditableText
                  value={config.site.testimonialsSubtitle || "Testimonios de clientes satisfechos con nuestros servicios legales"}
                  onSave={(value) => updateConfig({ site: { ...config.site, testimonialsSubtitle: value } })}
                  className="text-xl text-gray-600"
                />
              </p>
            </div>
            
            <TestimonialManager config={config} />
          </div>
        </section>

        {/* CTA - Más formal */}
        <section className="py-20 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <EditableText
                value={config.site.ctaTitle || "¿Necesitas asesoramiento legal?"}
                onSave={(value) => updateConfig({ site: { ...config.site, ctaTitle: value } })}
                className="text-4xl md:text-5xl font-bold"
              />
            </h2>
            <p className="text-xl mb-8 text-gray-300">
              <EditableText
                value={config.site.ctaSubtitle || "Consulta gratuita sin compromiso. Protege tus derechos con expertos."}
                onSave={(value) => updateConfig({ site: { ...config.site, ctaSubtitle: value } })}
                className="text-xl text-gray-300"
              />
            </p>
            <ScheduleButton />
          </div>
        </section>
      </main>

      {/* Footer más formal */}
      <footer className="bg-gray-900 text-white border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                <EditableText
                  value={config.site.title}
                  onSave={(value) => updateConfig({ site: { ...config.site, title: value } })}
                />
              </h3>
              <p className="text-gray-400">
                <EditableText
                  value={config.site.tagline}
                  onSave={(value) => updateConfig({ site: { ...config.site, tagline: value } })}
                />
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <div className="space-y-2 text-gray-400">
                <p>
                  <EditableText
                    value={config.contact.email}
                    onSave={(value) => updateConfig({ contact: { ...config.contact, email: value } })}
                  />
                </p>
                {(config.contact.emails || []).map((e, i) => (
                  <p key={`email-${i}`}>{e}</p>
                ))}
                {(config.contact.phones || []).map((p, i) => (
                  <p key={`phone-${i}`}>{p}</p>
                ))}
                {(config.contact.addresses || []).map((a, i) => (
                  <p key={`address-${i}`}>{a}</p>
                ))}
                {(config.contact.urls || []).map((u, i) => (
                  <p key={`url-${i}`}>{u}</p>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <div className="space-y-2">
                {config.legal.termsUrl && (
                  <Link href={config.legal.termsUrl} className="block text-gray-400 hover:text-white">
                    Términos y Condiciones
                  </Link>
                )}
                {config.legal.privacyUrl && (
                  <Link href={config.legal.privacyUrl} className="block text-gray-400 hover:text-white">
                    Política de Privacidad
                  </Link>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 {config.site.title}. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
