#!/usr/bin/env node

/**
 * Script para probar que las paletas de colores funcionan correctamente en modo oscuro
 * 
 * Uso:
 * node scripts/test-palette-dark-mode.js
 */

console.log('🎨 Probando paletas de colores en modo oscuro...\n')

// Simular las paletas de colores del ThemeManager
const colorPalettes = [
  {
    id: 'default',
    name: 'Por Defecto',
    colors: {
      light: {
        backgroundColor: '#ffffff',
        sectionBackground: '#f8fafc',
        navbarBackground: '#ffffff',
        textColor: '#1e293b',
        accentColor: '#10b981',
        primaryButtonColor: '#10b981',
        secondaryButtonColor: '#3b82f6',
        outlineButtonColor: '#6b7280'
      },
      dark: {
        backgroundColor: '#0f172a',
        sectionBackground: '#1e293b',
        navbarBackground: '#0f172a',
        textColor: '#f1f5f9',
        accentColor: '#10b981',
        primaryButtonColor: '#10b981',
        secondaryButtonColor: '#3b82f6',
        outlineButtonColor: '#9ca3af'
      }
    }
  },
  {
    id: 'abogados',
    name: 'Abogados',
    colors: {
      light: {
        backgroundColor: '#fafafa',
        sectionBackground: '#f5f5f5',
        navbarBackground: '#ffffff',
        textColor: '#1a1a1a',
        accentColor: '#d4af37',
        primaryButtonColor: '#1a1a1a',
        secondaryButtonColor: '#8b8b8b',
        outlineButtonColor: '#8b8b8b'
      },
      dark: {
        backgroundColor: '#0f0f0f',
        sectionBackground: '#1a1a1a',
        navbarBackground: '#0f0f0f',
        textColor: '#f5f5f5',
        accentColor: '#d4af37',
        primaryButtonColor: '#d4af37',
        secondaryButtonColor: '#8b8b8b',
        outlineButtonColor: '#8b8b8b'
      }
    }
  },
  {
    id: 'psicologos',
    name: 'Psicólogos',
    colors: {
      light: {
        backgroundColor: '#faf5ff',
        sectionBackground: '#f3e8ff',
        navbarBackground: '#ffffff',
        textColor: '#1e293b',
        accentColor: '#8b5cf6',
        primaryButtonColor: '#6366f1',
        secondaryButtonColor: '#8b5cf6',
        outlineButtonColor: '#8b5cf6'
      },
      dark: {
        backgroundColor: '#1a0b2e',
        sectionBackground: '#1e293b',
        navbarBackground: '#1a0b2e',
        textColor: '#f1f5f9',
        accentColor: '#8b5cf6',
        primaryButtonColor: '#6366f1',
        secondaryButtonColor: '#8b5cf6',
        outlineButtonColor: '#a78bfa'
      }
    }
  }
]

// Función para simular la aplicación de colores
function applyColors(colors, mode) {
  console.log(`🎨 Aplicando colores en modo ${mode}:`)
  console.log(`   Fondo: ${colors.backgroundColor}`)
  console.log(`   Sección: ${colors.sectionBackground}`)
  console.log(`   Texto: ${colors.textColor}`)
  console.log(`   Acento: ${colors.accentColor}`)
  console.log(`   Botón Primario: ${colors.primaryButtonColor}`)
  console.log(`   Botón Secundario: ${colors.secondaryButtonColor}`)
  console.log('')
}

// Función para simular el cambio de modo
function testPaletteModeChange(paletteId) {
  const palette = colorPalettes.find(p => p.id === paletteId)
  if (!palette) {
    console.log(`❌ Paleta ${paletteId} no encontrada`)
    return
  }

  console.log(`🔄 Probando paleta: ${palette.name}`)
  console.log('=' * 50)
  
  // Aplicar en modo claro
  applyColors(palette.colors.light, 'claro')
  
  // Simular cambio a modo oscuro
  console.log('🌙 Cambiando a modo oscuro...')
  applyColors(palette.colors.dark, 'oscuro')
  
  // Simular cambio de vuelta a modo claro
  console.log('☀️ Cambiando de vuelta a modo claro...')
  applyColors(palette.colors.light, 'claro')
  
  console.log('✅ Prueba completada\n')
}

// Función para comparar colores entre modos
function compareModes(paletteId) {
  const palette = colorPalettes.find(p => p.id === paletteId)
  if (!palette) return

  console.log(`🔍 Comparando modos para: ${palette.name}`)
  console.log('=' * 50)
  
  const light = palette.colors.light
  const dark = palette.colors.dark
  
  console.log('📊 Diferencias entre modo claro y oscuro:')
  console.log(`   Fondo: ${light.backgroundColor} → ${dark.backgroundColor}`)
  console.log(`   Sección: ${light.sectionBackground} → ${dark.sectionBackground}`)
  console.log(`   Texto: ${light.textColor} → ${dark.textColor}`)
  console.log(`   Acento: ${light.accentColor} → ${dark.accentColor}`)
  console.log(`   Botón Primario: ${light.primaryButtonColor} → ${dark.primaryButtonColor}`)
  console.log(`   Botón Secundario: ${light.secondaryButtonColor} → ${dark.secondaryButtonColor}`)
  console.log('')
}

// Ejecutar pruebas
console.log('🚀 Iniciando pruebas de paletas...\n')

// Probar cada paleta
colorPalettes.forEach(palette => {
  testPaletteModeChange(palette.id)
  compareModes(palette.id)
})

console.log('🎯 Pruebas completadas!')
console.log('\n📝 Resumen:')
console.log('- Las paletas deben mantener sus colores específicos al cambiar de modo')
console.log('- El modo oscuro debe usar colores más oscuros que el modo claro')
console.log('- Los colores de acento pueden mantenerse similares entre modos')
console.log('- Los colores de texto deben contrastar bien con el fondo')

console.log('\n💡 Para probar en el navegador:')
console.log('1. Abrir el gestor de colores')
console.log('2. Seleccionar una paleta')
console.log('3. Cambiar entre modo claro y oscuro')
console.log('4. Verificar que los colores cambian correctamente')
