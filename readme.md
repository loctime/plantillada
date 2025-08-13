# Landing Page - Hotmart + Calendly

Landing page profesional para servicios de coaching/consultoría con integración de Hotmart (ventas) y Calendly (agendamiento).

## 🏗️ Arquitectura del Proyecto

### Stack Tecnológico
- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI)
- **Gestión de Estado**: React Hooks
- **Formularios**: React Hook Form + Zod
- **Iconos**: Lucide React
- **Fuentes**: Geist (Sans + Mono)

### Estructura de Carpetas
```
landing-hotmart-calendly/
├── app/                    # App Router de Next.js
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── components/            # Componentes reutilizables
│   ├── schedule-dialog.tsx # Integración Calendly
│   ├── theme-provider.tsx  # Provider de tema
│   └── ui/               # Componentes shadcn/ui
├── lib/                  # Utilidades y configuración
│   ├── site.ts          # Configuración del sitio
│   └── utils.ts         # Utilidades generales
├── hooks/               # Custom hooks
├── public/              # Assets estáticos
└── styles/              # Estilos adicionales
```

## 🎯 Funcionalidades Principales

### 🎨 **Sistema de Edición Reactiva (NUEVO)**

**Regla Fundamental**: Si no es editable, no está terminado.

El proyecto incluye un **sistema de edición inline** que permite modificar todo el contenido en tiempo real:

- ✅ **Edición reactiva** - Cambios inmediatos sin refrescar
- ✅ **Componentes editables** - `EditableText`, `EditableImage`, `EditableUrl`
- ✅ **Contexto admin** - Gestión centralizada del estado
- ✅ **Persistencia automática** - Guardado en Firebase

**Documentación completa**: Ver `REACTIVE_EDITING_README.md` para la fórmula mágica de implementación.

### 1. Integración Calendly
- **Componente**: `components/schedule-dialog.tsx`
- **Funcionalidad**: Modal con iframe de Calendly
- **Configuración**: URL en `lib/site.ts` → `calendlyUrl`
- **Fallback**: Enlace directo si iframe falla

### 2. Integración Hotmart
- **Productos**: Sesiones 1:1 y curso online
- **Configuración**: URLs en `lib/site.ts` → `sessions[].hotmartUrl` y `course.hotmartUrl`
- **Flujo**: Botón → Nueva pestaña → Checkout Hotmart

### 3. Secciones de la Landing
- **Hero**: Título, subtítulo, CTAs principales
- **Sesiones**: 3 tipos de sesiones 1:1 con precios
- **Curso**: Producto digital con video de presentación
- **Sobre mí**: Historia personal + foto/video
- **Testimonios**: Social proof de clientes
- **CTA Banner**: Call-to-action final
- **Footer**: Enlaces legales y contacto

## ⚙️ Configuración del Sitio

### Sistema de Configuración Dinámica con Firebase

El proyecto incluye un **sistema de configuración avanzado** con:

1. **Firestore Database** para almacenamiento persistente y escalable
2. **Panel de administración** (`/admin`) protegido con contraseña
3. **API REST** (`/api/config`) para cargar/guardar configuración
4. **Configuración en tiempo real** sin necesidad de código
5. **Funciona en producción** (Vercel, Netlify, etc.) sin errores 500

### 🚀 **Migración a Firebase (NUEVO)**

Para resolver el error 500 en producción, hemos migrado a **Firestore**:

#### **Beneficios de Firebase:**
- ✅ **Funciona en producción** - No más errores 500
- ✅ **Datos persistentes** - Configuración segura en la nube
- ✅ **Escalable** - Maneja múltiples clientes
- ✅ **Tiempo real** - Actualizaciones instantáneas
- ✅ **Sin dependencias del servidor** - No requiere escritura de archivos

