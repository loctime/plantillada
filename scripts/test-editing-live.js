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

async function testEditingLive() {
  console.log('🧪 Probando edición en vivo con servidor corriendo...\n')

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

  console.log('✅ Variables de entorno cargadas')
  console.log('📋 Project ID:', firebaseConfig.projectId)

  // 2. Probar API endpoint
  console.log('\n2️⃣ Probando API endpoint...')
  try {
    const response = await fetch('http://localhost:3000/api/config', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ API endpoint funciona correctamente')
      console.log('📋 Título actual:', data.site?.title)
      console.log('📋 Tagline actual:', data.site?.tagline)
      console.log('📋 Productos:', data.products?.length || 0)
    } else {
      console.log('❌ Error en API endpoint:', response.status, response.statusText)
      const errorText = await response.text()
      console.log('📄 Error details:', errorText)
    }
  } catch (error) {
    console.log('❌ Error probando API endpoint:', error.message)
    console.log('💡 Asegúrate de que el servidor esté corriendo (npm run dev)')
  }

  // 3. Probar guardado vía API
  console.log('\n3️⃣ Probando guardado vía API...')
  try {
    const testConfig = {
      site: {
        title: "Sitio de Prueba - " + new Date().toISOString(),
        tagline: "Descripción de prueba actualizada vía API"
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

    const saveResponse = await fetch('http://localhost:3000/api/config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testConfig)
    })
    
    if (saveResponse.ok) {
      const saveData = await saveResponse.json()
      console.log('✅ Guardado vía API exitoso')
      console.log('📋 Respuesta:', saveData)
    } else {
      console.log('❌ Error guardando vía API:', saveResponse.status, saveResponse.statusText)
      const errorText = await saveResponse.text()
      console.log('📄 Error details:', errorText)
    }
  } catch (error) {
    console.log('❌ Error probando guardado vía API:', error.message)
  }

  // 4. Verificar cambios en Firebase
  console.log('\n4️⃣ Verificando cambios en Firebase...')
  try {
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    const tenantId = getTenantId()
    const configDoc = doc(db, 'config', tenantId)
    const configSnapshot = await getDoc(configDoc)
    
    if (configSnapshot.exists()) {
      const data = configSnapshot.data()
      if (data.data && typeof data.data === 'string') {
        const config = JSON.parse(data.data)
        console.log('✅ Configuración en Firebase actualizada')
        console.log('📋 Título en Firebase:', config.site?.title)
        console.log('📋 Tagline en Firebase:', config.site?.tagline)
      }
    }
  } catch (error) {
    console.log('❌ Error verificando Firebase:', error.message)
  }

  // 5. Instrucciones para el usuario
  console.log('\n5️⃣ Instrucciones para probar edición en el navegador:')
  console.log(`
🎯 AHORA QUE EL SERVIDOR ESTÁ CORRIENDO:

1. 🔐 AUTENTICACIÓN:
   - Abre http://localhost:3000/admin en tu navegador
   - Login con usuario: admin, contraseña: admin123
   - Verifica que aparezca el botón flotante en la esquina inferior izquierda

2. 🎛️ ACTIVAR MODO ADMIN:
   - Haz clic en el botón "Admin" flotante
   - Debe cambiar a "Modo Admin" (fondo verde)
   - O usa el atajo Ctrl+Shift+A

3. 📝 BUSCAR ELEMENTOS EDITABLES:
   - Solo los elementos con componentes EditableText son editables
   - Deben mostrar hover verde cuando pases el mouse
   - Deben tener un ícono de edición (✏️) que aparece al hacer hover

4. ✏️ EDITAR CONTENIDO:
   - Haz clic en cualquier texto editable
   - Cambia el contenido
   - Haz clic en el botón ✓ para guardar
   - Debe aparecer "Guardando..." y luego "Guardado"

5. 🔄 VERIFICAR CAMBIOS:
   - Los cambios deben reflejarse inmediatamente
   - Si no se ven, usa el botón "Refrescar configuración" (🔄)
   - O usa "Forzar recarga completa" (🔄 naranja)

6. 🔍 VERIFICAR CONSOLA:
   - Abre DevTools (F12)
   - Busca logs de guardado
   - Verifica que no haya errores de Firebase

7. 📱 ELEMENTOS ESPECÍFICOS A PROBAR:
   - Título del sitio (site.title)
   - Tagline (site.tagline)
   - Texto de botones
   - Descripciones de sesiones
   - Testimonios
   - Información de contacto

8. 🚨 SI NO FUNCIONA:
   - Verifica que estés autenticado
   - Verifica que el modo admin esté activado
   - Verifica que el elemento sea editable
   - Revisa la consola del navegador
   - Usa los botones de refrescar
  `)

  console.log('\n✅ Prueba completada')
  console.log('🌐 Servidor corriendo en: http://localhost:3000')
  console.log('🔧 Panel admin en: http://localhost:3000/admin')
}

// Ejecutar la prueba
testEditingLive().catch(console.error)
