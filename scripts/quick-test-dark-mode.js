// Script de prueba rápida para modo oscuro
console.log('🚀 Prueba rápida del modo oscuro...')

// Verificar estado inicial
const root = document.documentElement
const isDark = root.classList.contains('dark')
console.log(`🎯 Estado inicial: ${isDark ? 'OSCURO' : 'CLARO'}`)

// Función para cambiar modo
function quickToggle() {
  const isDark = root.classList.contains('dark')
  if (isDark) {
    root.classList.remove('dark')
    console.log('☀️ Cambiado a CLARO')
  } else {
    root.classList.add('dark')
    console.log('🌙 Cambiado a OSCURO')
  }
  
  // Verificar colores después del cambio
  setTimeout(() => {
    const bgColor = getComputedStyle(root).getPropertyValue('--background-color')
    const textColor = getComputedStyle(root).getPropertyValue('--text-color')
    console.log(`🎨 Colores después del cambio:`)
    console.log(`   Fondo: ${bgColor}`)
    console.log(`   Texto: ${textColor}`)
  }, 100)
}

// Función para aplicar paleta de prueba
function quickPalette() {
  const isDark = root.classList.contains('dark')
  const colors = isDark ? {
    backgroundColor: '#1a0b2e',
    textColor: '#f1f5f9',
    accentColor: '#8b5cf6'
  } : {
    backgroundColor: '#faf5ff',
    textColor: '#1e293b',
    accentColor: '#8b5cf6'
  }
  
  console.log(`🎨 Aplicando paleta de prueba (${isDark ? 'oscuro' : 'claro'}):`, colors)
  
  Object.entries(colors).forEach(([key, value]) => {
    const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
    root.style.setProperty(cssVar, value)
    console.log(`✅ ${cssVar} = ${value}`)
  })
  
  // Aplicar también al body
  document.body.style.backgroundColor = colors.backgroundColor
  document.body.style.color = colors.textColor
}

console.log('\n🎮 Comandos rápidos:')
console.log('- quickToggle() - Cambiar modo')
console.log('- quickPalette() - Aplicar paleta de prueba')

// Ejecutar prueba automática
console.log('\n🧪 Ejecutando prueba automática...')
quickPalette()



