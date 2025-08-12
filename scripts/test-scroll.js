// Script para probar el scroll del gestor de colores
console.log('📜 Probando scroll del gestor de colores...')

// Función para verificar si el elemento tiene scroll
function checkScroll(element) {
  if (!element) {
    console.log('❌ Elemento no encontrado')
    return
  }
  
  const hasScroll = element.scrollHeight > element.clientHeight
  const scrollTop = element.scrollTop
  const maxScroll = element.scrollHeight - element.clientHeight
  
  console.log('📊 Información del scroll:')
  console.log(`  - Altura del contenido: ${element.scrollHeight}px`)
  console.log(`  - Altura visible: ${element.clientHeight}px`)
  console.log(`  - Tiene scroll: ${hasScroll ? 'SÍ' : 'NO'}`)
  console.log(`  - Posición actual: ${scrollTop}px`)
  console.log(`  - Scroll máximo: ${maxScroll}px`)
  
  return hasScroll
}

// Función para hacer scroll al final
function scrollToBottom(element) {
  if (!element) return
  
  element.scrollTo({
    top: element.scrollHeight,
    behavior: 'smooth'
  })
  
  console.log('⬇️ Haciendo scroll al final...')
}

// Función para hacer scroll al inicio
function scrollToTop(element) {
  if (!element) return
  
  element.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
  
  console.log('⬆️ Haciendo scroll al inicio...')
}

// Buscar el gestor de colores
const themeManager = document.querySelector('.overflow-y-auto')
if (themeManager) {
  console.log('✅ Gestor de colores encontrado')
  checkScroll(themeManager)
  
  console.log('\n🎮 Comandos disponibles:')
  console.log('- scrollToBottom(themeManager) - Ir al final')
  console.log('- scrollToTop(themeManager) - Ir al inicio')
  console.log('- checkScroll(themeManager) - Verificar scroll')
} else {
  console.log('❌ Gestor de colores no encontrado')
  console.log('💡 Asegúrate de que el gestor de colores esté abierto')
}
