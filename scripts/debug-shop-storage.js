#!/usr/bin/env node

/**
 * Script para diagnosticar el estado del localStorage de la tienda
 * Ejecutar con: node scripts/debug-shop-storage.js
 */

console.log('🔍 Diagnóstico del localStorage de la tienda')
console.log('============================================')

// Simular localStorage para diagnóstico
const mockLocalStorage = {
  'shop-products': null,
  'shop-categories': null
}

// Intentar leer desde localStorage real (si estamos en un navegador)
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    mockLocalStorage['shop-products'] = window.localStorage.getItem('shop-products')
    mockLocalStorage['shop-categories'] = window.localStorage.getItem('shop-categories')
  } catch (error) {
    console.log('⚠️ No se pudo acceder al localStorage real')
  }
}

console.log('\n📦 Estado de shop-products:')
if (mockLocalStorage['shop-products']) {
  try {
    const products = JSON.parse(mockLocalStorage['shop-products'])
    console.log(`✅ Productos encontrados: ${products.length}`)
    console.log('📋 Primeros 3 productos:')
    products.slice(0, 3).forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - $${product.price}`)
    })
  } catch (error) {
    console.log('❌ Error parseando productos:', error.message)
  }
} else {
  console.log('❌ No hay productos guardados en localStorage')
}

console.log('\n📁 Estado de shop-categories:')
if (mockLocalStorage['shop-categories']) {
  try {
    const categories = JSON.parse(mockLocalStorage['shop-categories'])
    console.log(`✅ Categorías encontradas: ${categories.length}`)
    console.log('📋 Categorías:')
    categories.forEach((category, index) => {
      console.log(`   ${index + 1}. ${category.name} (${category.products?.length || 0} productos)`)
    })
  } catch (error) {
    console.log('❌ Error parseando categorías:', error.message)
  }
} else {
  console.log('❌ No hay categorías guardadas en localStorage')
}

console.log('\n🔧 Recomendaciones:')
console.log('1. Si no hay datos, la tienda debería cargar productos de muestra')
console.log('2. Verificar que el hook useShop se esté ejecutando correctamente')
console.log('3. Revisar si hay errores en la consola del navegador')
console.log('4. Verificar que localStorage esté habilitado en el navegador')

console.log('\n✨ Diagnóstico completado')
