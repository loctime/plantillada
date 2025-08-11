const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function debugCurrentConfig(tenantId = 'plantilla') {
  try {
    console.log(`🔍 Debuggeando configuración actual para tenant: ${tenantId}`);
    
    const configDoc = doc(db, 'config', tenantId);
    const configSnapshot = await getDoc(configDoc);
    
    if (!configSnapshot.exists()) {
      console.log('❌ No existe configuración para este tenant');
      return;
    }
    
    const data = configSnapshot.data();
    console.log('📄 Datos raw de Firestore:', JSON.stringify(data, null, 2));
    
    if (data.data && typeof data.data === 'string') {
      try {
        const config = JSON.parse(data.data);
        console.log('✅ Configuración parseada correctamente');
        console.log('📋 Título actual:', config.site?.title);
        console.log('📋 Tagline actual:', config.site?.tagline);
        
        // Verificar si hay currentTemplate
        if (config.currentTemplate) {
          console.log(`⚠️  ¡PROBLEMA! Hay currentTemplate: ${config.currentTemplate}`);
          console.log('🔍 Esto significa que se está aplicando un template automáticamente');
        } else {
          console.log('✅ No hay currentTemplate - la configuración debería cargarse correctamente');
        }
        
        // Mostrar toda la configuración
        console.log('\n📄 Configuración completa:');
        console.log(JSON.stringify(config, null, 2));
        
      } catch (parseError) {
        console.error('❌ Error parseando JSON:', parseError);
      }
    } else {
      console.log('📋 Los datos están directamente en el documento (formato antiguo)');
      console.log('✅ Configuración directa:', JSON.stringify(data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error debuggeando configuración:', error);
  }
}

// Ejecutar el debug
debugCurrentConfig();
