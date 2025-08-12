// Script para aplicar el diseño de abogados como diseño activo
const https = require('https');
const http = require('http');

function applyAbogadosDesign() {
  console.log('🎨 Aplicando diseño de abogados como diseño activo...\n');
  
  // Primero cargar la configuración actual
  console.log('📄 1. Cargando configuración actual...');
  
  const getOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/config',
    method: 'GET'
  };

  const getReq = http.request(getOptions, (res) => {
    console.log(`📡 Status: ${res.statusCode}`);
    
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const currentConfig = JSON.parse(data);
        console.log('✅ Configuración actual cargada');
        console.log(`📋 Título actual: ${currentConfig.site?.title}`);
        console.log(`📋 Diseños seleccionados: ${JSON.stringify(currentConfig.selectedDesigns)}`);
        
        // Actualizar la configuración con el diseño de abogados
        const updatedConfig = {
          ...currentConfig,
          selectedDesigns: {
            ...currentConfig.selectedDesigns,
            landing: 'estudio-abogados-premium'
          }
        };
        
        console.log('\n📄 2. Guardando configuración actualizada...');
        
        // Guardar la configuración actualizada
        const postOptions = {
          hostname: 'localhost',
          port: 3000,
          path: '/api/config',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        };

        const postReq = http.request(postOptions, (postRes) => {
          console.log(`📡 Status: ${postRes.statusCode}`);
          
          let postData = '';
          
          postRes.on('data', (chunk) => {
            postData += chunk;
          });
          
          postRes.on('end', () => {
            try {
              const result = JSON.parse(postData);
              console.log('✅ Configuración guardada exitosamente');
              console.log(`📋 Resultado: ${JSON.stringify(result)}`);
              
              console.log('\n🎨 Diseño de abogados aplicado correctamente');
              console.log('💡 Ahora puedes:');
              console.log('   1. Recargar http://localhost:3000 en el navegador');
              console.log('   2. Verificar que se apliquen los colores del diseño de abogados');
              console.log('   3. Cambiar entre modo claro y oscuro para ver los diferentes colores');
              
            } catch (error) {
              console.error('❌ Error parseando respuesta:', error);
              console.log('📄 Respuesta raw:', postData);
            }
          });
        });

        postReq.on('error', (error) => {
          console.error('❌ Error en la petición POST:', error);
        });

        postReq.write(JSON.stringify(updatedConfig));
        postReq.end();
        
      } catch (error) {
        console.error('❌ Error parseando configuración actual:', error);
        console.log('📄 Respuesta raw:', data);
      }
    });
  });

  getReq.on('error', (error) => {
    console.error('❌ Error en la petición GET:', error);
  });

  getReq.end();
}

// Ejecutar la aplicación del diseño
applyAbogadosDesign();
