// Script para probar que los fondos de las paletas son diferentes
console.log('🎨 Probando fondos diferenciados de las paletas...')

// Definir las paletas con sus fondos
const palettes = {
  default: {
    light: { backgroundColor: '#ffffff', sectionBackground: '#f8fafc' },
    dark: { backgroundColor: '#0f172a', sectionBackground: '#1e293b' }
  },
  abogados: {
    light: { backgroundColor: '#fafafa', sectionBackground: '#f5f5f5' },
    dark: { backgroundColor: '#0f0f0f', sectionBackground: '#1a1a1a' }
  },
  contable: {
    light: { backgroundColor: '#f0f8ff', sectionBackground: '#e6f3ff' },
    dark: { backgroundColor: '#0a1428', sectionBackground: '#1e293b' }
  },
  ingenieros: {
    light: { backgroundColor: '#f0f9ff', sectionBackground: '#e0f2fe' },
    dark: { backgroundColor: '#0c1a2e', sectionBackground: '#1e293b' }
  },
  psicologos: {
    light: { backgroundColor: '#faf5ff', sectionBackground: '#f3e8ff' },
    dark: { backgroundColor: '#1a0b2e', sectionBackground: '#1e293b' }
  },
  coaches: {
    light: { backgroundColor: '#fffbeb', sectionBackground: '#fef3c7' },
    dark: { backgroundColor: '#2e1a0f', sectionBackground: '#1e293b' }
  },
  consultores: {
    light: { backgroundColor: '#f0fdf4', sectionBackground: '#dcfce7' },
    dark: { backgroundColor: '#0a1f0a', sectionBackground: '#1e293b' }
  }
}

// Función para aplicar una paleta
function applyPalette(paletteName, isDark = false) {
  const palette = palettes[paletteName]
  if (!palette) {
    console.log(`❌ Paleta "${paletteName}" no encontrada`)
    return
  }

  const colors = isDark ? palette.dark : palette.light
  const root = document.documentElement
  const body = document.body

  console.log(`🎨 Aplicando paleta: ${paletteName} (${isDark ? 'oscuro' : 'claro'})`)
  console.log(`   Fondo principal: ${colors.backgroundColor}`)
  console.log(`   Fondo secciones: ${colors.sectionBackground}`)

  // Aplicar colores
  root.style.setProperty('--background-color', colors.backgroundColor)
  root.style.setProperty('--section-background', colors.sectionBackground)
  body.style.backgroundColor = colors.backgroundColor
  root.style.backgroundColor = colors.backgroundColor

  console.log('✅ Colores aplicados')
}

// Función para mostrar todas las paletas
function showAllPalettes() {
  console.log('\n📋 Todas las paletas disponibles:')
  Object.entries(palettes).forEach(([name, palette]) => {
    console.log(`\n🎨 ${name.toUpperCase()}:`)
    console.log(`   Claro - Fondo: ${palette.light.backgroundColor}, Secciones: ${palette.light.sectionBackground}`)
    console.log(`   Oscuro - Fondo: ${palette.dark.backgroundColor}, Secciones: ${palette.dark.sectionBackground}`)
  })
}

// Función para probar todas las paletas en modo claro
function testAllLightPalettes() {
  console.log('\n🔄 Probando todas las paletas en modo claro...')
  const paletteNames = Object.keys(palettes)
  
  let currentIndex = 0
  
  const testNext = () => {
    if (currentIndex >= paletteNames.length) {
      console.log('✅ Prueba completada')
      return
    }
    
    const paletteName = paletteNames[currentIndex]
    console.log(`\n🎯 Probando: ${paletteName}`)
    applyPalette(paletteName, false)
    
    currentIndex++
    setTimeout(testNext, 2000) // Cambiar cada 2 segundos
  }
  
  testNext()
}

// Mostrar información inicial
showAllPalettes()

console.log('\n🎮 Comandos disponibles:')
console.log('- applyPalette("nombre", isDark) - Aplicar una paleta específica')
console.log('- testAllLightPalettes() - Probar todas las paletas en modo claro')
console.log('- showAllPalettes() - Mostrar todas las paletas')

console.log('\n💡 Ejemplos:')
console.log('- applyPalette("abogados", false) - Abogados modo claro')
console.log('- applyPalette("psicologos", true) - Psicólogos modo oscuro')
console.log('- applyPalette("coaches", false) - Coaches modo claro')
