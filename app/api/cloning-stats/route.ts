import { NextResponse } from 'next/server'

interface CloningStats {
  totalProducts: number
  successfulClones: number
  failedClones: number
  averageProcessingTime: number
  imagesProcessed: number
  storageUsed: number
  lastClonedAt: string
  topCategories: Array<{ name: string; count: number }>
  recentActivity: Array<{
    id: string
    action: string
    timestamp: string
    details: string
  }>
}

// Mock data - en producción vendría de Firebase
const mockStats: CloningStats = {
  totalProducts: 15,
  successfulClones: 14,
  failedClones: 1,
  averageProcessingTime: 2.5,
  imagesProcessed: 42,
  storageUsed: 15.2,
  lastClonedAt: new Date().toISOString(),
  topCategories: [
    { name: 'Electrónicos', count: 6 },
    { name: 'Ropa', count: 4 },
    { name: 'Hogar', count: 3 },
    { name: 'Deportes', count: 2 }
  ],
  recentActivity: [
    {
      id: '1',
      action: 'product_cloned',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutos atrás
      details: 'Producto "Smartphone XYZ" clonado desde amazon.com'
    },
    {
      id: '2',
      action: 'product_cloned',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutos atrás
      details: 'Producto "Camiseta Deportiva" clonado desde nike.com'
    },
    {
      id: '3',
      action: 'clone_failed',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutos atrás
      details: 'Error al clonar producto desde sitio no accesible'
    }
  ]
}

export async function GET() {
  try {
    // En producción, aquí obtendrías las estadísticas reales de Firebase
    // Por ahora retornamos datos mock
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return NextResponse.json({
      success: true,
      stats: mockStats,
      message: 'Estadísticas obtenidas exitosamente'
    })

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error)
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { action, details } = await request.json()

    // En producción, aquí registrarías la actividad en Firebase
    console.log('Nueva actividad de clonación:', { action, details, timestamp: new Date() })

    return NextResponse.json({
      success: true,
      message: 'Actividad registrada exitosamente'
    })

  } catch (error) {
    console.error('Error registrando actividad:', error)
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
