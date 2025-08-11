// Script para probar la funcionalidad del tema
// Este script simula las acciones que haría el usuario en el navegador

console.log('🧪 Probando funcionalidad del switch de tema...\n');

// Simular localStorage
const mockLocalStorage = {
  getItem: (key) => {
    console.log(`📥 localStorage.getItem("${key}")`);
    return null; // Simular que no hay tema guardado
  },
  setItem: (key, value) => {
    console.log(`📤 localStorage.setItem("${key}", "${value}")`);
  }
};

// Simular document
const mockDocument = {
  documentElement: {
    style: {
      setProperty: (property, value) => {
        console.log(`🎨 CSS: ${property} = ${value}`);
      }
    }
  },
  body: {
    classList: {
      toggle: (className, force) => {
        console.log(`🎭 Toggle class "${className}" = ${force}`);
      }
    }
  }
};

// Simular window.matchMedia
const mockMatchMedia = (query) => ({
  matches: query.includes('dark') ? false : true // Simular preferencia de sistema claro
});

// Simular configuración de tema
const mockConfig = {
  theme: {
    light: {
      backgroundColor: '#ffffff',
      sectionBackground: '#f8fafc',
      navbarBackground: '#ffffff',
      textColor: '#1e293b',
      accentColor: '#10b981',
      primaryButtonColor: '#10b981',
      secondaryButtonColor: '#3b82f6',
      outlineButtonColor: '#6b7280'
    },
    dark: {
      backgroundColor: '#0f172a',
      sectionBackground: '#1e293b',
      navbarBackground: '#0f172a',
      textColor: '#f1f5f9',
      accentColor: '#10b981',
      primaryButtonColor: '#10b981',
      secondaryButtonColor: '#3b82f6',
      outlineButtonColor: '#9ca3af'
    }
  }
};

console.log('🔧 Configuración de prueba:');
console.log('  - Tema guardado en localStorage: ninguno');
console.log('  - Preferencia del sistema: claro');
console.log('  - Configuración de tema: disponible\n');

// Simular el hook useTheme
function simulateUseTheme() {
  let isDarkMode = false;
  
  // Simular detección inicial
  console.log('🔄 Detección inicial del tema:');
  const savedTheme = mockLocalStorage.getItem('theme');
  if (savedTheme) {
    isDarkMode = savedTheme === 'dark';
    console.log(`  - Tema guardado encontrado: ${savedTheme}`);
  } else {
    const prefersDark = mockMatchMedia('(prefers-color-scheme: dark)').matches;
    isDarkMode = prefersDark;
    console.log(`  - Usando preferencia del sistema: ${prefersDark ? 'oscuro' : 'claro'}`);
  }
  
  console.log(`  - Estado inicial: ${isDarkMode ? 'oscuro' : 'claro'}\n`);
  
  // Simular aplicación del tema
  function applyTheme() {
    console.log('🎨 Aplicando tema:');
    const theme = isDarkMode ? 'dark' : 'light';
    mockLocalStorage.setItem('theme', theme);
    
    if (mockConfig?.theme) {
      const activeTheme = mockConfig.theme[isDarkMode ? 'dark' : 'light'];
      console.log(`  - Tema activo: ${theme}`);
      
      // Aplicar variables CSS
      const root = mockDocument.documentElement;
      root.style.setProperty('--background-color', activeTheme.backgroundColor);
      root.style.setProperty('--section-background', activeTheme.sectionBackground);
      root.style.setProperty('--navbar-background', activeTheme.navbarBackground);
      root.style.setProperty('--text-color', activeTheme.textColor);
      root.style.setProperty('--accent-color', activeTheme.accentColor);
      root.style.setProperty('--primary-button-color', activeTheme.primaryButtonColor);
      root.style.setProperty('--secondary-button-color', activeTheme.secondaryButtonColor);
      root.style.setProperty('--outline-button-color', activeTheme.outlineButtonColor);
      
      // Aplicar clase de tema
      mockDocument.body.classList.toggle('dark', isDarkMode);
    }
  }
  
  // Aplicar tema inicial
  applyTheme();
  
  // Simular toggle del tema
  function toggleTheme() {
    console.log('\n🔄 Toggle del tema:');
    isDarkMode = !isDarkMode;
    console.log(`  - Nuevo estado: ${isDarkMode ? 'oscuro' : 'claro'}`);
    applyTheme();
  }
  
  return {
    isDarkMode: () => isDarkMode,
    toggleTheme
  };
}

// Ejecutar simulación
const theme = simulateUseTheme();

console.log('\n🧪 Probando toggle del tema:');
console.log(`Estado actual: ${theme.isDarkMode() ? 'oscuro' : 'claro'}`);

// Simular clic en el botón de tema
theme.toggleTheme();
console.log(`Después del toggle: ${theme.isDarkMode() ? 'oscuro' : 'claro'}`);

// Simular otro clic
theme.toggleTheme();
console.log(`Después del segundo toggle: ${theme.isDarkMode() ? 'oscuro' : 'claro'}`);

console.log('\n✅ Simulación completada');
console.log('\n💡 Verificaciones en el navegador:');
console.log('1. Abre las herramientas de desarrollador (F12)');
console.log('2. Ve a la pestaña Console');
console.log('3. Haz clic en el botón de tema');
console.log('4. Verifica que aparezcan mensajes similares a los de arriba');
console.log('5. Si no aparecen, hay un problema con el hook useTheme');
console.log('6. Verifica que las variables CSS se apliquen en la pestaña Elements');
console.log('7. Verifica que la clase "dark" se agregue/quite del elemento body');
