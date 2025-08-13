const fs = require('fs')
const path = require('path')
const FormData = require('form-data')

async function testUploadAPI() {
  console.log('🧪 Probando API de Upload...\n')

  // Verificar que existe un archivo de prueba
  const testImagePath = path.join(__dirname, '../public/placeholder.jpg')
  
  if (!fs.existsSync(testImagePath)) {
    console.log('❌ No se encontró archivo de prueba en public/placeholder.jpg')
    console.log('💡 Crea un archivo de imagen en public/placeholder.jpg para probar')
    return
  }

  try {
    // Crear FormData
    const formData = new FormData()
    formData.append('file', fs.createReadStream(testImagePath))

    console.log('📤 Subiendo archivo de prueba...')

    // Hacer request a la API
    const response = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData
    })

    const data = await response.json()

    if (response.ok) {
      console.log('✅ Upload exitoso!')
      console.log('📊 Datos de respuesta:')
      console.log(`   URL: ${data.url}`)
      console.log(`   Public ID: ${data.publicId}`)
      console.log(`   Dimensiones: ${data.width}x${data.height}`)
      console.log(`   Formato: ${data.format}`)
      console.log(`   Tamaño: ${data.size} bytes`)
      console.log(`   Mensaje: ${data.message}`)
    } else {
      console.log('❌ Error en upload:')
      console.log(`   Status: ${response.status}`)
      console.log(`   Error: ${data.error}`)
      if (data.details) {
        console.log(`   Detalles: ${data.details}`)
      }
    }

  } catch (error) {
    console.log('❌ Error de conexión:')
    console.log(`   ${error.message}`)
    console.log('\n💡 Asegúrate de que:')
    console.log('   1. El servidor esté corriendo (npm run dev)')
    console.log('   2. Las variables de entorno de Cloudinary estén configuradas')
    console.log('   3. Tengas conexión a internet')
  }
}

// Ejecutar prueba
testUploadAPI()
