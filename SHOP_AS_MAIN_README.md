# 🛒 Configuración de Tienda como Página Principal

Este documento explica cómo configurar la tienda online como la página principal del sitio, reemplazando la landing page tradicional.

## 🎯 ¿Qué hace este cambio?

- **Página Principal**: La URL `/` redirige automáticamente a `/shop`
- **Navegación Simplificada**: Se elimina el enlace "Tienda" de la navegación
- **Configuración Automática**: La tienda se configura como plantilla principal
- **Diseño por Defecto**: Se aplica el diseño "tech-shop" automáticamente

## 🚀 Configuración Rápida

### Opción 1: Script Automático (Recomendado)

```bash
# Ejecutar el script de configuración
node scripts/setup-shop-as-main.js
```

### Opción 2: Configuración Manual

1. **Acceder al Panel de Administración**
   ```
   http://localhost:3000/admin
   ```

2. **Ir a "General" → "Cambiar Plantilla"**
   - Seleccionar "Tienda Online"
   - Aplicar cambios

3. **Ir a "Seleccionar Diseño"**
   - Elegir "Tech Shop" o el diseño deseado
   - Aplicar colores y contenido

## 📁 Archivos Modificados

### 1. `app/page.tsx`
- **Antes**: Landing page completa con secciones editables
- **Después**: Redirección automática a `/shop`

### 2. `app/shop/page.tsx`
- **Navegación**: Eliminado enlace "Tienda" (ya es la página principal)
- **Menú móvil**: Actualizado para reflejar el cambio

### 3. `scripts/setup-shop-as-main.js`
- **Nuevo script**: Configuración automática de la tienda como principal
- **Productos de ejemplo**: Crea productos iniciales
- **Configuración de diseño**: Aplica diseño por defecto

## 🔧 Configuración Detallada

### Estructura de Configuración

```javascript
{
  currentTemplate: 'shop',
  selectedDesign: 'tech-shop',
  site: {
    title: 'Mi Tienda Online',
    tagline: 'Tu tienda de confianza',
    description: 'Tienda online con productos de calidad'
  },
  shopConfig: {
    storeName: "MI TIENDA",
    storeTagline: "Tu tienda de confianza",
    navigation: ["INICIO", "PRODUCTOS", "CATEGORÍAS", "CONTACTO"],
    categories: ["Todos", "Electrónicos", "Ropa", "Hogar"],
    // ... más configuración
  },
  products: [
    // Productos de ejemplo
  ],
  layout: {
    type: 'sidebar-left',
    productStyle: 'cards-square',
    // ... configuración de layout
  }
}
```

### Navegación Actualizada

**Antes:**
- Inicio → Landing page
- Tienda → `/shop`
- LinkHub → `/linkhub`
- Admin → `/admin`

**Después:**
- Inicio → `/shop` (tienda)
- LinkHub → `/linkhub`
- Admin → `/admin`

## 🎨 Personalización

### Cambiar el Diseño

1. **Acceder al modo admin**: `Ctrl + Shift + A`
2. **Usar el selector de diseños** en la esquina superior derecha
3. **Elegir diseño**: Tech Shop, Moda Shop, Gym Shop, etc.

### Personalizar Productos

1. **Modo admin activado**
2. **Hacer clic en "Agregar Producto"** en la esquina superior derecha
3. **Editar productos existentes** con el botón "Editar"

### Configurar Categorías

1. **Modo admin activado**
2. **Hover sobre las categorías** en el sidebar
3. **Hacer clic en el ícono de edición**

## 🔄 Revertir Cambios

Si quieres volver a la landing page como página principal:

### Opción 1: Script Automático (Recomendado)
```bash
# Script para configurar landing como principal
node scripts/setup-landing-as-main.js
```

### Opción 2: Manual
1. Acceder al panel de administración (`/admin`)
2. Ir a "General" → "Cambiar Plantilla"
3. Seleccionar "Landing Page"
4. Aplicar cambios

## 🚨 Consideraciones Importantes

### SEO
- **URLs**: La tienda ahora es la página principal
- **Meta tags**: Se mantienen los meta tags de la tienda
- **Sitemap**: Actualizar si es necesario

### Analytics
- **Eventos**: Los eventos de la tienda ahora son los principales
- **Conversiones**: Enfocarse en métricas de e-commerce
- **Funnel**: El funnel principal es ahora de compra

### Usuarios Existentes
- **Bookmarks**: Los usuarios con bookmarks a `/shop` seguirán funcionando
- **Enlaces externos**: Considerar redirecciones 301 si es necesario
- **Notificaciones**: Informar a usuarios sobre el cambio

## 📊 Métricas a Monitorear

### Después del Cambio
- **Tiempo en página**: Debería aumentar
- **Tasa de conversión**: Enfocarse en ventas
- **Bounce rate**: Monitorear si mejora
- **Sesiones**: Verificar que no se pierdan visitantes

### KPIs de E-commerce
- **Productos vistos**: Engagement con el catálogo
- **Carritos abandonados**: Optimizar el proceso de compra
- **Ventas**: Métrica principal
- **ROI**: Retorno de inversión en marketing

## 🛠️ Troubleshooting

### Problema: Redirección infinita
**Solución**: Verificar que `/shop` no redirija a `/`

### Problema: Configuración no se guarda
**Solución**: Verificar permisos de Firebase y variables de entorno

### Problema: Diseño no se aplica
**Solución**: Limpiar caché del navegador y verificar configuración

### Problema: Productos no aparecen
**Solución**: Verificar que la configuración `products` esté en Firestore

## 📞 Soporte

Si tienes problemas con la configuración:

1. **Revisar logs**: Consola del navegador y terminal
2. **Verificar Firebase**: Permisos y configuración
3. **Scripts de diagnóstico**: Usar scripts de verificación existentes
4. **Crear issue**: En el repositorio de GitHub

---

**Nota**: Este cambio es irreversible sin configuración manual. Asegúrate de hacer backup antes de aplicar.
