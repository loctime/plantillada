# 🚀 Plantillada - Sistema Multi-Plantilla

Una plataforma completa para crear y gestionar diferentes tipos de sitios web desde un solo panel de administración, con sistema de edición reactiva y múltiples plantillas especializadas.

## ✨ Características Principales

### 🎯 Sistema Multi-Plantilla
- **Landing Page**: Página de aterrizaje profesional con formularios y conversión
- **Tienda Online**: E-commerce completo con sistema de clonación de productos
- **Centro de Psicología**: Sitio web especializado para psicólogos y terapeutas
- **Sitio Multi-Página**: Combinación de múltiples secciones en un solo sitio
- **LinkHub**: Página de enlaces personales y redes sociales
- **Foro Comunitario**: Plataforma de discusión (próximamente)

### 🎨 Sistema de Edición Reactiva
- **Edición inline**: Modifica contenido directamente en la página
- **Cambios en tiempo real**: Sin necesidad de refrescar
- **Componentes editables**: Texto, imágenes, URLs, listas
- **Upload de archivos**: Sube imágenes directamente con drag & drop
- **Optimización automática**: Cloudinary optimiza las imágenes automáticamente
- **Modo admin protegido**: Solo usuarios autenticados pueden editar
- **Guardado automático**: Cambios se guardan en Firebase automáticamente

### 🛒 Sistema de Clonación Avanzado
- **Extracción automática**: Clona productos desde cualquier sitio web
- **Procesamiento de imágenes**: Optimización automática con Cloudinary
- **Rate limiting inteligente**: Respeto a los límites de velocidad
- **Estadísticas en tiempo real**: Métricas detalladas de clonación

### 🎨 Sistema de Diseños
- **Múltiples paletas de colores**: Especializadas por sector
- **Temas claro/oscuro**: Con paletas específicas para cada modo
- **Diseños predefinidos**: Contenido específico por sector
- **Sistema de backup**: Restauración de configuraciones anteriores

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico
- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI)
- **Base de datos**: Firebase Firestore
- **Autenticación**: Firebase Auth
- **Procesamiento de imágenes**: Cloudinary
- **Gestión de Estado**: React Context + Zustand

### Estructura de Carpetas
```
palntillada/
├── app/                    # App Router de Next.js
│   ├── admin/             # Panel de administración
│   ├── api/               # APIs del servidor
│   ├── linkhub/           # Página de enlaces
│   ├── multi/             # Sitio multi-página
│   ├── psicologos/        # Centro de psicología
│   └── shop/              # Tienda online
├── components/            # Componentes reutilizables
│   ├── editable-*.tsx     # Componentes editables
│   ├── admin-*.tsx        # Componentes de administración
│   └── ui/               # Componentes shadcn/ui
├── lib/                  # Utilidades y configuración
├── hooks/               # Custom hooks
├── scripts/             # Scripts de utilidad
└── public/              # Assets estáticos
```

## 🚀 Funcionalidades por Plantilla

### 1. Landing Page
- **Formularios de Contacto**: Integración con Calendly
- **Secciones Editables**: Contenido dinámico
- **Testimonios**: Gestión de testimonios de clientes
- **SEO Optimizado**: Meta tags y estructura semántica
- **Sistema de precios**: Opcional para bufetes de abogados

### 2. Tienda Online
- **Catálogo de Productos**: Gestión completa de inventario
- **Sistema de Clonación**: Extracción automática desde sitios externos
- **Carrito de Compras**: Gestión de compras
- **Estadísticas Avanzadas**: Métricas de rendimiento
- **Procesamiento de Imágenes**: Optimización automática

### 3. Centro de Psicología
- **Colores terapéuticos**: Púrpuras y azules
- **Servicios especializados**: Terapia individual, de pareja, familiar
- **Enfoque en confidencialidad**: Diseño que prioriza la privacidad
- **Integración Calendly**: Agendamiento profesional

### 4. LinkHub
- **Perfil personalizable**: Nombre, bio, avatar, contacto
- **Gestión de enlaces**: Agregar, editar, eliminar enlaces
- **Redes sociales**: Instagram, Twitter, LinkedIn, etc.
- **Temas personalizables**: Colores y estilos
- **Panel de gestión avanzada**: Vista completa de todos los enlaces

### 5. Sitio Multi-Página
- **Gestión de Páginas**: Crear, editar y organizar páginas
- **Navegación Unificada**: Configuración de menús
- **Configuración Global**: SEO, analytics y más
- **Ordenamiento**: Control del orden de las páginas

## 🎨 Sistema de Diseños Especializados

### Diseños Disponibles

