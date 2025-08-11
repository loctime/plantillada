// Simular la lógica de loadConfig para probar qué está pasando
function testLoadConfig() {
  console.log('🧪 Probando lógica de carga de configuración...\n');
  
  // Simular los datos que están en Firestore
  const firestoreData = {
    data: '{"site":{"title":"MARCA NUEVA DE LA PAGINA","tagline":"Acompañamiento 1:1 y formación práctica para cambios reales."},"integrations":{"calendlyUrl":"https://calendly.com/tu-usuario/sesion","hotmartBaseUrl":"https://pay.hotmart.com"},"sessions":[{"id":"sesion-claridad","name":"Sesión de Claridad","summary":"Define tu objetivo y el plan inmediato de 30 días.","duration":"60 min","price":"€99","features":["Diagnóstico inicial y mapa de objetivos","Prioridades y plan de acción","Seguimiento por email 7 días"],"hotmartUrl":"https://pay.hotmart.com/TU_CHECKOUT_1"}],"course":{"title":"Curso Online: Sistema de Productividad Sencilla","blurb":"Aprende a construir un sistema ligero para enfocarte, priorizar con calma y avanzar cada semana sin fricción.","price":"€179","hotmartUrl":"https://pay.hotmart.com/TU_CHECKOUT_CURSO","videoUrl":"","bullets":["Estructura de planificación semanal en 30 minutos","Métricas simples para medir progreso","Plantillas reutilizables y ejemplos","Casos prácticos y ejercicios guiados"]},"about":{"photoUrl":"/placeholder.svg?height=520&width=420","videoUrl":"","story":"Soy [Tu Nombre], consultor y coach con X años ayudando a profesionales a ganar claridad, enfocarse y ejecutar con calma.","whyMe":"He acompañado a +300 clientes en sectores diversos."},"testimonials":[{"quote":"En dos sesiones definimos un plan claro y recuperé la motivación.","author":"María G.","role":"Marketing Specialist"}],"contact":{"email":"hola@tumarca.com"},"legal":{"termsUrl":"","privacyUrl":""}}'
  };
  
  console.log('📄 Datos de Firestore:', JSON.stringify(firestoreData, null, 2));
  
  // Simular la lógica de loadConfig
  const data = firestoreData;
  const template = null; // Sin template solicitado
  
  if (data.data && typeof data.data === 'string') {
    try {
      const config = JSON.parse(data.data);
      console.log('✅ Configuración parseada correctamente');
      console.log('📋 Título parseado:', config.site?.title);
      console.log('📋 Tagline parseada:', config.site?.tagline);
      
      // Verificar si hay currentTemplate
      if (config.currentTemplate) {
        console.log(`⚠️  ¡PROBLEMA! Hay currentTemplate: ${config.currentTemplate}`);
        console.log('🔍 Esto causaría que se aplique un template automáticamente');
      } else {
        console.log('✅ No hay currentTemplate - la configuración debería cargarse correctamente');
      }
      
      // Simular la lógica de decisión
      if (template && config.currentTemplate) {
        console.log('📋 Aplicando template solicitado:', template);
        // return getTemplateConfig(template, tenant)
      } else {
        console.log('✅ Cargando configuración personalizada guardada');
        console.log('📋 Título final:', config.site?.title);
        console.log('📋 Tagline final:', config.site?.tagline);
        // return config
      }
      
    } catch (parseError) {
      console.error('❌ Error parseando JSON:', parseError);
      console.error('🔍 Datos que causaron el error:', data.data);
    }
  }
  
  console.log('\n🎯 Resultado esperado:');
  console.log('✅ El título debería ser: "MARCA NUEVA DE LA PAGINA"');
  console.log('✅ No debería haber currentTemplate');
  console.log('✅ La configuración personalizada debería cargarse correctamente');
}

// Ejecutar la prueba
testLoadConfig();
