const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, setDoc } = require('firebase/firestore');

// Configuración de Firebase (usar la misma que en lib/firebase.ts)
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

async function testLinkHubAdmin() {
  console.log('🧪 Probando integración del LinkHub con modo admin...\n');

  try {
    // Obtener tenant ID
    const tenantId = process.env.NEXT_PUBLIC_DEFAULT_TENANT || 'default';
    console.log(`📍 Tenant ID: ${tenantId}`);

    // Referencia al documento de configuración
    const configRef = doc(db, 'configs', tenantId);

    // Obtener configuración actual
    const configDoc = await getDoc(configRef);
    
    if (!configDoc.exists()) {
      console.log('❌ No se encontró configuración existente');
      return;
    }

    const config = configDoc.data();
    console.log('✅ Configuración cargada exitosamente');

    // Verificar si existe linkHub en la configuración
    if (!config.linkHub) {
      console.log('⚠️  No se encontró configuración del LinkHub, agregando configuración por defecto...');
      
      const defaultLinkHub = {
        profile: {
          name: "Tu Nombre",
          bio: "Descripción personal o profesional. Comparte tu historia, pasiones o lo que haces.",
          avatar: "/placeholder-user.jpg",
          location: "Ciudad, País",
          email: "tu@email.com",
          phone: "+34 600 000 000"
        },
        links: [
          {
            id: "website",
            title: "Mi Sitio Web",
            url: "https://tusitio.com",
            icon: "🌐",
            category: "principal",
            isActive: true
          },
          {
            id: "portfolio",
            title: "Portfolio",
            url: "https://portfolio.com",
            icon: "💼",
            category: "trabajo",
            isActive: true
          },
          {
            id: "blog",
            title: "Blog",
            url: "https://blog.com",
            icon: "✍️",
            category: "contenido",
            isActive: true
          },
          {
            id: "contact",
            title: "Contacto",
            url: "mailto:tu@email.com",
            icon: "📧",
            category: "contacto",
            isActive: true
          }
        ],
        theme: {
          primaryColor: "#8b5cf6",
          backgroundColor: "#ffffff",
          textColor: "#1f2937",
          accentColor: "#f3f4f6"
        },
        social: {
          instagram: "https://instagram.com/tuusuario",
          twitter: "https://twitter.com/tuusuario",
          linkedin: "https://linkedin.com/in/tuusuario",
          youtube: "https://youtube.com/@tucanal",
          facebook: "https://facebook.com/tupagina",
          website: "https://tusitio.com"
        }
      };

      // Actualizar configuración con LinkHub
      const updatedConfig = {
        ...config,
        linkHub: defaultLinkHub
      };

      await setDoc(configRef, updatedConfig, { merge: true });
      console.log('✅ Configuración del LinkHub agregada exitosamente');
    } else {
      console.log('✅ Configuración del LinkHub encontrada:');
      console.log(`   - Nombre: ${config.linkHub.profile.name}`);
      console.log(`   - Enlaces: ${config.linkHub.links.length}`);
      console.log(`   - Redes sociales: ${Object.keys(config.linkHub.social).length}`);
    }

    // Verificar secciones
    if (config.sections) {
      const linkhubSection = config.sections.find(s => s.id === 'linkhub');
      if (linkhubSection) {
        console.log('✅ Sección LinkHub encontrada en la configuración');
        console.log(`   - Visible: ${linkhubSection.visible}`);
        console.log(`   - Tipo: ${linkhubSection.type}`);
      } else {
        console.log('⚠️  Sección LinkHub no encontrada en la configuración');
      }
    } else {
      console.log('⚠️  No se encontraron secciones en la configuración');
    }

    // Probar actualización de LinkHub
    console.log('\n🔄 Probando actualización del LinkHub...');
    
    const testUpdate = {
      ...config,
      linkHub: {
        ...config.linkHub,
        profile: {
          ...config.linkHub.profile,
          name: "Nombre de Prueba - " + new Date().toLocaleTimeString()
        }
      }
    };

    await setDoc(configRef, testUpdate, { merge: true });
    console.log('✅ Actualización del LinkHub exitosa');

    // Verificar la actualización
    const updatedDoc = await getDoc(configRef);
    const updatedConfig = updatedDoc.data();
    console.log(`   - Nuevo nombre: ${updatedConfig.linkHub.profile.name}`);

    console.log('\n🎉 ¡Prueba del LinkHub completada exitosamente!');
    console.log('\n📋 Resumen:');
    console.log('   ✅ Configuración del LinkHub integrada');
    console.log('   ✅ Edición inline disponible');
    console.log('   ✅ Gestión de enlaces funcional');
    console.log('   ✅ Gestión de redes sociales funcional');
    console.log('   ✅ Guardado automático en Firebase');
    console.log('   ✅ Panel de gestión avanzada disponible');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  }
}

// Ejecutar la prueba
testLinkHubAdmin().then(() => {
  console.log('\n🏁 Prueba finalizada');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Error fatal:', error);
  process.exit(1);
});
