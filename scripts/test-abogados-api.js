// Script para probar la carga del diseño de abogados a través del API
const https = require('https');
const http = require('http');

function testAbogadosAPI() {
  console.log('🎨 Probando carga del diseño de abogados a través del API...\n');
  
  // Probar carga a través del API con template específico
  console.log('📄 1. Probando carga a través del API con template estudio-abogados-premium...');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/config?template=estudio-abogados-premium',
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
        console.log('✅ Configuración cargada exitosamente a través del API');
        console.log(`📋 Título: ${config.site?.title}`);
        console.log(`📋 Tagline: ${config.site?.tagline}`);
        
        // Verificar configuración de tema
        if (config.theme) {
          console.log('\n🎨 Configuración de tema cargada:');
          console.log('   Modo claro:');
          console.log(`     Fondo: ${config.theme.light.backgroundColor}`);
          console.log(`     Texto: ${config.theme.light.textColor}`);
          console.log(`     Acento: ${config.theme.light.accentColor}`);
          console.log('   Modo oscuro:');
          console.log(`     Fondo: ${config.theme.dark.backgroundColor}`);
          console.log(`     Texto: ${config.theme.dark.textColor}`);
          console.log(`     Acento: ${config.theme.dark.accentColor}`);
        }
        
        // Verificar sesiones
        if (config.sessions) {
          console.log('\n📝 Sesiones cargadas:');
          config.sessions.forEach((session, index) => {
            console.log(`   ${index + 1}. ${session.name} - ${session.price}`);
          });
        }
        
        // Verificar curso
        if (config.course) {
          console.log('\n📚 Curso cargado:');
          console.log(`   Título: ${config.course.title}`);
          console.log(`   Precio: ${config.course.price}`);
        }
        
        // Verificar testimonios
        if (config.testimonials) {
          console.log('\n💬 Testimonios cargados:');
          config.testimonials.forEach((testimonial, index) => {
            console.log(`   ${index + 1}. ${testimonial.author} - ${testimonial.role}`);
          });
        }
        
        console.log('\n✅ Diseño de abogados cargado correctamente a través del API');
        
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

// Ejecutar la prueba
testAbogadosAPI();
