// Script para probar que la configuración se preserva correctamente
const https = require('https');

function testConfigPreservation() {
  console.log('🔍 Probando preservación de configuración entre páginas');
  
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
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const config = JSON.parse(data);
        console.log('\n📄 Configuración actual:');
        console.log(`   Título principal: ${config.site?.title}`);
        console.log(`   Hero Button: ${config.buttons?.heroButton}`);
        console.log(`   Nombre de tienda: ${config.shopConfig?.storeName}`);
        console.log(`   Productos: ${config.products?.length || 0}`);
        console.log(`   Sesiones: ${config.sessions?.length || 0}`);
        
        // Verificar que todas las secciones están presentes
        const sections = {
          'site': !!config.site,
          'buttons': !!config.buttons,
          'integrations': !!config.integrations,
          'sessions': !!config.sessions,
          'course': !!config.course,
          'about': !!config.about,
          'testimonials': !!config.testimonials,
          'contact': !!config.contact,
          'legal': !!config.legal,
          'shopConfig': !!config.shopConfig,
          'products': !!config.products
        };
        
        console.log('\n✅ Secciones presentes:');
        Object.entries(sections).forEach(([section, present]) => {
          console.log(`   ${section}: ${present ? '✅' : '❌'}`);
        });
        
        // Verificar que no se han perdido datos importantes
        const missingSections = Object.entries(sections).filter(([_, present]) => !present);
        
        if (missingSections.length > 0) {
          console.log('\n❌ Secciones faltantes:');
          missingSections.forEach(([section]) => {
            console.log(`   - ${section}`);
          });
        } else {
          console.log('\n🎯 ¡PERFECTO! Todas las secciones están presentes');
        }
        
        // Verificar datos específicos
        if (config.site?.title === 'mi marquita') {
          console.log('✅ Título principal preservado correctamente');
        } else {
          console.log('❌ Título principal se perdió o cambió');
        }
        
        if (config.buttons?.heroButton === 'asereje') {
          console.log('✅ Hero button preservado correctamente');
        } else {
          console.log('❌ Hero button se perdió o cambió');
        }
        
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

testConfigPreservation();
