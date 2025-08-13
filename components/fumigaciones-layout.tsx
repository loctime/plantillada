"use client"

import { Calendar, Check, Quote, Shield, AlertTriangle, Bug, Phone, Clock, MapPin, Building2, Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ScheduleButton } from "@/components/schedule-dialog"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Config } from "@/lib/config-loader"
import { useAdmin } from "@/lib/admin-context"
import { EditableText } from "@/components/editable-text"
import { EditableList } from "@/components/editable-list"
import { EditableUrl } from "@/components/editable-url"
import { EditableImage } from "@/components/editable-image"
import { EditableMedia } from "@/components/editable-media"
import { SessionManager } from "@/components/session-manager"
import { TestimonialManager } from "@/components/testimonial-manager"
import { ThemeSwitch } from "@/components/theme-switch"
import { DynamicNavigation } from "@/components/dynamic-navigation"

export function FumigacionesLayout() {
  const { isAdminMode, updateConfig, config } = useAdmin()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Si no hay config, mostrar loading
  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  // Datos editables para servicios de emergencia
  const emergencyServices = [
    {
      title: config.fumigaciones?.emergencyServices?.[0]?.title || "Fumigación Residencial",
      description: config.fumigaciones?.emergencyServices?.[0]?.description || "Protección completa para tu hogar",
      icon: <Shield className="h-8 w-8" />
    },
    {
      title: config.fumigaciones?.emergencyServices?.[1]?.title || "Fumigación Comercial",
      description: config.fumigaciones?.emergencyServices?.[1]?.description || "Soluciones para empresas",
      icon: <Building2 className="h-8 w-8" />
    },
    {
      title: config.fumigaciones?.emergencyServices?.[2]?.title || "Control de Termitas",
      description: config.fumigaciones?.emergencyServices?.[2]?.description || "Eliminación profesional",
      icon: <Bug className="h-8 w-8" />
    },
    {
      title: config.fumigaciones?.emergencyServices?.[3]?.title || "Emergencias 24/7",
      description: config.fumigaciones?.emergencyServices?.[3]?.description || "Respuesta inmediata",
      icon: <AlertTriangle className="h-8 w-8" />
    }
  ]

  // Datos editables para tipos de plagas
  const pestTypes = [
    { name: config.fumigaciones?.pestTypes?.[0]?.name || "Cucarachas", icon: <Bug className="h-6 w-6" /> },
    { name: config.fumigaciones?.pestTypes?.[1]?.name || "Termitas", icon: <Bug className="h-6 w-6" /> },
    { name: config.fumigaciones?.pestTypes?.[2]?.name || "Hormigas", icon: <Bug className="h-6 w-6" /> },
    { name: config.fumigaciones?.pestTypes?.[3]?.name || "Moscas", icon: <Bug className="h-6 w-6" /> },
    { name: config.fumigaciones?.pestTypes?.[4]?.name || "Mosquitos", icon: <Bug className="h-6 w-6" /> },
    { name: config.fumigaciones?.pestTypes?.[5]?.name || "Arañas", icon: <Bug className="h-6 w-6" /> },
    { name: config.fumigaciones?.pestTypes?.[6]?.name || "Roedores", icon: <Bug className="h-6 w-6" /> },
    { name: config.fumigaciones?.pestTypes?.[7]?.name || "Fauna Silvestre", icon: <Bug className="h-6 w-6" /> }
  ]

  // Datos editables para pasos de trabajo
  const workSteps = [
    {
      step: "1",
      title: config.fumigaciones?.workSteps?.[0]?.title || "Preparación",
      description: config.fumigaciones?.workSteps?.[0]?.description || "Evaluación completa del problema"
    },
    {
      step: "2",
      title: config.fumigaciones?.workSteps?.[1]?.title || "Desinfección",
      description: config.fumigaciones?.workSteps?.[1]?.description || "Aplicación de tratamientos especializados"
    },
    {
      step: "3",
      title: config.fumigaciones?.workSteps?.[2]?.title || "Limpieza",
      description: config.fumigaciones?.workSteps?.[2]?.description || "Verificación y seguimiento"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header con información de emergencia */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <EditableText 
                  value={config.fumigaciones?.emergencyPhone || "555-0123"} 
                  onSave={(value) => {
                    if (updateConfig) {
                      updateConfig({
                        ...config,
                        fumigaciones: {
                          ...config.fumigaciones,
                          emergencyPhone: value
                        }
                      })
                    }
                  }}
                  className="font-medium"
                  tag="span"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <EditableText 
                  value={config.fumigaciones?.emergencyDescription || "Emergencias 24/7"} 
                  onSave={(value) => {
                    if (updateConfig) {
                      updateConfig({
                        ...config,
                        fumigaciones: {
                          ...config.fumigaciones,
                          emergencyDescription: value
                        }
                      })
                    }
                  }}
                  className="font-medium"
                  tag="span"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <EditableText 
                value={config.fumigaciones?.emergencyTitle || "¡Servicio de emergencia disponible!"} 
                onSave={(value) => {
                  if (updateConfig) {
                    updateConfig({
                      ...config,
                      fumigaciones: {
                        ...config.fumigaciones,
                        emergencyTitle: value
                      }
                    })
                  }
                }}
                className="text-orange-400 font-semibold"
                tag="span"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navegación principal */}
      <nav className="bg-card shadow-lg border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center">
                <EditableImage
                  value={config.site?.logo || "/placeholder-logo.png"}
                  alt={config.site?.title || "Logo"}
                  className="h26 w-26 object-contain rounded-lg"
                  onSave={(value) => {
                    if (updateConfig) {
                      updateConfig({
                        ...config,
                        site: {
                          ...config.site,
                          logo: value
                        }
                      })
                    }
                  }}
                />
              </div>
              <div className="flex flex-col">
                <EditableText 
                  value={config.site?.title || "Pest Busters"} 
                  onSave={(value) => {
                    if (updateConfig) {
                      updateConfig({
                        ...config,
                        site: {
                          ...config.site,
                          title: value
                        }
                      })
                    }
                  }}
                  className="text-xl font-bold text-foreground leading-tight"
                  tag="h1"
                />
                <EditableText 
                  value={config.fumigaciones?.tagline || "Control de Plagas Profesional"} 
                  onSave={(value) => {
                    if (updateConfig) {
                      updateConfig({
                        ...config,
                        fumigaciones: {
                          ...config.fumigaciones,
                          tagline: value
                        }
                      })
                    }
                  }}
                  className="text-sm text-muted-foreground leading-tight"
                  tag="span"
                />
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <DynamicNavigation config={config} />
            </div>

            <div className="flex items-center space-x-6">
              <ScheduleButton />
              <ThemeSwitch />
              
              {/* Botón de menú móvil */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
          
          {/* Menú móvil */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-4">
                <DynamicNavigation config={config} isMobile={true} />
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Layout específico para fumigaciones */}
      <section className="relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <EditableText 
                value={config.site?.heroTitle || "Complex Approach to Pest Control"} 
                onSave={(value) => {
                  if (updateConfig) {
                    updateConfig({
                      ...config,
                      site: {
                        ...config.site,
                        heroTitle: value
                      }
                    })
                  }
                }}
                className="text-5xl font-bold leading-tight" 
                tag="h1" 
              />
              <EditableText 
                value={config.site?.heroSubtitle || "Servicios profesionales de fumigación"} 
                onSave={(value) => {
                  if (updateConfig) {
                    updateConfig({
                      ...config,
                      site: {
                        ...config.site,
                        heroSubtitle: value
                      }
                    })
                  }
                }}
                className="text-2xl text-accent font-semibold" 
                tag="h2" 
              />
              <EditableText 
                value={config.fumigaciones?.heroDescription || "Soluciones integrales de control de plagas con tecnología avanzada y garantía de resultados"} 
                onSave={(value) => {
                  if (updateConfig) {
                    updateConfig({
                      ...config,
                      fumigaciones: {
                        ...config.fumigaciones,
                        heroDescription: value
                      }
                    })
                  }
                }}
                className="text-primary-foreground/80 text-lg" 
                tag="p" 
              />
              <EditableText 
                value={config.fumigaciones?.emergencyButtonText || "¿Necesitas servicios de emergencia?"} 
                onSave={(value) => {
                  if (updateConfig) {
                    updateConfig({
                      ...config,
                      fumigaciones: {
                        ...config.fumigaciones,
                        emergencyButtonText: value
                      }
                    })
                  }
                }}
                className="bg-accent text-accent-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:bg-accent/80 transition-colors cursor-pointer inline-block"
                tag="span"
              />
            </div>
            <div className="relative">
              <EditableImage
                value={config.fumigaciones?.heroImage || "/placeholder.jpg"}
                alt="Servicios de fumigación"
                className="rounded-lg shadow-2xl"
                onSave={(value) => {
                  if (updateConfig) {
                    updateConfig({
                      ...config,
                      fumigaciones: {
                        ...config.fumigaciones,
                        heroImage: value
                      }
                    })
                  }
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sección de servicios de emergencia */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <EditableText 
              value={config.fumigaciones?.emergencyTitle || "Servicios de Emergencia"} 
              onSave={(value) => {
                if (updateConfig) {
                  updateConfig({
                    ...config,
                    fumigaciones: {
                      ...config.fumigaciones,
                      emergencyTitle: value
                    }
                  })
                }
              }}
              className="text-4xl font-bold text-foreground mb-4" 
              tag="h2" 
            />
            <EditableText 
              value={config.fumigaciones?.emergencyDescription || "Respuesta rápida y profesional"} 
              onSave={(value) => {
                if (updateConfig) {
                  updateConfig({
                    ...config,
                    fumigaciones: {
                      ...config.fumigaciones,
                      emergencyDescription: value
                    }
                  })
                }
              }}
              className="text-xl text-muted-foreground" 
              tag="p" 
            />
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {emergencyServices.map((service, index) => (
              <div key={index} className="bg-card p-6 rounded-lg shadow-lg text-center border">
                <div className="text-primary mb-4 flex justify-center">
                  {service.icon}
                </div>
                <EditableText 
                  value={service.title} 
                  onSave={(value) => {
                    const newServices = [...(config.fumigaciones?.emergencyServices || [])]
                    newServices[index] = { ...newServices[index], title: value }
                    if (updateConfig) {
                      updateConfig({
                        ...config,
                        fumigaciones: {
                          ...config.fumigaciones,
                          emergencyServices: newServices
                        }
                      })
                    }
                  }}
                  className="text-xl font-semibold text-foreground mb-2" 
                  tag="h3" 
                />
                <EditableText 
                  value={service.description} 
                  onSave={(value) => {
                    const newServices = [...(config.fumigaciones?.emergencyServices || [])]
                    newServices[index] = { ...newServices[index], description: value }
                    if (updateConfig) {
                      updateConfig({
                        ...config,
                        fumigaciones: {
                          ...config.fumigaciones,
                          emergencyServices: newServices
                        }
                      })
                    }
                  }}
                  className="text-muted-foreground" 
                  tag="p" 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de protección */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <EditableText 
                value={config.fumigaciones?.protectionTitle || "Protección Integral"} 
                onSave={(value) => {
                  if (updateConfig) {
                    updateConfig({
                      ...config,
                      fumigaciones: {
                        ...config.fumigaciones,
                        protectionTitle: value
                      }
                    })
                  }
                }}
                className="text-4xl font-bold text-foreground mb-6" 
                tag="h2" 
              />
              <EditableText 
                value={config.fumigaciones?.aboutPoint1 || "Ofrecemos protección completa contra todo tipo de plagas con métodos seguros y efectivos."} 
                onSave={(value) => {
                  if (updateConfig) {
                    updateConfig({
                      ...config,
                      fumigaciones: {
                        ...config.fumigaciones,
                        aboutPoint1: value
                      }
                    })
                  }
                }}
                className="text-lg text-muted-foreground mb-6" 
                tag="p" 
              />
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Check className="h-6 w-6 text-primary" />
                  <EditableText 
                    value={config.fumigaciones?.aboutPoint2 || "Métodos seguros para mascotas y niños"} 
                    onSave={(value) => {
                      if (updateConfig) {
                        updateConfig({
                          ...config,
                          fumigaciones: {
                            ...config.fumigaciones,
                            aboutPoint2: value
                          }
                        })
                      }
                    }}
                    className="text-foreground" 
                    tag="span" 
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-6 w-6 text-primary" />
                  <EditableText 
                    value={config.fumigaciones?.aboutPoint3 || "Garantía de resultados"} 
                    onSave={(value) => {
                      if (updateConfig) {
                        updateConfig({
                          ...config,
                          fumigaciones: {
                            ...config.fumigaciones,
                            aboutPoint3: value
                          }
                        })
                      }
                    }}
                    className="text-foreground" 
                    tag="span" 
                  />
                </div>
              </div>
            </div>
            <div className="relative">
              <EditableImage
                value={config.fumigaciones?.emergencyImage || "/placeholder.jpg"}
                alt="Protección integral"
                className="rounded-lg shadow-xl"
                onSave={(value) => {
                  if (updateConfig) {
                    updateConfig({
                      ...config,
                      fumigaciones: {
                        ...config.fumigaciones,
                        emergencyImage: value
                      }
                    })
                  }
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sección de principios de trabajo */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <EditableText 
              value={config.fumigaciones?.workPrincipleTitle || "Nuestro Proceso de Trabajo"} 
              onSave={(value) => {
                if (updateConfig) {
                  updateConfig({
                    ...config,
                    fumigaciones: {
                      ...config.fumigaciones,
                      workPrincipleTitle: value
                    }
                  })
                }
              }}
              className="text-4xl font-bold text-foreground mb-4" 
              tag="h2" 
            />
            <p className="text-xl text-muted-foreground">3 pasos simples para eliminar plagas</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {workSteps.map((step, index) => (
              <div key={index} className="bg-card p-8 rounded-lg shadow-lg text-center border">
                <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {step.step}
                </div>
                <EditableText 
                  value={step.title} 
                  onSave={(value) => {
                    const newSteps = [...(config.fumigaciones?.workSteps || [])]
                    newSteps[index] = { ...newSteps[index], title: value }
                    if (updateConfig) {
                      updateConfig({
                        ...config,
                        fumigaciones: {
                          ...config.fumigaciones,
                          workSteps: newSteps
                        }
                      })
                    }
                  }}
                  className="text-2xl font-semibold text-foreground mb-4" 
                  tag="h3" 
                />
                <EditableText 
                  value={step.description} 
                  onSave={(value) => {
                    const newSteps = [...(config.fumigaciones?.workSteps || [])]
                    newSteps[index] = { ...newSteps[index], description: value }
                    if (updateConfig) {
                      updateConfig({
                        ...config,
                        fumigaciones: {
                          ...config.fumigaciones,
                          workSteps: newSteps
                        }
                      })
                    }
                  }}
                  className="text-muted-foreground" 
                  tag="p" 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4 text-center">
          <EditableText 
            value={config.fumigaciones?.ctaTitle || "¿Necesitas servicios de fumigación?"} 
            onSave={(value) => {
              if (updateConfig) {
                updateConfig({
                  ...config,
                  fumigaciones: {
                    ...config.fumigaciones,
                    ctaTitle: value
                  }
                })
              }
            }}
            className="text-4xl font-bold text-accent-foreground mb-4" 
            tag="h2" 
          />
          <p className="text-xl text-accent-foreground/80 mb-8">Servicio 24/7 - Respuesta inmediata</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <span className="bg-background text-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:bg-muted transition-colors cursor-pointer inline-block">
              Solicitar Cita
            </span>
            <span className="border-2 border-accent-foreground text-accent-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:bg-accent-foreground hover:text-accent transition-colors cursor-pointer inline-block">
              Emergencia 24/7
            </span>
          </div>
        </div>
      </section>

      {/* Sección About Us */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <EditableText 
                value={config.fumigaciones?.aboutTitle || "Sobre Nosotros"} 
                onSave={(value) => {
                  if (updateConfig) {
                    updateConfig({
                      ...config,
                      fumigaciones: {
                        ...config.fumigaciones,
                        aboutTitle: value
                      }
                    })
                  }
                }}
                className="text-4xl font-bold text-foreground mb-6" 
                tag="h2" 
              />
              <p className="text-lg text-muted-foreground mb-6">
                Más de 10 años protegiendo hogares y empresas de plagas con métodos seguros y efectivos.
              </p>
              <p className="text-lg text-muted-foreground">
                Nuestro compromiso es proporcionar soluciones efectivas y seguras para el control de plagas.
              </p>
            </div>
            <div className="relative">
              <EditableImage
                value={config.fumigaciones?.aboutImage || "/placeholder.jpg"}
                alt="Sobre nosotros"
                className="rounded-lg shadow-xl"
                onSave={(value) => {
                  if (updateConfig) {
                    updateConfig({
                      ...config,
                      fumigaciones: {
                        ...config.fumigaciones,
                        aboutImage: value
                      }
                    })
                  }
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <EditableText 
              value={config.fumigaciones?.testimonialsTitle || "Lo que dicen nuestros clientes"} 
              onSave={(value) => {
                if (updateConfig) {
                  updateConfig({
                    ...config,
                    fumigaciones: {
                      ...config.fumigaciones,
                      testimonialsTitle: value
                    }
                  })
                }
              }}
              className="text-4xl font-bold text-foreground mb-4" 
              tag="h2" 
            />
            <p className="text-xl text-muted-foreground">Más de 10 años protegiendo hogares y empresas</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {config.testimonials?.slice(0, 3).map((testimonial, index) => (
              <div key={index} className="bg-card p-6 rounded-lg shadow-lg border">
                <div className="flex items-center mb-4">
                  <Quote className="h-8 w-8 text-primary" />
                </div>
                <EditableText 
                  value={testimonial.quote || "Excelente servicio profesional"} 
                  onSave={(value) => {
                    const newTestimonials = [...(config.testimonials || [])]
                    newTestimonials[index] = { ...newTestimonials[index], quote: value }
                    if (updateConfig) {
                      updateConfig({
                        ...config,
                        testimonials: newTestimonials
                      })
                    }
                  }}
                  className="text-muted-foreground mb-4" 
                  tag="p" 
                />
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-muted rounded-full mr-4"></div>
                  <div>
                    <EditableText 
                      value={testimonial.author || "Cliente Satisfecho"} 
                      onSave={(value) => {
                        const newTestimonials = [...(config.testimonials || [])]
                        newTestimonials[index] = { ...newTestimonials[index], author: value }
                        if (updateConfig) {
                          updateConfig({
                            ...config,
                            testimonials: newTestimonials
                          })
                        }
                      }}
                      className="font-semibold text-foreground" 
                      tag="span" 
                    />
                    <EditableText 
                      value={testimonial.role || "Cliente"} 
                      onSave={(value) => {
                        const newTestimonials = [...(config.testimonials || [])]
                        newTestimonials[index] = { ...newTestimonials[index], role: value }
                        if (updateConfig) {
                          updateConfig({
                            ...config,
                            testimonials: newTestimonials
                          })
                        }
                      }}
                      className="text-muted-foreground text-sm block" 
                      tag="span" 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action final */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <EditableText 
            value={config.fumigaciones?.finalCtaTitle || "¿Listo para eliminar las plagas?"} 
            onSave={(value) => {
              if (updateConfig) {
                updateConfig({
                  ...config,
                  fumigaciones: {
                    ...config.fumigaciones,
                    finalCtaTitle: value
                  }
                })
              }
            }}
            className="text-4xl font-bold mb-4" 
            tag="h2" 
          />
          <p className="text-xl text-primary-foreground/80 mb-8">Contáctanos hoy mismo para una evaluación gratuita</p>
          <span className="bg-accent text-accent-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:bg-accent/80 transition-colors cursor-pointer inline-block">
            Solicitar Evaluación Gratuita
          </span>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <EditableText 
                value={config.site?.title || "Pest Busters"} 
                onSave={(value) => {
                  if (updateConfig) {
                    updateConfig({
                      ...config,
                      site: {
                        ...config.site,
                        title: value
                      }
                    })
                  }
                }}
                className="text-2xl font-bold mb-4" 
                tag="h3" 
              />
              <EditableText 
                value={config.fumigaciones?.tagline || "Soluciones integrales de control de plagas"} 
                onSave={(value) => {
                  if (updateConfig) {
                    updateConfig({
                      ...config,
                      fumigaciones: {
                        ...config.fumigaciones,
                        tagline: value
                      }
                    })
                  }
                }}
                className="text-primary-foreground/70" 
                tag="p" 
              />
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-primary-foreground/70">
                <li>Fumigación Residencial</li>
                <li>Fumigación Comercial</li>
                <li>Control de Termitas</li>
                <li>Emergencias 24/7</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <div className="space-y-2 text-primary-foreground/70">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>{config.fumigaciones?.emergencyPhone || "555-0123"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Ciudad, Estado</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Lun-Vie: 8AM-6PM</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Síguenos</h4>
                              <div className="flex space-x-4">
                  <EditableUrl 
                    value={config.fumigaciones?.socialLinks?.facebook || "#"} 
                    onSave={(value) => {
                      if (updateConfig) {
                        updateConfig({
                          ...config,
                          fumigaciones: {
                            ...config.fumigaciones,
                            socialLinks: {
                              ...config.fumigaciones?.socialLinks,
                              facebook: value
                            }
                          }
                        })
                      }
                    }}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  />
                  <EditableUrl 
                    value={config.fumigaciones?.socialLinks?.instagram || "#"} 
                    onSave={(value) => {
                      if (updateConfig) {
                        updateConfig({
                          ...config,
                          fumigaciones: {
                            ...config.fumigaciones,
                            socialLinks: {
                              ...config.fumigaciones?.socialLinks,
                              instagram: value
                            }
                          }
                        })
                      }
                    }}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  />
                  <EditableUrl 
                    value={config.fumigaciones?.socialLinks?.twitter || "#"} 
                    onSave={(value) => {
                      if (updateConfig) {
                        updateConfig({
                          ...config,
                          fumigaciones: {
                            ...config.fumigaciones,
                            socialLinks: {
                              ...config.fumigaciones?.socialLinks,
                              twitter: value
                            }
                          }
                        })
                      }
                    }}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  />
                </div>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/70">
            <EditableText 
              value={config.fumigaciones?.footerCopyright || "© 2024 Pest Busters. Todos los derechos reservados."} 
              onSave={(value) => {
                if (updateConfig) {
                  updateConfig({
                    ...config,
                    fumigaciones: {
                      ...config.fumigaciones,
                      footerCopyright: value
                    }
                  })
                }
              }}
              tag="p"
            />
          </div>
        </div>
      </footer>
    </div>
  )
}
