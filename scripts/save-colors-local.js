// Script para guardar colores directamente en config.json local
// Ejecutar con: node scripts/save-colors-local.js

const fs = require('fs');
const path = require('path');

// Función para guardar colores en config.json local
function saveColorsToLocal(colors, mode = 'dark') {
  try {
    const configPath = path.join(__dirname, '../public/config.json');
    
    if (!fs.existsSync(configPath)) {
      console.log('❌ Archivo config.json no encontrado');
      return false;
    }
    
    // Leer configuración actual
    const configContent = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configContent);
    
    // Asegurar que existe la estructura de tema
    if (!config.theme) {
      config.theme = {
        light: {},
        dark: {}
      };
    }
    
    // Actualizar colores del modo especificado
    config.theme[mode] = {
      ...config.theme[mode],
      ...colors
    };
    
    // Guardar configuración actualizada
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    
    console.log(`✅ Colores guardados en config.json (modo ${mode})`);
    console.log('📋 Colores guardados:', JSON.stringify(colors, null, 2));
    
    return true;
  } catch (error) {
    console.error('❌ Error guardando colores:', error);
    return false;
  }
}

// Ejemplo de uso
if (require.main === module) {
  console.log('🎨 Script para guardar colores en config.json local\n');
  
  // Ejemplo: cambiar color de fondo a azul oscuro
  const newColors = {
    backgroundColor: '#1a1d29',
    sectionBackground: '#2d3748',
    navbarBackground: '#1a1d29',
    textColor: '#f7fafc',
    accentColor: '#f59e0b'
  };
  
  console.log('💾 Guardando colores de ejemplo...');
  const success = saveColorsToLocal(newColors, 'dark');
  
  if (success) {
    console.log('\n✅ ¡Colores guardados exitosamente!');
    console.log('🔄 Reinicia la aplicación para ver los cambios');
  } else {
    console.log('\n❌ Error guardando colores');
  }
}

module.exports = { saveColorsToLocal };
