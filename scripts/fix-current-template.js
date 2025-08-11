const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, setDoc } = require('firebase/firestore');

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

async function fixCurrentTemplate(tenantId = 'plantilla') {
  try {
    console.log(`🔧 Verificando y arreglando currentTemplate para tenant: ${tenantId}`);
    
    const configDoc = doc(db, 'config', tenantId);
    const configSnapshot = await getDoc(configDoc);
    
    if (!configSnapshot.exists()) {
      console.log('❌ No existe configuración para este tenant');
      return;
    }
    
    const data = configSnapshot.data();
    console.log('📄 Datos actuales de Firestore:', JSON.stringify(data, null, 2));
    
    if (data.data && typeof data.data === 'string') {
      try {
        const config = JSON.parse(data.data);
        console.log('✅ Configuración parseada correctamente');
        console.log('📋 Título actual:', config.site?.title);
        
        // Verificar si hay currentTemplate
        if (config.currentTemplate) {
          console.log(`⚠️  ¡PROBLEMA ENCONTRADO! Hay currentTemplate: ${config.currentTemplate}`);
          console.log('🔍 Esto está causando que se aplique automáticamente un template');
          console.log('🧹 Eliminando currentTemplate...');
          
          // Eliminar currentTemplate
          delete config.currentTemplate;
          
          // Guardar configuración limpia
          const cleanData = { data: JSON.stringify(config) };
          await setDoc(configDoc, cleanData);
          
          console.log('✅ currentTemplate eliminado exitosamente');
          console.log('📋 Nuevo título (debería ser el personalizado):', config.site?.title);
        } else {
          console.log('✅ No hay currentTemplate - la configuración está limpia');
          console.log('📋 Título guardado:', config.site?.title);
        }
        
      } catch (parseError) {
        console.error('❌ Error parseando JSON:', parseError);
      }
    } else {
      console.log('📋 Los datos están directamente en el documento (formato antiguo)');
      console.log('✅ No hay currentTemplate - la configuración está limpia');
    }
    
  } catch (error) {
    console.error('❌ Error arreglando currentTemplate:', error);
  }
}

// Ejecutar el fix
fixCurrentTemplate();
