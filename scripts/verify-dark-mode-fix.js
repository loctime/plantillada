// Script para verificar las correcciones del modo oscuro
// Ejecutar con: node scripts/verify-dark-mode-fix.js

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando correcciones del modo oscuro...\n');

// 1. Verificar que las tarjetas de sesiones usen custom-bg
const pagePath = path.join(__dirname, '../app/page.tsx');
if (fs.existsSync(pagePath)) {
  console.log('📄 Verificando tarjetas de sesiones...');
  
  const pageContent = fs.readFileSync(pagePath, 'utf8');
  
  // Buscar la línea donde están las tarjetas de sesiones
  const sessionCardsLine = pageContent.includes('bg-white') ? 
    pageContent.split('\n').findIndex(line => line.includes('bg-white') && line.includes('article')) : -1;
  
  if (sessionCardsLine > 0) {
    console.log(`❌ Línea ${sessionCardsLine + 1}: Tarjeta de sesión aún usa bg-white`);
  } else {
    console.log('✅ Tarjetas de sesiones usan custom-bg');
  }
  
  // Verificar que usen custom-bg
  const usesCustomBg = pageContent.includes('custom-bg') && pageContent.includes('article');
  console.log(`  - Usa custom-bg: ${usesCustomBg ? '✅' : '❌'}`);
  
} else {
  console.log('❌ Archivo page.tsx no encontrado');
}

// 2. Verificar componente EditableText
const editableTextPath = path.join(__dirname, '../components/editable-text.tsx');
if (fs.existsSync(editableTextPath)) {
  console.log('\n📄 Verificando EditableText...');
  
  const editableTextContent = fs.readFileSync(editableTextPath, 'utf8');
  
  // Verificar hover en modo oscuro
  const hasDarkHover = editableTextContent.includes('dark:hover:bg-emerald-900/20');
  console.log(`  - Hover en modo oscuro: ${hasDarkHover ? '✅' : '❌'}`);
  
  // Verificar botón de edición
  const hasCustomBgButton = editableTextContent.includes('custom-bg') && editableTextContent.includes('Button');
  console.log(`  - Botón usa custom-bg: ${hasCustomBgButton ? '✅' : '❌'}`);
  
  // Verificar que no use bg-white
  const hasBgWhite = editableTextContent.includes('bg-white');
  console.log(`  - No usa bg-white: ${!hasBgWhite ? '✅' : '❌'}`);
  
} else {
  console.log('\n❌ Archivo editable-text.tsx no encontrado');
}

// 3. Verificar componente EditableList
const editableListPath = path.join(__dirname, '../components/editable-list.tsx');
if (fs.existsSync(editableListPath)) {
  console.log('\n📄 Verificando EditableList...');
  
  const editableListContent = fs.readFileSync(editableListPath, 'utf8');
  
  // Verificar hover en modo oscuro
  const hasDarkHover = editableListContent.includes('dark:hover:bg-emerald-900/20');
  console.log(`  - Hover en modo oscuro: ${hasDarkHover ? '✅' : '❌'}`);
  
  // Verificar botón de edición
  const hasCustomBgButton = editableListContent.includes('custom-bg') && editableListContent.includes('Button');
  console.log(`  - Botón usa custom-bg: ${hasCustomBgButton ? '✅' : '❌'}`);
  
  // Verificar hover del botón de eliminar
  const hasRedDarkHover = editableListContent.includes('dark:hover:bg-red-900/20');
  console.log(`  - Hover rojo en modo oscuro: ${hasRedDarkHover ? '✅' : '❌'}`);
  
} else {
  console.log('\n❌ Archivo editable-list.tsx no encontrado');
}

// 4. Verificar componente EditableUrl
const editableUrlPath = path.join(__dirname, '../components/editable-url.tsx');
if (fs.existsSync(editableUrlPath)) {
  console.log('\n📄 Verificando EditableUrl...');
  
  const editableUrlContent = fs.readFileSync(editableUrlPath, 'utf8');
  
  // Verificar hover en modo oscuro
  const hasDarkHover = editableUrlContent.includes('dark:hover:bg-emerald-900/20');
  console.log(`  - Hover en modo oscuro: ${hasDarkHover ? '✅' : '❌'}`);
  
  // Verificar botón de edición
  const hasCustomBgButton = editableUrlContent.includes('custom-bg') && editableUrlContent.includes('Button');
  console.log(`  - Botón usa custom-bg: ${hasCustomBgButton ? '✅' : '❌'}`);
  
} else {
  console.log('\n❌ Archivo editable-url.tsx no encontrado');
}

// 5. Verificar CSS global
const cssPath = path.join(__dirname, '../app/globals.css');
if (fs.existsSync(cssPath)) {
  console.log('\n📄 Verificando CSS global...');
  
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  
  // Verificar que las clases personalizadas estén definidas
  const hasCustomBg = cssContent.includes('.custom-bg {');
  const hasCustomText = cssContent.includes('.custom-text {');
  const hasDarkClass = cssContent.includes('.dark {');
  
  console.log(`  - Clase .custom-bg definida: ${hasCustomBg ? '✅' : '❌'}`);
  console.log(`  - Clase .custom-text definida: ${hasCustomText ? '✅' : '❌'}`);
  console.log(`  - Clase .dark definida: ${hasDarkClass ? '✅' : '❌'}`);
  
  // Verificar variables CSS
  const hasBackgroundColor = cssContent.includes('--background-color:');
  const hasTextColor = cssContent.includes('--text-color:');
  
  console.log(`  - Variable --background-color: ${hasBackgroundColor ? '✅' : '❌'}`);
  console.log(`  - Variable --text-color: ${hasTextColor ? '✅' : '❌'}`);
  
} else {
  console.log('\n❌ Archivo globals.css no encontrado');
}

// 6. Verificar hook useTheme
const themeHookPath = path.join(__dirname, '../hooks/use-theme.ts');
if (fs.existsSync(themeHookPath)) {
  console.log('\n📄 Verificando hook useTheme...');
  
  const themeHookContent = fs.readFileSync(themeHookPath, 'utf8');
  
  // Verificar que aplique las variables CSS
  const hasSetProperty = themeHookContent.includes('setProperty');
  const hasBackgroundColor = themeHookContent.includes('--background-color');
  const hasTextColor = themeHookContent.includes('--text-color');
  
  console.log(`  - Aplica setProperty: ${hasSetProperty ? '✅' : '❌'}`);
  console.log(`  - Aplica --background-color: ${hasBackgroundColor ? '✅' : '❌'}`);
  console.log(`  - Aplica --text-color: ${hasTextColor ? '✅' : '❌'}`);
  
  // Verificar logs de depuración
  const hasLogs = themeHookContent.includes('console.log');
  console.log(`  - Tiene logs de depuración: ${hasLogs ? '✅' : '❌'}`);
  
} else {
  console.log('\n❌ Archivo use-theme.ts no encontrado');
}

console.log('\n🎯 Resumen de verificación:');
console.log('Si todos los elementos están marcados con ✅, las correcciones del modo oscuro están aplicadas.');
console.log('Si hay elementos marcados con ❌, esos necesitan ser corregidos.');
console.log('\n💡 Para probar en el navegador:');
console.log('1. Abre la aplicación en el navegador');
console.log('2. Activa el modo oscuro con el botón de tema');
console.log('3. Verifica que las tarjetas de sesiones tengan fondo oscuro y texto claro');
console.log('4. Verifica que los elementos editables sean visibles en modo oscuro');
console.log('5. Verifica que los hovers funcionen correctamente en modo oscuro');
