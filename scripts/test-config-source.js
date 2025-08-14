// Script para verificar de dónde se carga la configuración
// Ejecutar con: node scripts/test-config-source.js

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando fuente de configuración...\n');

// 1. Verificar archivo local
const configPath = path.join(__dirname, '../public/config.json');
if (fs.existsSync(configPath)) {
  console.log('✅ Archivo config.json local encontrado');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  console.log('📋 Título del sitio:', config.site?.title);
  console.log('📋 Color de fondo (tema oscuro):', config.theme?.dark?.backgroundColor);
} else {
  console.log('❌ Archivo config.json local no encontrado');
}

// 2. Verificar si hay variables de entorno para Firebase
console.log('\n🔧 Variables de entorno Firebase:');
const firebaseVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'
];

firebaseVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 10)}...`);
  } else {
    console.log(`❌ ${varName}: No definida`);
  }
});

// 3. Verificar si la aplicación debería cargar desde Firestore
console.log('\n🎯 Análisis:');
const hasFirebaseConfig = firebaseVars.every(varName => process.env[varName]);
if (hasFirebaseConfig) {
  console.log('✅ Firebase configurado - la app debería cargar desde Firestore');
  console.log('🔍 El problema puede ser:');
  console.log('   - La app está cargando desde config.json local');
  console.log('   - Firestore no tiene datos guardados');
  console.log('   - Error de conexión con Firestore');
} else {
  console.log('❌ Firebase no configurado - la app carga desde config.json local');
  console.log('💡 Para usar Firestore, configura las variables de entorno');
}

console.log('\n💡 Para solucionar:');
console.log('1. Si Firebase está configurado:');
console.log('   - Verifica que la app cargue desde /api/config');
console.log('   - Verifica que el gestor guarde en Firestore');
console.log('2. Si Firebase no está configurado:');
console.log('   - Configura las variables de entorno');
console.log('   - O modifica la app para guardar en config.json local');
