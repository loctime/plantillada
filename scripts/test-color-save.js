// Script simple para probar el guardado de colores
// Ejecutar con: node scripts/test-color-save.js

const fs = require('fs');
const path = require('path');

console.log('🎨 Probando guardado de colores...\n');

// 1. Verificar archivo de configuración local
const configPath = path.join(__dirname, '../public/config.json');
if (fs.existsSync(configPath)) {
  console.log('✅ Archivo config.json encontrado');
  
  const configContent = fs.readFileSync(configPath, 'utf8');
  const config = JSON.parse(configContent);
  
  // Verificar si hay tema
  if (config.theme) {
    console.log('✅ Tema encontrado en config.json');
    console.log('📋 Tema claro:', JSON.stringify(config.theme.light, null, 2));
    console.log('📋 Tema oscuro:', JSON.stringify(config.theme.dark, null, 2));
  } else {
    console.log('❌ No hay tema en config.json');
  }
} else {
  console.log('❌ Archivo config.json no encontrado');
}

// 2. Verificar diseño de fumigaciones
const fumigacionesPath = path.join(__dirname, '../public/fumigaciones-design.json');
if (fs.existsSync(fumigacionesPath)) {
  console.log('\n✅ Archivo fumigaciones-design.json encontrado');
  
  const fumigacionesContent = fs.readFileSync(fumigacionesPath, 'utf8');
  const fumigaciones = JSON.parse(fumigacionesContent);
  
  if (fumigaciones.theme) {
    console.log('✅ Tema encontrado en fumigaciones-design.json');
    console.log('📋 Tema claro:', JSON.stringify(fumigaciones.theme.light, null, 2));
    console.log('📋 Tema oscuro:', JSON.stringify(fumigaciones.theme.dark, null, 2));
  } else {
    console.log('❌ No hay tema en fumigaciones-design.json');
  }
} else {
  console.log('\n❌ Archivo fumigaciones-design.json no encontrado');
}

// 3. Comparar temas
console.log('\n🔍 Comparando temas:');
if (fs.existsSync(configPath) && fs.existsSync(fumigacionesPath)) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const fumigaciones = JSON.parse(fs.readFileSync(fumigacionesPath, 'utf8'));
  
  if (config.theme && fumigaciones.theme) {
    const configDark = config.theme.dark;
    const fumigacionesDark = fumigaciones.theme.dark;
    
    console.log('📊 Comparación tema oscuro:');
    console.log('  config.json:', configDark.backgroundColor);
    console.log('  fumigaciones:', fumigacionesDark.backgroundColor);
    
    if (configDark.backgroundColor === fumigacionesDark.backgroundColor) {
      console.log('⚠️  ¡PROBLEMA! Los colores son idénticos');
      console.log('🔍 Esto significa que el gestor de colores no está guardando cambios');
    } else {
      console.log('✅ Los colores son diferentes - el gestor está funcionando');
    }
  }
}

console.log('\n💡 Para probar el gestor de colores:');
console.log('1. Abre la aplicación en el navegador');
console.log('2. Activa el modo admin');
console.log('3. Abre el gestor de colores');
console.log('4. Cambia un color');
console.log('5. Guarda los cambios');
console.log('6. Ejecuta este script nuevamente para verificar');
