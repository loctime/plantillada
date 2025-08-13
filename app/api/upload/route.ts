import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Tipos de archivo permitidos
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml'
]

// Tamaño máximo (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    // Verificar que Cloudinary esté configurado
    if (!process.env.CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: 'Cloudinary no está configurado' },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      )
    }

    // Validar tipo de archivo
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { 
          error: 'Tipo de archivo no permitido',
          allowedTypes: ALLOWED_TYPES,
          receivedType: file.type
        },
        { status: 400 }
      )
    }

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          error: 'Archivo demasiado grande',
          maxSize: MAX_FILE_SIZE,
          receivedSize: file.size
        },
        { status: 400 }
      )
    }

    // Convertir archivo a buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Subir a Cloudinary con optimización automática
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'plantillada',
          resource_type: 'auto',
          transformation: [
            { quality: 'auto:good' }, // Optimización automática
            { fetch_format: 'auto' }   // Formato automático (WebP si es soportado)
          ],
          public_id: `${Date.now()}_${file.name.replace(/\.[^/.]+$/, '')}` // Nombre único
        },
        (error, result) => {
          if (error) {
            console.error('Error en Cloudinary:', error)
            reject(new Error('Error al subir archivo a Cloudinary'))
          } else {
            resolve(result)
          }
        }
      )

      uploadStream.end(buffer)
    })

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes,
      message: 'Archivo subido exitosamente'
    })

  } catch (error) {
    console.error('Error en upload:', error)
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

// Configurar límites para archivos grandes
export const config = {
  api: {
    bodyParser: false,
  },
}
