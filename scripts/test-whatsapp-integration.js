const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, setDoc } = require('firebase/firestore');

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testWhatsAppIntegration() {
  console.log('🧪 Probando integración de WhatsApp...\n');

  try {
    // Obtener configuración actual
    const tenantId = process.env.NEXT_PUBLIC_DEFAULT_TENANT || 'default';
    const configRef = doc(db, 'config', tenantId);
    const configSnap = await getDoc(configRef);

    if (!configSnap.exists()) {
      console.log('❌ No se encontró configuración. Creando configuración de prueba...');
      
      // Crear configuración de prueba
      const testConfig = {
        site: {
          title: "Tienda de Prueba",
          tagline: "Probando integración de WhatsApp"
        },
        contact: {
          email: "test@example.com",
          phones: [
            "+54 9 11 1234 5678",
            "+54 9 11 9876 5432",
            "+54 9 11 5555 1111"
          ],
          whatsappPhone: "+54 9 11 1234 5678", // Primer número seleccionado
          emails: [],
          addresses: [],
          cbus: [],
          cuits: [],
          urls: []
        },
        // ... resto de configuración por defecto
      };

      await setDoc(configRef, testConfig);
      console.log('✅ Configuración de prueba creada');
    } else {
      const config = configSnap.data();
      console.log('📋 Configuración actual:');
      console.log(`   - Teléfonos: ${config.contact?.phones?.join(', ') || 'Ninguno'}`);
      console.log(`   - WhatsApp seleccionado: ${config.contact?.whatsappPhone || 'No seleccionado'}`);
      
      // Verificar si hay números de teléfono
      if (!config.contact?.phones || config.contact.phones.length === 0) {
        console.log('⚠️  No hay números de teléfono configurados');
        console.log('💡 Agrega números en /admin → General → Contacto');
        return;
      }

      // Verificar si hay WhatsApp seleccionado
      if (!config.contact?.whatsappPhone) {
        console.log('⚠️  No hay número de WhatsApp seleccionado');
        console.log('💡 Selecciona un número en /admin → General → WhatsApp para Carrito');
        return;
      }

      console.log('✅ Configuración correcta para WhatsApp');
    }

    console.log('\n🎯 Próximos pasos:');
    console.log('1. Ve a /admin → General → Contacto');
    console.log('2. Agrega tus números de teléfono');
    console.log('3. En "WhatsApp para Carrito" selecciona el número a usar');
    console.log('4. Guarda la configuración');
    console.log('5. Ve a /shop y prueba el carrito de compras');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  testWhatsAppIntegration();
}

module.exports = { testWhatsAppIntegration };
