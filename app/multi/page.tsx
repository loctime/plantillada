"use client"

import { useState, useEffect } from 'react'
import { Config } from '@/lib/config-loader'

export default function MultiPage() {
  const [config, setConfig] = useState<Config | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/config?template=multi-page')
        if (response.ok) {
          const multiConfig = await response.json()
          setConfig(multiConfig)
        }
      } catch (error) {
        console.error('Error loading multi-page config:', error)
      } finally {
        setLoading(false)
      }
    }

    loadConfig()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Cargando sitio multi-página...</div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Error al cargar la configuración</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {config.site.title}
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#inicio" className="text-gray-700 hover:text-gray-900">Inicio</a>
              <a href="#sesiones" className="text-gray-700 hover:text-gray-900">Sesiones</a>
              <a href="#cursos" className="text-gray-700 hover:text-gray-900">Cursos</a>
              <a href="#sobre-mi" className="text-gray-700 hover:text-gray-900">Sobre Mí</a>
              <a href="#testimonios" className="text-gray-700 hover:text-gray-900">Testimonios</a>
              <a href="#contacto" className="text-gray-700 hover:text-gray-900">Contacto</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">
              {config.site.heroTitle || "Sitio Multi-Página Profesional"}
            </h2>
            <p className="text-xl mb-8">
              {config.site.tagline}
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href="#sesiones"
                className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                {config.buttons?.heroButton || "Explorar"}
              </a>
              <a
                href="#contacto"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
              >
                {config.buttons?.ctaButton || "Contacto"}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Sesiones Section */}
      <section id="sesiones" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {config.site.sessionsTitle || "Sesiones 1:1"}
            </h3>
            <p className="text-lg text-gray-600">
              {config.site.sessionsSubtitle || "Sesiones personalizadas para tu crecimiento"}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {config.sessions.map((session) => (
              <div key={session.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    {session.name}
                  </h4>
                  <p className="text-gray-600 mb-4">{session.summary}</p>
                  <div className="flex items-center justify-between mb-4">
                    {(config.site?.showPrices !== false && session.showPrice !== false) && (
                      <span className="text-2xl font-bold text-purple-600">{session.price}</span>
                    )}
                    <span className="text-sm text-gray-500">{session.duration}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {session.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={session.hotmartUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-purple-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                  >
                    {config.buttons?.sessionsButton || "Agendar Sesión"}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cursos Section */}
      <section id="cursos" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Cursos Online</h3>
            <p className="text-lg text-gray-600">Formación especializada para tu desarrollo profesional</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">
                {config.course.title}
              </h4>
              <p className="text-lg text-gray-600 mb-6">
                {config.course.blurb}
              </p>
              {(config.site?.showPrices !== false && config.course.showPrice !== false) && (
                <div className="mb-6">
                  <span className="text-3xl font-bold text-purple-600">{config.course.price}</span>
                </div>
              )}
              <ul className="space-y-3 mb-8">
                {config.course.bullets.map((bullet, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {bullet}
                  </li>
                ))}
              </ul>
              <a
                href={config.course.hotmartUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                {config.buttons?.courseButton || "Comprar Curso"}
              </a>
            </div>
            <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
              {config.course.videoUrl ? (
                <iframe
                  src={config.course.videoUrl}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                />
              ) : (
                <div className="text-gray-500 text-center">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <p>Video de presentación</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Mí Section */}
      <section id="sobre-mi" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {config.site.aboutTitle || "Sobre Mí"}
            </h3>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gray-200 rounded-lg aspect-square flex items-center justify-center">
              <img
                src={config.about.photoUrl}
                alt="Foto profesional"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <p className="text-lg text-gray-700 mb-6">
                {config.about.story}
              </p>
              <p className="text-lg text-gray-700">
                {config.about.whyMe}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios Section */}
      <section id="testimonios" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {config.site.testimonialsTitle || "Testimonios"}
            </h3>
            <p className="text-lg text-gray-600">
              {config.site.testimonialsSubtitle || "Lo que dicen mis clientes"}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {config.testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <svg className="w-8 h-8 text-purple-600 mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto Section */}
      <section id="contacto" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {config.site.ctaTitle || "¿Listo para empezar?"}
            </h3>
            <p className="text-lg text-gray-600">
              {config.site.ctaSubtitle || "Contáctame para comenzar tu transformación"}
            </p>
          </div>
          
          <div className="max-w-md mx-auto text-center">
            <a
              href={`mailto:${config.contact.email}`}
              className="inline-block bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              {config.buttons?.ctaButton || "Contactar"}
            </a>
            <p className="mt-4 text-gray-600">
              O escríbeme directamente a: <a href={`mailto:${config.contact.email}`} className="text-purple-600 hover:underline">{config.contact.email}</a>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h4 className="text-xl font-semibold mb-4">{config.site.title}</h4>
            <p className="text-gray-400 mb-6">{config.site.tagline}</p>
            <div className="flex justify-center space-x-6">
              <a href={`mailto:${config.contact.email}`} className="text-gray-400 hover:text-white">
                {config.contact.email}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
