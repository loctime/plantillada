const fs = require('fs')
const path = require('path')

console.log('🎨 Probando aplicación de colores...')

// Simular la aplicación de colores como lo hace el ThemeManager
function applyColors(colors) {
  console.log('🎨 Aplicando colores:', colors)
  
  Object.entries(colors).forEach(([key, value]) => {
    if (value) {
      const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
      console.log(`🎨 Variable CSS: ${cssVar} = ${value}`)
    }
  })
}

// Colores de prueba para diferentes paletas
const testPalettes = {
  abogados: {
    backgroundColor: '#ffffff',
    sectionBackground: '#f8f9fa',
    navbarBackground: '#ffffff',
    textColor: '#1a1a1a',
    accentColor: '#d4af37',
    primaryButtonColor: '#1a1a1a',
    secondaryButtonColor: '#8b8b8b',
    outlineButtonColor: '#8b8b8b'
  },
  psicologos: {
    backgroundColor: '#ffffff',
    sectionBackground: '#f8fafc',
    navbarBackground: '#ffffff',
    textColor: '#1e293b',
    accentColor: '#8b5cf6',
    primaryButtonColor: '#6366f1',
    secondaryButtonColor: '#8b5cf6',
    outlineButtonColor: '#8b5cf6'
  },
  ingenieros: {
    backgroundColor: '#ffffff',
    sectionBackground: '#f8fafc',
    navbarBackground: '#ffffff',
    textColor: '#1e293b',
    accentColor: '#3b82f6',
    primaryButtonColor: '#059669',
    secondaryButtonColor: '#374151',
    outlineButtonColor: '#374151'
  }
}

console.log('\n🔍 Probando diferentes paletas:')

Object.entries(testPalettes).forEach(([name, colors]) => {
  console.log(`\n📋 Paleta: ${name}`)
  applyColors(colors)
})

console.log('\n✅ Prueba completada. Verifica en el navegador que:')
console.log('1. Las variables CSS se aplican al :root')
console.log('2. El fondo cambia cuando cambias de paleta')
console.log('3. Los colores se aplican inmediatamente')

// Verificar que el CSS está configurado correctamente
const cssFiles = [
  'app/globals.css',
  'styles/globals.css'
]

console.log('\n📁 Verificando archivos CSS:')

cssFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8')
    const hasCustomBg = content.includes('custom-bg')
    const hasBackgroundColor = content.includes('--background-color')
    const hasImportant = content.includes('!important')
    
    console.log(`\n📄 ${file}:`)
    console.log(`  ✅ custom-bg: ${hasCustomBg ? 'SÍ' : 'NO'}`)
    console.log(`  ✅ --background-color: ${hasBackgroundColor ? 'SÍ' : 'NO'}`)
    console.log(`  ✅ !important: ${hasImportant ? 'SÍ' : 'NO'}`)
  } else {
    console.log(`\n❌ ${file}: NO EXISTE`)
  }
})
