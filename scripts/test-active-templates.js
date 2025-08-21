// Script para probar el sistema de activeTemplates localmente

console.log('🧪 Probando sistema de activeTemplates...');

// Simular configuración con activeTemplates
const testConfigs = [
  {
    name: 'Configuración 1: Solo Tienda',
    activeTemplates: ['shop'],
    expectedRedirect: '/shop'
  },
  {
    name: 'Configuración 2: Tienda + Landing',
    activeTemplates: ['shop', 'landing'],
    expectedRedirect: '/shop'
  },
  {
    name: 'Configuración 3: Landing + Tienda',
    activeTemplates: ['landing', 'shop'],
    expectedRedirect: '/landing'
  },
  {
    name: 'Configuración 4: Múltiples plantillas',
    activeTemplates: ['linkhub', 'shop', 'landing'],
    expectedRedirect: '/linkhub'
  },
  {
    name: 'Configuración 5: Sin plantillas activas',
    activeTemplates: [],
    expectedRedirect: '/landing'
  }
];

// Función que simula la lógica de redirección
function getRedirectPath(activeTemplates) {
  if (!activeTemplates || activeTemplates.length === 0) {
    console.log('⚠️ No hay plantillas activas, usando landing por defecto');
    return '/landing';
  }

  const firstActiveTemplate = activeTemplates[0];
  console.log(`🎯 Primera plantilla activa: ${firstActiveTemplate}`);

  switch (firstActiveTemplate) {
    case 'landing':
      return '/landing';
    case 'shop':
      return '/shop';
    case 'linkhub':
      return '/linkhub';
    case 'multi':
      return '/multi';
    case 'psicologos':
      return '/psicologos';
    default:
      console.log('🏠 Plantilla no reconocida, usando landing por defecto');
      return '/landing';
  }
}

// Probar todas las configuraciones
testConfigs.forEach((config, index) => {
  console.log(`\n📋 ${config.name}`);
  console.log(`   Plantillas activas: [${config.activeTemplates.join(', ')}]`);
  
  const redirectPath = getRedirectPath(config.activeTemplates);
  const isCorrect = redirectPath === config.expectedRedirect;
  
  console.log(`   Redirección esperada: ${config.expectedRedirect}`);
  console.log(`   Redirección obtenida: ${redirectPath}`);
  console.log(`   ✅ ${isCorrect ? 'CORRECTO' : '❌ INCORRECTO'}`);
});

console.log('\n🎯 Resumen del sistema:');
console.log('   - La primera plantilla en activeTemplates será la página principal');
console.log('   - Si no hay plantillas activas, usa /landing por defecto');
console.log('   - El orden de selección determina la prioridad');
console.log('   - Las plantillas desactivadas no estarán disponibles');

console.log('\n📝 Para implementar:');
console.log('   1. Ejecutar: node scripts/setup-active-templates.js');
console.log('   2. Ir a /admin y seleccionar plantillas en orden');
console.log('   3. La primera seleccionada será la página principal');
console.log('   4. Ir a / para ver la redirección automática');
