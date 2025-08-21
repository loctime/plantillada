# 🎯 Sistema de Plantillas Activas

## 📋 Descripción

El sistema de **Plantillas Activas** (`activeTemplates`) es una mejora del sistema anterior que permite un control más granular sobre qué plantillas están disponibles y en qué orden se muestran. La primera plantilla en el array será la página principal del sitio.

## 🔄 Cómo Funciona

### 1. **Orden de Selección**
- Las plantillas se seleccionan en orden de prioridad
- La **primera plantilla seleccionada** será la página principal (`/`)
- Las plantillas desactivadas no estarán disponibles

### 2. **Redirección Automática**
- `http://localhost:3000/` → Revisa `config.activeTemplates[0]`
- Si `activeTemplates = ['shop', 'landing']` → Redirige a `/shop`
- Si `activeTemplates = ['landing', 'shop']` → Redirige a `/landing`

### 3. **Plantillas Disponibles**
- **Landing Page** (`/landing`) - Página de aterrizaje profesional
- **Tienda Online** (`/shop`) - E-commerce completo
- **Link Hub** (`/linkhub`) - Página de enlaces personales
- **Centro de Psicología** (`/psicologos`) - Sitio para terapeutas
- **Sitio Multi-Página** (`/multi`) - Combinación de secciones

## 🛠️ Configuración

### Configuración Inicial
```bash
# Configurar el sistema de plantillas activas
node scripts/setup-active-templates.js
```

### Desde el Panel de Administración
1. Ir a `http://localhost:3000/admin`
2. Sección "General" → "Cambiar Plantilla"
3. Seleccionar plantillas en el orden deseado
4. La primera seleccionada será la página principal

## 📊 Ejemplos de Configuración

### Ejemplo 1: Solo Tienda
```json
{
  "activeTemplates": ["shop"]
}
```
- Página principal: `/shop`
- Navegación: Solo tienda

### Ejemplo 2: Landing + Tienda
```json
{
  "activeTemplates": ["landing", "shop"]
}
```
- Página principal: `/landing`
- Navegación: Landing → Tienda

### Ejemplo 3: Tienda + Landing
```json
{
  "activeTemplates": ["shop", "landing"]
}
```
- Página principal: `/shop`
- Navegación: Tienda → Landing

### Ejemplo 4: Múltiples Plantillas
```json
{
  "activeTemplates": ["linkhub", "shop", "landing"]
}
```
- Página principal: `/linkhub`
- Navegación: LinkHub → Tienda → Landing

## 🔧 Archivos Modificados

### 1. **Página Principal** (`app/page.tsx`)
```typescript
// Revisa activeTemplates en lugar de currentTemplate
const activeTemplates = config.activeTemplates || []
const firstActiveTemplate = activeTemplates[0]

// Redirige según la primera plantilla activa
switch (firstActiveTemplate) {
  case 'shop': router.replace("/shop")
  case 'landing': router.replace("/landing")
  // ...
}
```

### 2. **Selector de Plantillas** (`components/template-selector.tsx`)
- Muestra el orden de selección
- Indica cuál es la página principal
- Permite activar/desactivar plantillas

### 3. **Panel de Administración** (`app/admin/page.tsx`)
- Usa `activeTemplates` en lugar de `selectedTemplates`
- Guarda el orden de selección

## 🎨 Interfaz de Usuario

### Indicadores Visuales
- **Badge "Principal"**: Indica la página principal
- **Badge "#2, #3..."**: Indica el orden de las demás plantillas
- **Orden actual**: Muestra la secuencia completa

### Selección de Plantillas
1. Marcar/desmarcar checkboxes
2. El orden se mantiene automáticamente
3. La primera marcada será la principal
4. Cambios se guardan automáticamente

## 🚀 Ventajas del Nuevo Sistema

### ✅ **Flexibilidad**
- Control total sobre qué plantillas están activas
- Orden personalizable de navegación
- Fácil activación/desactivación

### ✅ **Simplicidad**
- Una sola configuración para todo
- No más confusión entre plantillas
- Interfaz intuitiva

### ✅ **Escalabilidad**
- Fácil agregar nuevas plantillas
- Sistema preparado para futuras expansiones
- Compatible con el sistema existente

## 🔍 Solución de Problemas

### Problema: No redirige correctamente
**Solución:**
1. Verificar `config.activeTemplates` en la consola del navegador
2. Asegurar que al menos una plantilla esté activa
3. Revisar que la primera plantilla sea válida

### Problema: Plantillas no aparecen en navegación
**Solución:**
1. Verificar que estén en `activeTemplates`
2. Revisar que no estén desactivadas
3. Limpiar caché del navegador

### Problema: Cambios no se guardan
**Solución:**
1. Verificar conexión con Firebase
2. Revisar permisos de escritura
3. Ejecutar script de configuración

## 📝 Migración desde el Sistema Anterior

### Compatibilidad
- El sistema mantiene compatibilidad con `currentTemplate`
- Migra automáticamente `selectedTemplates` a `activeTemplates`
- No requiere cambios en plantillas existentes

### Migración Automática
```bash
# Ejecutar script de migración
node scripts/setup-active-templates.js
```

### Migración Manual
1. Ir a `/admin`
2. Seleccionar plantillas en el orden deseado
3. Guardar configuración
4. Verificar redirección en `/`

## 🎯 Próximos Pasos

1. **Probar el sistema** en desarrollo
2. **Configurar plantillas** según necesidades
3. **Verificar redirecciones** en todas las rutas
4. **Documentar casos de uso** específicos

---

**¿Necesitas ayuda?** Revisa la documentación o contacta al equipo de desarrollo.
