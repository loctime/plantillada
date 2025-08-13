require('dotenv').config({ path: '.env.local' })

function verifyCloudinaryConfig() {
  console.log('🔍 Verificando configuración de Cloudinary...\n')

  const requiredVars = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY', 
    'CLOUDINARY_API_SECRET'
  ]

  let allConfigured = true

  console.log('📋 Variables de entorno requeridas:')
  
  requiredVars.forEach(varName => {
    const value = process.env[varName]
    if (value) {
      console.log(`   ✅ ${varName}: ${value.substring(0, 10)}...`)
    } else {
      console.log(`   ❌ ${varName}: NO CONFIGURADA`)
      allConfigured = false
    }
  })

  console.log()

  if (allConfigured) {
    console.log('✅ Todas las variables están configuradas')
    console.log('🚀 La API de upload debería funcionar correctamente')
    
    console.log('\n📝 Próximos pasos:')
    console.log('   1. Instala las dependencias: npm install')
    console.log('   2. Inicia el servidor: npm run dev')
    console.log('   3. Prueba la API: node scripts/test-upload-api.js')
    console.log('   4. Usa el modo admin para subir imágenes')
  } else {
    console.log('❌ Faltan variables de entorno')
    console.log('\n🔧 Para configurar Cloudinary:')
    console.log('   1. Ve a https://cloudinary.com/')
    console.log('   2. Crea una cuenta gratuita')
    console.log('   3. Ve a Dashboard > Settings > Access Keys')
    console.log('   4. Copia Cloud Name, API Key y API Secret')
    console.log('   5. Agrega las variables a tu archivo .env.local:')
    console.log('\n   CLOUDINARY_CLOUD_NAME=tu_cloud_name')
    console.log('   CLOUDINARY_API_KEY=tu_api_key')
    console.log('   CLOUDINARY_API_SECRET=tu_api_secret')
  }
}

verifyCloudinaryConfig()