#### **Configuración Rápida:**
1. **Crear proyecto Firebase** en [Firebase Console](https://console.firebase.google.com/)
2. **Habilitar Firestore** Database
3. **Configurar variables de entorno** (ver sección Variables de Entorno)
4. **Migrar configuración existente** usando el script incluido

#### **Script de Migración:**
```bash
node scripts/migrate-config.js
```

Este script te mostrará el JSON actual para copiar a Firestore.

#### **Documentación Completa:**
Ver `FIREBASE_SETUP.md` para instrucciones detalladas.

### 💡 **Ventajas del Sistema de Configuración**

#### **Para el Cliente Final** 🎯
- **Independencia total**: No necesita conocimientos técnicos
- **Actualizaciones instantáneas**: Cambios en tiempo real
- **Flexibilidad completa**: Personalización sin límites
- **Interfaz intuitiva**: Panel fácil de usar y entender

#### **Para el Desarrollador** ⚡
- **Menos soporte**: El cliente se autogestiona
- **Escalabilidad**: Fácil agregar nuevas funcionalidades
- **Mantenimiento reducido**: Configuración centralizada
- **Reutilización**: Sistema aplicable a múltiples proyectos

#### **Para el Negocio** 📈
- **Reducción de costos**: Menos horas de desarrollo
- **Satisfacción del cliente**: Control total sobre su sitio
- **Escalabilidad**: Múltiples clientes con el mismo sistema
- **Competitividad**: Diferenciación en el mercado

### Sistema JSON de Configuración

#### **Archivo Principal**: `public/config.json`
```json
{
  "site": {
    "title": "Tu Marca Personal",
    "tagline": "Acompañamiento 1:1 y formación práctica para cambios reales."
  },
  "integrations": {
    "calendlyUrl": "https://calendly.com/tu-usuario/sesion",
    "hotmartBaseUrl": "https://pay.hotmart.com"
  },
  "sessions": [
    {
      "id": "sesion-claridad",
      "name": "Sesión de Claridad",
      "summary": "Define tu objetivo y el plan inmediato de 30 días.",
      "duration": "60 min",
      "price": "€99",
      "features": ["Diagnóstico inicial", "Plan de acción", "Seguimiento"],
      "hotmartUrl": "https://pay.hotmart.com/TU_CHECKOUT_1"
    }
  ],
  "course": {
    "title": "Curso Online: Sistema de Productividad Sencilla",
    "blurb": "Aprende a construir un sistema ligero...",
    "price": "€179",
    "hotmartUrl": "https://pay.hotmart.com/TU_CHECKOUT_CURSO",
    "videoUrl": "",
    "bullets": ["Estructura semanal", "Métricas simples", "Plantillas"]
  },
  "about": {
    "photoUrl": "/placeholder.svg",
    "videoUrl": "",
    "story": "Soy [Tu Nombre], consultor y coach...",
    "whyMe": "He acompañado a +300 clientes..."
  },
  "testimonials": [
    {
      "quote": "En dos sesiones definimos un plan claro...",
      "author": "María G.",
      "role": "Marketing Specialist"
    }
  ],
  "contact": {
    "email": "hola@tumarca.com"
  },
  "legal": {
    "termsUrl": "",
    "privacyUrl": ""
  }
}
```

#### **API Endpoints**
- **GET** `/api/config` - Cargar configuración
- **POST** `/api/config` - Guardar configuración

#### **Componentes del Sistema**
- **`lib/config-loader.ts`** - Funciones para cargar/guardar JSON
- **`app/api/config/route.ts`** - API REST para configuración
- **`app/page.tsx`** - Carga dinámica desde JSON (Client Component)

### Panel de Administración

**URL**: `/admin`
**Credenciales por defecto**:
- Usuario: `admin`
- Contraseña: `admin123`

**Funcionalidades Configurables** (7 Pestañas):

#### 🔧 **1. General**
- **Título del sitio**: Nombre de la marca/empresa
- **Tagline**: Descripción principal del servicio
- **Email de contacto**: Para formularios y comunicación

#### 📅 **2. Integraciones**
- **URL de Calendly**: Enlace directo al calendario de agendamiento
- **URL base de Hotmart**: Configuración de la plataforma de pagos

#### 🎯 **3. Sesiones 1:1**
- **Agregar/Eliminar sesiones**: Gestión completa de servicios
- **Nombre y precio**: Personalización de cada sesión
- **Duración**: Tiempo estimado de cada sesión
- **Resumen**: Descripción de cada servicio
- **Características**: Lista de beneficios (una por línea)
- **URL de Hotmart**: Enlace al checkout específico

#### 🛒 **4. Curso Online**
- **Título del curso**: Nombre del producto digital
- **Descripción**: Detalles y beneficios del curso
- **Precio**: Costo del curso (formato flexible)
- **URL de Hotmart**: Enlace al checkout de ventas
- **Video de presentación**: URL de YouTube/Vimeo para preview
- **Características**: Lista de beneficios del curso

#### 👤 **5. Sobre Mí**
- **Foto profesional**: URL de la imagen de perfil
- **Video de presentación**: Video personal de introducción
- **Mi historia**: Biografía y experiencia profesional
- **¿Por qué elegirme?**: Propuesta de valor única

#### 💬 **6. Testimonios**
- **Agregar/Eliminar testimonios**: Gestión completa de testimonios
- **Texto del testimonio**: Opinión del cliente
- **Nombre del cliente**: Autor del testimonio
- **Cargo/Profesión**: Rol profesional del cliente

#### 🔗 **7. Legal**
- **URL de Términos y Condiciones**: Enlace a página legal
- **URL de Política de Privacidad**: Enlace a política de datos

### Variables de Entorno

Crear archivo `.env.local` con:

```bash
# Firebase Configuration (REQUERIDO)
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Configuración de administración
ADMIN_PASSWORD=admin123
ADMIN_USERNAME=admin

# Variables legacy (opcionales - ahora se manejan desde Firebase)
NEXT_PUBLIC_SITE_TITLE=Tu Marca Personal
NEXT_PUBLIC_SITE_TAGLINE=Acompañamiento 1:1 y formación práctica...
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/tu-usuario/sesion
NEXT_PUBLIC_HOTMART_BASE_URL=https://pay.hotmart.com
COURSE_TITLE=Curso Online: Sistema de Productividad...
COURSE_PRICE=€179
COURSE_HOTMART_URL=https://pay.hotmart.com/TU_CHECKOUT_CURSO
ABOUT_PHOTO_URL=/placeholder.svg
ABOUT_STORY=Soy [Tu Nombre], consultor y coach...
CONTACT_EMAIL=hola@tumarca.com
```

### Archivo Principal: `lib/config.ts`
```typescript
export const site = {
  title: "Tu Marca Personal",
  tagline: "Acompañamiento 1:1 y formación práctica...",
  calendlyUrl: "https://calendly.com/tu-usuario/sesion",
  
  // Configuración de sesiones
  sessions: [
    {
      id: "sesion-claridad",
      name: "Sesión de Claridad",
      price: "€99",
      hotmartUrl: "https://pay.hotmart.com/TU_CHECKOUT_1",
      // ...
    }
  ],
  
  // Configuración del curso
  course: {
    title: "Curso Online: Sistema de Productividad...",
    price: "€179",
    hotmartUrl: "https://pay.hotmart.com/TU_CHECKOUT_CURSO",
    videoUrl: "", // YouTube/Vimeo embed
  },
  
  // Información personal
  about: {
    photoUrl: "/placeholder.svg",
    videoUrl: "", // Video de presentación
    story: "Soy [Tu Nombre], consultor y coach...",
    whyMe: "He acompañado a +300 clientes...",
  },
  
  // Testimonios
  testimonials: [
    {
      quote: "En dos sesiones definimos un plan claro...",
      author: "María G.",
      role: "Marketing Specialist",
    }
  ],
  
  // Contacto y legal
  contact: { email: "hola@tumarca.com" },
  legal: { terms: "", privacy: "" },
}
```

## 🎨 Sistema de Diseño

### Colores Principales
- **Primario**: Emerald (verde) - `bg-emerald-600`
- **Secundario**: Grises de Tailwind
- **Acentos**: Variaciones de emerald

### Tipografía
- **Sans**: Geist Sans (variable CSS)
- **Mono**: Geist Mono (variable CSS)
- **Tamaños**: Responsive con Tailwind

### Componentes UI
- **Botones**: Variantes default/outline con emerald
- **Cards**: Bordes redondeados, sombras sutiles
- **Layout**: Container responsive, grid system

## 🚀 Comandos de Desarrollo

```bash
# Instalar dependencias
pnpm install

# Desarrollo local
pnpm dev

# Build de producción
pnpm build

# Lint (deshabilitado en build)
pnpm lint

# Iniciar servidor de producción
pnpm start
```

## 📝 Personalización Requerida

### 🚀 **Método Recomendado: Panel de Administración**

1. **Acceder al panel**: Ir a `/admin`
2. **Iniciar sesión**: Usuario `admin`, Contraseña `admin123`
3. **Configurar todo** desde la interfaz gráfica
4. **Guardar cambios** automáticamente

### 🔄 **Flujo de Trabajo del Sistema JSON**

```
Cliente edita en /admin → API /api/config → Guarda en public/config.json → Página principal carga desde JSON
```

**Ventajas**:
- ✅ **Sin reinicio de servidor** necesario
- ✅ **Cambios en tiempo real** en la landing
- ✅ **Backup automático** en Git
- ✅ **Sin base de datos** requerida
- ✅ **Fácil mantenimiento** y portabilidad

### 🔧 **Método Avanzado: Variables de Entorno**

#### 1. URLs de Integración
- **Calendly**: `NEXT_PUBLIC_CALENDLY_URL` en `.env.local`
- **Hotmart**: `COURSE_HOTMART_URL` y `SESSIONS_CONFIG` en `.env.local`

#### 2. Contenido
- **Título y tagline**: `NEXT_PUBLIC_SITE_TITLE` y `NEXT_PUBLIC_SITE_TAGLINE`
- **Historia personal**: `ABOUT_STORY` y `ABOUT_WHY_ME`
- **Testimonios**: Por ahora estáticos (se pueden hacer dinámicos después)
- **Precios**: `COURSE_PRICE` y en `SESSIONS_CONFIG`

#### 3. Imágenes y Media
- **Foto personal**: `ABOUT_PHOTO_URL`
- **Video curso**: `COURSE_VIDEO_URL`
- **Video presentación**: `ABOUT_VIDEO_URL`
- **Logo**: Crear y agregar favicon

#### 4. Legal y Contacto
- **Email**: `CONTACT_EMAIL`
- **Términos**: `LEGAL_TERMS_URL`
- **Privacidad**: `LEGAL_PRIVACY_URL`

### 🔐 **Seguridad**

**Cambiar credenciales por defecto**:
```bash
ADMIN_USERNAME=tu-usuario
ADMIN_PASSWORD=tu-contraseña-segura
```

### 🚀 **Roadmap de Funcionalidades**

#### **Fase 1 - Configuración Básica** ✅
- Panel de administración con autenticación
- Configuración de Calendly y Hotmart
- Información personal y del curso
- Enlaces legales

#### **Fase 2 - Contenido Dinámico** 🔄
- Gestión de testimonios desde el panel
- Sistema de FAQ configurables
- Casos de éxito editables
- Blog/artículos integrados

#### **Fase 3 - Personalización Avanzada** 📋
- Selector de temas de colores
- Subida de imágenes y logos
- Configuración de SEO
- Analytics y tracking

#### **Fase 4 - Integraciones Extendidas** 📋
- Múltiples tipos de sesiones
- Integración con más plataformas de pago
- Sistema de cupones y descuentos
- Email marketing integrado

#### **Fase 5 - Funcionalidades Premium** 📋
- Dashboard de analytics
- Sistema de leads y CRM
- A/B testing de contenido
- Backup automático de configuración

## 🔧 Configuración Técnica

### Next.js Config (`next.config.mjs`)
```javascript
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
}
```

### Tailwind CSS
- **Versión**: v4.1.9
- **Config**: PostCSS integrado
- **Animaciones**: `tailwindcss-animate`

### TypeScript
- **Config**: `tsconfig.json` estándar
- **Errores**: Ignorados en build para desarrollo rápido

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Adaptaciones
- **Header**: Navegación colapsa en móvil
- **Grid**: 1 columna → 3 columnas
- **Botones**: Stack vertical en móvil
- **Imágenes**: Aspect ratio mantenido

## 🔍 SEO y Performance



### Optimizaciones
- **Images**: Next.js Image component
- **Fonts**: Geist optimizado
- **Loading**: Lazy loading en iframes
- **Bundle**: Tree shaking automático

## 🚨 Consideraciones de Seguridad

### Iframes
- **Calendly**: `rel="noopener noreferrer"`
- **Hotmart**: Enlaces externos seguros
- **Videos**: YouTube/Vimeo embeds seguros

### Formularios
- **Validación**: React Hook Form + Zod
- **Sanitización**: Inputs controlados

## 📊 Analytics y Tracking

### Implementación Sugerida
```typescript
// Google Analytics
// Hotjar
// Facebook Pixel
// Calendly tracking
```

## 🚀 Deployment

### Sistema de Configuración con Firebase

El proyecto usa **Firestore** para almacenamiento persistente en desarrollo y producción:

#### **🛠️ Desarrollo (Local)**
- Usa Firestore para almacenar la configuración
- El panel `/admin` guarda cambios directamente en la base de datos
- Requiere configuración de Firebase (variables de entorno)

#### **🌐 Producción (Vercel/Netlify)**
- Usa el mismo Firestore que en desarrollo
- El panel `/admin` funciona igual que en local
- **No más errores 500** - Sistema de archivos no requerido

### Variables de Entorno para Producción

```bash
# Firebase Configuration (REQUERIDO)
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Credenciales del panel de administración
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### Pasos para el Despliegue en Vercel

1. **Configura Firebase** siguiendo las instrucciones en `FIREBASE_SETUP.md`
2. **Conecta tu repositorio** a Vercel
3. **Configura las variables de entorno** de Firebase en Vercel
4. **Despliega** - Vercel detectará automáticamente que es un proyecto Next.js
5. **Migra la configuración** usando el panel `/admin` o el script de migración

### 🔄 Flujo de Actualización en Producción

1. **Edita** en `/admin` de tu sitio en producción
2. **Guarda** - los cambios se guardan automáticamente en Firestore
3. **¡Listo!** - Los cambios se reflejan inmediatamente

> **Nota**: Con Firebase, los cambios se guardan automáticamente y no requieren re-despliegue.

### Plataformas Recomendadas
- **Vercel**: Integración nativa con Next.js ✅
- **Netlify**: Build automático
- **Railway**: Full-stack hosting

## 🔄 Mantenimiento

## 🎯 Reglas de Desarrollo

### **Regla Fundamental**: Si no es editable, no está terminado

Al implementar nuevas funcionalidades, **SIEMPRE** seguir estas reglas:

1. **Usar el contexto admin directamente**
   ```tsx
   const { config, updateConfig } = useAdmin()
   ```

2. **Hacer todo editable por defecto**
   - Textos → `EditableText`
   - Imágenes → `EditableImage` 
   - URLs → `EditableUrl`

3. **Actualizar la interfaz Config**
   - Agregar nuevos campos en `lib/config-loader.ts`
   - Usar tipos TypeScript apropiados

4. **Probar la reactividad**
   - Verificar que los cambios se reflejan inmediatamente
   - No debe requerir refrescar la página

**Documentación completa**: `REACTIVE_EDITING_README.md`

### Actualizaciones Regulares
- **Dependencias**: `pnpm update`
- **Next.js**: Seguir releases
- **shadcn/ui**: Actualizar componentes

### Monitoreo
- **Performance**: Core Web Vitals
- **Conversiones**: Calendly + Hotmart analytics
- **Errores**: Sentry o similar

## 📚 Recursos Adicionales

### Documentación
- [Next.js App Router](https://nextjs.org/docs/app)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Calendly API](https://developer.calendly.com/)

### Herramientas Útiles
- **Figma**: Diseño de componentes
- **Hotmart**: Dashboard de ventas
- **Calendly**: Dashboard de agendamiento
- **Google Analytics**: Tracking de conversiones

---

**Nota**: Este README está diseñado para ser una referencia completa del proyecto. Actualizar según evolucione el desarrollo.