#### Landing Page
- **Estudio Contable**: Azules profesionales, tipografía serif
- **Estudio de Abogados**: Oscuros elegantes, precios opcionales
- **Ingenieros**: Verdes y azules, tipografía técnica
- **Blog Personal**: Colores vibrantes, tipografía moderna
- **Coach Personal**: Colores cálidos, tipografía amigable
- **Fumigaciones**: Verdes y naranjas, layout específico

#### Tienda Online
- **Tech Shop**: Azules tecnológicos, tipografía futurista
- **Moda Shop**: Rosas y dorados, tipografía elegante
- **Gym Shop**: Rojos energéticos, tipografía deportiva
- **Lifestyle Shop**: Verdes naturales, tipografía minimalista

### Características de los Diseños
- **Paletas de colores personalizadas** por sector
- **Contenido predefinido** específico del nicho
- **Tipografías especializadas** para cada sector
- **Sistema de backup automático** al aplicar diseños
- **Configuración por defecto** optimizada

## 🔧 Configuración y Instalación

### Prerrequisitos
```bash
Node.js 18+
npm o pnpm
Cuenta de Firebase
Cuenta de Cloudinary (opcional)
```

### Instalación
```bash
# Clonar repositorio
git clone https://github.com/loctime/plantillada.git
cd palntillada

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
```

### Variables de Entorno
```env
# Firebase Configuration (REQUERIDO)
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id

# Cloudinary (opcional)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Credenciales del panel de administración
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### Configuración de Firebase

1. **Crear proyecto** en [Firebase Console](https://console.firebase.google.com/)
2. **Habilitar Firestore** Database
3. **Configurar reglas de Firestore**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /config/{document} {
      allow read, write: if true;
    }
    match /backups/{document} {
      allow read, write: if true;
    }
    match /tenants/{document} {
      allow read, write: if true;
    }
  }
}
```

### Ejecutar en Desarrollo
```bash
npm run dev
```

## 🎯 Uso del Sistema

### 1. Acceder al Panel de Administración
```
http://localhost:3000/admin
Usuario: admin
Contraseña: admin123
```

### 2. Modo Admin Inline
- **Atajo de teclado**: `Ctrl + Shift + A` (requiere autenticación)
- **Botón flotante**: En la esquina inferior derecha
- **Edición directa**: Hover sobre elementos para editar
- **Guardado automático**: Cambios se guardan en tiempo real

### 3. Seleccionar Plantilla y Diseño
1. Ir a "General" → "Cambiar Plantilla"
2. Elegir plantillas deseadas
3. Ir a "Seleccionar Diseño"
4. Elegir diseño específico por sector
5. Aplicar colores y/o contenido predefinido

### 4. Personalizar Contenido
- **Edición inline**: Hacer clic en cualquier texto para editarlo
- **Upload de imágenes**: Arrastra y suelta imágenes directamente
- **Gestión de secciones**: Mostrar/ocultar secciones
- **Gestión de sesiones**: Agregar/eliminar servicios
- **Gestión de testimonios**: Agregar/eliminar testimonios
- **Gestión de colores**: Personalizar paleta de colores
- **Gestión del LinkHub**: Configurar enlaces y redes sociales

### 5. Clonar Productos (Tienda)
1. Ir a la pestaña "Clonación"
2. Ingresar URL del producto a clonar
3. El sistema extraerá automáticamente:
   - Nombre y descripción
   - Precio y categoría
   - Imágenes del producto
   - Metadatos

## 🔧 Características Técnicas Avanzadas

### Sistema de Edición Reactiva
```tsx
// Regla fundamental: Si no es editable, no está terminado
const { config, updateConfig } = useAdmin()

<EditableText 
  value={config.site.title}
  onSave={(value) => updateConfig({ site: { ...config.site, title: value } })}
/>
```

### Sistema Multi-Tenant
- **Detección automática** de subdominios
- **Configuración independiente** por tenant
- **Soporte para Vercel** con subdominios temporales
- **Consolidación automática** de documentos

### Sistema de Backup
- **Backup automático** al aplicar diseños
- **Gestión de backups** desde el panel admin
- **Restauración** de configuraciones anteriores
- **Eliminación** de backups antiguos

### Sistema de Colores
- **Paletas predefinidas** por sector
- **Modo claro/oscuro** con paletas específicas
- **Aplicación en tiempo real** de cambios
- **Reset** a configuración original

## 📊 APIs Disponibles

### Configuración
```typescript
// Cargar configuración
GET /api/config

// Guardar configuración
POST /api/config
```

### Clonación de Productos
```typescript
// Clonar producto individual
POST /api/clone-product
{
  "url": "https://ejemplo.com/producto/123"
}

// Obtener estadísticas
GET /api/cloning-stats
```

