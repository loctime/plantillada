const fs = require('fs')
const path = require('path')

// Leer la configuración actual del archivo JSON
const configPath = path.join(process.cwd(), 'public', 'config.json')

try {
  const configData = fs.readFileSync(configPath, 'utf8')
  const config = JSON.parse(configData)
  
  console.log('✅ Configuración actual cargada exitosamente')
  
  console.log('\n📋 Para migrar a Firestore:')
  console.log('1. Ve a Firebase Console > Firestore Database')
  console.log('2. Crea una colección llamada "config"')
  console.log('3. Crea un documento con ID "site"')
  console.log('4. Copia y pega el siguiente JSON:')
  console.log('\n' + JSON.stringify(config, null, 2))
  
  console.log('\n🔧 Después de migrar:')
  console.log('1. Configura las variables de entorno en .env.local')
  console.log('2. Agrega las variables en tu plataforma de hosting')
  console.log('3. Prueba la funcionalidad en /admin')
  
} catch (error) {
  console.error('❌ Error leyendo config.json:', error.message)
  console.log('📝 No hay configuración existente para migrar.')
}
