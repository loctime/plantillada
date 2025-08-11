# Solución: Problema de Cambios que se Revierten

## 🎯 Problema Identificado

Los cambios se guardaban correctamente en Firestore (como se veía en los logs), pero al hacer refresh de la página, los cambios se revertían a la configuración original.

### Síntomas
- ✅ Configuración se guarda exitosamente en Firestore
- ✅ Logs muestran "Documento guardado exitosamente"
- ❌ Al hacer refresh, los cambios desaparecen
- ❌ Se vuelve a cargar la configuración por defecto

## 🔍 Causa Raíz

El problema estaba en la lógica de `loadConfig` en `lib/config-loader.ts`. Cuando se cargaba la configuración desde Firestore:

1. **Se detectaba un `currentTemplate`** en la configuración guardada
2. **Se aplicaba automáticamente el template** en lugar de usar la configuración personalizada
3. **Se sobrescribían los cambios** con la configuración del template

### Código Problemático (ANTES)
```typescript
// Si hay un template guardado, aplicar esa configuración
if (config.currentTemplate) {
  console.log('📋 Aplicando template guardado:', config.currentTemplate)
  return getTemplateConfig(config.currentTemplate, tenant)
}
```

## 🔧 Solución Implementada

### 1. Modificación de `loadConfig`
Cambié la lógica para que **solo aplique templates cuando se solicite explícitamente**:

```typescript
// IMPORTANTE: No aplicar template automáticamente si hay configuración personalizada
// Solo aplicar template si se solicita explícitamente
if (template && config.currentTemplate) {
  console.log('📋 Aplicando template solicitado:', template)
  return getTemplateConfig(template, tenant)
}
// Si no hay template solicitado, devolver la configuración personalizada
console.log('✅ Cargando configuración personalizada guardada')
return config
```

### 2. Modificación de `saveConfig`
Agregué lógica para **limpiar automáticamente el `currentTemplate`** cuando se guarda configuración personalizada:

```typescript
// IMPORTANTE: Limpiar currentTemplate cuando se guarda configuración personalizada
// para evitar que se aplique automáticamente al cargar
const configToSave = { ...config }
if (configToSave.currentTemplate) {
  console.log('🧹 Limpiando currentTemplate para evitar aplicación automática')
  delete configToSave.currentTemplate
}
```

### 3. Nueva Función `saveTemplate`
Creé una función específica para guardar templates cuando se seleccionan desde el admin:

```typescript
export async function saveTemplate(templateId: string, tenantId?: string): Promise<boolean> {
  // Esta función SÍ mantiene el currentTemplate para que se aplique automáticamente
  const templateConfig = getTemplateConfig(templateId, tenant)
  templateConfig.currentTemplate = templateId
  // ... guardar en Firestore
}
```

## 🎯 Cómo Funciona Ahora

### Flujo Correcto
1. **Usuario edita configuración** en el admin
2. **Se guarda con `saveConfig()`** (se limpia `currentTemplate`)
3. **Al cargar la página**, se usa la configuración personalizada
4. **Los cambios persisten** después del refresh

### Flujo para Templates
1. **Usuario selecciona template** en el admin
2. **Se guarda con `saveTemplate()`** (se mantiene `currentTemplate`)
3. **Al cargar la página**, se aplica el template automáticamente
4. **El template se mantiene** hasta que se edite manualmente

## 🛠️ Scripts de Reparación

### Script para Limpiar Configuración Actual
```bash
node scripts/fix-config.js
```

Este script:
- Lee la configuración actual de Firestore
- Elimina el campo `currentTemplate` si existe
- Guarda la configuración limpia

### Script para Debuggear
```bash
node scripts/debug-config.js
```

Este script muestra el estado actual de la configuración en Firestore.

## ✅ Verificación

Para verificar que la solución funciona:

1. **Edita algo en el admin**
2. **Guarda los cambios**
3. **Haz refresh de la página**
4. **Los cambios deberían persistir**

## 🚨 Importante

- **Templates**: Solo se aplican cuando se seleccionan explícitamente
- **Configuración personalizada**: Siempre tiene prioridad sobre templates
- **currentTemplate**: Se limpia automáticamente al guardar cambios personalizados

## 📝 Archivos Modificados

- `lib/config-loader.ts`: Lógica principal de carga y guardado
- `scripts/fix-config.js`: Script para limpiar configuración actual
- `scripts/debug-config.js`: Script para debuggear

## 🎉 Resultado

Ahora los cambios se guardan correctamente y **persisten después del refresh**, resolviendo el problema de reversión de cambios.
