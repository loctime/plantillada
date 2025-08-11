import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { getFirestore, doc as firestoreDoc, getDoc as firestoreGetDoc, setDoc as firestoreSetDoc, deleteDoc as firestoreDeleteDoc } from 'firebase/firestore'
import { Config } from '@/lib/config-loader'

// GET - Obtener configuración de un tenant específico
export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const { tenantId } = params
    console.log('🔍 Super Admin: Obteniendo configuración del tenant:', tenantId)
    
    const tenantDoc = firestoreDoc(db, 'config', tenantId)
    const tenantSnapshot = await firestoreGetDoc(tenantDoc)
    
    if (!tenantSnapshot.exists()) {
      return NextResponse.json(
        { error: `Tenant "${tenantId}" no encontrado` },
        { status: 404 }
      )
    }
    
    const data = tenantSnapshot.data()
    let config: Config
    
    // Parsear la configuración
    if (data.data && typeof data.data === 'string') {
      try {
        config = JSON.parse(data.data) as Config
      } catch (parseError) {
        console.error('Error parsing config:', parseError)
        return NextResponse.json(
          { error: 'Error parsing tenant configuration' },
          { status: 500 }
        )
      }
    } else {
      config = data as Config
    }
    
    const tenantInfo = {
      id: tenantId,
      name: data.name || tenantId,
      domain: data.domain || 'N/A',
      isActive: data.isActive !== false,
      lastModified: data.lastModified || new Date().toISOString(),
      config
    }
    
    console.log('✅ Super Admin: Configuración obtenida para tenant:', tenantId)
    
    return NextResponse.json({ 
      success: true, 
      tenant: tenantInfo
    })
  } catch (error) {
    console.error('❌ Error getting tenant:', error)
    return NextResponse.json(
      { 
        error: 'Error getting tenant',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// PUT - Actualizar configuración de un tenant
export async function PUT(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const { tenantId } = params
    const config: Config = await request.json()
    
    console.log('💾 Super Admin: Actualizando configuración del tenant:', tenantId)
    
    const tenantDoc = firestoreDoc(db, 'config', tenantId)
    const tenantSnapshot = await firestoreGetDoc(tenantDoc)
    
    if (!tenantSnapshot.exists()) {
      return NextResponse.json(
        { error: `Tenant "${tenantId}" no encontrado` },
        { status: 404 }
      )
    }
    
    const existingData = tenantSnapshot.data()
    
    // Actualizar solo la configuración, manteniendo los metadatos
    await firestoreSetDoc(tenantDoc, {
      ...existingData,
      data: JSON.stringify(config),
      lastModified: new Date().toISOString()
    })
    
    console.log('✅ Super Admin: Configuración actualizada para tenant:', tenantId)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Tenant configuration updated successfully',
      tenant: tenantId
    })
  } catch (error) {
    console.error('❌ Error updating tenant:', error)
    return NextResponse.json(
      { 
        error: 'Error updating tenant',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar un tenant
export async function DELETE(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const { tenantId } = params
    console.log('🗑️ Super Admin: Eliminando tenant:', tenantId)
    
    const tenantDoc = firestoreDoc(db, 'config', tenantId)
    const tenantSnapshot = await firestoreGetDoc(tenantDoc)
    
    if (!tenantSnapshot.exists()) {
      return NextResponse.json(
        { error: `Tenant "${tenantId}" no encontrado` },
        { status: 404 }
      )
    }
    
    // Eliminar el documento del tenant
    await firestoreDeleteDoc(tenantDoc)
    
    console.log('✅ Super Admin: Tenant eliminado:', tenantId)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Tenant deleted successfully',
      tenant: tenantId
    })
  } catch (error) {
    console.error('❌ Error deleting tenant:', error)
    return NextResponse.json(
      { 
        error: 'Error deleting tenant',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
