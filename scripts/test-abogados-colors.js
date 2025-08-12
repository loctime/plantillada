// Script para probar la aplicación de colores del diseño de abogados
const https = require('https');
const http = require('http');

function testAbogadosColors() {
  console.log('🎨 Probando aplicación de colores del diseño de abogados...\n');
  
  // Probar carga de la página principal con el diseño aplicado
  console.log('📄 1. Probando carga de la página principal...');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`📡 Status: ${res.statusCode}`);
    
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        // Buscar variables CSS en el HTML
        console.log('\n🎨 Buscando variables CSS en el HTML...');
        
        // Buscar variables CSS personalizadas
        const cssVariables = [
          '--background-color',
          '--section-background', 
          '--navbar-background',
          '--text-color',
          '--accent-color',
          '--primary-button-color',
          '--secondary-button-color',
          '--outline-button-color'
        ]
        
        cssVariables.forEach(variable => {
          const regex = new RegExp(`${variable}:\\s*([^;]+)`, 'i')
          const match = data.match(regex)
          if (match) {
            console.log(`   ✅ ${variable}: ${match[1].trim()}`)
          } else {
            console.log(`   ❌ ${variable}: No encontrada`)
          }
        })
        
        // Buscar clases CSS personalizadas
        const customClasses = [
          'custom-bg',
          'custom-section-bg',
          'custom-navbar-bg',
          'custom-text',
          'custom-accent'
        ]
        
        console.log('\n🎨 Verificando clases CSS personalizadas...')
        customClasses.forEach(className => {
          const regex = new RegExp(`\\.${className}`, 'i')
          const match = data.match(regex)
          if (match) {
            console.log(`   ✅ Clase ${className} encontrada`)
          } else {
            console.log(`   ❌ Clase ${className} no encontrada`)
          }
        })
        
        // Buscar contenido específico del diseño de abogados
        console.log('\n📝 Verificando contenido del diseño de abogados...')
        const abogadosContent = [
          'Bufete de Abogados',
          'Derecho Civil',
          'Derecho Mercantil',
          'Derecho Laboral',
          'Derecho Penal',
          'Fundamentos Legales'
        ]
        
        abogadosContent.forEach(content => {
          const regex = new RegExp(content, 'i')
          const match = data.match(regex)
          if (match) {
            console.log(`   ✅ "${content}" encontrado`)
          } else {
            console.log(`   ❌ "${content}" no encontrado`)
          }
        })
        
        console.log('\n✅ Prueba de colores completada')
        console.log('\n💡 Para verificar visualmente:')
        console.log('   1. Abre http://localhost:3000 en el navegador')
        console.log('   2. Verifica que los colores sean:')
        console.log('      - Fondo: #ffffff (blanco)')
        console.log('      - Texto: #1a1a1a (negro)')
        console.log('      - Acento: #d4af37 (dorado)')
        console.log('      - Botones: #1a1a1a (negro)')
        console.log('   3. Cambia a modo oscuro y verifica:')
        console.log('      - Fondo: #0f0f0f (negro)')
        console.log('      - Texto: #f5f5f5 (blanco)')
        console.log('      - Acento: #d4af37 (dorado)')
        
      } catch (error) {
        console.error('❌ Error analizando HTML:', error)
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error en la petición:', error)
  });

  req.end();
}

// Ejecutar la prueba
testAbogadosColors();
