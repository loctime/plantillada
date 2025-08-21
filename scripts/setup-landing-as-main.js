const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore');

// Configuración de Firebase (usar las variables de entorno)
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

async function setupLandingAsMain() {
  try {
    console.log('🔄 Configurando la landing page como página principal...');
    
    // Obtener la configuración actual
    const configRef = doc(db, 'config', 'main');
    const configSnap = await getDoc(configRef);
    
    let currentConfig = {};
    if (configSnap.exists()) {
      currentConfig = configSnap.data();
      console.log('📋 Configuración actual encontrada');
    }
    
    // Configurar la landing page como plantilla principal
    const updatedConfig = {
      ...currentConfig,
      currentTemplate: 'landing',
      selectedDesign: 'coach-personal', // Diseño por defecto para landing
      site: {
        ...currentConfig.site,
        title: currentConfig.site?.title || 'Mi Sitio Web',
        tagline: currentConfig.site?.tagline || 'Acompañamiento 1:1 y formación práctica para cambios reales.',
        description: currentConfig.site?.description || 'Sitio web profesional con servicios de coaching y formación'
      },
      // Configuración específica de la landing page
      sessions: currentConfig.sessions || [
        {
          id: "sesion-claridad",
          name: "Sesión de Claridad",
          summary: "Define tu objetivo y el plan inmediato de 30 días.",
          duration: "60 min",
          price: "€99",
          features: [
            "Diagnóstico inicial y mapa de objetivos",
            "Prioridades y plan de acción",
            "Seguimiento por email 7 días",
          ],
          hotmartUrl: "https://pay.hotmart.com/TU_CHECKOUT_1",
        },
        {
          id: "sesion-estrategia",
          name: "Estrategia Pro",
          summary: "Estrategia personalizada y sistema semanal.",
          duration: "90 min",
          price: "€149",
          features: ["Auditoría de situación actual", "Diseño de sistema y métricas", "Plantillas y recursos"],
          hotmartUrl: "https://pay.hotmart.com/TU_CHECKOUT_2",
        },
        {
          id: "sesion-impulso",
          name: "Impulso y Ejecución",
          summary: "Implementación guiada y resolución de bloqueos.",
          duration: "60 min",
          price: "€129",
          features: ["Resolución de bloqueos clave", "Checklist de ejecución", "Revisión de resultados"],
          hotmartUrl: "https://pay.hotmart.com/TU_CHECKOUT_3",
        },
      ],
      course: currentConfig.course || {
        title: "Curso Online: Sistema de Productividad Sencilla",
        blurb: "Aprende a construir un sistema ligero para enfocarte, priorizar con calma y avanzar cada semana sin fricción.",
        price: "€179",
        hotmartUrl: "https://pay.hotmart.com/TU_CHECKOUT_CURSO",
        videoUrl: "",
        bullets: [
          "Estructura de planificación semanal en 30 minutos",
          "Métricas simples para medir progreso",
          "Plantillas reutilizables y ejemplos",
          "Casos prácticos y ejercicios guiados",
        ],
      },
      about: currentConfig.about || {
        photoUrl: "/placeholder.svg?height=520&width=420",
        videoUrl: "",
        story: "Soy [Tu Nombre], consultor y coach con X años ayudando a profesionales a ganar claridad, enfocarse y ejecutar con calma. Mi enfoque es práctico, humano y orientado a resultados medibles.",
        whyMe: "He acompañado a +300 clientes en sectores diversos. Integro estrategia, hábitos y priorización para construir momentum sostenible.",
      },
      testimonials: currentConfig.testimonials || [
        {
          quote: "En dos sesiones definimos un plan claro y recuperé la motivación. Pasé de la parálisis a entregar mi proyecto.",
          author: "María G.",
          role: "Marketing Specialist",
        },
        {
          quote: "Las herramientas son simples y efectivas. Mi semana ahora tiene foco y cierro lo importante.",
          author: "Javier R.",
          role: "Product Manager",
        },
        {
          quote: "El curso me dio estructura y las sesiones 1:1 me mantuvieron responsable. Muy recomendable.",
          author: "Lucía P.",
          role: "Emprendedora",
        },
      ],
      integrations: currentConfig.integrations || {
        calendlyUrl: "https://calendly.com/tu-usuario/sesion",
        hotmartBaseUrl: "https://pay.hotmart.com",
      },
      contact: currentConfig.contact || {
        email: "hola@tumarca.com",
      },
      legal: currentConfig.legal || {
        terms: "",
        privacy: "",
      }
    };
    
    // Guardar la configuración actualizada
    await setDoc(configRef, updatedConfig);
    
    console.log('✅ Configuración completada exitosamente');
    console.log('📝 La landing page ahora es la página principal del sitio');
    console.log('🔗 Accede a http://localhost:3000 para ver la landing page');
    console.log('⚙️  Accede a http://localhost:3000/admin para administrar');
    
  } catch (error) {
    console.error('❌ Error configurando la landing page como principal:', error);
    process.exit(1);
  }
}

// Ejecutar el script
setupLandingAsMain();
