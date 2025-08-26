const fs = require('fs')
const path = require('path')

function checkAdminSystem() {
  console.log('🔍 Verificando sistema de edición admin...\n')

  // 1. Verificar archivos críticos
  console.log('1️⃣ Verificando archivos críticos...')
  const criticalFiles = [
    'lib/admin-context.tsx',
    'hooks/use-admin-auth.ts',
    'components/editable-text.tsx',
    'components/admin-toggle.tsx',
    'app/api/config/route.ts',
    'lib/config-loader.ts'
  ]

  criticalFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}`)
    } else {
      console.log(`❌ ${file} - NO ENCONTRADO`)
    }
  })

  // 2. Verificar variables de entorno
  console.log('\n2️⃣ Verificando variables de entorno...')
  const envFile = '.env.local'
  if (fs.existsSync(envFile)) {
    console.log(`✅ ${envFile} encontrado`)
    const envContent = fs.readFileSync(envFile, 'utf8')
    const requiredVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
    ]
    
    requiredVars.forEach(varName => {
      if (envContent.includes(varName)) {
        console.log(`✅ ${varName} configurada`)
      } else {
        console.log(`❌ ${varName} NO configurada`)
      }
    })
  } else {
    console.log(`❌ ${envFile} NO encontrado`)
    console.log('📝 Necesitas crear este archivo con las credenciales de Firebase')
  }

  // 3. Verificar configuración de Firebase
  console.log('\n3️⃣ Verificando configuración de Firebase...')
  const firebaseFile = 'lib/firebase.ts'
  if (fs.existsSync(firebaseFile)) {
    console.log(`✅ ${firebaseFile} encontrado`)
  } else {
    console.log(`❌ ${firebaseFile} NO encontrado`)
  }

  // 4. Verificar componentes editables
  console.log('\n4️⃣ Verificando componentes editables...')
  const editableComponents = [
    'components/editable-text.tsx',
    'components/editable-image.tsx',
    'components/editable-url.tsx',
    'components/editable-list.tsx',
    'components/editable-media.tsx'
  ]

  editableComponents.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}`)
    } else {
      console.log(`⚠️ ${file} - NO ENCONTRADO`)
    }
  })

  // 5. Verificar layout principal
  console.log('\n5️⃣ Verificando layout principal...')
  const layoutFile = 'app/layout.tsx'
  if (fs.existsSync(layoutFile)) {
    const layoutContent = fs.readFileSync(layoutFile, 'utf8')
    if (layoutContent.includes('AdminProvider')) {
      console.log('✅ AdminProvider configurado en layout')
    } else {
      console.log('❌ AdminProvider NO configurado en layout')
    }
  } else {
    console.log(`❌ ${layoutFile} NO encontrado`)
  }

  // 6. Verificar package.json
  console.log('\n6️⃣ Verificando dependencias...')
  const packageFile = 'package.json'
  if (fs.existsSync(packageFile)) {
    const packageContent = JSON.parse(fs.readFileSync(packageFile, 'utf8'))
    const requiredDeps = ['firebase', 'next', 'react']
    
    requiredDeps.forEach(dep => {
      if (packageContent.dependencies && packageContent.dependencies[dep]) {
        console.log(`✅ ${dep} instalado`)
      } else if (packageContent.devDependencies && packageContent.devDependencies[dep]) {
        console.log(`✅ ${dep} instalado (dev)`)
      } else {
        console.log(`❌ ${dep} NO instalado`)
      }
    })
  }

  // 7. Diagnóstico del problema
  console.log('\n7️⃣ Diagnóstico del problema de edición...')
  console.log(`
🔍 BASADO EN LOS LOGS QUE COMPARTISTE:

Los logs muestran:
- ✅ El sistema está cargando correctamente
- ✅ Las categorías se guardan en localStorage
- ✅ El modo admin se puede activar
- ❌ Los productos no se cargan (count: 0)
- ❌ Las ediciones no se guardan

PROBLEMAS IDENTIFICADOS:

1. 🔥 FIREBASE NO CONFIGURADO:
   - Las variables de entorno de Firebase no están configuradas
   - Esto impide que las ediciones se guarden en Firestore
   - El sistema falla silenciosamente al guardar

2. 📦 PRODUCTOS NO CARGADOS:
   - Los productos tienen count: 0
   - Esto puede ser porque no hay productos en la base de datos
   - O porque Firebase no está configurado correctamente

3. 🔐 AUTENTICACIÓN:
   - El sistema de autenticación parece funcionar
   - El modo admin se puede activar
   - Pero las ediciones no se persisten

SOLUCIONES:

1. 🔧 CONFIGURAR FIREBASE:
   - Crear archivo .env.local con credenciales de Firebase
   - Configurar reglas de Firestore
   - Verificar conexión

2. 🧪 PROBAR EDICIÓN:
   - Ir a /admin y hacer login
   - Activar modo admin
   - Intentar editar texto
   - Verificar consola del navegador

3. 🔍 VERIFICAR LOGS:
   - Abrir DevTools (F12)
   - Buscar errores de Firebase
   - Verificar logs de guardado

4. 📝 CREAR PRODUCTOS:
   - Usar el sistema de clonación
   - O agregar productos manualmente
   - Verificar que se guarden en Firestore
  `)

  // 8. Pasos para solucionar
  console.log('\n8️⃣ Pasos para solucionar el problema:')
  console.log(`
📋 PASOS DETALLADOS:

1. CONFIGURAR FIREBASE:
   a) Ve a https://console.firebase.google.com/
   b) Crea un proyecto o usa uno existente
   c) Habilita Firestore Database
   d) Ve a Configuración > General
   e) Crea una app web
   f) Copia las credenciales

2. CREAR ARCHIVO .env.local:
   Crea un archivo .env.local en la raíz del proyecto con:
   
   NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

3. CONFIGURAR REGLAS DE FIRESTORE:
   En Firebase Console > Firestore > Reglas, usa:
   
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /config/{document} {
         allow read, write: if true;
       }
     }
   }

4. REINICIAR EL SERVIDOR:
   npm run dev

5. PROBAR EDICIÓN:
   a) Ir a http://localhost:3000/admin
   b) Login con admin/admin123
   c) Activar modo admin
   d) Editar texto
   e) Verificar que se guarde

6. VERIFICAR EN FIREBASE:
   a) Ir a Firebase Console > Firestore
   b) Verificar que se cree la colección 'config'
   c) Verificar que se guarden los cambios
  `)

  console.log('\n✅ Verificación completada')
}

// Ejecutar la verificación
checkAdminSystem()
