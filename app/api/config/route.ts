import { NextRequest, NextResponse } from 'next/server'
import { loadConfig, saveConfig, Config, getTenantId } from '@/lib/config-loader'

// Función para obtener tenant ID desde el request
function getTenantFromRequest(request: NextRequest): string {
  const host = request.headers.get('host') || ''
  
  // Mapeo de dominios a tenant IDs
  const domainToTenant: Record<string, string> = {
    'localhost:3000': 'default',
    'landing-six-gold.vercel.app': 'gold',
    'marcamia.com': 'marcamia',
    'tumarca.com': 'tumarca',
    'controldoc.app': 'controldoc',
  }
  
  // Buscar coincidencia exacta
  if (domainToTenant[host]) {
    return domainToTenant[host]
  }
  
  // IMPORTANTE: Para subdominios de Vercel, extraer el tenant base
  // Ejemplo: plantilla-5dqaylk9f-loctimes-projects.vercel.app -> plantilla
  if (host.includes('.vercel.app')) {
    const parts = host.split('.')
    if (parts.length >= 3) {
      const firstPart = parts[0]
      // Si el primer parte contiene guiones, tomar solo la parte antes del primer guión
      if (firstPart.includes('-')) {
        const baseTenant = firstPart.split('-')[0]
        console.log(`🔍 API: Detectado subdominio Vercel: ${host} -> tenant: ${baseTenant}`)
        return baseTenant
      }
      return firstPart
    }
  }
  
  // Buscar coincidencia por subdominio (solo para dominios no-Vercel)
  const subdomain = host.split('.')[0]
  if (subdomain && subdomain !== 'www') {
    return subdomain
  }
  
  // Fallback al dominio completo como tenant ID
  return host.replace(/[^a-zA-Z0-9]/g, '-')
}

// GET - Cargar configuración
export async function GET(request: NextRequest) {
  try {
    const tenantId = getTenantFromRequest(request)
    const { searchParams } = new URL(request.url)
    const template = searchParams.get('template')
    
    console.log('🔍 API: Cargando configuración para tenant:', tenantId, 'template:', template)
    
    const config = await loadConfig(tenantId, template)
    return NextResponse.json(config)
  } catch (error) {
    console.error('Error loading config:', error)
    return NextResponse.json(
      { 
        error: 'Error loading configuration',
        details: error instanceof Error ? error.message : 'Unknown error',
        environment: process.env.NODE_ENV
      },
      { status: 500 }
    )
  }
}

// POST - Guardar configuración
export async function POST(request: NextRequest) {
  try {
    const tenantId = getTenantFromRequest(request)
    console.log('💾 API: Guardando configuración para tenant:', tenantId)
    
    const config: Config = await request.json()
    
    console.log('Intentando guardar configuración en Firestore...')
    console.log('Configuración recibida:', JSON.stringify(config, null, 2))
    
    // Guardar configuración en Firestore
    const success = await saveConfig(config, tenantId)
    
    if (success) {
      console.log('✅ Configuración guardada exitosamente')
      return NextResponse.json({ 
        success: true, 
        message: 'Configuration saved successfully to Firestore',
        tenant: tenantId
      })
    } else {
      console.log('❌ Error al guardar configuración')
      return NextResponse.json(
        { 
          error: 'Error saving configuration to Firestore',
          details: 'saveConfig returned false',
          tenant: tenantId
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error saving config:', error)
    return NextResponse.json(
      { 
        error: 'Invalid configuration data',
        details: error instanceof Error ? error.message : 'Unknown error',
        environment: process.env.NODE_ENV
      },
      { status: 400 }
    )
  }
}
