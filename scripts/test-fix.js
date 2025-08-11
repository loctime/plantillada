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

async function testFix(tenantId = 'plantilla') {
  try {
    console.log(`🧪 Probando solución para tenant: ${tenantId}`);
    
    // 1. Crear configuración de prueba con currentTemplate
    const testConfig = {
      site: {
        title: "Título de Prueba",
        tagline: "Tagline de prueba"
      },
      integrations: {
        calendlyUrl: "https://calendly.com/test",
        hotmartBaseUrl: "https://pay.hotmart.com"
      },
      sessions: [],
      course: {
        title: "Curso de Prueba",
        blurb: "Descripción de prueba",
        price: "€99",
        hotmartUrl: "https://pay.hotmart.com/test",
        videoUrl: "",
        bullets: []
      },
      about: {
        photoUrl: "/test.jpg",
        videoUrl: "",
        story: "Historia de prueba",
        whyMe: "Por qué elegirme"
      },
      testimonials: [],
      contact: {
        email: "test@test.com"
      },
      legal: {
        termsUrl: "",
        privacyUrl: ""
      },
      currentTemplate: "landing" // Esto causaba el problema
    };
    
    console.log('📝 Configuración de prueba creada con currentTemplate');
    
    // 2. Simular el guardado (como saveConfig)
    const configToSave = { ...testConfig };
    if (configToSave.currentTemplate) {
      console.log('🧹 Limpiando currentTemplate...');
      delete configToSave.currentTemplate;
    }
    
    const dataToSave = { data: JSON.stringify(configToSave) };
    const configDoc = doc(db, 'config', tenantId);
    await setDoc(configDoc, dataToSave);
    
    console.log('✅ Configuración guardada (simulando saveConfig)');
    
    // 3. Simular la carga (como loadConfig)
    const configSnapshot = await getDoc(configDoc);
    const data = configSnapshot.data();
    
    if (data.data && typeof data.data === 'string') {
      const loadedConfig = JSON.parse(data.data);
      console.log('📋 Configuración cargada:', JSON.stringify(loadedConfig, null, 2));
      
      if (loadedConfig.currentTemplate) {
        console.log('❌ PROBLEMA: Aún hay currentTemplate después del guardado');
      } else {
        console.log('✅ ÉXITO: currentTemplate fue eliminado correctamente');
      }
      
      if (loadedConfig.site.title === "Título de Prueba") {
        console.log('✅ ÉXITO: La configuración personalizada se mantiene');
      } else {
        console.log('❌ PROBLEMA: La configuración personalizada se perdió');
      }
    }
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
}

// Ejecutar la prueba
testFix();
