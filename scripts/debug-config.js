const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');

// Configuración de Firebase (usa las mismas variables de entorno que tu app)
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

async function debugConfig(tenantId = 'plantilla') {
  try {
    console.log(`🔍 Debuggeando configuración para tenant: ${tenantId}`);
    
    const configDoc = doc(db, 'config', tenantId);
    const configSnapshot = await getDoc(configDoc);
    
    if (!configSnapshot.exists()) {
      console.log('❌ No existe configuración para este tenant');
      return;
    }
    
    const data = configSnapshot.data();
    console.log('📄 Datos raw de Firestore:', JSON.stringify(data, null, 2));
    
    // Verificar si hay campo 'data' como string
    if (data.data && typeof data.data === 'string') {
      console.log('📋 Campo "data" encontrado como string JSON');
      try {
        const parsedConfig = JSON.parse(data.data);
        console.log('✅ Configuración parseada:', JSON.stringify(parsedConfig, null, 2));
        
        // Verificar si hay currentTemplate
        if (parsedConfig.currentTemplate) {
          console.log(`⚠️  ¡PROBLEMA ENCONTRADO! Hay currentTemplate: ${parsedConfig.currentTemplate}`);
          console.log('🔍 Esto significa que se está aplicando un template en lugar de usar la configuración personalizada');
        } else {
          console.log('✅ No hay currentTemplate - la configuración debería cargarse correctamente');
        }
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
debugConfig();
