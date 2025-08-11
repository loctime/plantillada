const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

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

// Función para crear configuración personalizada
function createCustomConfig(tenantId, customData = {}) {
  const baseConfig = {
    site: {
      title: customData.title || `Tu Marca Personal - ${tenantId}`,
      tagline: customData.tagline || "Acompañamiento 1:1 y formación práctica para cambios reales."
    },
    integrations: {
      calendlyUrl: customData.calendlyUrl || "https://calendly.com/tu-usuario/sesion",
      hotmartBaseUrl: "https://pay.hotmart.com"
    },
    sessions: customData.sessions || [
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
    course: customData.course || {
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
    about: customData.about || {
      photoUrl: "/placeholder.svg?height=520&width=420",
      videoUrl: "",
      story: "Soy [Tu Nombre], consultor y coach con X años ayudando a profesionales a ganar claridad, enfocarse y ejecutar con calma.",
      whyMe: "He acompañado a +300 clientes en sectores diversos."
    },
    testimonials: customData.testimonials || [
      {
        quote: "En dos sesiones definimos un plan claro y recuperé la motivación.",
        author: "María G.",
        role: "Marketing Specialist"
      }
    ],
    contact: {
      email: customData.contactEmail || "hola@tumarca.com"
    },
    legal: {
      termsUrl: "",
      privacyUrl: ""
    }
  };

  return baseConfig;
}

async function createTenant(tenantId, customData = {}) {
  try {
    console.log(`🚀 Creando tenant: ${tenantId}`);
    
    const config = createCustomConfig(tenantId, customData);
    
    // Guardar en Firestore
    const configDoc = doc(db, 'config', tenantId);
    await setDoc(configDoc, { data: JSON.stringify(config) });
    
    console.log(`✅ Tenant ${tenantId} creado exitosamente!`);
    console.log(`📋 Configuración:`);
    console.log(`   - Título: ${config.site.title}`);
    console.log(`   - Tagline: ${config.site.tagline}`);
    console.log(`   - Email: ${config.contact.email}`);
    
    console.log(`\n🎯 Próximos pasos:`);
    console.log(`1. Agrega el dominio al mapeo en lib/config-loader.ts`);
    console.log(`2. Despliega la aplicación`);
    console.log(`3. Accede a tu-dominio.com/admin para personalizar`);
    
    return true;
  } catch (error) {
    console.error(`❌ Error creando tenant ${tenantId}:`, error);
    return false;
  }
}

// Ejemplos de uso
async function createExampleTenants() {
  console.log('📝 Creando tenants de ejemplo...\n');
  
  // Ejemplo 1: Cliente de coaching
  await createTenant('coachingpro', {
    title: "Coaching Pro",
    tagline: "Coaching ejecutivo y desarrollo de liderazgo",
    contactEmail: "info@coachingpro.com"
  });
  
  // Ejemplo 2: Cliente de marketing
  await createTenant('marketingplus', {
    title: "Marketing Plus",
    tagline: "Estrategias de marketing digital que generan resultados",
    contactEmail: "hola@marketingplus.com"
  });
  
  console.log('\n✅ Todos los tenants de ejemplo creados!');
}

// Si se ejecuta directamente
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('📖 Uso del script:');
    console.log('  node scripts/create-tenant.js <tenant-id>');
    console.log('  node scripts/create-tenant.js --examples');
    console.log('');
    console.log('Ejemplos:');
    console.log('  node scripts/create-tenant.js micliente');
    console.log('  node scripts/create-tenant.js --examples');
  } else if (args[0] === '--examples') {
    createExampleTenants();
  } else {
    const tenantId = args[0];
    createTenant(tenantId);
  }
}

module.exports = { createTenant, createCustomConfig };
