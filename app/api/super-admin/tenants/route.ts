import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, doc, setDoc, getDefaultConfig } from '@/lib/config-loader'
import { getFirestore, collection as firestoreCollection, getDocs as firestoreGetDocs, doc as firestoreDoc, setDoc as firestoreSetDoc } from 'firebase/firestore'

interface TenantInfo {
  id: string
  name: string
  domain: string
  isActive: boolean
  lastModified?: string
}

// GET - Listar todos los tenants
export async function GET() {
  try {
    console.log('🔍 Super Admin: Listando todos los tenants...')
    
    const tenantsCollection = firestoreCollection(db, 'config')
    const tenantsSnapshot = await firestoreGetDocs(tenantsCollection)
    
    const tenants: TenantInfo[] = []
    
    tenantsSnapshot.forEach((doc) => {
      const data = doc.data()
      tenants.push({
        id: doc.id,
        name: data.name || doc.id,
        domain: data.domain || 'N/A',
        isActive: data.isActive !== false, // Por defecto activo
        lastModified: data.lastModified || new Date().toISOString()
      })
    })
    
    console.log(`✅ Super Admin: Encontrados ${tenants.length} tenants`)
    
    return NextResponse.json({ 
      success: true, 
      tenants,
      count: tenants.length
    })
  } catch (error) {
    console.error('❌ Error listing tenants:', error)
    return NextResponse.json(
      { 
        error: 'Error listing tenants',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo tenant
export async function POST(request: NextRequest) {
  try {
    const { id, name, domain, isActive = true } = await request.json()
    
    console.log('🆕 Super Admin: Creando nuevo tenant:', { id, name, domain })
    
    if (!id || !name || !domain) {
      return NextResponse.json(
        { error: 'ID, name y domain son requeridos' },
        { status: 400 }
      )
    }
    
    // Verificar si el tenant ya existe
    const existingDoc = firestoreDoc(db, 'config', id)
    const existingSnapshot = await firestoreGetDocs(firestoreCollection(db, 'config'))
    const exists = existingSnapshot.docs.some(doc => doc.id === id)
    
    if (exists) {
      return NextResponse.json(
        { error: `El tenant con ID "${id}" ya existe` },
        { status: 409 }
      )
    }
    
    // Crear configuración por defecto para el nuevo tenant
    const defaultConfig = getDefaultConfig(id)
    
    // Guardar el tenant con su configuración
    const tenantDoc = firestoreDoc(db, 'config', id)
    await firestoreSetDoc(tenantDoc, {
      name,
      domain,
      isActive,
      lastModified: new Date().toISOString(),
      data: JSON.stringify(defaultConfig)
    })
    
    console.log('✅ Super Admin: Tenant creado exitosamente:', id)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Tenant created successfully',
      tenant: {
        id,
        name,
        domain,
        isActive,
        lastModified: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('❌ Error creating tenant:', error)
    return NextResponse.json(
      { 
        error: 'Error creating tenant',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
