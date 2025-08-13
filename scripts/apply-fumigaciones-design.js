const { initializeApp } = require('firebase/app')
const { getFirestore, doc, getDoc, setDoc } = require('firebase/firestore')
const fs = require('fs')
const path = require('path')

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function applyFumigacionesDesign() {
  console.log('🎨 Iniciando aplicación del diseño de fumigaciones...')
  
  try {
    // Leer la configuración de fumigaciones
    const fumigacionesConfigPath = path.join(__dirname, '../public/fumigaciones-design.json')
    const fumigacionesConfig = JSON.parse(fs.readFileSync(fumigacionesConfigPath, 'utf8'))
    
    console.log('📋 Configuración de fumigaciones cargada')
    
    // Obtener tenant ID (usar un ID por defecto para pruebas)
    const tenantId = process.argv[2] || 'default-tenant'
    console.log(`🏢 Aplicando a tenant: ${tenantId}`)
    
    // Obtener configuración actual
    const configDocRef = doc(db, 'configs', tenantId)
    const configDoc = await getDoc(configDocRef)
    
    let currentConfig = {}
    if (configDoc.exists()) {
      currentConfig = configDoc.data()
      console.log('📋 Configuración actual cargada')
    } else {
      console.log('📋 Creando nueva configuración')
    }
    
    // Fusionar configuraciones
    const newConfig = {
      ...currentConfig,
      ...fumigacionesConfig,
      selectedDesigns: {
        ...currentConfig.selectedDesigns,
        landing: 'fumigaciones'
      }
    }
    
    console.log('🔧 Aplicando configuración de fumigaciones...')
    console.log(`📋 Diseños seleccionados: ${JSON.stringify(newConfig.selectedDesigns)}`)
    
    // Guardar configuración
    await setDoc(configDocRef, newConfig, { merge: true })
    
    console.log('✅ Configuración de fumigaciones aplicada exitosamente')
    console.log('🎯 Elementos editables habilitados:')
    console.log('   - Información de contacto de emergencia')
    console.log('   - Enlaces de redes sociales')
    console.log('   - Textos de navegación')
    console.log('   - Contenido del hero')
    console.log('   - Títulos y descripciones de secciones')
    console.log('   - Lista de tipos de plagas')
    console.log('   - Pasos de trabajo')
    console.log('   - Botones y enlaces')
    console.log('   - Imágenes')
    console.log('   - Footer completo')
    
    // Verificar que se guardó correctamente
    const savedConfigDoc = await getDoc(configDocRef)
    if (savedConfigDoc.exists()) {
      const savedConfig = savedConfigDoc.data()
      console.log('✅ Verificación exitosa:')
      console.log(`   - Diseño seleccionado: ${savedConfig.selectedDesigns?.landing}`)
      console.log(`   - Título del sitio: ${savedConfig.site?.title}`)
      console.log(`   - Configuración de fumigaciones: ${savedConfig.fumigaciones ? 'Presente' : 'Faltante'}`)
      
      if (savedConfig.selectedDesigns?.landing === 'fumigaciones') {
        console.log('🎉 ¡Diseño de fumigaciones aplicado correctamente!')
        console.log('📱 Ahora puedes visitar la página para ver el layout completamente editable')
        console.log('🔧 Todos los elementos son editables desde el modo administrador')
      } else {
        throw new Error('El diseño de fumigaciones no se configuró correctamente')
      }
    }
    
  } catch (error) {
    console.error('❌ Error al aplicar el diseño de fumigaciones:', error)
    process.exit(1)
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  applyFumigacionesDesign()
}

module.exports = { applyFumigacionesDesign }
