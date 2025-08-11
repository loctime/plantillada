// Simular la lógica de getTenantId para probar diferentes dominios
function testGetTenantId(hostname) {
  console.log(`\n🔍 Probando hostname: ${hostname}`);
  
  // Mapeo de dominios a tenant IDs
  const domainToTenant = {
    'localhost': 'default',
    'landing-six-gold.vercel.app': 'gold',
    'marcamia.com': 'marcamia',
    'tumarca.com': 'tumarca',
    'controldoc.app': 'controldoc',
  }
  
  // Buscar coincidencia exacta
  if (domainToTenant[hostname]) {
    console.log(`✅ Coincidencia exacta: ${domainToTenant[hostname]}`);
    return domainToTenant[hostname]
  }
  
  // IMPORTANTE: Para subdominios de Vercel, extraer el tenant base
  // Ejemplo: plantilla-5dqaylk9f-loctimes-projects.vercel.app -> plantilla
  if (hostname.includes('.vercel.app')) {
    const parts = hostname.split('.')
    if (parts.length >= 3) {
      const firstPart = parts[0]
      // Si el primer parte contiene guiones, tomar solo la parte antes del primer guión
      if (firstPart.includes('-')) {
        const baseTenant = firstPart.split('-')[0]
        console.log(`✅ Subdominio Vercel detectado: ${hostname} -> tenant: ${baseTenant}`);
        return baseTenant
      }
      console.log(`✅ Subdominio Vercel simple: ${hostname} -> tenant: ${firstPart}`);
      return firstPart
    }
  }
  
  // Buscar coincidencia por subdominio (solo para dominios no-Vercel)
  const subdomain = hostname.split('.')[0]
  if (subdomain && subdomain !== 'www') {
    console.log(`✅ Subdominio normal: ${hostname} -> tenant: ${subdomain}`);
    return subdomain
  }
  
  // Fallback al dominio completo como tenant ID
  const fallback = hostname.replace(/[^a-zA-Z0-9]/g, '-')
  console.log(`✅ Fallback: ${hostname} -> tenant: ${fallback}`);
  return fallback
}

// Probar diferentes casos
console.log('🧪 Probando lógica de detección de tenant ID...\n');

const testCases = [
  'localhost',
  'localhost:3000',
  'plantilla.controldoc.app',
  'plantilla-5dqaylk9f-loctimes-projects.vercel.app',
  'plantilla-4sd908igv-loctimes-projects.vercel.app',
  'plantilla-41zrpivf3-loctimes-projects.vercel.app',
  'plantilla-tle8r0ik3-loctimes-projects.vercel.app',
  'gold.controldoc.app',
  'marcamia.com',
  'tumarca.com',
  'controldoc.app',
  'www.example.com',
  'example.com'
];

testCases.forEach(hostname => {
  const tenantId = testGetTenantId(hostname);
  console.log(`📋 Resultado: ${hostname} -> ${tenantId}`);
});

console.log('\n🎯 Verificación:');
console.log('✅ Todos los subdominios de plantilla deberían devolver: plantilla');
console.log('✅ Los dominios mapeados deberían devolver sus valores específicos');
console.log('✅ Los dominios normales deberían devolver su subdominio');
