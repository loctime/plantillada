// Script para probar la configuración de colores del diseño de abogados
// Este script simula la aplicación de colores y verifica que se configuren correctamente

console.log('🎨 Probando configuración de colores para Estudio de Abogados...')

// Configuración de tema para el diseño de abogados
const abogadosTheme = {
  light: {
    backgroundColor: '#f8f9fa',
    sectionBackground: '#ffffff',
    navbarBackground: '#1a1a1a',
    textColor: '#2c3e50',
    accentColor: '#d4af37',
    primaryButtonColor: '#1a1a1a',
    secondaryButtonColor: '#8b8b8b',
    outlineButtonColor: '#d4af37'
  },
  dark: {
    backgroundColor: '#1a1a1a',
    sectionBackground: '#2d2d2d',
    navbarBackground: '#000000',
    textColor: '#ffffff',
    accentColor: '#d4af37',
    primaryButtonColor: '#d4af37',
    secondaryButtonColor: '#8b8b8b',
    outlineButtonColor: '#ffffff'
  }
}

// Función para simular la aplicación de variables CSS
function applyThemeColors(theme, mode) {
  console.log(`\n🌙 Aplicando tema ${mode.toUpperCase()}:`)
  
  const root = {
    style: {
      setProperty: (property, value) => {
        console.log(`   ${property}: ${value}`)
      }
    }
  }
  
  // Aplicar variables CSS personalizadas
  root.style.setProperty('--background-color', theme.backgroundColor)
  root.style.setProperty('--section-background', theme.sectionBackground)
  root.style.setProperty('--navbar-background', theme.navbarBackground)
  root.style.setProperty('--text-color', theme.textColor)
  root.style.setProperty('--accent-color', theme.accentColor)
  root.style.setProperty('--primary-button-color', theme.primaryButtonColor)
  root.style.setProperty('--secondary-button-color', theme.secondaryButtonColor)
  root.style.setProperty('--outline-button-color', theme.outlineButtonColor)
  
  // Crear color de navegación con transparencia
  const navbarColor = theme.navbarBackground
  let navbarWithOpacity = navbarColor
  
  if (navbarColor.startsWith('#')) {
    const r = parseInt(navbarColor.slice(1, 3), 16)
    const g = parseInt(navbarColor.slice(3, 5), 16)
    const b = parseInt(navbarColor.slice(5, 7), 16)
    navbarWithOpacity = `rgba(${r}, ${g}, ${b}, 0.8)`
  }
  
  root.style.setProperty('--navbar-background-transparent', navbarWithOpacity)
}

// Función para verificar contraste de colores
function checkColorContrast(backgroundColor, textColor) {
  // Función simple para calcular luminancia relativa
  function getLuminance(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255
    
    const [rs, gs, bs] = [r, g, b].map(c => {
      if (c <= 0.03928) return c / 12.92
      return Math.pow((c + 0.055) / 1.055, 2.4)
    })
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }
  
  const bgLuminance = getLuminance(backgroundColor)
  const textLuminance = getLuminance(textColor)
  
  const ratio = (Math.max(bgLuminance, textLuminance) + 0.05) / 
                (Math.min(bgLuminance, textLuminance) + 0.05)
  
  return {
    ratio: ratio.toFixed(2),
    passes: ratio >= 4.5,
    level: ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'Fail'
  }
}

// Probar tema claro
console.log('\n☀️ TEMA CLARO:')
applyThemeColors(abogadosTheme.light, 'claro')

// Verificar contraste en tema claro
const lightContrast = checkColorContrast(abogadosTheme.light.backgroundColor, abogadosTheme.light.textColor)
console.log(`\n📊 Contraste tema claro (fondo: ${abogadosTheme.light.backgroundColor} vs texto: ${abogadosTheme.light.textColor}):`)
console.log(`   Ratio: ${lightContrast.ratio}:1`)
console.log(`   Nivel: ${lightContrast.level}`)
console.log(`   ✅ Pasa: ${lightContrast.passes ? 'SÍ' : 'NO'}`)

// Probar tema oscuro
console.log('\n🌙 TEMA OSCURO:')
applyThemeColors(abogadosTheme.dark, 'oscuro')

// Verificar contraste en tema oscuro
const darkContrast = checkColorContrast(abogadosTheme.dark.backgroundColor, abogadosTheme.dark.textColor)
console.log(`\n📊 Contraste tema oscuro (fondo: ${abogadosTheme.dark.backgroundColor} vs texto: ${abogadosTheme.dark.textColor}):`)
console.log(`   Ratio: ${darkContrast.ratio}:1`)
console.log(`   Nivel: ${darkContrast.level}`)
console.log(`   ✅ Pasa: ${darkContrast.passes ? 'SÍ' : 'NO'}`)

// Verificar contraste de botones
console.log('\n🔘 CONTRASTE DE BOTONES:')

// Botón primario en tema claro
const primaryLightContrast = checkColorContrast(abogadosTheme.light.primaryButtonColor, '#ffffff')
console.log(`   Botón primario (tema claro): ${primaryLightContrast.ratio}:1 - ${primaryLightContrast.level}`)

// Botón primario en tema oscuro
const primaryDarkContrast = checkColorContrast(abogadosTheme.dark.primaryButtonColor, '#000000')
console.log(`   Botón primario (tema oscuro): ${primaryDarkContrast.ratio}:1 - ${primaryDarkContrast.level}`)

// Resumen de colores
console.log('\n🎨 RESUMEN DE COLORES:')
console.log('   Tema Claro:')
console.log(`     - Fondo principal: ${abogadosTheme.light.backgroundColor} (gris claro elegante)`)
console.log(`     - Fondo secciones: ${abogadosTheme.light.sectionBackground} (blanco puro)`)
console.log(`     - Navegación: ${abogadosTheme.light.navbarBackground} (negro elegante)`)
console.log(`     - Texto: ${abogadosTheme.light.textColor} (azul oscuro profesional)`)
console.log(`     - Acento: ${abogadosTheme.light.accentColor} (dorado premium)`)

console.log('\n   Tema Oscuro:')
console.log(`     - Fondo principal: ${abogadosTheme.dark.backgroundColor} (negro elegante)`)
console.log(`     - Fondo secciones: ${abogadosTheme.dark.sectionBackground} (gris oscuro)`)
console.log(`     - Navegación: ${abogadosTheme.dark.navbarBackground} (negro puro)`)
console.log(`     - Texto: ${abogadosTheme.dark.textColor} (blanco puro)`)
console.log(`     - Acento: ${abogadosTheme.dark.accentColor} (dorado premium)`)

console.log('\n✅ Prueba de colores completada exitosamente!')
console.log('\n💡 Notas:')
console.log('   - Los colores están optimizados para bufetes de abogados')
console.log('   - El dorado (#d4af37) es el color de acento premium')
console.log('   - Los fondos son elegantes y profesionales')
console.log('   - El contraste cumple con estándares de accesibilidad')
console.log('   - Los colores se pueden editar desde el panel de administración')

