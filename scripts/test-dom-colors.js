// Script para probar la aplicación de colores en el DOM
// Ejecutar en la consola del navegador

console.log('🎨 Probando aplicación de colores en el DOM...')

// Función para aplicar colores como lo hace el ThemeManager
function applyColors(colors) {
  if (typeof document === 'undefined') {
    console.log('❌ Este script debe ejecutarse en el navegador')
    return
  }

  const root = document.documentElement
  console.log('🎨 Aplicando colores:', colors)

  Object.entries(colors).forEach(([key, value]) => {
    if (value) {
      const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
      root.style.setProperty(cssVar, value)
      console.log(`🎨 Aplicando CSS: ${cssVar} = ${value}`)
    }
  })

  // Crear color de navegación con transparencia
  if (colors.navbarBackground) {
    const navbarColor = colors.navbarBackground
    let navbarWithOpacity = navbarColor
    
    if (navbarColor.startsWith('#')) {
      const r = parseInt(navbarColor.slice(1, 3), 16)
      const g = parseInt(navbarColor.slice(3, 5), 16)
      const b = parseInt(navbarColor.slice(5, 7), 16)
      navbarWithOpacity = `rgba(${r}, ${g}, ${b}, 0.8)`
    } else if (navbarColor.startsWith('rgb(')) {
      navbarWithOpacity = navbarColor.replace('rgb(', 'rgba(').replace(')', ', 0.8)')
    }
    
    root.style.setProperty('--navbar-background-transparent', navbarWithOpacity)
    console.log(`🎨 Aplicando CSS: --navbar-background-transparent = ${navbarWithOpacity}`)
  }

  // Verificar que las variables se aplicaron
  console.log('\n🔍 Verificando variables aplicadas:')
  const computedStyle = getComputedStyle(root)
  console.log('--background-color:', computedStyle.getPropertyValue('--background-color'))
  console.log('--text-color:', computedStyle.getPropertyValue('--text-color'))
  console.log('--accent-color:', computedStyle.getPropertyValue('--accent-color'))
}

// Colores de prueba
const testColors = {
  backgroundColor: '#ff0000', // Rojo para que sea muy visible
  sectionBackground: '#ffcccc',
  navbarBackground: '#ff6666',
  textColor: '#000000',
  accentColor: '#00ff00',
  primaryButtonColor: '#0000ff',
  secondaryButtonColor: '#ffff00',
  outlineButtonColor: '#ff00ff'
}

// Aplicar colores de prueba
console.log('\n🎯 Aplicando colores de prueba (fondo rojo):')
applyColors(testColors)

console.log('\n✅ Si ves el fondo rojo, las variables CSS funcionan correctamente')
console.log('🔄 Para restaurar, recarga la página o ejecuta:')
console.log('applyColors({backgroundColor: "#ffffff", sectionBackground: "#f8fafc", navbarBackground: "#ffffff", textColor: "#1e293b", accentColor: "#10b981", primaryButtonColor: "#10b981", secondaryButtonColor: "#3b82f6", outlineButtonColor: "#6b7280"})')
