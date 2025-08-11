// Script para depurar el switch de tema
// Ejecutar con: node scripts/debug-theme.js

const fs = require('fs');
const path = require('path');

console.log('🔍 Depurando configuración del switch de tema...\n');

// 1. Verificar el hook use-theme.ts línea por línea
const themeHookPath = path.join(__dirname, '../hooks/use-theme.ts');
if (fs.existsSync(themeHookPath)) {
  console.log('📄 Analizando hook use-theme.ts...');
  
  const themeHookContent = fs.readFileSync(themeHookPath, 'utf8');
  const lines = themeHookContent.split('\n');
  
  // Buscar problemas de sintaxis
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
    if (line.includes('if (config?.theme)') && !line.includes('{')) {
      console.log(`⚠️  Línea ${lineNumber}: if sin llave de apertura`);
      hasSyntaxError = true;
    }
    
    if (line.includes('useEffect') && !line.includes('{')) {
      console.log(`⚠️  Línea ${lineNumber}: useEffect sin llave de apertura`);
      hasSyntaxError = true;
    }
  }
  
  if (braceCount !== 0) {
    console.log(`❌ Desbalance de llaves: ${braceCount > 0 ? 'faltan cerrar' : 'faltan abrir'} ${Math.abs(braceCount)} llaves`);
    hasSyntaxError = true;
  } else {
    console.log('✅ Balance de llaves correcto');
  }
  
  if (!hasSyntaxError) {
    console.log('✅ No se encontraron errores de sintaxis en el hook');
  }
  
  // Verificar que las funciones estén completas
  const hasToggleTheme = themeHookContent.includes('const toggleTheme = () => {');
  const hasSetTheme = themeHookContent.includes('const setTheme = (dark: boolean) => {');
  const hasReturn = themeHookContent.includes('return {');
  
  console.log(`  - Función toggleTheme: ${hasToggleTheme ? '✅' : '❌'}`);
  console.log(`  - Función setTheme: ${hasSetTheme ? '✅' : '❌'}`);
  console.log(`  - Return statement: ${hasReturn ? '✅' : '❌'}`);
  
} else {
  console.log('❌ Hook use-theme.ts no encontrado');
}

// 2. Verificar que el componente ThemeSwitch esté correctamente implementado
const themeSwitchPath = path.join(__dirname, '../components/theme-switch.tsx');
if (fs.existsSync(themeSwitchPath)) {
  console.log('\n📄 Analizando componente ThemeSwitch...');
  
  const themeSwitchContent = fs.readFileSync(themeSwitchPath, 'utf8');
  
  // Verificar estructura del componente
  const hasExport = themeSwitchContent.includes('export function ThemeSwitch()');
  const hasUseTheme = themeSwitchContent.includes('const { isDarkMode, toggleTheme } = useTheme()');
  const hasReturn = themeSwitchContent.includes('return (');
  const hasClosing = themeSwitchContent.includes('</TooltipProvider>');
  
  console.log(`  - Export function: ${hasExport ? '✅' : '❌'}`);
  console.log(`  - Usa hook useTheme: ${hasUseTheme ? '✅' : '❌'}`);
  console.log(`  - Return statement: ${hasReturn ? '✅' : '❌'}`);
  console.log(`  - Cierre correcto: ${hasClosing ? '✅' : '❌'}`);
  
  // Verificar que el botón esté correctamente configurado
  const hasButton = themeSwitchContent.includes('<Button');
  const hasOnClick = themeSwitchContent.includes('onClick={toggleTheme}');
  const hasIcons = themeSwitchContent.includes('Sun') && themeSwitchContent.includes('Moon');
  
  console.log(`  - Botón presente: ${hasButton ? '✅' : '❌'}`);
  console.log(`  - onClick configurado: ${hasOnClick ? '✅' : '❌'}`);
  console.log(`  - Iconos presentes: ${hasIcons ? '✅' : '❌'}`);
  
} else {
  console.log('\n❌ Componente ThemeSwitch no encontrado');
}

