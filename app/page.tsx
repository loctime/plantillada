"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAdmin } from "@/lib/admin-context"

export default function Page() {
  const router = useRouter()
  const { config, isLoading } = useAdmin()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // Esperar a que se cargue la configuración
    if (isLoading) return

    // Si no hay configuración, usar landing por defecto
    if (!config) {
      console.log("📋 No hay configuración, usando landing por defecto")
      router.replace("/landing")
      return
    }

    // Determinar qué página mostrar basado en el orden de plantillas activas
    const activeTemplates = config.activeTemplates || []
    console.log(`🎯 Plantillas activas:`, activeTemplates)

    setIsRedirecting(true)

    // Si no hay plantillas activas, usar landing por defecto
    if (activeTemplates.length === 0) {
      console.log("⚠️ No hay plantillas activas, usando landing por defecto")
      router.replace("/landing")
      return
    }

    // Tomar la primera plantilla activa (en orden de selección)
    const firstActiveTemplate = activeTemplates[0]
    console.log(`🎯 Primera plantilla activa: ${firstActiveTemplate}`)

    // Redirigir según la primera plantilla activa
    switch (firstActiveTemplate) {
      case 'landing':
        console.log("🏠 Redirigiendo a landing...")
        router.replace("/landing")
        break
      case 'shop':
        console.log("🛒 Redirigiendo a tienda...")
        router.replace("/shop")
        break
      case 'linkhub':
        console.log("🔗 Redirigiendo a LinkHub...")
        router.replace("/linkhub")
        break
      case 'multi':
        console.log("📄 Redirigiendo a sitio multi-página...")
        router.replace("/multi")
        break
      case 'psicologos':
        console.log("🧠 Redirigiendo a centro de psicología...")
        router.replace("/psicologos")
        break
      default:
        console.log("🏠 Plantilla no reconocida, usando landing por defecto")
        router.replace("/landing")
    }
  }, [config, isLoading, router])

  // Mostrar loading mientras se determina la redirección
  if (isLoading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">
            {isLoading ? "Cargando configuración..." : "Redirigiendo..."}
          </p>
        </div>
      </div>
    )
  }

  // Fallback en caso de que no se redirija
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Inicializando...</p>
      </div>
    </div>
  )
}
