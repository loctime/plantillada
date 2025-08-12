"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Brain, 
  Heart, 
  Users, 
  Clock, 
  CheckCircle, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  Shield,
  Star,
  ArrowRight
} from "lucide-react"
import { Config, loadConfig } from "@/lib/config-loader"
import { ScheduleDialog } from "@/components/schedule-dialog"

export default function PsicologosPage() {
  const [config, setConfig] = useState<Config | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPageConfig = async () => {
      try {
        const loadedConfig = await loadConfig()
        setConfig(loadedConfig)
      } catch (error) {
        console.error('Error loading config:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPageConfig()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error al cargar la configuración</h1>
          <p className="text-gray-600">Por favor, intenta recargar la página</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{config.site.title}</h1>
                <p className="text-sm text-gray-600">{config.site.tagline}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                <Phone className="h-4 w-4 mr-2" />
                Contactar
              </Button>
              <ScheduleDialog 
                calendlyUrl={config.integrations?.calendlyUrl || ""}
                buttonText="Agendar Sesión"
                buttonVariant="default"
                className="bg-purple-600 hover:bg-purple-700"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {config.site.heroTitle || "Tu bienestar emocional es nuestra prioridad"}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {config.site.heroSubtitle || "Ofrecemos terapia individual, de pareja y familiar con un enfoque profesional, empático y basado en evidencia científica"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ScheduleDialog 
              calendlyUrl={config.integrations?.calendlyUrl || ""}
              buttonText="Primera Consulta Gratuita"
              buttonVariant="default"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
            />
            <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-3 text-lg">
              Conocer Nuestros Servicios
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {config.site.sessionsTitle || "Nuestros Servicios"}
            </h2>
            <p className="text-lg text-gray-600">
              {config.site.sessionsSubtitle || "Especialidades terapéuticas adaptadas a tus necesidades"}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {config.sessions?.map((session, index) => (
              <Card key={session.id} className="border-purple-200 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      {index === 0 && <Brain className="h-6 w-6 text-purple-600" />}
                      {index === 1 && <Users className="h-6 w-6 text-purple-600" />}
                      {index === 2 && <Heart className="h-6 w-6 text-purple-600" />}
                      {index === 3 && <Shield className="h-6 w-6 text-purple-600" />}
                    </div>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      {session.duration}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{session.name}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {session.summary}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {session.features?.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-purple-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-purple-600">
                      {session.price}
                    </div>
                    <Button 
                      onClick={() => window.open(session.hotmartUrl, '_blank')}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Reservar Sesión
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {config.site.aboutTitle || "Nuestro Centro"}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {config.about?.story}
              </p>
              <p className="text-lg text-gray-600 mb-8">
                {config.about?.whyMe}
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <span className="text-sm text-gray-600">Confidencialidad total</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-purple-600" />
                  <span className="text-sm text-gray-600">Profesionales certificados</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src={config.about?.photoUrl || "/placeholder.svg"} 
                alt="Equipo de psicólogos"
                className="rounded-lg shadow-lg w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-purple-600 bg-opacity-20 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {config.site.testimonialsTitle || "Experiencias de Nuestros Pacientes"}
            </h2>
            <p className="text-lg text-gray-600">
              {config.site.testimonialsSubtitle || "Testimonios de personas que han encontrado bienestar con nosotros"}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {config.testimonials?.map((testimonial, index) => (
              <Card key={index} className="border-purple-200">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold">
                        {testimonial.author.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.author}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {config.site.ctaTitle || "¿Necesitas apoyo psicológico?"}
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            {config.site.ctaSubtitle || "Primera consulta gratuita y confidencial"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ScheduleDialog 
              calendlyUrl={config.integrations?.calendlyUrl || ""}
              buttonText="Agendar Consulta Gratuita"
              buttonVariant="default"
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg"
            />
            <Button variant="outline" className="border-white text-white hover:bg-purple-700 px-8 py-3 text-lg">
              <Phone className="h-4 w-4 mr-2" />
              Llamar Ahora
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">{config.site.title}</span>
              </div>
              <p className="text-gray-400">{config.site.tagline}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Servicios</h3>
              <ul className="space-y-2 text-gray-400">
                {config.sessions?.slice(0, 3).map((session) => (
                  <li key={session.id}>{session.name}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contacto</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{config.contact?.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+34 600 000 000</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Madrid, España</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Horarios</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Lun - Vie: 9:00 - 20:00</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Sáb: 9:00 - 14:00</span>
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="my-8 bg-gray-700" />
          
          <div className="text-center text-gray-400">
            <p>&copy; 2024 {config.site.title}. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
