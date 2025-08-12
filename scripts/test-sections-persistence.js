// Configurar Firebase para Node.js
const { initializeApp } = require('firebase/app')
const { getFirestore, doc, getDoc, setDoc } = require('firebase/firestore')

// Cargar variables de entorno
require('dotenv').config()

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

console.log('🔥 Configuración Firebase:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain
})

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function testSectionsPersistence() {
  try {
    console.log('🧪 Probando persistencia de secciones...')
    
    // Obtener configuración actual
    const tenantId = 'default' // o el tenant que quieras probar
    const configDoc = doc(db, 'config', tenantId)
    const configSnapshot = await getDoc(configDoc)
    
    if (configSnapshot.exists()) {
      const data = configSnapshot.data()
      let config
      
      if (data.data && typeof data.data === 'string') {
        config = JSON.parse(data.data)
      } else {
        config = data
      }
      
      console.log('📋 Configuración actual cargada')
      console.log('📋 Título del sitio:', config.site?.title)
      console.log('📋 Secciones existentes:', config.sections?.length || 0)
      
      if (config.sections) {
        config.sections.forEach((section, index) => {
          console.log(`  ${index + 1}. ${section.title} (${section.type || 'sin tipo'}) - Visible: ${section.visible}`)
        })
      }
      
      // Agregar una sección de prueba
      const testSection = {
        id: 'test-linkhub',
        title: 'Link Hub de Prueba',
        visible: true,
        description: 'Sección de prueba para Link Hub',
        type: 'linkhub',
        content: {
          title: 'Mis Enlaces',
          description: 'Encuentra todos mis enlaces importantes',
          backgroundColor: 'transparent',
          textColor: 'inherit'
        }
      }
      
      // Agregar la sección si no existe
      if (!config.sections) {
        config.sections = []
      }
      
      const existingIndex = config.sections.findIndex(s => s.id === testSection.id)
      if (existingIndex >= 0) {
        config.sections[existingIndex] = testSection
        console.log('🔄 Sección de prueba actualizada')
      } else {
        config.sections.push(testSection)
        console.log('➕ Sección de prueba agregada')
      }
      
      // Guardar configuración actualizada
      const dataToSave = { data: JSON.stringify(config) }
      await setDoc(configDoc, dataToSave)
      console.log('✅ Configuración guardada exitosamente')
      
      // Verificar que se guardó correctamente
      const verifySnapshot = await getDoc(configDoc)
      const verifyData = verifySnapshot.data()
      const verifyConfig = JSON.parse(verifyData.data)
      
      console.log('🔍 Verificación:')
      console.log('📋 Total de secciones:', verifyConfig.sections?.length || 0)
      const testSectionFound = verifyConfig.sections?.find(s => s.id === 'test-linkhub')
      if (testSectionFound) {
        console.log('✅ Sección de prueba encontrada:', testSectionFound.title)
      } else {
        console.log('❌ Sección de prueba no encontrada')
      }
      
    } else {
      console.log('📝 No existe configuración, creando una nueva...')
      
      const newConfig = {
        site: {
          title: 'Sitio de Prueba',
          tagline: 'Descripción de prueba'
        },
        sections: [
          {
            id: 'test-linkhub',
            title: 'Link Hub de Prueba',
            visible: true,
            description: 'Sección de prueba para Link Hub',
            type: 'linkhub',
            content: {
              title: 'Mis Enlaces',
              description: 'Encuentra todos mis enlaces importantes',
              backgroundColor: 'transparent',
              textColor: 'inherit'
            }
          }
        ],
        integrations: {
          calendlyUrl: "https://calendly.com/tu-usuario/sesion",
          hotmartBaseUrl: "https://pay.hotmart.com"
        }
      }
      
      const dataToSave = { data: JSON.stringify(newConfig) }
      await setDoc(configDoc, dataToSave)
      console.log('✅ Nueva configuración creada con sección de prueba')
    }
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error)
    console.error('🔍 Detalles del error:', error.message)
  }
}

// Ejecutar la prueba
testSectionsPersistence()
  .then(() => {
    console.log('🏁 Prueba completada')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error)
    process.exit(1)
  })