// 3. Verificar configuración del tema
const configPath = path.join(__dirname, '../public/config.json');
if (fs.existsSync(configPath)) {
  console.log('\n📄 Analizando configuración del tema...');
  
  try {
    const configContent = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configContent);
    
    if (config.theme) {
      console.log('✅ Configuración de tema encontrada');
      
      if (config.theme.light) {
        const lightColors = Object.keys(config.theme.light);
        console.log(`  - Tema claro: ${lightColors.length} colores configurados`);
        
        // Verificar que todos los colores necesarios estén presentes
        const requiredColors = [
          'backgroundColor', 'sectionBackground', 'navbarBackground', 
          'textColor', 'accentColor', 'primaryButtonColor', 
          'secondaryButtonColor', 'outlineButtonColor'
        ];
        
        const missingColors = requiredColors.filter(color => !config.theme.light[color]);
        if (missingColors.length > 0) {
          console.log(`  ⚠️  Colores faltantes en tema claro: ${missingColors.join(', ')}`);
        } else {
          console.log('  ✅ Todos los colores del tema claro están configurados');
        }
      }
      
      if (config.theme.dark) {
        const darkColors = Object.keys(config.theme.dark);
        console.log(`  - Tema oscuro: ${darkColors.length} colores configurados`);
        
        // Verificar que todos los colores necesarios estén presentes
        const requiredColors = [
          'backgroundColor', 'sectionBackground', 'navbarBackground', 
          'textColor', 'accentColor', 'primaryButtonColor', 
          'secondaryButtonColor', 'outlineButtonColor'
        ];
        
        const missingColors = requiredColors.filter(color => !config.theme.dark[color]);
        if (missingColors.length > 0) {
          console.log(`  ⚠️  Colores faltantes en tema oscuro: ${missingColors.join(', ')}`);
        } else {
          console.log('  ✅ Todos los colores del tema oscuro están configurados');
        }
      }
    } else {
      console.log('❌ No se encontró configuración de tema');
    }
    
  } catch (error) {
    console.log(`❌ Error al parsear config.json: ${error.message}`);
  }
  
} else {
  console.log('\n❌ Archivo config.json no encontrado');
}

// 4. Verificar CSS global
const cssPath = path.join(__dirname, '../app/globals.css');
if (fs.existsSync(cssPath)) {
  console.log('\n📄 Analizando CSS global...');
  
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  
  // Verificar variables CSS
  const cssVariables = [
    '--background-color', '--section-background', '--navbar-background',
    '--text-color', '--accent-color', '--primary-button-color',
    '--secondary-button-color', '--outline-button-color'
  ];
  
  const missingVariables = cssVariables.filter(variable => !cssContent.includes(variable));
  if (missingVariables.length > 0) {
    console.log(`  ⚠️  Variables CSS faltantes: ${missingVariables.join(', ')}`);
  } else {
    console.log('  ✅ Todas las variables CSS están definidas');
  }
  
  // Verificar clase .dark
  if (cssContent.includes('.dark {')) {
    console.log('  ✅ Clase .dark está definida');
  } else {
    console.log('  ❌ Clase .dark no está definida');
  }
  
  // Verificar clases personalizadas
  const customClasses = [
    '.custom-bg', '.custom-section-bg', '.custom-navbar-bg',
    '.custom-text', '.custom-accent', '.custom-primary-button-bg'
  ];
  
  const missingClasses = customClasses.filter(cls => !cssContent.includes(cls));
  if (missingClasses.length > 0) {
    console.log(`  ⚠️  Clases CSS faltantes: ${missingClasses.join(', ')}`);
  } else {
    console.log('  ✅ Todas las clases CSS personalizadas están definidas');
  }
  
} else {
  console.log('\n❌ Archivo globals.css no encontrado');
}

console.log('\n🎯 Resumen de depuración:');
console.log('Si todos los elementos están marcados con ✅, el switch de tema debería funcionar correctamente.');
console.log('Si hay elementos marcados con ❌ o ⚠️, esos son los problemas que necesitan ser solucionados.');
console.log('\n💡 Próximos pasos:');
console.log('1. Si hay errores de sintaxis, corregirlos primero');
console.log('2. Verificar que el componente ThemeSwitch esté siendo renderizado');
console.log('3. Probar el switch de tema en el navegador');
console.log('4. Verificar la consola del navegador para errores de JavaScript');
