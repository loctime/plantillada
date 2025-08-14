# 🚀 Plantillada - Sistema Multi-Plantilla (README Consolidado)

Una plataforma completa para crear y gestionar diferentes tipos de sitios web desde un solo panel de administración, con sistema de edición reactiva y múltiples plantillas especializadas.

## 📋 Índice
- [Características Principales](#características-principales)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Configuración e Instalación](#configuración-e-instalación)
- [Sistema de Autenticación](#sistema-de-autenticación)
- [Modo Admin Inline](#modo-admin-inline)
- [Sistema de Edición Reactiva](#sistema-de-edición-reactiva)
- [Sistema de Diseños](#sistema-de-diseños)
- [Sistema de Colores Universal](#sistema-de-colores-universal)
- [Sistema de Upload](#sistema-de-upload)
- [Funcionalidades por Plantilla](#funcionalidades-por-plantilla)
- [APIs Disponibles](#apis-disponibles)
- [Despliegue](#despliegue)
- [Scripts de Utilidad](#scripts-de-utilidad)
- [Solución de Problemas](#solución-de-problemas)
- [Roadmap](#roadmap)

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

## 🔧 Configuración e Instalación

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

## 🔐 Sistema de Autenticación

### Características
- **Acceso fácil**: Enlace "Admin" en la barra de navegación
- **Sesión persistente**: 24 horas automáticas
- **No re-autenticación**: La sesión se mantiene activa
- **Logout**: Botón para cerrar sesión
- **Modo admin protegido**: Solo usuarios autenticados pueden editar

### Componentes
- **AdminLoginModal**: Modal de login reutilizable
- **useAdminAuth**: Hook personalizado para manejar autenticación
- **AdminAuthStatus**: Muestra estado de autenticación

### Flujo de Usuario
1. **Login**: Clic en "Admin" → Modal de login → Credenciales
2. **Sesión Activa**: 24 horas automáticas, acceso directo a `/admin`
3. **Logout**: Botón "Cerrar Sesión" en `/admin` o indicador de estado

## 🎯 Modo Admin Inline

### Activación
- **Atajo de teclado**: `Ctrl + Shift + A` (requiere autenticación)
- **Botón flotante**: En la esquina inferior derecha

### Características
- **Edición de texto inline**: Hover sobre texto para editar
- **Edición de listas**: Agregar, eliminar y reordenar elementos
- **Edición de URLs**: Validación automática y vista previa
- **Edición de imágenes y videos**: Vista previa en tiempo real
- **Edición de botones**: Texto editable con tamaño automático
- **Gestión de sesiones**: Panel completo de gestión
- **Gestión de testimonios**: Panel de gestión de testimonios
- **Gestión de secciones**: Mostrar/ocultar secciones
- **Gestión del LinkHub**: Panel completo de gestión
- **Gestión de colores**: Panel completo de gestión de colores

### Elementos Editables
- ✅ **Header**: Título del sitio, tagline
- ✅ **Contenido Multimedia**: Imagen Hero, contenido personal
- ✅ **Botones**: Hero, Sesiones, Curso, Sobre Mí, CTA
- ✅ **Secciones**: Hero, Sesiones, Curso, Sobre Mí, Testimonios, CTA, LinkHub
- ✅ **Footer**: Email de contacto, URLs de términos y privacidad

### Guardado Automático
- **Guardado en tiempo real**: Los cambios se guardan automáticamente en Firebase
- **Indicador de estado**: 
  - 🔄 "Guardando..." durante el proceso
  - ✅ "Guardado [hora]" cuando se completa
  - 💾 "Sin cambios" cuando no hay modificaciones pendientes

## ⚡ Sistema de Edición Reactiva

### Reglas de Oro
1. **SIEMPRE usar el contexto directamente**: `const { config, updateConfig } = useAdmin()`
2. **SIEMPRE agregar estado de loading**: Verificar que `config` existe
3. **SIEMPRE hacer nuevos elementos editables**: Usar `EditableText`, `EditableImage`, `EditableUrl`
4. **Patrón estándar para elementos editables**:
```tsx
<EditableText 
  value={config.miSeccion?.miCampo || "Valor por defecto"}
  onSave={(value) => {
    updateConfig({
      ...config,
      miSeccion: {
        ...config.miSeccion,
        miCampo: value
      }
    })
  }}
  className="mi-clase-css"
  tag="h2"
/>
```

### Checklist para Nuevas Implementaciones
- [ ] ¿El componente usa `useAdmin()` directamente?
- [ ] ¿Tiene estado de loading cuando `!config`?
- [ ] ¿Todos los textos son `EditableText`?
- [ ] ¿Todas las imágenes son `EditableImage`?
- [ ] ¿Todas las URLs son `EditableUrl`?
- [ ] ¿La interfaz `Config` está actualizada?
- [ ] ¿Los cambios se guardan con `updateConfig`?
- [ ] ¿Funciona la reactividad en modo admin?

**Regla Fundamental**: Si no es editable, no está terminado.

## 🎨 Sistema de Diseños

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
- **Food Shop**: Amarillo y negro, estilo "PedidoRapido"

### Características de los Diseños
- **Paletas de colores personalizadas** por sector
- **Contenido predefinido** específico del nicho
- **Tipografías especializadas** para cada sector
- **Sistema de backup automático** al aplicar diseños
- **Configuración por defecto** optimizada

## 🎨 Sistema de Colores Universal

### Características
- **Control Universal**: Todos los colores de la web se controlan desde un solo lugar
- **Aplicación en Tiempo Real**: Los cambios se aplican inmediatamente
- **Modo Claro/Oscuro**: Paletas específicas para cada modo
- **Paletas Predefinidas**: Colores especializados por sector
- **Edición Personalizada**: Modificar colores individuales

### Variables CSS Personalizadas
```css
:root {
  /* Colores principales */
  --background-color: #ffffff;
  --section-background: #f8fafc;
  --navbar-background: #ffffff;
  --text-color: #1e293b;
  --accent-color: #10b981;
  
  /* Colores de botones */
  --primary-button-color: #10b981;
  --secondary-button-color: #3b82f6;
  --outline-button-color: #6b7280;
}
```

### Clases CSS del Tema
```css
/* Fondos */
.theme-bg-primary { background-color: var(--background-color) !important; }
.theme-bg-section { background-color: var(--section-background) !important; }

/* Textos */
.theme-text-primary { color: var(--text-color) !important; }
.theme-text-accent { color: var(--accent-color) !important; }

/* Botones */
.theme-btn-primary { background-color: var(--primary-button-color) !important; }
.theme-btn-secondary { background-color: var(--secondary-button-color) !important; }
```

## 📤 Sistema de Upload

### Características
- **Upload directo**: Sube imágenes desde tu dispositivo
- **Drag & Drop**: Arrastra y suelta archivos fácilmente
- **Optimización automática**: Cloudinary optimiza las imágenes automáticamente
- **Validación**: Verificación de tipos y tamaños de archivo
- **Preview en tiempo real**: Vista previa antes de confirmar
- **CDN global**: Mejor rendimiento de carga

### Tipos de Archivo Soportados
- JPEG/JPG, PNG, GIF, WebP, SVG

### Límites
- **Tamaño máximo**: 5MB por archivo
- **Almacenamiento**: 25GB (plan gratuito de Cloudinary)
- **Ancho de banda**: 25GB/mes (plan gratuito)

### Uso
1. **Activa el modo admin** (`Ctrl + Shift + A`)
2. **Haz clic en una imagen** para editarla
3. **Selecciona "Subir"** en lugar de "URL"
4. **Arrastra o selecciona** tu archivo
5. **Confirma** el upload

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

### Upload
```typescript
// Subir archivo
POST /api/upload
// FormData con campo 'file'
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

# Probar sistema de upload
node scripts/test-upload-api.js
```

### Diagnóstico
```bash
# Verificar configuración
node scripts/verify-config.js

# Debuggear configuración actual
node scripts/debug-config.js

# Reparar permisos de Firebase
node scripts/fix-firebase-permissions.js

# Verificar variables de entorno
node scripts/debug-env.js
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

#### Variables de entorno no funcionan
- **Solución**: Usar solo `.env.local`, eliminar `.env`
- **Causa**: Conflicto entre archivos de variables

#### Bucle infinito en ThemeSwitch
- **Solución**: Optimización de `useEffect` y contexto
- **Causa**: Dependencias que cambian en cada render

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
- **Sistema de Colores**: Ver `UNIVERSAL_COLORS_README.md`

### Contacto
- **Issues**: [GitHub Issues](https://github.com/loctime/plantillada/issues)
- **Documentación**: [README.md](readme.md)
- **Soporte**: Crear issue en GitHub

---

**Plantillada** - Sistema Multi-Plantilla para sitios web profesionales 🚀

*Regla Fundamental: Si no es editable, no está terminado.*
