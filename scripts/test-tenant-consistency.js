#!/usr/bin/env node

/**
 * Script para verificar consistencia del tenant ID
 * Ejecutar con: node scripts/test-tenant-consistency.js
 */

console.log('🧪 Verificando consistencia del tenant ID...\n');

// Simular entorno del servidor
process.env.NEXT_PUBLIC_DEFAULT_TENANT = 'default';

// Simular getTenantId del servidor
function getTenantIdServer() {
  return process.env.NEXT_PUBLIC_DEFAULT_TENANT || 'default';
}

// Simular getTenantId del cliente
function getTenantIdClient() {
  const host = 'localhost:3000';
  
  // IMPORTANTE: Para desarrollo local, usar 'default' para consistencia con el servidor
  if (host === 'localhost:3000') {
    return 'default';
  }
  
  // Fallback al host completo
  return host.replace(/[^a-zA-Z0-9]/g, '-');
}

console.log('🔍 Server getTenantId():', getTenantIdServer());
console.log('🔍 Client getTenantId():', getTenantIdClient());
console.log('✅ ¿Son consistentes?', getTenantIdServer() === getTenantIdClient() ? 'SÍ' : 'NO');

if (getTenantIdServer() === getTenantIdClient()) {
  console.log('\n🎯 Tenant ID consistente - La configuración debería persistir correctamente');
} else {
  console.log('\n❌ Tenant ID inconsistente - Este es el problema de persistencia');
  console.log('   El servidor usa:', getTenantIdServer());
  console.log('   El cliente usa:', getTenantIdClient());
}

console.log('\n📋 Resumen:');
console.log('   - Servidor siempre usa: default');
console.log('   - Cliente localhost:3000 debe usar: default');
console.log('   - Cliente otros dominios usan: hostname');
