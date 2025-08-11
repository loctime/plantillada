const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

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

async function forceFixConfig(tenantId = 'plantilla') {
  try {
    console.log(`🔧 Arreglando configuración forzadamente para tenant: ${tenantId}`);
    
    // Crear configuración limpia con el título personalizado
    const cleanConfig = {
      site: {
        title: "MARCA NUEVA DE LA PAGINA",
        tagline: "Acompañamiento 1:1 y formación práctica para cambios reales."
      },
      integrations: {
        calendlyUrl: "https://calendly.com/tu-usuario/sesion",
        hotmartBaseUrl: "https://pay.hotmart.com"
      },
      sessions: [
        {
          id: "sesion-claridad",
          name: "Sesión de Claridad",
          summary: "Define tu objetivo y el plan inmediato de 30 días.",
          duration: "60 min",
          price: "€99",
          features: [
            "Diagnóstico inicial y mapa de objetivos",
            "Prioridades y plan de acción",
            "Seguimiento por email 7 días"
          ],
          hotmartUrl: "https://pay.hotmart.com/TU_CHECKOUT_1"
        }
      ],
      course: {
        title: "Curso Online: Sistema de Productividad Sencilla",
        blurb: "Aprende a construir un sistema ligero para enfocarte, priorizar con calma y avanzar cada semana sin fricción.",
        price: "€179",
        hotmartUrl: "https://pay.hotmart.com/TU_CHECKOUT_CURSO",
        videoUrl: "",
        bullets: [
          "Estructura de planificación semanal en 30 minutos",
          "Métricas simples para medir progreso",
          "Plantillas reutilizables y ejemplos",
          "Casos prácticos y ejercicios guiados"
        ]
      },
      about: {
        photoUrl: "/placeholder.svg?height=520&width=420",
        videoUrl: "",
        story: "Soy [Tu Nombre], consultor y coach con X años ayudando a profesionales a ganar claridad, enfocarse y ejecutar con calma.",
        whyMe: "He acompañado a +300 clientes en sectores diversos."
      },
      testimonials: [
        {
          quote: "En dos sesiones definimos un plan claro y recuperé la motivación.",
          author: "María G.",
          role: "Marketing Specialist"
        }
      ],
      contact: {
        email: "hola@tumarca.com"
      },
      legal: {
        termsUrl: "",
        privacyUrl: ""
      }
      // IMPORTANTE: NO incluir currentTemplate
    };
    
    console.log('📋 Configuración limpia creada:');
    console.log('📋 Título:', cleanConfig.site.title);
    console.log('📋 Sin currentTemplate');
    
    // Guardar en Firestore
    const configDoc = doc(db, 'config', tenantId);
    const dataToSave = { data: JSON.stringify(cleanConfig) };
    
    await setDoc(configDoc, dataToSave);
    console.log('✅ Configuración arreglada exitosamente en Firestore');
    console.log('📝 Documento actualizado:', tenantId);
    
    console.log('\n🎉 ¡Listo! Ahora:');
    console.log('1. Haz refresh de la página');
    console.log('2. El título debería ser: "MARCA NUEVA DE LA PAGINA"');
    console.log('3. Los cambios deberían persistir');
    
  } catch (error) {
    console.error('❌ Error arreglando configuración:', error);
  }
}

// Ejecutar el fix
forceFixConfig();
