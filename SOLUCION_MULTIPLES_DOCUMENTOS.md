# Solución: Problema de Múltiples Documentos en Firestore

## 🎯 Problema Identificado

Se estaban creando **múltiples documentos** en Firestore en lugar de usar un solo documento por tenant. Esto causaba que:

1. **Cada deploy de Vercel creaba un nuevo documento** con nombres como:
   - `plantilla-5dqaylk9f-loctimes-projects`
   - `plantilla-4sd908igv-loctimes-projects`
   - `plantilla-41zrpivf3-loctimes-projects`
   - `plantilla-tle8r0ik3-loctimes-projects`

2. **Los cambios se guardaban en documentos temporales** que se perdían en el siguiente deploy

3. **Al hacer refresh, se cargaba desde el documento temporal** en lugar del documento principal

4. **No había persistencia real** de los cambios

## 🔍 Causa Raíz

El problema estaba en las funciones `getTenantId()` y `getTenantFromRequest()` que **usaban el subdominio completo de Vercel** como tenant ID.

### Código Problemático (ANTES)
```typescript
// Buscar coincidencia por subdominio
const subdomain = hostname.split('.')[0]
if (subdomain && subdomain !== 'www') {
  return subdomain  // ❌ Esto devolvía "plantilla-5dqaylk9f-loctimes-projects"
}
```

**Resultado**: Cada deploy de Vercel generaba un nuevo tenant ID y por tanto un nuevo documento.

## 🔧 Solución Implementada

### 1. Detección Inteligente de Subdominios Vercel

Modifiqué la lógica para **extraer solo el tenant base** de los subdominios de Vercel:

```typescript
// IMPORTANTE: Para subdominios de Vercel, extraer el tenant base
// Ejemplo: plantilla-5dqaylk9f-loctimes-projects.vercel.app -> plantilla
if (hostname.includes('.vercel.app')) {
  const parts = hostname.split('.')
  if (parts.length >= 3) {
    const firstPart = parts[0]
    // Si el primer parte contiene guiones, tomar solo la parte antes del primer guión
    if (firstPart.includes('-')) {
      const baseTenant = firstPart.split('-')[0]
      console.log(`🔍 Detectado subdominio Vercel: ${hostname} -> tenant: ${baseTenant}`)
      return baseTenant
    }
    return firstPart
  }
}
```

### 2. Aplicación en Ambos Contextos

La solución se aplicó tanto en:
- **`lib/config-loader.ts`** - Para el lado cliente
- **`app/api/config/route.ts`** - Para el lado servidor (API)

## 🎯 Cómo Funciona Ahora

### Mapeo de Dominios
- `plantilla-5dqaylk9f-loctimes-projects.vercel.app` → `plantilla`
- `plantilla-4sd908igv-loctimes-projects.vercel.app` → `plantilla`
- `plantilla.controldoc.app` → `plantilla`
- `gold.controldoc.app` → `gold`
- `localhost` → `default`

### Flujo Correcto
1. **Usuario edita configuración** en cualquier subdominio de Vercel
2. **Se detecta el tenant base** (ej: `plantilla`)
3. **Se guarda en el documento principal** `plantilla`
4. **Al hacer refresh, se carga desde el mismo documento**
5. **Los cambios persisten** independientemente del subdominio

## 🛠️ Scripts de Reparación

### Script para Consolidar Documentos Existentes
```bash
node scripts/consolidate-config.js
```

Este script:
- Encuentra todos los documentos temporales (`plantilla-*`)
- Identifica el más reciente (con más datos)
- Lo consolida en el documento principal `plantilla`
- Mantiene los documentos temporales por seguridad

### Script para Probar la Lógica
```bash
node scripts/test-tenant-id.js
```

Este script prueba la nueva lógica con diferentes dominios para verificar que funciona correctamente.

## ✅ Verificación

Para verificar que la solución funciona:

1. **Edita algo en el admin** desde cualquier subdominio de Vercel
2. **Guarda los cambios**
3. **Haz refresh de la página**
4. **Los cambios deberían persistir** ✅
5. **Verifica en Firebase Console** que solo hay un documento `plantilla`

## 🚨 Importante

- **Documentos temporales**: Se mantienen por seguridad, puedes eliminarlos manualmente
- **Documento principal**: Siempre será `plantilla` para el tenant plantilla
- **Subdominios Vercel**: Ahora se mapean correctamente al tenant base
- **Persistencia**: Los cambios se mantienen entre deploys

## 📝 Archivos Modificados

- `lib/config-loader.ts`: Función `getTenantId()` actualizada
- `app/api/config/route.ts`: Función `getTenantFromRequest()` actualizada
- `scripts/consolidate-config.js`: Script para consolidar documentos
- `scripts/test-tenant-id.js`: Script para probar la lógica

## 🎉 Resultado

Ahora **solo se usa un documento por tenant** y los cambios **persisten correctamente** entre deploys y refreshes, resolviendo el problema de múltiples documentos.
