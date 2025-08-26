const { initializeApp } = require('firebase/app')
const { getFirestore, doc, getDoc, setDoc } = require('firebase/firestore')

// Configuración de Firebase (usar las mismas variables que en el proyecto)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

async function debugAdminEditing() {
  console.log('🔍 Iniciando diagnóstico del sistema de edición admin...\n')

  // 1. Verificar configuración de Firebase
  console.log('1️⃣ Verificando configuración de Firebase...')
  if (!firebaseConfig.apiKey) {
    console.log('❌ NEXT_PUBLIC_FIREBASE_API_KEY no está configurada')
    return
  }
  if (!firebaseConfig.projectId) {
    console.log('❌ NEXT_PUBLIC_FIREBASE_PROJECT_ID no está configurada')
    return
  }
  console.log('✅ Configuración de Firebase encontrada')

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

  // 3. Verificar tenant ID
  console.log('\n3️⃣ Verificando tenant ID...')
  const host = process.env.HOST || 'localhost:3000'
  console.log('Host detectado:', host)
  
  // Mapeo de dominios a tenant IDs
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
  
  console.log('Tenant ID detectado:', tenantId)

  // 4. Verificar documento en Firestore
  console.log('\n4️⃣ Verificando documento en Firestore...')
  try {
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    const configDoc = doc(db, 'config', tenantId)
    const configSnapshot = await getDoc(configDoc)
    
    if (configSnapshot.exists()) {
      const data = configSnapshot.data()
      console.log('✅ Documento encontrado en Firestore')
      console.log('📄 Estructura del documento:', Object.keys(data))
      
      if (data.data && typeof data.data === 'string') {
        try {
          const config = JSON.parse(data.data)
          console.log('✅ Configuración JSON válida')
          console.log('📋 Título del sitio:', config.site?.title)
          console.log('📋 Tagline:', config.site?.tagline)
        } catch (parseError) {
          console.log('❌ Error parseando JSON:', parseError.message)
        }
      } else {
        console.log('⚠️ Los datos no están en formato JSON string')
        console.log('📄 Datos directos:', data)
      }
    } else {
      console.log('⚠️ Documento no encontrado en Firestore')
      console.log('📝 Creando documento de prueba...')
      
      const testConfig = {
        site: {
          title: "Sitio de Prueba",
          tagline: "Descripción de prueba"
        },
        integrations: {
          calendlyUrl: "https://calendly.com/test/sesion",
          hotmartBaseUrl: "https://pay.hotmart.com"
        }
      }
      
      const dataToSave = { data: JSON.stringify(testConfig) }
      await setDoc(configDoc, dataToSave)
      console.log('✅ Documento de prueba creado')
    }
  } catch (error) {
    console.log('❌ Error accediendo a Firestore:', error.message)
    console.log('🔍 Detalles del error:', {
      name: error.name,
      code: error.code,
      stack: error.stack
    })
  }

  // 5. Verificar permisos de Firestore
  console.log('\n5️⃣ Verificando permisos de Firestore...')
  console.log('📋 Reglas recomendadas para Firestore:')
  console.log(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /config/{document} {
      allow read, write: if true;
    }
    match /backups/{document} {
      allow read, write: if true;
    }
    match /tenants/{document} {
      allow read, write: if true;
    }
  }
}
  `)

  // 6. Verificar variables de entorno
  console.log('\n6️⃣ Verificando variables de entorno...')
  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ]
  
  requiredEnvVars.forEach(varName => {
    const value = process.env[varName]
    if (value) {
      console.log(`✅ ${varName}: ${value.substring(0, 10)}...`)
    } else {
      console.log(`❌ ${varName}: No configurada`)
    }
  })

  // 7. Recomendaciones
  console.log('\n7️⃣ Recomendaciones para solucionar problemas:')
  console.log(`
🔧 Pasos para solucionar problemas de edición:

1. Verificar autenticación:
   - Ir a /admin y hacer login con admin/admin123
   - Verificar que el botón flotante aparezca en la esquina inferior izquierda

2. Activar modo admin:
   - Hacer clic en el botón "Admin" flotante
   - O usar el atajo Ctrl+Shift+A (solo si está autenticado)

3. Verificar Firebase:
   - Asegurar que las reglas de Firestore permitan lectura/escritura
   - Verificar que el proyecto esté activo en Firebase Console

4. Verificar consola del navegador:
   - Abrir DevTools (F12)
   - Buscar errores en la consola
   - Verificar logs de guardado

5. Probar edición:
   - Hacer clic en cualquier texto editable
   - Cambiar el contenido
   - Hacer clic en el botón de guardar (✓)
   - Verificar que aparezca "Guardando..." y luego "Guardado"

6. Si persiste el problema:
   - Usar el botón "Refrescar configuración" (🔄)
   - O usar "Forzar recarga completa" (🔄 naranja)
   - Verificar que los cambios se reflejen en Firebase Console
  `)

  console.log('\n✅ Diagnóstico completado')
}

// Ejecutar el diagnóstico
debugAdminEditing().catch(console.error)
