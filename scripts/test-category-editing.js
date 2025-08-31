/**
 * Script para probar la edición de categorías
 * Ejecutar en la consola del navegador para diagnosticar problemas
 */

function testCategoryEditing() {
  console.log('🧪 Iniciando prueba de edición de categorías...')
  
  try {
    // Obtener categorías del localStorage
    const savedCategories = localStorage.getItem('shop-categories')
    
    if (!savedCategories) {
      console.log('📦 No hay categorías guardadas en localStorage')
      return
    }
    
    const categories = JSON.parse(savedCategories)
    console.log(`📁 Categorías encontradas: ${categories.length}`)
    categories.forEach((cat, index) => {
      console.log(`   ${index + 1}. ID: ${cat.id}, Nombre: "${cat.name}", Descripción: "${cat.description}"`)
    })
    
    // Simular una actualización de categoría
    if (categories.length > 0) {
      const testCategory = categories[0]
      const originalName = testCategory.name
      const newName = originalName + ' (TEST)'
      
      console.log(`\n🔄 Simulando actualización de categoría:`)
      console.log(`   ID: ${testCategory.id}`)
      console.log(`   Nombre original: "${originalName}"`)
      console.log(`   Nombre nuevo: "${newName}"`)
      
      // Actualizar la categoría
      const updatedCategories = categories.map(cat => 
        cat.id === testCategory.id 
          ? { ...cat, name: newName }
          : cat
      )
      
      // Guardar en localStorage
      localStorage.setItem('shop-categories', JSON.stringify(updatedCategories))
      console.log('✅ Categoría actualizada en localStorage')
      
      // Verificar que se guardó correctamente
      const verifyCategories = JSON.parse(localStorage.getItem('shop-categories'))
      const updatedCategory = verifyCategories.find(cat => cat.id === testCategory.id)
      
      if (updatedCategory && updatedCategory.name === newName) {
        console.log('✅ Verificación exitosa: La categoría se actualizó correctamente')
      } else {
        console.log('❌ Error en verificación: La categoría no se actualizó correctamente')
        console.log('   Categoría encontrada:', updatedCategory)
      }
      
      // Restaurar nombre original
      const restoredCategories = categories.map(cat => 
        cat.id === testCategory.id 
          ? { ...cat, name: originalName }
          : cat
      )
      localStorage.setItem('shop-categories', JSON.stringify(restoredCategories))
      console.log('🔄 Nombre original restaurado')
      
    } else {
      console.log('❌ No hay categorías para probar')
    }
    
  } catch (error) {
    console.error('❌ Error en prueba de edición de categorías:', error)
  }
}

// Función para verificar el estado actual
function checkCurrentState() {
  console.log('🔍 Verificando estado actual...')
  
  try {
    const savedCategories = localStorage.getItem('shop-categories')
    if (savedCategories) {
      const categories = JSON.parse(savedCategories)
      console.log(`📁 Categorías en localStorage: ${categories.length}`)
      categories.forEach((cat, index) => {
        console.log(`   ${index + 1}. "${cat.name}" (ID: ${cat.id})`)
      })
    } else {
      console.log('📦 No hay categorías en localStorage')
    }
    
    // Verificar si hay productos
    const savedProducts = localStorage.getItem('shop-products')
    if (savedProducts) {
      const products = JSON.parse(savedProducts)
      console.log(`📦 Productos en localStorage: ${products.length}`)
    } else {
      console.log('📦 No hay productos en localStorage')
    }
    
  } catch (error) {
    console.error('❌ Error verificando estado:', error)
  }
}

// Función para forzar recarga del estado
function forceReloadState() {
  console.log('🔄 Forzando recarga del estado...')
  
  try {
    // Disparar un evento personalizado para forzar la recarga
    const event = new CustomEvent('forceReloadShopState')
    window.dispatchEvent(event)
    console.log('✅ Evento de recarga disparado')
    
    // También intentar recargar la página después de un delay
    setTimeout(() => {
      console.log('🔄 Recargando página...')
      window.location.reload()
    }, 2000)
    
  } catch (error) {
    console.error('❌ Error forzando recarga:', error)
  }
}

// Función para verificar si React está actualizando el DOM
function checkDOMUpdates() {
  console.log('🔍 Verificando actualizaciones del DOM...')
  
  try {
    // Buscar elementos de categorías en el DOM
    const categoryElements = document.querySelectorAll('[class*="category"]')
    console.log(`📁 Elementos de categoría encontrados en DOM: ${categoryElements.length}`)
    
    // Buscar elementos con nombres de categorías
    const categoryNames = document.querySelectorAll('h3, .text-lg, .font-semibold')
    console.log(`📝 Elementos de texto encontrados: ${categoryNames.length}`)
    
    categoryNames.forEach((element, index) => {
      const text = element.textContent?.trim()
      if (text && text.length > 0 && text.length < 50) {
        console.log(`   ${index + 1}. "${text}"`)
      }
    })
    
  } catch (error) {
    console.error('❌ Error verificando DOM:', error)
  }
}

// Ejecutar pruebas
console.log('🚀 Ejecutando pruebas de edición de categorías...')
checkCurrentState()
console.log('\n' + '='.repeat(50) + '\n')
testCategoryEditing()
console.log('\n' + '='.repeat(50) + '\n')
checkDOMUpdates()

// Agregar funciones al scope global para uso manual
window.testCategoryEditing = testCategoryEditing
window.checkCurrentState = checkCurrentState
window.forceReloadState = forceReloadState
window.checkDOMUpdates = checkDOMUpdates

console.log('\n📋 Funciones disponibles:')
console.log('   - testCategoryEditing()')
console.log('   - checkCurrentState()')
console.log('   - forceReloadState()')
console.log('   - checkDOMUpdates()')
