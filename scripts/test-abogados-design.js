// Script para probar la carga del diseño de abogados
const https = require('https');
const http = require('http');

function testAbogadosDesign() {
  console.log('🎨 Probando carga del diseño de abogados...\n');
  
  // Probar carga directa del archivo JSON
  console.log('📄 1. Probando carga directa del archivo JSON...');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/abogados-design.json',
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
        const designData = JSON.parse(data);
        console.log('✅ Archivo JSON cargado exitosamente');
        console.log(`📋 Nombre del diseño: ${designData.name}`);
        console.log(`📋 ID del diseño: ${designData.id}`);
        console.log(`📋 Categoría: ${designData.category}`);
        
        // Verificar colores
        console.log('\n🎨 Verificando colores del diseño:');
        console.log(`   Primario: ${designData.colorScheme.primary}`);
        console.log(`   Secundario: ${designData.colorScheme.secondary}`);
        console.log(`   Acento: ${designData.colorScheme.accent}`);
        
        // Verificar variables CSS
        if (designData.cssVariables) {
          console.log('\n🎨 Variables CSS encontradas:');
          Object.entries(designData.cssVariables).forEach(([key, value]) => {
            console.log(`   ${key}: ${value}`);
          });
        }
        
        // Verificar configuración de tema
        if (designData.theme) {
          console.log('\n🎨 Configuración de tema encontrada:');
          console.log('   Modo claro:');
          console.log(`     Fondo: ${designData.theme.light.backgroundColor}`);
          console.log(`     Texto: ${designData.theme.light.textColor}`);
          console.log(`     Acento: ${designData.theme.light.accentColor}`);
          console.log('   Modo oscuro:');
          console.log(`     Fondo: ${designData.theme.dark.backgroundColor}`);
          console.log(`     Texto: ${designData.theme.dark.textColor}`);
          console.log(`     Acento: ${designData.theme.dark.accentColor}`);
        }
        
        // Verificar contenido
        if (designData.config) {
          console.log('\n📝 Contenido del diseño:');
          console.log(`   Título: ${designData.config.site.title}`);
          console.log(`   Tagline: ${designData.config.site.tagline}`);
          console.log(`   Sesiones: ${designData.config.sessions.length}`);
          console.log(`   Testimonios: ${designData.config.testimonials.length}`);
        }
        
        console.log('\n✅ Diseño de abogados verificado correctamente');
        
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
testAbogadosDesign();
