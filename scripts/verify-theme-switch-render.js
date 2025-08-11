// Script para verificar que el ThemeSwitch esté siendo renderizado
// Ejecutar con: node scripts/verify-theme-switch-render.js

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando que ThemeSwitch esté siendo renderizado...\n');

// 1. Verificar que ThemeSwitch esté importado en page.tsx
const pagePath = path.join(__dirname, '../app/page.tsx');
if (fs.existsSync(pagePath)) {
  console.log('📄 Verificando imports en page.tsx...');
  
  const pageContent = fs.readFileSync(pagePath, 'utf8');
  const lines = pageContent.split('\n');
  
  let importLine = -1;
  let usageLine = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('import { ThemeSwitch }')) {
      importLine = i + 1;
    }
    if (line.includes('<ThemeSwitch')) {
      usageLine = i + 1;
    }
  }
  
  if (importLine > 0) {
    console.log(`✅ ThemeSwitch importado en línea ${importLine}`);
  } else {
    console.log('❌ ThemeSwitch no está importado');
  }
  
  if (usageLine > 0) {
    console.log(`✅ ThemeSwitch usado en línea ${usageLine}`);
  } else {
    console.log('❌ ThemeSwitch no está siendo usado');
  }
  
  // Verificar contexto de uso
  const headerSection = pageContent.includes('function Header()') ? 
    pageContent.substring(pageContent.indexOf('function Header()')) : '';
  
  if (headerSection.includes('<ThemeSwitch')) {
    console.log('✅ ThemeSwitch está en el componente Header');
  } else {
    console.log('❌ ThemeSwitch no está en el componente Header');
  }
  
} else {
  console.log('❌ Archivo page.tsx no encontrado');
}

// 2. Verificar que no haya errores de sintaxis en ThemeSwitch
const themeSwitchPath = path.join(__dirname, '../components/theme-switch.tsx');
if (fs.existsSync(themeSwitchPath)) {
  console.log('\n📄 Verificando sintaxis de ThemeSwitch...');
  
  const themeSwitchContent = fs.readFileSync(themeSwitchPath, 'utf8');
  const lines = themeSwitchContent.split('\n');
  
  let braceCount = 0;
  let hasSyntaxError = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNumber = i + 1;
    
    // Contar llaves
    const openBraces = (line.match(/\{/g) || []).length;
    const closeBraces = (line.match(/\}/g) || []).length;
    braceCount += openBraces - closeBraces;
    
    // Verificar líneas problemáticas
    if (line.includes('export function') && !line.includes('{')) {
      console.log(`⚠️  Línea ${lineNumber}: export function sin llave de apertura`);
      hasSyntaxError = true;
    }
  }
  
  if (braceCount !== 0) {
    console.log(`❌ Desbalance de llaves: ${braceCount > 0 ? 'faltan cerrar' : 'faltan abrir'} ${Math.abs(braceCount)} llaves`);
    hasSyntaxError = true;
  } else {
    console.log('✅ Balance de llaves correcto en ThemeSwitch');
  }
  
  if (!hasSyntaxError) {
    console.log('✅ No se encontraron errores de sintaxis en ThemeSwitch');
  }
  
} else {
  console.log('\n❌ Archivo theme-switch.tsx no encontrado');
}

// 3. Verificar que el hook useTheme esté disponible
const themeHookPath = path.join(__dirname, '../hooks/use-theme.ts');
if (fs.existsSync(themeHookPath)) {
  console.log('\n📄 Verificando hook useTheme...');
  
  const themeHookContent = fs.readFileSync(themeHookPath, 'utf8');
  
  const hasExport = themeHookContent.includes('export function useTheme()');
  const hasReturn = themeHookContent.includes('return {');
  const hasIsDarkMode = themeHookContent.includes('isDarkMode,');
  const hasToggleTheme = themeHookContent.includes('toggleTheme,');
  
  console.log(`  - Export function: ${hasExport ? '✅' : '❌'}`);
  console.log(`  - Return statement: ${hasReturn ? '✅' : '❌'}`);
  console.log(`  - isDarkMode exportado: ${hasIsDarkMode ? '✅' : '❌'}`);
  console.log(`  - toggleTheme exportado: ${hasToggleTheme ? '✅' : '❌'}`);
  
} else {
  console.log('\n❌ Archivo use-theme.ts no encontrado');
}

// 4. Verificar que el contexto de administración esté disponible
const adminContextPath = path.join(__dirname, '../lib/admin-context.tsx');
if (fs.existsSync(adminContextPath)) {
  console.log('\n📄 Verificando contexto de administración...');
  
  const adminContextContent = fs.readFileSync(adminContextPath, 'utf8');
  
  const hasAdminProvider = adminContextContent.includes('export function AdminProvider');
  const hasUseAdmin = adminContextContent.includes('export function useAdmin');
  const hasConfig = adminContextContent.includes('config: Config | null');
  
  console.log(`  - AdminProvider exportado: ${hasAdminProvider ? '✅' : '❌'}`);
  console.log(`  - useAdmin exportado: ${hasUseAdmin ? '✅' : '❌'}`);
  console.log(`  - Config disponible: ${hasConfig ? '✅' : '❌'}`);
  
} else {
  console.log('\n❌ Archivo admin-context.tsx no encontrado');
}

// 5. Verificar que el layout incluya el AdminProvider
const layoutPath = path.join(__dirname, '../app/layout.tsx');
if (fs.existsSync(layoutPath)) {
  console.log('\n📄 Verificando layout...');
  
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  
  const hasAdminProvider = layoutContent.includes('<AdminProvider');
  const hasThemeProvider = layoutContent.includes('<ThemeProvider');
  
  console.log(`  - AdminProvider en layout: ${hasAdminProvider ? '✅' : '❌'}`);
  console.log(`  - ThemeProvider en layout: ${hasThemeProvider ? '✅' : '❌'}`);
  
} else {
  console.log('\n❌ Archivo layout.tsx no encontrado');
}

console.log('\n🎯 Resumen de verificación:');
console.log('Si todos los elementos están marcados con ✅, el ThemeSwitch debería estar funcionando.');
console.log('Si hay elementos marcados con ❌, esos son los problemas que necesitan ser solucionados.');
console.log('\n💡 Para probar en el navegador:');
console.log('1. Abre la aplicación en el navegador');
console.log('2. Abre las herramientas de desarrollador (F12)');
console.log('3. Ve a la pestaña Console');
console.log('4. Busca mensajes que empiecen con 🎛️ ThemeSwitch');
console.log('5. Si no aparecen, el componente no se está renderizando');
console.log('6. Haz clic en el botón de tema y busca mensajes que empiecen con 🖱️');
console.log('7. Verifica que aparezcan mensajes del hook useTheme');
