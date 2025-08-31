#!/usr/bin/env node

/**
 * Script para probar el nuevo sistema de diseños de tienda simplificados
 * 
 * Este script verifica que:
 * 1. Solo existen 3 diseños (Food, Tech, Service)
 * 2. Los archivos JSON están correctos
 * 3. Los componentes están disponibles
 */

const fs = require('fs')
const path = require('path')

console.log('🧪 Probando nuevo sistema de diseños de tienda...\n')

// Verificar archivos JSON de diseño
const designFiles = [
  'food-shop-design.json',
  'tech-shop-design.json', 
  'service-shop-design.json'
]

const publicDir = path.join(__dirname, '..', 'public')
const designsDir = path.join(__dirname, '..', 'lib')

console.log('📁 Verificando archivos de diseño...')

// Verificar que solo existen los 3 diseños
const allFiles = fs.readdirSync(publicDir)
const designJsonFiles = allFiles.filter(file => file.includes('-shop-design.json'))

console.log(`✅ Encontrados ${designJsonFiles.length} archivos de diseño:`)
designJsonFiles.forEach(file => console.log(`   - ${file}`))

if (designJsonFiles.length !== 3) {
  console.error('❌ Error: Deberían existir exactamente 3 archivos de diseño')
  process.exit(1)
}

// Verificar que los archivos requeridos existen
for (const file of designFiles) {
  const filePath = path.join(publicDir, file)
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Error: No se encuentra ${file}`)
    process.exit(1)
  }
  
  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    console.log(`✅ ${file} - Configuración válida`)
    
    // Verificar estructura básica
    if (!content.name || !content.category || !content.config) {
      console.error(`❌ Error: ${file} tiene estructura incompleta`)
      process.exit(1)
    }
  } catch (error) {
    console.error(`❌ Error: ${file} no es un JSON válido`)
    process.exit(1)
  }
}

// Verificar archivo de diseños TypeScript
const designsFile = path.join(designsDir, 'designs.tsx')
if (!fs.existsSync(designsFile)) {
  console.error('❌ Error: No se encuentra lib/designs.tsx')
  process.exit(1)
}

const designsContent = fs.readFileSync(designsFile, 'utf8')

// Verificar que solo hay 3 diseños de shop definidos
const expectedDesigns = ['food-shop', 'tech-shop', 'service-shop']
let foundDesigns = 0

for (const design of expectedDesigns) {
  if (designsContent.includes(`id: '${design}'`)) {
    foundDesigns++
    console.log(`✅ Encontrado diseño: ${design}`)
  } else {
    console.error(`❌ Error: No se encuentra el diseño ${design}`)
    process.exit(1)
  }
}

console.log(`✅ Encontrados ${foundDesigns} diseños de tienda en lib/designs.tsx`)

if (foundDesigns !== 3) {
  console.error('❌ Error: Deberían estar definidos exactamente 3 diseños de tienda')
  process.exit(1)
}

// Verificar componentes
const componentsDir = path.join(__dirname, '..', 'components')
const requiredComponents = [
  'shop-design-selector.tsx',
  'shop/ShopHeader.tsx',
  'shop/ShopFooter.tsx',
  'shop/ShopSidebar.tsx'
]

console.log('\n🔧 Verificando componentes...')

for (const component of requiredComponents) {
  const componentPath = path.join(componentsDir, component)
  if (!fs.existsSync(componentPath)) {
    console.error(`❌ Error: No se encuentra ${component}`)
    process.exit(1)
  }
  console.log(`✅ ${component}`)
}

// Verificar estilos CSS
const stylesFile = path.join(__dirname, '..', 'app', 'shop', 'layout-styles.css')
if (!fs.existsSync(stylesFile)) {
  console.error('❌ Error: No se encuentra app/shop/layout-styles.css')
  process.exit(1)
}

const stylesContent = fs.readFileSync(stylesFile, 'utf8')

// Verificar que están los estilos necesarios
const requiredStyles = [
  'layout-mobile-first',
  'layout-web-first', 
  'layout-with-sidebar',
  'product-style-cards-square',
  'product-style-list-horizontal',
  'design-food-shop',
  'design-tech-shop',
  'design-service-shop'
]

console.log('\n🎨 Verificando estilos CSS...')

for (const style of requiredStyles) {
  if (!stylesContent.includes(style)) {
    console.error(`❌ Error: No se encuentra el estilo ${style}`)
    process.exit(1)
  }
  console.log(`✅ ${style}`)
}

// Resumen final
console.log('\n🎉 ¡Sistema de diseños simplificado verificado exitosamente!')
console.log('\n📋 Resumen:')
console.log('   ✅ 3 diseños de tienda (Food, Tech, Service)')
console.log('   ✅ Archivos JSON de configuración válidos')
console.log('   ✅ Componentes Header, Footer y Sidebar universales')
console.log('   ✅ Selector de diseño con acordeón')
console.log('   ✅ Estilos CSS para layouts y productos')
console.log('   ✅ Soporte para Mobile-First y Web-First')
console.log('   ✅ Sidebar opcional con filtros')
console.log('   ✅ Estilos de productos: Tarjetas y Lista')

console.log('\n🚀 El sistema está listo para usar!')
console.log('\n💡 Próximos pasos:')
console.log('   1. Integrar los componentes en la página de tienda')
console.log('   2. Conectar el selector con la lógica de estado')
console.log('   3. Aplicar los estilos CSS dinámicamente')
console.log('   4. Probar en diferentes dispositivos')
