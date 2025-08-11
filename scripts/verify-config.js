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

async function verifyConfig(tenantId = 'default') {
  try {
    console.log(`🔍 Verificando configuración para tenant: ${tenantId}`);
    
    const configDoc = doc(db, 'config', tenantId);
    const configSnapshot = await getDoc(configDoc);
    
    if (configSnapshot.exists()) {
      const data = configSnapshot.data();
      console.log('✅ Documento encontrado en Firestore');
      console.log('📄 Datos del documento:', JSON.stringify(data, null, 2));
      
      // Si los datos están en el campo 'data' como string JSON
      if (data.data && typeof data.data === 'string') {
        try {
          const parsedConfig = JSON.parse(data.data);
          console.log('✅ Configuración parseada correctamente');
          console.log('🏠 Título del sitio:', parsedConfig.site?.title);
          console.log('📝 Tagline:', parsedConfig.site?.tagline);
          console.log('🎯 Sesiones:', parsedConfig.sessions?.length || 0);
          console.log('💬 Testimonios:', parsedConfig.testimonials?.length || 0);
        } catch (parseError) {
          console.error('❌ Error parseando JSON:', parseError);
        }
      } else {
        console.log('📋 Datos directos del documento');
        console.log('🏠 Título del sitio:', data.site?.title);
        console.log('📝 Tagline:', data.site?.tagline);
      }
    } else {
      console.log('❌ Documento no encontrado en Firestore');
    }
  } catch (error) {
    console.error('❌ Error verificando configuración:', error);
  }
}

// Ejecutar verificación
const tenantId = process.argv[2] || 'default';
verifyConfig(tenantId);
