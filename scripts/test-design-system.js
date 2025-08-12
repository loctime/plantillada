const { initializeApp } = require('firebase/app')
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore')

// Configuración de Firebase (ajusta según tu configuración)
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

async function testDesignSystem() {
  console.log('🎨 Probando sistema de diseños...')
  
  const tenantId = 'default'
  const configDoc = doc(db, 'config', tenantId)
  
  // Configuración de prueba con diseños
  const testConfig = {
    site: {
      title: "Test Design System",
      tagline: "Probando el sistema de diseños"
    },
    selectedTemplates: ['landing', 'shop'],
    selectedDesigns: {
      landing: 'estudio-contable',
      shop: 'tech-shop'
    },
    integrations: {
      calendlyUrl: "https://calendly.com/test/sesion",
      hotmartBaseUrl: "https://pay.hotmart.com"
    },
    sessions: [
      {
        id: "sesion-test",
        name: "Sesión de Prueba",
        summary: "Sesión para probar el sistema de diseños.",
        duration: "60 min",
        price: "€99",
        features: [
          "Prueba de diseño",
          "Configuración visual",
          "Personalización"
        ],
        hotmartUrl: "https://pay.hotmart.com/TEST"
      }
    ],
    course: {
      title: "Curso de Prueba",
      blurb: "Curso para probar el sistema de diseños.",
      price: "€179",
      hotmartUrl: "https://pay.hotmart.com/TEST_CURSO",
      videoUrl: "",
      bullets: [
        "Prueba de diseño",
        "Configuración visual",
        "Personalización"
      ]
    },
    about: {
      photoUrl: "/placeholder.svg?height=520&width=420",
      videoUrl: "",
      story: "Historia de prueba para el sistema de diseños.",
      whyMe: "Experiencia en pruebas de diseño."
    },
    testimonials: [
      {
        quote: "El sistema de diseños funciona perfectamente.",
        author: "Test User",
        role: "Tester"
      }
    ],
    contact: {
      email: "test@example.com"
    },
    legal: {
      termsUrl: "",
      privacyUrl: ""
    }
  }
  
  try {
    // Guardar configuración de prueba
    await setDoc(configDoc, { data: JSON.stringify(testConfig) })
    console.log('✅ Configuración de prueba guardada')
    
    // Verificar que se guardó correctamente
    const configSnapshot = await getDoc(configDoc)
    if (configSnapshot.exists()) {
      const data = configSnapshot.data()
      const config = JSON.parse(data.data)
      console.log('📋 Configuración cargada:')
      console.log('  - Plantillas seleccionadas:', config.selectedTemplates)
      console.log('  - Diseños seleccionados:', config.selectedDesigns)
      console.log('  - Título del sitio:', config.site.title)
    }
    
    console.log('🎨 Sistema de diseños probado exitosamente')
    console.log('📝 Para probar:')
    console.log('  1. Ve a /admin')
    console.log('  2. Inicia sesión con admin/admin123')
    console.log('  3. Ve a la pestaña "General"')
    console.log('  4. Haz clic en "Seleccionar Diseño"')
    console.log('  5. Selecciona diferentes diseños para cada plantilla')
    
  } catch (error) {
    console.error('❌ Error probando sistema de diseños:', error)
  }
}

// Ejecutar la prueba
testDesignSystem()
