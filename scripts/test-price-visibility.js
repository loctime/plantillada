// Script para probar la funcionalidad de visibilidad de precios
// Este script simula las operaciones que haría el componente

console.log('🧪 Probando funcionalidad de visibilidad de precios...')

// Simular configuración de ejemplo
const mockConfig = {
  site: {
    title: "Bufete de Abogados Martínez & Asociados",
    tagline: "Excelencia legal y compromiso con la justicia desde 1995",
    showPrices: false // Por defecto oculto para abogados
  },
  sessions: [
    {
      id: "derecho-civil",
      name: "Derecho Civil",
      summary: "Asesoramiento integral en contratos, herencias, responsabilidad civil y derecho de familia",
      duration: "Según complejidad del caso",
      price: "Desde €200",
      features: [
        "Contratos y acuerdos comerciales",
        "Herencias y sucesiones",
        "Responsabilidad civil y daños",
        "Derecho de familia y divorcios",
        "Propiedad horizontal",
        "Arrendamientos urbanos"
      ],
      hotmartUrl: "https://pay.hotmart.com/DERECHO_CIVIL",
      showPrice: false
    },
    {
      id: "derecho-mercantil",
      name: "Derecho Mercantil",
      summary: "Asesoramiento empresarial y corporativo para empresas de todos los tamaños",
      duration: "Servicio continuo",
      price: "Desde €300/mes",
      features: [
        "Constitución de sociedades",
        "Contratos comerciales",
        "Fusiones y adquisiciones",
        "Derecho societario",
        "Concurrencia desleal",
        "Propiedad intelectual"
      ],
      hotmartUrl: "https://pay.hotmart.com/DERECHO_MERCANTIL",
      showPrice: false
    }
  ],
  course: {
    title: "Curso: Fundamentos Legales para Empresarios",
    blurb: "Conoce los aspectos legales fundamentales para proteger tu negocio y evitar conflictos jurídicos",
    price: "€599",
    hotmartUrl: "https://pay.hotmart.com/CURSO_DERECHO_EMPRESARIAL",
    videoUrl: "",
    bullets: [
      "Formas jurídicas de empresa y sus implicaciones",
      "Contratos comerciales y cláusulas esenciales",
      "Protección de datos y RGPD",
      "Aspectos laborales básicos",
      "Propiedad intelectual y marcas",
      "Responsabilidad civil empresarial"
    ],
    showPrice: false
  }
}

// Función para verificar si un precio debe mostrarse
function shouldShowPrice(config, item) {
  return config.site?.showPrices !== false && item.showPrice !== false
}

// Función para renderizar una sesión (simulación)
function renderSession(session, config) {
  console.log(`\n📋 ${session.name}`)
  console.log(`   Descripción: ${session.summary}`)
  console.log(`   Duración: ${session.duration}`)
  
  if (shouldShowPrice(config, session)) {
    console.log(`   💰 Precio: ${session.price} ✅ VISIBLE`)
  } else {
    console.log(`   💰 Precio: ${session.price} ❌ OCULTO`)
  }
  
  console.log(`   Características: ${session.features.length} items`)
}

// Función para renderizar el curso (simulación)
function renderCourse(course, config) {
  console.log(`\n📚 ${course.title}`)
  console.log(`   Descripción: ${course.blurb}`)
  
  if (shouldShowPrice(config, course)) {
    console.log(`   💰 Precio: ${course.price} ✅ VISIBLE`)
  } else {
    console.log(`   💰 Precio: ${course.price} ❌ OCULTO`)
  }
  
  console.log(`   Contenido: ${course.bullets.length} módulos`)
}

// Probar configuración actual (precios ocultos)
console.log('\n🔒 CONFIGURACIÓN ACTUAL (Precios OCULTOS para abogados):')
console.log('💰 showPrices global:', mockConfig.site.showPrices)

mockConfig.sessions.forEach(session => {
  renderSession(session, mockConfig)
})

renderCourse(mockConfig.course, mockConfig)

// Probar con precios visibles
console.log('\n\n👁️ CONFIGURACIÓN CON PRECIOS VISIBLES:')
const configWithPrices = {
  ...mockConfig,
  site: {
    ...mockConfig.site,
    showPrices: true
  }
}

configWithPrices.sessions = configWithPrices.sessions.map(session => ({
  ...session,
  showPrice: true
}))

configWithPrices.course = {
  ...configWithPrices.course,
  showPrice: true
}

console.log('💰 showPrices global:', configWithPrices.site.showPrices)

configWithPrices.sessions.forEach(session => {
  renderSession(session, configWithPrices)
})

renderCourse(configWithPrices.course, configWithPrices)

// Probar configuración mixta
console.log('\n\n🎭 CONFIGURACIÓN MIXTA (algunos precios visibles):')
const mixedConfig = {
  ...mockConfig,
  site: {
    ...mockConfig.site,
    showPrices: true // Global activado
  }
}

// Solo la primera sesión con precio visible
mixedConfig.sessions = mixedConfig.sessions.map((session, index) => ({
  ...session,
  showPrice: index === 0 // Solo la primera visible
}))

mixedConfig.course = {
  ...mixedConfig.course,
  showPrice: false // Curso oculto
}

console.log('💰 showPrices global:', mixedConfig.site.showPrices)

mixedConfig.sessions.forEach(session => {
  renderSession(session, mixedConfig)
})

renderCourse(mixedConfig.course, mixedConfig)

console.log('\n\n✅ Prueba completada exitosamente!')
console.log('\n📝 Resumen de la funcionalidad:')
console.log('   - Los precios se pueden ocultar globalmente con site.showPrices: false')
console.log('   - Cada sesión/curso puede tener su propia configuración con showPrice')
console.log('   - La lógica es: (site.showPrices !== false) && (item.showPrice !== false)')
console.log('   - Para bufetes de abogados, se recomienda mantener precios ocultos')
