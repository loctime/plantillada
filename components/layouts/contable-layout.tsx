"use client"

import { Calendar, Check, Quote, Menu, X, Calculator, TrendingUp, DollarSign } from "lucide-react"
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

interface ContableLayoutProps {
  config: Config
}

export function ContableLayout({ config }: ContableLayoutProps) {
  const { isAdminMode, updateConfig } = useAdmin()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header profesional para contables */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-blue-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo profesional */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="font-bold text-xl text-blue-900">
                    <EditableText
                      value={config.site.title}
                      onSave={(value) => updateConfig({ site: { ...config.site, title: value } })}
                      className="font-bold text-xl"
                    />
                  </span>
                  <p className="text-xs text-blue-600">Estudio Contable</p>
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
                className="md:hidden p-2 rounded-md text-blue-600 hover:text-blue-900 hover:bg-blue-100"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-blue-200 bg-white">
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

        {/* Hero Section - Profesional y financiero */}
        <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
                <TrendingUp className="h-4 w-4" />
                <span>Asesoramiento Contable Profesional</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold">
                <EditableText
                  value={config.site.heroTitle || "Tu Éxito Financiero Comienza Aquí"}
                  onSave={(value) => updateConfig({ site: { ...config.site, heroTitle: value } })}
                  className="text-5xl md:text-7xl font-bold"
                />
              </h1>
              
              <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto">
                <EditableText
                  value={config.site.heroSubtitle || "Servicios contables integrales para empresas y particulares. Optimización fiscal, planificación financiera y cumplimiento normativo."}
                  onSave={(value) => updateConfig({ site: { ...config.site, heroSubtitle: value } })}
                  className="text-xl md:text-2xl text-blue-100"
                />
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <ScheduleButton />
                <Link
                  href="#servicios"
                  className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-white hover:text-blue-900 transition-colors"
                >
                  Ver Servicios
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Servicios - Layout específico para contables */}
        <section id="servicios" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
                <EditableText
                  value={config.site.sessionsTitle || "Nuestros Servicios Contables"}
                  onSave={(value) => updateConfig({ site: { ...config.site, sessionsTitle: value } })}
                  className="text-4xl md:text-5xl font-bold"
                />
              </h2>
              <p className="text-xl text-blue-700 max-w-3xl mx-auto">
                <EditableText
                  value={config.site.sessionsSubtitle || "Soluciones contables completas para hacer crecer tu negocio. Asesoramiento fiscal, auditoría y planificación financiera estratégica."}
                  onSave={(value) => updateConfig({ site: { ...config.site, sessionsSubtitle: value } })}
                  className="text-xl text-blue-700"
                />
              </p>
            </div>
            
            <SessionManager config={config} />
          </div>
        </section>

        {/* Estadísticas - Específico para contables */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <DollarSign className="h-12 w-12 mx-auto mb-4 text-blue-200" />
                <h3 className="text-3xl font-bold mb-2">+500</h3>
                <p className="text-blue-100">Clientes Satisfechos</p>
              </div>
              <div>
                <Calculator className="h-12 w-12 mx-auto mb-4 text-blue-200" />
                <h3 className="text-3xl font-bold mb-2">15+</h3>
                <p className="text-blue-100">Años de Experiencia</p>
              </div>
              <div>
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-blue-200" />
                <h3 className="text-3xl font-bold mb-2">€2M+</h3>
                <p className="text-blue-100">Ahorros Generados</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sobre Nosotros - Más profesional */}
        <section id="sobre-nosotros" className="py-20 bg-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <EditableImage
                  value={config.about.photoUrl}
                  onSave={(value) => updateConfig({ about: { ...config.about, photoUrl: value } })}
                  className="w-full rounded-lg shadow-xl"
                  alt="Estudio contable"
                />
              </div>
              
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-bold text-blue-900 mb-6">
                    <EditableText
                      value={config.site.aboutTitle || "Sobre Nuestro Estudio"}
                      onSave={(value) => updateConfig({ site: { ...config.site, aboutTitle: value } })}
                      className="text-4xl font-bold"
                    />
                  </h2>
                  
                  <div className="space-y-6 text-lg text-blue-800 leading-relaxed">
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
                  <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-blue-200">
                    <Calculator className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-blue-900">Contabilidad</h3>
                    <p className="text-sm text-blue-600">Completa</p>
                  </div>
                  <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-blue-200">
                    <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-blue-900">Fiscal</h3>
                    <p className="text-sm text-blue-600">Optimización</p>
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
              <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
                <EditableText
                  value={config.site.testimonialsTitle || "Lo que dicen nuestros clientes"}
                  onSave={(value) => updateConfig({ site: { ...config.site, testimonialsTitle: value } })}
                  className="text-4xl md:text-5xl font-bold"
                />
              </h2>
              <p className="text-xl text-blue-700 max-w-3xl mx-auto">
                <EditableText
                  value={config.site.testimonialsSubtitle || "Testimonios de clientes satisfechos con nuestros servicios contables"}
                  onSave={(value) => updateConfig({ site: { ...config.site, testimonialsSubtitle: value } })}
                  className="text-xl text-blue-700"
                />
              </p>
            </div>
            
            <TestimonialManager config={config} />
          </div>
        </section>

        {/* CTA - Más profesional */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <EditableText
                value={config.site.ctaTitle || "¿Necesitas asesoramiento contable?"}
                onSave={(value) => updateConfig({ site: { ...config.site, ctaTitle: value } })}
                className="text-4xl md:text-5xl font-bold"
              />
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              <EditableText
                value={config.site.ctaSubtitle || "Consulta gratuita sin compromiso. Optimiza tu situación fiscal y financiera."}
                onSave={(value) => updateConfig({ site: { ...config.site, ctaSubtitle: value } })}
                className="text-xl text-blue-100"
              />
            </p>
            <ScheduleButton />
          </div>
        </section>
      </main>

      {/* Footer más profesional */}
      <footer className="bg-blue-900 text-white border-t border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                <EditableText
                  value={config.site.title}
                  onSave={(value) => updateConfig({ site: { ...config.site, title: value } })}
                />
              </h3>
              <p className="text-blue-300">
                <EditableText
                  value={config.site.tagline}
                  onSave={(value) => updateConfig({ site: { ...config.site, tagline: value } })}
                />
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <div className="space-y-2 text-blue-300">
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
                  <Link href={config.legal.termsUrl} className="block text-blue-300 hover:text-white">
                    Términos y Condiciones
                  </Link>
                )}
                {config.legal.privacyUrl && (
                  <Link href={config.legal.privacyUrl} className="block text-blue-300 hover:text-white">
                    Política de Privacidad
                  </Link>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-blue-800 text-center text-blue-300">
            <p>&copy; 2024 {config.site.title}. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
