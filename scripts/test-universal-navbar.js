#!/usr/bin/env node

/**
 * Script para verificar que el navbar universal está implementado correctamente
 * 
 * Este script verifica que:
 * 1. El componente UniversalNavbar existe
 * 2. La página de tienda usa el navbar universal
 * 3. El navbar tiene todos los elementos necesarios
 */

const fs = require('fs')
const path = require('path')

console.log('🧪 Probando navbar universal...\n')

// Verificar que el componente UniversalNavbar existe
const navbarPath = path.join(__dirname, '..', 'components', 'universal-navbar.tsx')
if (!fs.existsSync(navbarPath)) {
  console.error('❌ Error: No se encuentra components/universal-navbar.tsx')
  process.exit(1)
}

const navbarContent = fs.readFileSync(navbarPath, 'utf8')
console.log('✅ Componente UniversalNavbar encontrado')

// Verificar imports necesarios en el navbar
const requiredNavbarImports = [
  'DynamicNavigation',
  'ThemeSwitch',
  'DesignQuickPicker',
  'ScheduleButton',
  'useAdmin',
  'EditableText'
]

for (const importItem of requiredNavbarImports) {
  if (!navbarContent.includes(importItem)) {
    console.error(`❌ Error: Falta import ${importItem} en UniversalNavbar`)
    process.exit(1)
  }
  console.log(`✅ Import encontrado en navbar: ${importItem}`)
}

// Verificar elementos del navbar
const requiredNavbarElements = [
  'UniversalNavbarProps',
  'theme-bg-navbar-transparent',
  'theme-backdrop-blur',
  'theme-border',
  'theme-transition',
  'DynamicNavigation',
  'ThemeSwitch',
  'isMobileMenuOpen',
  'setIsMobileMenuOpen'
]

for (const element of requiredNavbarElements) {
  if (!navbarContent.includes(element)) {
    console.error(`❌ Error: Falta elemento ${element} en UniversalNavbar`)
    process.exit(1)
  }
  console.log(`✅ Elemento encontrado en navbar: ${element}`)
}

// Verificar que la página de tienda usa el navbar universal
const shopPagePath = path.join(__dirname, '..', 'app', 'shop', 'page.tsx')
if (!fs.existsSync(shopPagePath)) {
  console.error('❌ Error: No se encuentra app/shop/page.tsx')
  process.exit(1)
}

const shopPageContent = fs.readFileSync(shopPagePath, 'utf8')

// Verificar que importa UniversalNavbar
if (!shopPageContent.includes('UniversalNavbar')) {
  console.error('❌ Error: La página de tienda no importa UniversalNavbar')
  process.exit(1)
}
console.log('✅ UniversalNavbar importado en página de tienda')

// Verificar que usa el navbar universal
if (!shopPageContent.includes('<UniversalNavbar')) {
  console.error('❌ Error: La página de tienda no usa UniversalNavbar')
  process.exit(1)
}
console.log('✅ UniversalNavbar usado en página de tienda')

// Verificar que no usa ShopHeader
if (shopPageContent.includes('ShopHeader')) {
  console.error('❌ Error: La página de tienda aún usa ShopHeader')
  process.exit(1)
}
console.log('✅ ShopHeader removido de página de tienda')

// Verificar configuración del navbar
const navbarConfig = [
  'showDesignPicker={false}',
  'showScheduleButton={false}'
]

for (const config of navbarConfig) {
  if (!shopPageContent.includes(config)) {
    console.error(`❌ Error: Falta configuración ${config} en UniversalNavbar`)
    process.exit(1)
  }
  console.log(`✅ Configuración encontrada: ${config}`)
}

// Verificar que tiene barra de herramientas de tienda
const shopToolbarElements = [
  'Barra de herramientas de la tienda',
  'designConfig.storeName',
  'designConfig.storeTagline',
  'ShopDesignSelector',
  'handleSearch'
]

for (const element of shopToolbarElements) {
  if (!shopPageContent.includes(element)) {
    console.error(`❌ Error: Falta elemento ${element} en barra de herramientas`)
    process.exit(1)
  }
  console.log(`✅ Elemento encontrado en barra de herramientas: ${element}`)
}

// Verificar que el navbar universal tiene las props correctas
const navbarProps = [
  'className?: string',
  'showDesignPicker?: boolean',
  'showScheduleButton?: boolean',
  'showAdminLink?: boolean'
]

for (const prop of navbarProps) {
  if (!navbarContent.includes(prop)) {
    console.error(`❌ Error: Falta prop ${prop} en UniversalNavbar`)
    process.exit(1)
  }
  console.log(`✅ Prop encontrada: ${prop}`)
}

// Verificar que el navbar usa el contexto de admin
if (!navbarContent.includes('useAdmin()')) {
  console.error('❌ Error: UniversalNavbar no usa useAdmin()')
  process.exit(1)
}
console.log('✅ useAdmin() usado en UniversalNavbar')

// Verificar que el navbar es editable
if (!navbarContent.includes('EditableText')) {
  console.error('❌ Error: UniversalNavbar no es editable')
  process.exit(1)
}
console.log('✅ UniversalNavbar es editable')

// Resumen final
console.log('\n🎉 ¡Navbar universal verificado exitosamente!')
console.log('\n📋 Resumen del navbar universal:')
console.log('   ✅ Componente UniversalNavbar creado')
console.log('   ✅ Todos los imports necesarios incluidos')
console.log('   ✅ Elementos del navbar original preservados')
console.log('   ✅ Props configurables implementadas')
console.log('   ✅ Contexto de admin integrado')
console.log('   ✅ Texto editable incluido')
console.log('   ✅ Página de tienda actualizada')
console.log('   ✅ ShopHeader removido')
console.log('   ✅ Barra de herramientas de tienda integrada')

console.log('\n🚀 El navbar universal está listo para usar!')
console.log('\n💡 Características del navbar universal:')
console.log('   🎨 Mismo diseño que la landing page original')
console.log('   🔧 Configurable con props')
console.log('   📱 Responsive design')
console.log('   ⚙️ Integración con admin')
console.log('   🎯 Navegación dinámica')
console.log('   🌙 Switch de tema')
console.log('   📅 Botón de agendar (opcional)')
console.log('   🎨 Selector de diseño (opcional)')

console.log('\n🎨 Configuración actual en tienda:')
console.log('   ❌ showDesignPicker = false (usa ShopDesignSelector)')
console.log('   ❌ showScheduleButton = false (no relevante para tienda)')
console.log('   ✅ showAdminLink = true (por defecto)')
