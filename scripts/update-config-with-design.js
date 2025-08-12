// Script para actualizar la configuración con el diseño de abogados
const https = require('https');
const http = require('http');

function updateConfigWithDesign() {
  console.log('🎨 Actualizando configuración con diseño de abogados...\n');
  
  // Cargar el diseño de abogados
  console.log('📄 1. Cargando diseño de abogados...');
  
  const designOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/config?template=estudio-abogados-premium',
    method: 'GET'
  };

  const designReq = http.request(designOptions, (res) => {
    console.log(`📡 Status: ${res.statusCode}`);
    
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const designConfig = JSON.parse(data);
        console.log('✅ Diseño de abogados cargado');
        console.log(`📋 Título del diseño: ${designConfig.site?.title}`);
        
        // Actualizar la configuración con el diseño completo
        const updatedConfig = {
          ...designConfig,
          selectedDesigns: {
            landing: 'estudio-abogados-premium'
          }
        };
        
        console.log('\n📄 2. Guardando configuración completa...');
        
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
              
              console.log('\n🎨 Configuración actualizada correctamente');
              console.log('💡 Ahora puedes:');
              console.log('   1. Recargar http://localhost:3000 en el navegador');
              console.log('   2. Verificar que se apliquen:');
              console.log('      - Título: "Bufete de Abogados Martínez & Asociados"');
              console.log('      - Colores: Negro (#1a1a1a), Gris (#8b8b8b), Dorado (#d4af37)');
              console.log('      - Sesiones: Derecho Civil, Mercantil, Laboral, Penal');
              console.log('      - Curso: "Fundamentos Legales para Empresarios"');
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
        console.error('❌ Error parseando diseño:', error);
        console.log('📄 Respuesta raw:', data);
      }
    });
  });

  designReq.on('error', (error) => {
    console.error('❌ Error en la petición GET:', error);
  });

  designReq.end();
}

// Ejecutar la actualización
updateConfigWithDesign();
