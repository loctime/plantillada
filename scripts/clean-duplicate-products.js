/**
 * Script para limpiar productos duplicados en localStorage
 * Ejecutar en la consola del navegador para limpiar productos existentes
 */

function cleanDuplicateProducts() {
  console.log('🧹 Iniciando limpieza de productos duplicados...')
  
  try {
    // Obtener productos del localStorage
    const savedProducts = localStorage.getItem('shop-products')
    
    if (!savedProducts) {
      console.log('📦 No hay productos guardados en localStorage')
      return
    }
    
    const products = JSON.parse(savedProducts)
    console.log(`📦 Productos encontrados: ${products.length}`)
    
    // Encontrar duplicados
    const seen = new Set()
    const duplicates = []
    const cleaned = products.filter(product => {
      if (seen.has(product.id)) {
        duplicates.push(product)
        console.log(`🗑️ Producto duplicado encontrado: ${product.id} - ${product.name}`)
        return false
      }
      seen.add(product.id)
      return true
    })
    
    if (duplicates.length > 0) {
      console.log(`🧹 Se encontraron ${duplicates.length} productos duplicados`)
      console.log('🗑️ Productos duplicados eliminados:')
      duplicates.forEach(product => {
        console.log(`   - ${product.id}: ${product.name}`)
      })
      
      // Guardar productos limpios
      localStorage.setItem('shop-products', JSON.stringify(cleaned))
      console.log(`✅ Productos limpios guardados: ${cleaned.length} productos`)
      
      // Recargar la página para aplicar cambios
      console.log('🔄 Recargando página para aplicar cambios...')
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } else {
      console.log('✅ No se encontraron productos duplicados')
    }
    
  } catch (error) {
    console.error('❌ Error limpiando productos duplicados:', error)
  }
}

// Ejecutar limpieza
cleanDuplicateProducts()
