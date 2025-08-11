const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

// Configuración de Firebase (reemplaza con tus credenciales)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Configuración personalizada para ControlDoc
const controldocConfig = {
  site: {
    title: "ControlDoc",
    tagline: "Control y gestión documental profesional para empresas."
  },
  integrations: {
    calendlyUrl: "https://calendly.com/tu-usuario/controldoc-consulta",
    hotmartBaseUrl: "https://pay.hotmart.com"
  },
  sessions: [
    {
      id: "auditoria-documental",
      name: "Auditoría Documental",
      summary: "Revisión completa de tu sistema de gestión documental actual.",
      duration: "90 min",
      price: "€150",
      features: [
        "Análisis de procesos actuales",
        "Identificación de puntos de mejora",
        "Plan de implementación",
        "Recomendaciones de herramientas"
      ],
      hotmartUrl: "https://pay.hotmart.com/CONTROLDOC_AUDITORIA"
    },
    {
      id: "implementacion-sistema",
      name: "Implementación de Sistema",
      summary: "Configuración completa de tu sistema de control documental.",
      duration: "120 min",
      price: "€250",
      features: [
        "Configuración de estructura de carpetas",
        "Definición de flujos de trabajo",
        "Configuración de permisos y accesos",
        "Capacitación del equipo"
      ],
      hotmartUrl: "https://pay.hotmart.com/CONTROLDOC_IMPLEMENTACION"
    },
    {
      id: "mantenimiento-mensual",
      name: "Mantenimiento Mensual",
      summary: "Soporte continuo y optimización de tu sistema documental.",
      duration: "60 min",
      price: "€99/mes",
      features: [
        "Revisión mensual del sistema",
        "Optimización de procesos",
        "Soporte técnico prioritario",
        "Actualizaciones de seguridad"
      ],
      hotmartUrl: "https://pay.hotmart.com/CONTROLDOC_MANTENIMIENTO"
    }
  ],
  course: {
    title: "Curso: Gestión Documental Eficiente",
    blurb: "Aprende a implementar un sistema de control documental profesional que optimice los procesos de tu empresa.",
    price: "€299",
    hotmartUrl: "https://pay.hotmart.com/CONTROLDOC_CURSO",
    videoUrl: "",
    bullets: [
      "Fundamentos de gestión documental",
      "Herramientas y tecnologías actuales",
      "Implementación paso a paso",
      "Casos de éxito y mejores prácticas",
      "Certificado de finalización"
    ]
  },
  about: {
    photoUrl: "/placeholder.svg?height=520&width=420",
    videoUrl: "",
    story: "Somos especialistas en gestión documental con más de 10 años ayudando a empresas a optimizar sus procesos de control documental.",
    whyMe: "Hemos implementado sistemas exitosos en más de 50 empresas de diferentes sectores."
  },
  testimonials: [
    {
      quote: "ControlDoc transformó completamente nuestro sistema de archivos. Ahora todo está organizado y es fácil de encontrar.",
      author: "Carlos M.",
      role: "Director de Operaciones"
    },
    {
      quote: "La implementación fue rápida y el equipo quedó capacitado desde el primer día. Excelente servicio.",
      author: "Ana L.",
      role: "Gerente de Recursos Humanos"
    }
  ],
  contact: {
    email: "info@controldoc.app"
  },
  legal: {
    termsUrl: "",
    privacyUrl: ""
  }
};

async function setupControlDoc() {
  try {
    console.log('🚀 Configurando tenant ControlDoc en Firebase...');
    
    // Guardar configuración en Firestore
    const configDoc = doc(db, 'config', 'controldoc');
    await setDoc(configDoc, { data: JSON.stringify(controldocConfig) });
    
    console.log('✅ Configuración de ControlDoc guardada exitosamente!');
    console.log('📋 Resumen de la configuración:');
    console.log(`   - Título: ${controldocConfig.site.title}`);
    console.log(`   - Tagline: ${controldocConfig.site.tagline}`);
    console.log(`   - Sesiones configuradas: ${controldocConfig.sessions.length}`);
    console.log(`   - Email de contacto: ${controldocConfig.contact.email}`);
    
    console.log('\n🎯 Próximos pasos:');
    console.log('1. Despliega tu aplicación en producción');
    console.log('2. Configura tu dominio controldoc.app para apuntar a tu hosting');
    console.log('3. Accede a controldoc.app/admin para personalizar la configuración');
    console.log('4. Actualiza las URLs de Calendly y Hotmart con tus enlaces reales');
    
  } catch (error) {
    console.error('❌ Error configurando ControlDoc:', error);
    console.log('\n🔧 Solución:');
    console.log('1. Verifica que las variables de entorno de Firebase estén configuradas');
    console.log('2. Asegúrate de que Firestore esté habilitado en tu proyecto');
    console.log('3. Verifica las reglas de Firestore (deben permitir escritura)');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  setupControlDoc();
}

module.exports = { setupControlDoc, controldocConfig };
