const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, setDoc, collection, getDocs } = require('firebase/firestore');

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

async function fixFirebasePermissions() {
  try {
    console.log('🔧 Diagnosticando problemas de permisos de Firebase...');
    
    // Verificar configuración
    console.log('\n📋 Configuración de Firebase:');
    console.log('  - Project ID:', firebaseConfig.projectId);
    console.log('  - Auth Domain:', firebaseConfig.authDomain);
    console.log('  - API Key:', firebaseConfig.apiKey ? '✅ Configurada' : '❌ Faltante');
    
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      console.log('\n❌ ERROR: Variables de entorno de Firebase no configuradas');
      console.log('\n🔧 SOLUCIÓN:');
      console.log('1. Crea un archivo .env.local en la raíz del proyecto');
      console.log('2. Agrega las siguientes variables:');
      console.log(`
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
      `);
      console.log('3. Reinicia el servidor de desarrollo');
      return;
    }
    
    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('\n🔍 Probando conexión a Firestore...');
    
    // Probar lectura
    try {
      const configDoc = doc(db, 'config', 'test');
      await getDoc(configDoc);
      console.log('✅ Lectura de Firestore: OK');
    } catch (error) {
      console.log('❌ Error de lectura:', error.message);
    }
    
    // Probar escritura en config
    try {
      const testDoc = doc(db, 'config', 'test-permissions');
      await setDoc(testDoc, { 
        test: true, 
        timestamp: new Date().toISOString() 
      });
      console.log('✅ Escritura en colección config: OK');
      
      // Limpiar documento de prueba
      await setDoc(testDoc, {});
    } catch (error) {
      console.log('❌ Error de escritura en config:', error.message);
    }
    
    // Probar escritura en backups
    try {
      const backupDoc = doc(db, 'backups', 'test-backup');
      await setDoc(backupDoc, { 
        test: true, 
        timestamp: new Date().toISOString() 
      });
      console.log('✅ Escritura en colección backups: OK');
      
      // Limpiar documento de prueba
      await setDoc(backupDoc, {});
    } catch (error) {
      console.log('❌ Error de escritura en backups:', error.message);
      console.log('\n🔧 SOLUCIÓN PARA BACKUPS:');
      console.log('Actualiza las reglas de Firestore en Firebase Console:');
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
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
      `);
    }
    
    console.log('\n✅ Diagnóstico completado');
    
  } catch (error) {
    console.error('❌ Error en el diagnóstico:', error);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  fixFirebasePermissions();
}

module.exports = { fixFirebasePermissions };
