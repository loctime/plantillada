// Script para ejecutar desde la consola del navegador
// Abre la consola del navegador (F12) y pega este código

async function fixConfigFromBrowser() {
  try {
    console.log('🔧 Arreglando configuración desde el navegador...');
    
    // Importar las funciones necesarias
    const { loadConfig, saveConfig } = await import('/lib/config-loader.ts');
    
    // Cargar la configuración actual
    console.log('📋 Cargando configuración actual...');
    const currentConfig = await loadConfig();
    console.log('📋 Configuración actual:', currentConfig);
    
    // Verificar si hay currentTemplate
    if (currentConfig.currentTemplate) {
      console.log(`⚠️  ¡PROBLEMA ENCONTRADO! Hay currentTemplate: ${currentConfig.currentTemplate}`);
      console.log('🧹 Eliminando currentTemplate...');
      
      // Eliminar currentTemplate
      delete currentConfig.currentTemplate;
      
      // Guardar configuración limpia
      console.log('💾 Guardando configuración limpia...');
      const success = await saveConfig(currentConfig);
      
      if (success) {
        console.log('✅ currentTemplate eliminado exitosamente');
        console.log('📋 Título guardado:', currentConfig.site?.title);
        console.log('🔄 Recargando página...');
        window.location.reload();
      } else {
        console.error('❌ Error guardando configuración');
      }
    } else {
      console.log('✅ No hay currentTemplate - la configuración está limpia');
      console.log('📋 Título actual:', currentConfig.site?.title);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Función alternativa más simple
async function simpleFix() {
  try {
    console.log('🔧 Arreglando configuración de forma simple...');
    
    // Hacer una petición directa a la API
    const response = await fetch('/api/config');
    const config = await response.json();
    
    console.log('📋 Configuración cargada:', config);
    
    if (config.currentTemplate) {
      console.log(`⚠️  ¡PROBLEMA! Hay currentTemplate: ${config.currentTemplate}`);
      
      // Eliminar currentTemplate
      delete config.currentTemplate;
      
      // Guardar configuración limpia
      const saveResponse = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config)
      });
      
      const saveResult = await saveResponse.json();
      console.log('💾 Resultado del guardado:', saveResult);
      
      if (saveResult.success) {
        console.log('✅ Configuración arreglada exitosamente');
        console.log('🔄 Recargando página...');
        window.location.reload();
      } else {
        console.error('❌ Error guardando:', saveResult);
      }
    } else {
      console.log('✅ No hay currentTemplate - la configuración está limpia');
      console.log('📋 Título actual:', config.site?.title);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

console.log('🚀 Scripts disponibles:');
console.log('- fixConfigFromBrowser() - Arregla usando las funciones del proyecto');
console.log('- simpleFix() - Arregla usando la API directamente');
console.log('');
console.log('💡 Ejecuta: simpleFix()');
