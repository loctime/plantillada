const { initializeApp } = require('firebase/app')
const { getFirestore, doc, getDoc } = require('firebase/firestore')
const fs = require('fs')
const path = require('path')

// Configuración de Firebase
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

async function testFumigacionesEditable() {
  console.log('🧪 Iniciando prueba de editabilidad del diseño de fumigaciones...')
  
  try {
    // Obtener tenant ID
    const tenantId = process.argv[2] || 'default-tenant'
    console.log(`🏢 Verificando tenant: ${tenantId}`)
    
    // Obtener configuración actual
    const configDocRef = doc(db, 'configs', tenantId)
    const configDoc = await getDoc(configDocRef)
    
    if (!configDoc.exists()) {
      console.log('❌ No se encontró configuración para este tenant')
      console.log('💡 Ejecuta primero: node scripts/apply-fumigaciones-design.js')
      return
    }
    
    const config = configDoc.data()
    console.log('📋 Configuración cargada')
    
    // Verificar que el diseño de fumigaciones está activo
    if (config.selectedDesigns?.landing !== 'fumigaciones') {
      console.log('❌ El diseño de fumigaciones no está activo')
      console.log(`   Diseño actual: ${config.selectedDesigns?.landing}`)
      console.log('💡 Ejecuta: node scripts/apply-fumigaciones-design.js')
      return
    }
    
    console.log('✅ Diseño de fumigaciones activo')
    
    // Verificar elementos editables
    const fumigaciones = config.fumigaciones
    if (!fumigaciones) {
      console.log('❌ No se encontró configuración específica de fumigaciones')
      return
    }
    
    console.log('🎯 Verificando elementos editables:')
    
    // Información de contacto
    const emergencyServices = fumigaciones.emergencyServices
    if (emergencyServices) {
      console.log('✅ Información de contacto de emergencia:')
      console.log(`   - Teléfono: ${emergencyServices.phone || 'No configurado'}`)
      console.log(`   - Horarios: ${emergencyServices.hours || 'No configurado'}`)
      console.log(`   - Texto de llamada: ${emergencyServices.callText || 'No configurado'}`)
    } else {
      console.log('❌ Información de contacto de emergencia no configurada')
    }
    
    // Enlaces sociales
    const socialLinks = fumigaciones.socialLinks
    if (socialLinks) {
      console.log('✅ Enlaces de redes sociales:')
      console.log(`   - Facebook: ${socialLinks.facebook || 'No configurado'}`)
      console.log(`   - Twitter: ${socialLinks.twitter || 'No configurado'}`)
      console.log(`   - Google: ${socialLinks.google || 'No configurado'}`)
      console.log(`   - Instagram: ${socialLinks.instagram || 'No configurado'}`)
    } else {
      console.log('❌ Enlaces de redes sociales no configurados')
    }
    
    // Contenido principal
    console.log('✅ Contenido principal:')
    console.log(`   - Tagline: ${fumigaciones.tagline || 'No configurado'}`)
    console.log(`   - Descripción del hero: ${fumigaciones.heroDescription ? 'Configurado' : 'No configurado'}`)
    console.log(`   - Imagen del hero: ${fumigaciones.heroImage || 'No configurado'}`)
    
    // Títulos de secciones
    console.log('✅ Títulos de secciones:')
    console.log(`   - Emergencia: ${fumigaciones.emergencyTitle || 'No configurado'}`)
    console.log(`   - Protección: ${fumigaciones.protectionTitle || 'No configurado'}`)
    console.log(`   - Principios de trabajo: ${fumigaciones.workPrincipleTitle || 'No configurado'}`)
    console.log(`   - Sobre nosotros: ${fumigaciones.aboutTitle || 'No configurado'}`)
    console.log(`   - Testimonios: ${fumigaciones.testimonialsTitle || 'No configurado'}`)
    
    // Botones y enlaces
    console.log('✅ Botones y enlaces:')
    console.log(`   - Cita: ${fumigaciones.appointmentText || 'No configurado'}`)
    console.log(`   - URL de cita: ${fumigaciones.appointmentUrl || 'No configurado'}`)
    console.log(`   - Emergencia: ${fumigaciones.emergencyButtonText || 'No configurado'}`)
    console.log(`   - Servicios: ${fumigaciones.servicesButtonText || 'No configurado'}`)
    
    // Listas editables
    const pestTypes = fumigaciones.pestTypes
    if (pestTypes && pestTypes.length > 0) {
      console.log('✅ Lista de tipos de plagas:')
      pestTypes.forEach((pest, index) => {
        console.log(`   ${index + 1}. ${pest.name}`)
      })
    } else {
      console.log('❌ Lista de tipos de plagas no configurada')
    }
    
    const workSteps = fumigaciones.workSteps
    if (workSteps && workSteps.length > 0) {
      console.log('✅ Pasos de trabajo:')
      workSteps.forEach((step, index) => {
        console.log(`   ${step.number}. ${step.title} - ${step.description}`)
      })
    } else {
      console.log('❌ Pasos de trabajo no configurados')
    }
    
    // Footer
    console.log('✅ Footer:')
    console.log(`   - Texto de emergencia: ${fumigaciones.footerEmergencyText || 'No configurado'}`)
    console.log(`   - Teléfono: ${fumigaciones.footerPhone || 'No configurado'}`)
    console.log(`   - Copyright: ${fumigaciones.footerCopyright ? 'Configurado' : 'No configurado'}`)
    
    // Verificar que todos los elementos críticos están presentes
    const criticalElements = [
      'emergencyServices',
      'socialLinks',
      'tagline',
      'heroDescription',
      'emergencyTitle',
      'protectionTitle',
      'workPrincipleTitle',
      'aboutTitle',
      'testimonialsTitle',
      'pestTypes',
      'workSteps',
      'footerEmergencyText',
      'footerPhone'
    ]
    
    const missingElements = criticalElements.filter(element => !fumigaciones[element])
    
    if (missingElements.length === 0) {
      console.log('🎉 ¡Todos los elementos editables están configurados correctamente!')
      console.log('📱 El diseño de fumigaciones es completamente editable')
      console.log('🔧 Puedes editar cualquier elemento desde el modo administrador')
    } else {
      console.log('⚠️ Elementos faltantes:')
      missingElements.forEach(element => {
        console.log(`   - ${element}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error)
    process.exit(1)
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  testFumigacionesEditable()
}

module.exports = { testFumigacionesEditable }
