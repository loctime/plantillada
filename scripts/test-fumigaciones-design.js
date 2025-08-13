const { initializeApp } = require('firebase/app')
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore')

// Configuración de Firebase (usar las mismas credenciales que en el proyecto)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function testFumigacionesDesign() {
  console.log('🧪 Iniciando prueba del diseño de fumigaciones...')
  
  const tenantId = 'test-tenant'
  
  try {
    // 1. Crear configuración de prueba con diseño de fumigaciones
    console.log('📝 Creando configuración de prueba...')
    
    const testConfig = {
      site: {
        title: "Pest Busters - Control de Plagas Profesional",
        tagline: "Soluciones integrales de fumigación y control de plagas para hogares y empresas",
        heroTitle: "Complex Approach to Pest Control",
        heroSubtitle: "Servicios profesionales de fumigación y control de plagas con tecnología avanzada y garantía de resultados",
        sessionsTitle: "Nuestros Servicios",
        sessionsSubtitle: "Soluciones especializadas para cada tipo de plaga",
        aboutTitle: "Sobre Nosotros",
        testimonialsTitle: "Lo que dicen nuestros clientes",
        testimonialsSubtitle: "Más de 10 años protegiendo hogares y empresas",
        ctaTitle: "¿Necesitas servicios de fumigación?",
        ctaSubtitle: "Servicio 24/7 - Respuesta inmediata",
        showPrices: true
      },
      selectedTemplates: ['landing'],
      selectedDesigns: {
        landing: 'fumigaciones'
      },
      sessions: [
        {
          id: "fumigacion-residencial",
          name: "Fumigación Residencial",
          summary: "Control completo de plagas para hogares y viviendas",
          duration: "2-4 horas",
          price: "Desde €120",
          features: [
            "Inspección completa de la propiedad",
            "Tratamiento integral de plagas",
            "Productos seguros para mascotas",
            "Garantía de 6 meses",
            "Certificado de fumigación",
            "Seguimiento post-tratamiento"
          ],
          hotmartUrl: "https://pay.hotmart.com/FUMIGACION_RESIDENCIAL",
          showPrice: true
        },
        {
          id: "fumigacion-comercial",
          name: "Fumigación Comercial",
          summary: "Servicios especializados para empresas y comercios",
          duration: "4-8 horas",
          price: "Desde €250",
          features: [
            "Análisis de riesgo específico",
            "Plan de control personalizado",
            "Tratamiento sin interrumpir operaciones",
            "Cumplimiento de normativas sanitarias",
            "Garantía de 12 meses",
            "Reporte técnico detallado"
          ],
          hotmartUrl: "https://pay.hotmart.com/FUMIGACION_COMERCIAL",
          showPrice: true
        }
      ],
      course: {
        title: "Curso: Prevención de Plagas en el Hogar",
        blurb: "Aprende técnicas efectivas para prevenir y detectar plagas en tu hogar antes de que se conviertan en un problema",
        price: "€89",
        hotmartUrl: "https://pay.hotmart.com/CURSO_PREVENCION_PLAGAS",
        videoUrl: "",
        bullets: [
          "Identificación de signos de plagas",
          "Métodos de prevención efectivos",
          "Productos naturales de control",
          "Mantenimiento preventivo del hogar",
          "Cuándo llamar a profesionales",
          "Certificado de finalización"
        ],
        showPrice: true
      },
      about: {
        photoUrl: "/placeholder.svg?height=520&width=420",
        videoUrl: "",
        story: "Somos una empresa especializada en control de plagas con más de 10 años de experiencia, comprometida con la seguridad de nuestros clientes y el medio ambiente. Utilizamos tecnología avanzada y productos certificados para garantizar resultados efectivos y duraderos.",
        whyMe: "Hemos servido a más de 2.000 clientes satisfechos, manteniendo los más altos estándares de calidad y seguridad en todos nuestros tratamientos."
      },
      testimonials: [
        {
          quote: "Excelente servicio. Eliminaron completamente las cucarachas de mi cocina en una sola visita. Muy profesionales y puntuales.",
          author: "María R.",
          role: "Propietaria de Vivienda"
        },
        {
          quote: "El servicio de emergencia fue increíble. Llegaron en menos de una hora y resolvieron el problema de ratones inmediatamente.",
          author: "Carlos M.",
          role: "Restaurante"
        }
      ],
      contact: {
        email: "info@pestbusters.com"
      },
      integrations: {
        calendlyUrl: "https://calendly.com/pestbusters/consulta",
        hotmartBaseUrl: "https://pay.hotmart.com"
      },
      theme: {
        light: {
          backgroundColor: '#f8fafc',
          sectionBackground: '#ffffff',
          navbarBackground: '#ffffff',
          textColor: '#1e293b',
          accentColor: '#f59e0b',
          primaryButtonColor: '#059669',
          secondaryButtonColor: '#475569',
          outlineButtonColor: '#f59e0b'
        },
        dark: {
          backgroundColor: '#0f172a',
          sectionBackground: '#1e293b',
          navbarBackground: '#0f172a',
          textColor: '#f1f5f9',
          accentColor: '#f59e0b',
          primaryButtonColor: '#059669',
          secondaryButtonColor: '#475569',
          outlineButtonColor: '#fbbf24'
        }
      },
      legal: {
        termsUrl: "",
        privacyUrl: ""
      }
    }

    // 2. Guardar configuración en Firestore
    console.log('💾 Guardando configuración en Firestore...')
    
    const configDoc = doc(db, 'config', tenantId)
    await setDoc(configDoc, testConfig)
    
    console.log('✅ Configuración guardada exitosamente')
    
    // 3. Verificar que se guardó correctamente
    console.log('🔍 Verificando configuración guardada...')
    
    const savedConfigDoc = await getDoc(configDoc)
    if (savedConfigDoc.exists()) {
      const savedConfig = savedConfigDoc.data()
      console.log('✅ Configuración verificada:')
      console.log('   - Título:', savedConfig.site.title)
      console.log('   - Diseño seleccionado:', savedConfig.selectedDesigns?.landing)
      console.log('   - Servicios:', savedConfig.sessions?.length || 0)
      console.log('   - Testimonios:', savedConfig.testimonials?.length || 0)
    } else {
      throw new Error('La configuración no se guardó correctamente')
    }
    
    // 4. Verificar que el diseño está configurado correctamente
    if (savedConfigDoc.data().selectedDesigns?.landing === 'fumigaciones') {
      console.log('✅ Diseño de fumigaciones configurado correctamente')
    } else {
      throw new Error('El diseño de fumigaciones no se configuró correctamente')
    }
    
    console.log('🎉 ¡Prueba del diseño de fumigaciones completada exitosamente!')
    console.log('📱 Ahora puedes visitar la página para ver el layout específico de fumigaciones')
    console.log('🔗 URL: http://localhost:3000')
    
  } catch (error) {
    console.error('❌ Error en la prueba del diseño de fumigaciones:', error)
    process.exit(1)
  }
}

// Ejecutar la prueba
testFumigacionesDesign()
