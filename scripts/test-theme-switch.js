// Script para probar el switch de tema
// Ejecutar con: node scripts/test-theme-switch.js

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración del switch de tema...\n');

// 1. Verificar que el hook use-theme.ts existe y tiene la estructura correcta
const themeHookPath = path.join(__dirname, '../hooks/use-theme.ts');
if (fs.existsSync(themeHookPath)) {
  console.log('✅ Hook use-theme.ts encontrado');
  
  const themeHookContent = fs.readFileSync(themeHookPath, 'utf8');
  
  // Verificar que tiene las funciones necesarias
  const hasUseTheme = themeHookContent.includes('export function useTheme()');
  const hasToggleTheme = themeHookContent.includes('toggleTheme');
  const hasSetTheme = themeHookContent.includes('setTheme');
  const hasIsDarkMode = themeHookContent.includes('isDarkMode');
  
  console.log(`  - Función useTheme: ${hasUseTheme ? '✅' : '❌'}`);
  console.log(`  - Función toggleTheme: ${hasToggleTheme ? '✅' : '❌'}`);
  console.log(`  - Función setTheme: ${hasSetTheme ? '✅' : '❌'}`);
  console.log(`  - Variable isDarkMode: ${hasIsDarkMode ? '✅' : '❌'}`);
  
  // Verificar que aplica las variables CSS
  const hasCSSVariables = themeHookContent.includes('setProperty');
  const hasThemeConfig = themeHookContent.includes('config?.theme');
  
  console.log(`  - Aplica variables CSS: ${hasCSSVariables ? '✅' : '❌'}`);
  console.log(`  - Usa configuración de tema: ${hasThemeConfig ? '✅' : '❌'}`);
  
} else {
  console.log('❌ Hook use-theme.ts no encontrado');
}

// 2. Verificar que el componente ThemeSwitch existe
const themeSwitchPath = path.join(__dirname, '../components/theme-switch.tsx');
if (fs.existsSync(themeSwitchPath)) {
  console.log('\n✅ Componente ThemeSwitch encontrado');
  
  const themeSwitchContent = fs.readFileSync(themeSwitchPath, 'utf8');
  
  // Verificar que usa el hook
  const usesHook = themeSwitchContent.includes('useTheme');
  const hasToggleButton = themeSwitchContent.includes('onClick={toggleTheme}');
  const hasIcons = themeSwitchContent.includes('Sun') && themeSwitchContent.includes('Moon');
  
  console.log(`  - Usa hook useTheme: ${usesHook ? '✅' : '❌'}`);
  console.log(`  - Tiene botón de toggle: ${hasToggleButton ? '✅' : '❌'}`);
  console.log(`  - Tiene iconos Sun/Moon: ${hasIcons ? '✅' : '❌'}`);
  
} else {
  console.log('\n❌ Componente ThemeSwitch no encontrado');
}

// 3. Verificar configuración por defecto
const configPath = path.join(__dirname, '../public/config.json');
if (fs.existsSync(configPath)) {
  console.log('\n✅ Archivo config.json encontrado');
  
  const configContent = fs.readFileSync(configPath, 'utf8');
  const config = JSON.parse(configContent);
  
  // Verificar estructura del tema
  const hasTheme = config.theme;
  const hasLightTheme = config.theme?.light;
  const hasDarkTheme = config.theme?.dark;
  
  console.log(`  - Tiene configuración de tema: ${hasTheme ? '✅' : '❌'}`);
  console.log(`  - Tiene tema claro: ${hasLightTheme ? '✅' : '❌'}`);
  console.log(`  - Tiene tema oscuro: ${hasDarkTheme ? '✅' : '❌'}`);
  
  if (hasLightTheme) {
    const lightColors = Object.keys(config.theme.light);
    console.log(`  - Colores del tema claro: ${lightColors.join(', ')}`);
  }
  
  if (hasDarkTheme) {
    const darkColors = Object.keys(config.theme.dark);
    console.log(`  - Colores del tema oscuro: ${darkColors.join(', ')}`);
  }
  
} else {
  console.log('\n❌ Archivo config.json no encontrado');
}

// 4. Verificar CSS global
const cssPath = path.join(__dirname, '../app/globals.css');
if (fs.existsSync(cssPath)) {
  console.log('\n✅ Archivo globals.css encontrado');
  
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  
  // Verificar variables CSS personalizadas
  const hasCustomVariables = cssContent.includes('--background-color');
  const hasDarkClass = cssContent.includes('.dark {');
  const hasCustomClasses = cssContent.includes('.custom-bg');
  
  console.log(`  - Tiene variables CSS personalizadas: ${hasCustomVariables ? '✅' : '❌'}`);
  console.log(`  - Tiene clase .dark: ${hasDarkClass ? '✅' : '❌'}`);
  console.log(`  - Tiene clases personalizadas: ${hasCustomClasses ? '✅' : '❌'}`);
  
} else {
  console.log('\n❌ Archivo globals.css no encontrado');
}

// 5. Verificar que ThemeSwitch está siendo usado
const pagePath = path.join(__dirname, '../app/page.tsx');
if (fs.existsSync(pagePath)) {
  console.log('\n✅ Archivo page.tsx encontrado');
  
  const pageContent = fs.readFileSync(pagePath, 'utf8');
  
  const importsThemeSwitch = pageContent.includes('import { ThemeSwitch }');
  const usesThemeSwitch = pageContent.includes('<ThemeSwitch');
  
  console.log(`  - Importa ThemeSwitch: ${importsThemeSwitch ? '✅' : '❌'}`);
  console.log(`  - Usa componente ThemeSwitch: ${usesThemeSwitch ? '✅' : '❌'}`);
  
} else {
  console.log('\n❌ Archivo page.tsx no encontrado');
}

// 6. Verificar configuración del loader
const loaderPath = path.join(__dirname, '../lib/config-loader.ts');
if (fs.existsSync(loaderPath)) {
  console.log('\n✅ Archivo config-loader.ts encontrado');
  
  const loaderContent = fs.readFileSync(loaderPath, 'utf8');
  
  // Verificar interfaces
  const hasColorConfig = loaderContent.includes('interface ColorConfig');
  const hasThemeConfig = loaderContent.includes('interface ThemeConfig');
  const hasConfigInterface = loaderContent.includes('interface Config');
  
  console.log(`  - Tiene interface ColorConfig: ${hasColorConfig ? '✅' : '❌'}`);
  console.log(`  - Tiene interface ThemeConfig: ${hasThemeConfig ? '✅' : '❌'}`);
  console.log(`  - Tiene interface Config: ${hasConfigInterface ? '✅' : '❌'}`);
  
  // Verificar que el tema está incluido en la configuración por defecto
  const hasDefaultTheme = loaderContent.includes('theme: {');
  
  console.log(`  - Incluye tema en configuración por defecto: ${hasDefaultTheme ? '✅' : '❌'}`);
  
} else {
  console.log('\n❌ Archivo config-loader.ts no encontrado');
}

console.log('\n🎯 Resumen de verificación:');
console.log('Si todos los elementos están marcados con ✅, el switch de tema debería funcionar correctamente.');
console.log('Si hay elementos marcados con ❌, esos son los problemas que necesitan ser solucionados.');
console.log('\n💡 Para probar el switch de tema:');
console.log('1. Abre la aplicación en el navegador');
console.log('2. Busca el botón de tema (icono de sol/luna) en la barra de navegación');
console.log('3. Haz clic en él para cambiar entre modo claro y oscuro');
console.log('4. Verifica que los colores cambien correctamente');
console.log('5. Verifica que la preferencia se guarde en localStorage');
