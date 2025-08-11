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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para simular getTenantId() del lado del cliente
function getTenantId() {
  // Simular diferentes contextos
  const contexts = [
    { hostname: 'localhost', expected: 'default' },
    { hostname: 'plantilla.localhost', expected: 'plantilla' },
    { hostname: 'tumarca.com', expected: 'tumarca' },
    { hostname: 'controldoc.app', expected: 'controldoc' }
  ];

  contexts.forEach(context => {
    console.log(`\n🔍 Probando hostname: ${context.hostname}`);
    
    // Simular el mapeo de dominios
    const domainToTenant = {
      'localhost': 'default',
      'landing-six-gold.vercel.app': 'gold',
      'marcamia.com': 'marcamia',
      'tumarca.com': 'tumarca',
      'controldoc.app': 'controldoc',
    };
    
    // Buscar coincidencia exacta
    let tenantId = domainToTenant[context.hostname];
    
    if (!tenantId) {
      // Buscar coincidencia por subdominio
      const subdomain = context.hostname.split('.')[0];
      if (subdomain && subdomain !== 'www') {
        tenantId = subdomain;
      } else {
        // Fallback al dominio completo como tenant ID
        tenantId = context.hostname.replace(/[^a-zA-Z0-9]/g, '-');
      }
    }
    
    console.log(`   Tenant ID calculado: ${tenantId}`);
    console.log(`   Tenant ID esperado: ${context.expected}`);
    console.log(`   ✅ Coincide: ${tenantId === context.expected}`);
  });
}

// Función para verificar qué documentos existen en Firestore
async function checkFirestoreDocuments() {
  console.log('\n📁 Verificando documentos en Firestore...');
  
  const tenantIds = ['default', 'plantilla', 'tumarca', 'controldoc'];
  
  for (const tenantId of tenantIds) {
    try {
      const configDoc = doc(db, 'config', tenantId);
      const configSnapshot = await getDoc(configDoc);
      
      if (configSnapshot.exists()) {
        const data = configSnapshot.data();
        console.log(`✅ Documento encontrado para tenant: ${tenantId}`);
        
        if (data.data && typeof data.data === 'string') {
          try {
            const config = JSON.parse(data.data);
            console.log(`   📝 Título del sitio: ${config.site?.title || 'No definido'}`);
            console.log(`   🎯 Número de sesiones: ${config.sessions?.length || 0}`);
          } catch (parseError) {
            console.log(`   ❌ Error parseando JSON: ${parseError.message}`);
          }
        } else {
          console.log(`   📋 Datos directos del documento`);
          console.log(`   📝 Título del sitio: ${data.site?.title || 'No definido'}`);
        }
      } else {
        console.log(`❌ Documento NO encontrado para tenant: ${tenantId}`);
      }
    } catch (error) {
      console.log(`❌ Error verificando tenant ${tenantId}: ${error.message}`);
    }
  }
}

async function main() {
  console.log('🔍 Debug de Tenant IDs');
  console.log('=====================');
  
  // Verificar lógica de tenant ID
  getTenantId();
  
  // Verificar documentos en Firestore
  await checkFirestoreDocuments();
  
  console.log('\n✨ Debug completado');
}

main().catch(console.error);
