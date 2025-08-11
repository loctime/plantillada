const fs = require('fs')
const path = require('path')

// Leer la configuración actual del archivo JSON
const configPath = path.join(process.cwd(), 'public', 'config.json')

try {
  const configData = fs.readFileSync(configPath, 'utf8')
  const config = JSON.parse(configData)
  
  console.log('✅ Configuración actual cargada exitosamente')
  console.log('\n📋 CAMPOS PARA CREAR EN FIRESTORE:')
  console.log('=====================================')
  
  // Función para analizar y mostrar campos
  function analyzeFields(obj, prefix = '') {
    for (const [key, value] of Object.entries(obj)) {
      const fieldPath = prefix ? `${prefix}.${key}` : key
      
      if (Array.isArray(value)) {
        console.log(`📝 Campo: ${fieldPath}`)
        console.log(`   Tipo: array`)
        console.log(`   Valor: [${value.length} elementos]`)
        if (value.length > 0 && typeof value[0] === 'object') {
          console.log(`   ⚠️  Array de objetos - crear como map`)
        }
        console.log('')
      } else if (typeof value === 'object' && value !== null) {
        console.log(`📝 Campo: ${fieldPath}`)
        console.log(`   Tipo: map`)
        console.log(`   Valor: objeto con ${Object.keys(value).length} propiedades`)
        console.log('')
        analyzeFields(value, fieldPath)
      } else {
        console.log(`📝 Campo: ${fieldPath}`)
        console.log(`   Tipo: ${typeof value}`)
        console.log(`   Valor: ${value}`)
        console.log('')
      }
    }
  }
  
  analyzeFields(config)
  
  console.log('🔧 INSTRUCCIONES PASO A PASO:')
  console.log('==============================')
  console.log('1. En Firebase Console > Firestore Database')
  console.log('2. Crea colección: "config"')
  console.log('3. Crea documento con ID: "site"')
  console.log('4. Agrega los campos en este orden:')
  console.log('')
  
  // Mostrar orden de creación
  const fieldOrder = [
    'site',
    'site.title',
    'site.tagline',
    'integrations',
    'integrations.calendlyUrl',
    'integrations.hotmartBaseUrl',
    'sessions',
    'course',
    'course.title',
    'course.blurb',
    'course.price',
    'course.hotmartUrl',
    'course.videoUrl',
    'course.bullets',
    'about',
    'about.photoUrl',
    'about.videoUrl',
    'about.story',
    'about.whyMe',
    'testimonials',
    'contact',
    'contact.email',
    'legal',
    'legal.termsUrl',
    'legal.privacyUrl'
  ]
  
  fieldOrder.forEach((field, index) => {
    const parts = field.split('.')
    const indent = '   '.repeat(parts.length - 1)
    const fieldName = parts[parts.length - 1]
    const parentPath = parts.slice(0, -1).join('.')
    
    if (parts.length === 1) {
      console.log(`${index + 1}. ${indent}Campo: "${fieldName}"`)
      console.log(`${indent}   Tipo: map`)
    } else {
      console.log(`${index + 1}. ${indent}Campo: "${fieldName}" (dentro de "${parentPath}")`)
      console.log(`${indent}   Tipo: ${getFieldType(field, config)}`)
    }
  })
  
  console.log('')
  console.log('💡 CONSEJO: Si es muy complicado, usa el editor JSON:')
  console.log('1. Crea solo un campo llamado "data"')
  console.log('2. Tipo: map')
  console.log('3. Busca botón "JSON" o "Raw data"')
  console.log('4. Pega el JSON completo')
  
} catch (error) {
  console.error('❌ Error leyendo config.json:', error.message)
  console.log('📝 No hay configuración existente para migrar.')
}

function getFieldType(fieldPath, config) {
  const parts = fieldPath.split('.')
  let value = config
  
  for (const part of parts) {
    if (value && typeof value === 'object' && part in value) {
      value = value[part]
    } else {
      return 'unknown'
    }
  }
  
  if (Array.isArray(value)) {
    return 'array'
  } else if (typeof value === 'object' && value !== null) {
    return 'map'
  } else {
    return typeof value
  }
}
