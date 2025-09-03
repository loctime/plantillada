#!/usr/bin/env node

/**
 * Script de prueba para verificar la persistencia de configuración
 * Ejecutar con: node scripts/test-config-persistence.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, setDoc } = require('firebase/firestore');

// Configuración de Firebase (usar variables de entorno en producción)
const firebaseConfig = {
  projectId: 'landing-f1cf1',
  authDomain: 'landing-f1cf1.firebaseapp.com',
  // Agregar más config si es necesario
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testConfigPersistence() {
  console.log('🧪 Iniciando prueba de persistencia de configuración...\n');

  const tenantId = 'localhost:3000'; // Tenant de prueba
  const configDoc = doc(db, 'config', tenantId);

  try {
    // 1. Leer configuración actual
    console.log('📖 Leyendo configuración actual...');
    const configSnapshot = await getDoc(configDoc);
    
    if (configSnapshot.exists()) {
      const data = configSnapshot.data();
      console.log('✅ Configuración encontrada en Firebase');
      console.log('📄 Datos:', JSON.stringify(data, null, 2));
      
      // Verificar si tiene datos personalizados
      if (data.data) {
        try {
          const config = JSON.parse(data.data);
          console.log('\n🔍 Configuración parseada:');
          console.log('   Título:', config.site?.title);
          console.log('   Tagline:', config.site?.tagline);
          console.log('   ¿Es personalizada?', config.site?.title !== 'Tu Marca Personal - localhost:3000');
        } catch (parseError) {
          console.log('❌ Error parseando JSON:', parseError.message);
        }
      }
    } else {
      console.log('❌ No se encontró configuración para este tenant');
    }

    // 2. Crear configuración de prueba
    console.log('\n📝 Creando configuración de prueba...');
    const testConfig = {
      site: {
        title: `Test Config ${Date.now()}`,
        tagline: 'Esta es una configuración de prueba'
      },
      integrations: {
        calendlyUrl: 'https://calendly.com/test/sesion',
        hotmartBaseUrl: 'https://pay.hotmart.com'
      },
      theme: {
        light: {
          backgroundColor: '#ffffff',
          textColor: '#1e293b'
        },
        dark: {
          backgroundColor: '#0f172a',
          textColor: '#f1f5f9'
        }
      }
    };

    const dataToSave = { data: JSON.stringify(testConfig) };
    await setDoc(configDoc, dataToSave);
    console.log('✅ Configuración de prueba guardada');

    // 3. Verificar que se guardó
    console.log('\n🔍 Verificando que se guardó correctamente...');
    const verifySnapshot = await getDoc(configDoc);
    if (verifySnapshot.exists()) {
      const savedData = verifySnapshot.data();
      console.log('✅ Configuración verificada en Firebase');
      console.log('📄 Datos guardados:', JSON.stringify(savedData, null, 2));
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
    console.error('🔍 Detalles:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
  }
}

// Ejecutar la prueba
testConfigPersistence()
  .then(() => {
    console.log('\n✅ Prueba completada');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Prueba falló:', error);
    process.exit(1);
  });
