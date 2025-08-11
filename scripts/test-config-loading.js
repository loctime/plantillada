// Script para probar la carga de configuración desde el endpoint
const https = require('https');
const http = require('http');

function testConfigLoading() {
  console.log('🔍 Probando carga de configuración desde plantilla.controldoc.app');
  
  const options = {
    hostname: 'plantilla.controldoc.app',
    port: 443,
    path: '/api/config',
    method: 'GET',
    headers: {
      'Host': 'plantilla.controldoc.app',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  };

  const req = https.request(options, (res) => {
    console.log(`📡 Status: ${res.statusCode}`);
    console.log(`📡 Headers:`, res.headers);
    
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const config = JSON.parse(data);
        console.log('\n✅ Configuración cargada exitosamente:');
        console.log(`   Título: ${config.site?.title}`);
        console.log(`   Tagline: ${config.site?.tagline}`);
        console.log(`   Hero Button: ${config.buttons?.heroButton}`);
        
        if (config.site?.title === 'mi marquita') {
          console.log('🎯 ¡PERFECTO! El título es correcto: mi marquita');
        } else {
          console.log('❌ El título no es el esperado');
          console.log(`   Esperado: mi marquita`);
          console.log(`   Actual: ${config.site?.title}`);
        }
        
        console.log('\n📄 Configuración completa:');
        console.log(JSON.stringify(config, null, 2));
        
      } catch (error) {
        console.error('❌ Error parseando JSON:', error);
        console.log('📄 Respuesta raw:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error en la petición:', error);
  });

  req.end();
}

// También probar con localhost para desarrollo
function testLocalhost() {
  console.log('\n🔍 Probando carga de configuración desde localhost:3000');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/config',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`📡 Status: ${res.statusCode}`);
    
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const config = JSON.parse(data);
        console.log('\n✅ Configuración local cargada:');
        console.log(`   Título: ${config.site?.title}`);
        console.log(`   Tagline: ${config.site?.tagline}`);
      } catch (error) {
        console.error('❌ Error parseando JSON local:', error);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error en petición local:', error);
  });

  req.end();
}

// Ejecutar pruebas
testConfigLoading();
setTimeout(testLocalhost, 2000); // Esperar 2 segundos para la segunda prueba