### Super Admin
```typescript
// Gestión de tenants
GET /api/super-admin/tenants
POST /api/super-admin/tenants/[tenantId]
```

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Configurar variables de entorno
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
```

### Configuración de Dominio
1. Agregar dominio personalizado en Vercel
2. Configurar registros DNS
3. Configurar SSL automático

## 🛠️ Scripts de Utilidad

### Configuración
```bash
# Aplicar diseño específico
node scripts/apply-psicologos-design.js
node scripts/apply-fumigaciones-design.js
node scripts/apply-abogados-design.js

# Configurar ControlDoc
node scripts/setup-controldoc.js

# Consolidar configuración
node scripts/consolidate-config.js
```

### Pruebas
```bash
# Probar sistema de diseños
node scripts/test-design-system-enhanced.js

# Probar autenticación
node scripts/test-admin-auth.js

# Probar paletas de colores
node scripts/test-palette-dark-mode.js
```

### Diagnóstico
```bash
# Verificar configuración
node scripts/verify-config.js

# Debuggear configuración actual
node scripts/debug-config.js

# Reparar permisos de Firebase
node scripts/fix-firebase-permissions.js
```

## 🔒 Seguridad y Compliance

### Medidas Implementadas
- **Rate Limiting**: Protección contra abuso
- **Validación de URLs**: Verificación de enlaces
- **User-Agent Realista**: Simulación de navegadores
- **Respeto a robots.txt**: Cumplimiento de directrices
- **Manejo de Errores**: Logging y monitoreo

### Autenticación
- **Sesión persistente**: 24 horas automáticas
- **Modo admin protegido**: Solo usuarios autenticados
- **Logout automático**: Expiración de sesión
- **Credenciales configurables**: Variables de entorno

### Disclaimer Legal
```
Este sistema es para uso educativo y de desarrollo.
El usuario es responsable de:
- Obtener autorización previa de los sitios web origen
- Respetar derechos de autor y marcas registradas
- Cumplir con las leyes locales de comercio electrónico
- No infringir términos de servicio de terceros
```

## 🚨 Solución de Problemas

### Problemas Comunes

#### Los cambios no se ven después de guardar
- **Solución**: Refrescar manualmente o usar `Ctrl + Shift + A`
- **Causa**: Problema de sincronización del contexto

#### Error de permisos de Firebase
- **Solución**: Actualizar reglas de Firestore
- **Causa**: Reglas muy restrictivas

#### Múltiples documentos en Firestore
- **Solución**: Ejecutar `node scripts/consolidate-config.js`
- **Causa**: Subdominios temporales de Vercel

#### Modo admin no se activa
- **Solución**: Verificar autenticación y usar botón flotante
- **Causa**: Usuario no autenticado

### Herramientas de Diagnóstico
- **Scripts de prueba**: Verificar funcionalidades específicas
- **Logs de Firebase**: Revisar consola del navegador
- **Verificación de configuración**: Scripts de diagnóstico

## 📈 Roadmap

### Fase 1 - Funcionalidades Básicas ✅
- Panel de administración con autenticación
- Sistema de edición reactiva
- Múltiples plantillas y diseños
- Integración con Firebase

### Fase 2 - Funcionalidades Avanzadas ✅
- Sistema de clonación de productos
- Sistema de backup y restauración
- Paletas de colores personalizables
- Modo claro/oscuro

### Fase 3 - Mejoras de UX 🔄
- Drag & drop para reordenar secciones
- Upload directo de imágenes
- Editor visual de colores
- Previsualización en tiempo real

### Fase 4 - Funcionalidades Premium 📋
- Dashboard de analytics
- Sistema de leads y CRM
- A/B testing de contenido
- Backup programado automático

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/NuevaFuncionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/NuevaFuncionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

### Documentación Adicional
- **Configuración de Firebase**: Ver `FIREBASE_SETUP.md`
- **Solución de Problemas**: Ver `TROUBLESHOOTING.md`
- **Modo Admin**: Ver `ADMIN_MODE_README.md`
- **Sistema de Diseños**: Ver `DESIGN_SYSTEM_README.md`
- **Edición Reactiva**: Ver `REACTIVE_EDITING_README.md`
- **Autenticación**: Ver `ADMIN_AUTH_README.md`
- **Diseño de Fumigaciones**: Ver `FUMIGACIONES_EDITABLE_README.md`
- **Sistema de Upload**: Ver `UPLOAD_SYSTEM_README.md`

### Contacto
- **Issues**: [GitHub Issues](https://github.com/loctime/plantillada/issues)
- **Documentación**: [README.md](readme.md)
- **Soporte**: Crear issue en GitHub

---

**Plantillada** - Sistema Multi-Plantilla para sitios web profesionales 🚀

*Regla Fundamental: Si no es editable, no está terminado.*