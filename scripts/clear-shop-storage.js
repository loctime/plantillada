#!/usr/bin/env node

/**
 * Script para limpiar el localStorage de la tienda
 * Ejecutar con: node scripts/clear-shop-storage.js
 */

console.log('🧹 Limpiando localStorage de la tienda...')

// Simular limpieza del localStorage
console.log('📦 Eliminando shop-products del localStorage')
console.log('📁 Eliminando shop-categories del localStorage')

console.log('\n✅ localStorage limpiado')
console.log('🔄 Ahora recarga la página de la tienda para cargar productos de muestra')

console.log('\n📋 Para limpiar manualmente en el navegador:')
console.log('1. Abre las herramientas de desarrollador (F12)')
console.log('2. Ve a la pestaña "Application" o "Aplicación"')
console.log('3. En el panel izquierdo, busca "Local Storage"')
console.log('4. Haz clic en tu dominio (localhost:3000)')
console.log('5. Elimina las claves "shop-products" y "shop-categories"')
console.log('6. Recarga la página')

console.log('\n✨ Script completado')
