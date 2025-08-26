const { initializeApp } = require('firebase/app')
const { getFirestore, doc, getDoc, setDoc } = require('firebase/firestore')

// Función para obtener tenant ID
function getTenantId() {
  const host = process.env.HOST || 'localhost:3000'
  
  const domainToTenant = {
    'localhost:3000': 'default',
    'landing-six-gold.vercel.app': 'gold',
    'marcamia.com': 'marcamia',
    'tumarca.com': 'tumarca',
    'controldoc.app': 'controldoc',
  }
  
  let tenantId = domainToTenant[host]
  if (!tenantId) {
    if (host.includes('.vercel.app')) {
      const parts = host.split('.')
      if (parts.length >= 3) {
        const firstPart = parts[0]
        if (firstPart.includes('-')) {
          tenantId = firstPart.split('-')[0]
        } else {
          tenantId = firstPart
        }
      }
    } else {
      const subdomain = host.split('.')[0]
      tenantId = subdomain && subdomain !== 'www' ? subdomain : host.replace(/[^a-zA-Z0-9]/g, '-')
    }
  }
  
  return tenantId
}

async function testAdminSave() {
  console.log('🧪 Probando sistema de guardado de ediciones...\n')

  // 1. Cargar variables de entorno
  console.log('1️⃣ Cargando variables de entorno...')
  require('dotenv').config({ path: '.env.local' })
  
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  }

  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.log('❌ Variables de entorno de Firebase no configuradas')
    return
  }

  console.log('✅ Variables de entorno cargadas')
  console.log('📋 Project ID:', firebaseConfig.projectId)

  // 2. Inicializar Firebase
  console.log('\n2️⃣ Inicializando Firebase...')
  try {
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    console.log('✅ Firebase inicializado correctamente')
  } catch (error) {
    console.log('❌ Error inicializando Firebase:', error.message)
    return
  }

  // 3. Obtener tenant ID
  console.log('\n3️⃣ Obteniendo tenant ID...')
  const tenantId = getTenantId()
  console.log('📋 Tenant ID:', tenantId)

  // 4. Verificar documento actual
  console.log('\n4️⃣ Verificando documento actual...')
  try {
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    const configDoc = doc(db, 'config', tenantId)
    const configSnapshot = await getDoc(configDoc)
    
    if (configSnapshot.exists()) {
      const data = configSnapshot.data()
      console.log('✅ Documento encontrado')
      
      if (data.data && typeof data.data === 'string') {
        try {
          const config = JSON.parse(data.data)
          console.log('✅ Configuración JSON válida')
          console.log('📋 Título actual:', config.site?.title)
          console.log('📋 Tagline actual:', config.site?.tagline)
        } catch (parseError) {
          console.log('❌ Error parseando JSON:', parseError.message)
        }
      } else {
        console.log('⚠️ Los datos no están en formato JSON string')
        console.log('📄 Estructura:', Object.keys(data))
      }
    } else {
      console.log('⚠️ Documento no encontrado, creando uno nuevo...')
    }
  } catch (error) {
    console.log('❌ Error accediendo a Firestore:', error.message)
    return
  }

  // 5. Probar guardado
  console.log('\n5️⃣ Probando guardado...')
  try {
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    const configDoc = doc(db, 'config', tenantId)
    
    // Configuración de prueba
    const testConfig = {
      site: {
        title: "Sitio de Prueba - " + new Date().toISOString(),
        tagline: "Descripción de prueba actualizada"
      },
      integrations: {
        calendlyUrl: "https://calendly.com/test/sesion",
        hotmartBaseUrl: "https://pay.hotmart.com"
      },
      sessions: [
        {
          id: "sesion-claridad",
          name: "Sesión de Claridad",
          summary: "Define tu objetivo y el plan inmediato de 30 días.",
          duration: "60 min",
          price: "€99",
          features: [
            "Diagnóstico inicial y mapa de objetivos",
            "Prioridades y plan de acción",
            "Seguimiento por email 7 días"
          ],
          hotmartUrl: "https://pay.hotmart.com/TU_CHECKOUT_1"
        }
      ],
      course: {
        title: "Curso Online: Sistema de Productividad Sencilla",
        blurb: "Aprende a construir un sistema ligero para enfocarte, priorizar con calma y avanzar cada semana sin fricción.",
        price: "€179",
        hotmartUrl: "https://pay.hotmart.com/TU_CHECKOUT_CURSO",
        videoUrl: "",
        bullets: [
          "Estructura de planificación semanal en 30 minutos",
          "Métricas simples para medir progreso",
          "Plantillas reutilizables y ejemplos",
          "Casos prácticos y ejercicios guiados"
        ]
      },
      about: {
        photoUrl: "/placeholder.svg?height=520&width=420",
        videoUrl: "",
        story: "Soy [Tu Nombre], consultor y coach con X años ayudando a profesionales a ganar claridad, enfocarse y ejecutar con calma.",
        whyMe: "He acompañado a +300 clientes en sectores diversos."
      },
      testimonials: [
        {
          quote: "En dos sesiones definimos un plan claro y recuperé la motivación.",
          author: "María G.",
          role: "Marketing Specialist"
        }
      ],
      contact: {
        email: "hola@tumarca.com"
      },
      legal: {
        termsUrl: "",
        privacyUrl: ""
      }
    }
    
    const dataToSave = { data: JSON.stringify(testConfig) }
    console.log('💾 Guardando configuración de prueba...')
    
    await setDoc(configDoc, dataToSave)
    console.log('✅ Configuración guardada exitosamente')
    
    // Verificar que se guardó
    const verifySnapshot = await getDoc(configDoc)
    if (verifySnapshot.exists()) {
      const savedData = verifySnapshot.data()
      if (savedData.data) {
        const savedConfig = JSON.parse(savedData.data)
        console.log('✅ Verificación exitosa')
        console.log('📋 Título guardado:', savedConfig.site?.title)
        console.log('📋 Tagline guardada:', savedConfig.site?.tagline)
      }
    }
    
  } catch (error) {
    console.log('❌ Error guardando configuración:', error.message)
    console.log('🔍 Detalles del error:', {
      name: error.name,
      code: error.code,
      stack: error.stack
    })
  }

  // 6. Probar API endpoint
  console.log('\n6️⃣ Probando API endpoint...')
  try {
    const response = await fetch('http://localhost:3000/api/config', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ API endpoint funciona')
      console.log('📋 Título desde API:', data.site?.title)
    } else {
      console.log('❌ Error en API endpoint:', response.status, response.statusText)
    }
  } catch (error) {
    console.log('❌ Error probando API endpoint:', error.message)
    console.log('💡 Asegúrate de que el servidor esté corriendo (npm run dev)')
  }

  // 7. Análisis del problema
  console.log('\n7️⃣ Análisis del problema de edición...')
  console.log(`
🔍 BASADO EN LA PRUEBA:

Si la prueba de guardado fue exitosa, el problema puede estar en:

1. 🔄 SINCRONIZACIÓN DEL CONTEXTO:
   - El contexto de React puede no estar sincronizado
   - Los cambios se guardan en Firebase pero no se reflejan en la UI
   - Solución: Usar el botón "Refrescar configuración"

2. 🎯 MODO ADMIN NO ACTIVADO:
   - El modo admin debe estar activado para editar
   - Verificar que aparezca el botón flotante
   - Verificar que esté autenticado

3. 📝 COMPONENTES NO EDITABLES:
   - No todos los elementos son editables
   - Solo los que usan componentes EditableText, EditableImage, etc.
   - Verificar que el elemento tenga el componente editable

4. 🔐 AUTENTICACIÓN EXPIRADA:
   - La sesión de admin expira después de 24 horas
   - Hacer login nuevamente en /admin

5. 🌐 PROBLEMA DE RED:
   - Firebase puede tener problemas de conectividad
   - Verificar conexión a internet
   - Verificar que Firebase esté activo

SOLUCIONES ESPECÍFICAS:

1. 🔄 REFRESCAR CONFIGURACIÓN:
   - Usar el botón "Refrescar configuración" (🔄)
   - O usar "Forzar recarga completa" (🔄 naranja)

2. 🧪 PROBAR EDICIÓN PASO A PASO:
   a) Ir a http://localhost:3000/admin
   b) Login con admin/admin123
   c) Verificar que aparezca el botón flotante
   d) Hacer clic en "Admin" para activar modo admin
   e) Buscar texto editable (debe tener hover verde)
   f) Hacer clic en el texto para editar
   g) Cambiar el contenido
   h) Hacer clic en ✓ para guardar
   i) Verificar que aparezca "Guardando..." y luego "Guardado"

3. 🔍 VERIFICAR CONSOLA:
   - Abrir DevTools (F12)
   - Buscar errores de Firebase
   - Verificar logs de guardado
   - Buscar errores de red

4. 📱 VERIFICAR ELEMENTOS EDITABLES:
   - Solo los elementos con componentes EditableText son editables
   - Deben mostrar hover verde en modo admin
   - Deben tener el ícono de edición (✏️)
  `)

  console.log('\n✅ Prueba completada')
}

// Ejecutar la prueba
testAdminSave().catch(console.error)
