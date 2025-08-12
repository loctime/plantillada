// Script rápido para probar colores - ejecutar en consola del navegador
console.log('🎨 Prueba rápida de colores...')

// Función para aplicar colores de prueba
function testColors() {
  const root = document.documentElement
  const body = document.body
  
  // Aplicar fondo rojo muy visible
  root.style.setProperty('--background-color', '#ff0000')
  body.style.backgroundColor = '#ff0000'
  root.style.backgroundColor = '#ff0000'
  
  console.log('🎯 Fondo rojo aplicado - ¿lo ves?')
  console.log('Si ves el fondo rojo, las variables CSS funcionan')
  console.log('Si no lo ves, hay un problema con el CSS')
}

// Función para restaurar colores
function restoreColors() {
  const root = document.documentElement
  const body = document.body
  
  root.style.setProperty('--background-color', '#ffffff')
  body.style.backgroundColor = '#ffffff'
  root.style.backgroundColor = '#ffffff'
  
  console.log('✅ Colores restaurados')
}

// Ejecutar prueba
testColors()

console.log('🔄 Para restaurar, ejecuta: restoreColors()')
