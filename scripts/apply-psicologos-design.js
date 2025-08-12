const fs = require('fs');
const path = require('path');

// Función para aplicar el diseño de psicólogos
async function applyPsicologosDesign(tenantId = 'default') {
  try {
    console.log('🎨 Aplicando diseño de Psicólogos...');
    
    // Leer el archivo de diseño
    const designPath = path.join(__dirname, '../public/psicologos-design.json');
    const designData = JSON.parse(fs.readFileSync(designPath, 'utf8'));
    
    console.log('📋 Configuración cargada del archivo de diseño');
    
    // Hacer una petición POST a la API para guardar la configuración
    const response = await fetch('http://localhost:3000/api/config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...designData,
        tenantId: tenantId
      }),
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Diseño de Psicólogos aplicado exitosamente');
      console.log('📝 Mensaje:', result.message);
      console.log('🔗 Puedes ver el resultado en: http://localhost:3000/psicologos');
      console.log('⚙️  Configura desde: http://localhost:3000/admin');
    } else {
      const error = await response.json();
      console.error('❌ Error aplicando diseño:', error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('💡 Asegúrate de que el servidor esté corriendo en http://localhost:3000');
  }
}

// Función para mostrar ayuda
function showHelp() {
  console.log(`
🎨 Aplicador de Diseño de Psicólogos

Uso:
  node apply-psicologos-design.js [tenant-id]

Argumentos:
  tenant-id    ID del tenant (opcional, por defecto: 'default')

Ejemplos:
  node apply-psicologos-design.js
  node apply-psicologos-design.js psicologo-madrid
  node apply-psicologos-design.js centro-terapeutico

Características del diseño:
  ✨ Colores púrpuras y azules profesionales
  🧠 Iconografía terapéutica
  💜 Tipografía serena y confiable
  🛡️  Enfoque en confidencialidad
  📋 Servicios de terapia especializados
  ⭐ Testimonios de pacientes
  📅 Integración con Calendly
  💳 Enlaces a Hotmart para pagos

Requisitos:
  - Servidor corriendo en http://localhost:3000
  - API /api/config funcionando
  - Archivo public/psicologos-design.json presente
`);
}

// Procesar argumentos de línea de comandos
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  showHelp();
  process.exit(0);
}

const tenantId = args[0] || 'default';

console.log(`🎨 Aplicando diseño de Psicólogos para tenant: ${tenantId}`);
console.log('⏳ Iniciando proceso...\n');

// Ejecutar la aplicación del diseño
applyPsicologosDesign(tenantId);
