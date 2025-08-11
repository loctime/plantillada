// Script para verificar el nuevo layout del header
// Ejecutar con: node scripts/verify-header-layout.js

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando nuevo layout del header...\n');

// 1. Verificar que el header use justify-between
const pagePath = path.join(__dirname, '../app/page.tsx');
if (fs.existsSync(pagePath)) {
  console.log('📄 Verificando layout del header...');
  
  const pageContent = fs.readFileSync(pagePath, 'utf8');
  
  // Verificar que use justify-between
  const hasJustifyBetween = pageContent.includes('justify-between');
  console.log(`  - Usa justify-between: ${hasJustifyBetween ? '✅' : '❌'}`);
  
  // Verificar que tenga tres secciones principales
  const hasLeftSection = pageContent.includes('Lado izquierdo: Título');
  const hasCenterSection = pageContent.includes('Centro: Navegación');
  const hasRightSection = pageContent.includes('Lado derecho: Botones');
  
  console.log(`  - Sección izquierda: ${hasLeftSection ? '✅' : '❌'}`);
  console.log(`  - Sección centro: ${hasCenterSection ? '✅' : '❌'}`);
  console.log(`  - Sección derecha: ${hasRightSection ? '✅' : '❌'}`);
  
  // Verificar menú móvil
  const hasMobileMenu = pageContent.includes('Menú móvil');
  const hasMobileButton = pageContent.includes('Botón de menú móvil');
  const hasMenuIcon = pageContent.includes('Menu className');
  const hasXIcon = pageContent.includes('X className');
  
  console.log(`  - Menú móvil: ${hasMobileMenu ? '✅' : '❌'}`);
  console.log(`  - Botón móvil: ${hasMobileButton ? '✅' : '❌'}`);
  console.log(`  - Icono Menu: ${hasMenuIcon ? '✅' : '❌'}`);
  console.log(`  - Icono X: ${hasXIcon ? '✅' : '❌'}`);
  
} else {
  console.log('❌ Archivo page.tsx no encontrado');
}

// 2. Verificar componente DynamicNavigation
const navPath = path.join(__dirname, '../components/dynamic-navigation.tsx');
if (fs.existsSync(navPath)) {
  console.log('\n📄 Verificando DynamicNavigation...');
  
  const navContent = fs.readFileSync(navPath, 'utf8');
  
  // Verificar prop isMobile
  const hasIsMobileProp = navContent.includes('isMobile?: boolean');
  console.log(`  - Prop isMobile: ${hasIsMobileProp ? '✅' : '❌'}`);
  
  // Verificar lógica condicional
  const hasConditionalNav = navContent.includes('isMobile ? "flex flex-col space-y-4" : "hidden md:flex space-x-8"');
  console.log(`  - Navegación condicional: ${hasConditionalNav ? '✅' : '❌'}`);
  
  // Verificar estilos móviles
  const hasMobileStyles = navContent.includes('dark:hover:bg-gray-800');
  console.log(`  - Estilos móviles: ${hasMobileStyles ? '✅' : '❌'}`);
  
  // Verificar import de cn
  const hasCnImport = navContent.includes("import { cn } from '@/lib/utils'");
  console.log(`  - Import cn: ${hasCnImport ? '✅' : '❌'}`);
  
} else {
  console.log('\n❌ Archivo dynamic-navigation.tsx no encontrado');
}

// 3. Verificar imports
const pageContent = fs.readFileSync(pagePath, 'utf8');
const hasMenuImport = pageContent.includes('Menu, X');
const hasUseStateImport = pageContent.includes('useState');

console.log('\n📄 Verificando imports...');
console.log(`  - Iconos Menu, X: ${hasMenuImport ? '✅' : '❌'}`);
console.log(`  - useState: ${hasUseStateImport ? '✅' : '❌'}`);

console.log('\n🎯 Resumen de verificación:');
console.log('Si todos los elementos están marcados con ✅, el nuevo layout del header está implementado correctamente.');
console.log('\n💡 Beneficios del nuevo layout:');
console.log('1. Mejor distribución del espacio');
console.log('2. Navegación centrada en desktop');
console.log('3. Botones organizados en el lado derecho');
console.log('4. Menú hamburguesa para móviles');
console.log('5. Más espacio para agregar elementos futuros');
