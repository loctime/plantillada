# 🚀 Plantillada - Sistema Multi-Plantilla

Una plataforma completa para crear y gestionar diferentes tipos de sitios web desde un solo panel de administración.

## ✨ Características Principales

### 🎯 Sistema Multi-Plantilla
- **Landing Page**: Página de aterrizaje profesional con formularios y conversión
- **Tienda Online**: E-commerce completo con sistema de clonación de productos
- **Centro de Psicología**: Sitio web especializado para psicólogos y terapeutas
- **Sitio Multi-Página**: Combinación de múltiples secciones en un solo sitio
- **Foro Comunitario**: Plataforma de discusión (próximamente)

### 🛒 Sistema de Clonación Avanzado
- **Extracción Automática**: Clona productos desde cualquier sitio web
- **Procesamiento de Imágenes**: Optimización automática con Cloudinary
- **Rate Limiting Inteligente**: Respeto a los límites de velocidad
- **Estadísticas en Tiempo Real**: Métricas detalladas de clonación

### 🎨 Gestión Unificada
- **Panel de Administración Centralizado**: Controla todo desde `/admin`
- **Selector de Plantillas**: Cambia entre diferentes tipos de sitios
- **Configuración Dinámica**: Cada plantilla tiene su propia configuración
- **Navegación Unificada**: Gestiona menús y estructura del sitio

## 🏗️ Arquitectura del Sistema

### Estructura de Plantillas
```
/admin
├── TemplateSelector     # Selector de plantillas
├── Landing Config       # Configuración de landing page
├── Shop Config         # Configuración de tienda
└── Multi-Page Config   # Configuración multi-página

/pages
├── /                   # Landing page
├── /shop              # Tienda online
├── /psicologos        # Centro de psicología
├── /multi             # Sitio multi-página
└── /admin             # Panel de administración
```

### APIs Implementadas
```
/api
├── /config            # Configuración general
├── /clone-product     # Clonación de productos
├── /cloning-stats     # Estadísticas de clonación
└── /super-admin       # Administración avanzada
```

## 🚀 Funcionalidades por Plantilla

### 1. Landing Page
- **Formularios de Contacto**: Integración con Calendly
- **Secciones Editables**: Contenido dinámico
- **Testimonios**: Gestión de testimonios de clientes
- **SEO Optimizado**: Meta tags y estructura semántica

### 2. Tienda Online
- **Catálogo de Productos**: Gestión completa de inventario
- **Sistema de Clonación**: Extracción automática desde sitios externos
- **Carrito de Compras**: Gestión de compras
- **Estadísticas Avanzadas**: Métricas de rendimiento
- **Procesamiento de Imágenes**: Optimización automática

### 3. Sitio Multi-Página
- **Gestión de Páginas**: Crear, editar y organizar páginas
- **Navegación Unificada**: Configuración de menús
- **Configuración Global**: SEO, analytics y más
- **Ordenamiento**: Control del orden de las páginas

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js 15**: Framework principal
- **React 19**: Interfaz de usuario
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos y diseño
- **Shadcn/ui**: Componentes de UI

### Backend
- **Firebase Firestore**: Base de datos NoSQL
- **Firebase Auth**: Autenticación
- **Cloudinary**: Procesamiento de imágenes
- **Next.js API Routes**: APIs del servidor

### Estado y Datos
- **Zustand**: Estado global
- **SWR**: Caché y sincronización
- **React Hook Form**: Formularios
- **Zod**: Validación de datos

## 📦 Instalación y Configuración

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
cd plantillada

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
```

### Variables de Entorno
```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id

# Cloudinary (opcional)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
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

### 2. Seleccionar Plantilla
1. Hacer clic en "Cambiar Plantilla"
2. Elegir entre las opciones disponibles:
   - **Landing Page**: Para páginas de aterrizaje
   - **Tienda Online**: Para e-commerce
   - **Sitio Multi-Página**: Para sitios complejos
   - **Foro Comunitario**: Para comunidades (próximamente)

### 3. Configurar la Plantilla
Cada plantilla tiene su propia configuración:
- **General**: Título, descripción, contacto
- **Integraciones**: Calendly, Hotmart, etc.
- **Contenido**: Sesiones, cursos, testimonios
- **Legal**: Términos y privacidad

### 4. Clonar Productos (Tienda)
1. Ir a la pestaña "Clonación"
2. Ingresar URL del producto a clonar
3. El sistema extraerá automáticamente:
   - Nombre y descripción
   - Precio y categoría
   - Imágenes del producto
   - Metadatos

## 📊 Sistema de Clonación

### Características Técnicas
- **Rate Limiting**: Máximo 60 requests por minuto
- **User-Agent Rotación**: Simula navegadores reales
- **Respeto a robots.txt**: Verificación automática
- **Manejo de Errores**: Reintentos inteligentes
- **Procesamiento de Imágenes**: Optimización automática

### APIs Disponibles
```typescript
// Clonar producto individual
POST /api/clone-product
{
  "url": "https://ejemplo.com/producto/123"
}

// Obtener estadísticas
GET /api/cloning-stats

// Registrar actividad
POST /api/cloning-stats
{
  "action": "product_cloned",
  "details": "Producto clonado exitosamente"
}
```

### Estadísticas en Tiempo Real
- **Total de productos**: Número total de productos
- **Clonaciones exitosas**: Productos clonados correctamente
- **Tasa de fallos**: Errores en el proceso
- **Tiempo promedio**: Velocidad de clonación
- **Almacenamiento**: Uso de espacio en disco
- **Actividad reciente**: Log de acciones

## 🎨 Componentes Principales

### TemplateSelector
Selector visual de plantillas con características y estado.

### CloningStats
Dashboard de estadísticas de clonación con métricas en tiempo real.

### AdminPage
Panel principal de administración con configuración dinámica.

### ShopPage
Gestión de tienda con sistema de clonación integrado.

### MultiPage
Gestión de sitios multi-página con navegación unificada.

## 🔧 Configuración Avanzada

### Personalización de Plantillas
```typescript
// Agregar nueva plantilla
const newTemplate = {
  id: 'custom',
  name: 'Plantilla Personalizada',
  description: 'Descripción de la plantilla',
  icon: <CustomIcon />,
  features: ['Característica 1', 'Característica 2'],
  status: 'active',
  route: '/custom',
  color: 'bg-purple-500'
}
```

### Configuración de Clonación
```typescript
// Configurar rate limiting
const rateLimitConfig = {
  requestsPerMinute: 60,
  burstSize: 10,
  windowMs: 60 * 1000
}

// Configurar procesamiento de imágenes
const imageConfig = {
  format: 'webp',
  quality: 'auto',
  transformations: {
    width: 800,
    height: 600,
    crop: 'fill'
  }
}
```

## 📈 Métricas y Analytics

### Dashboard de Estadísticas
- **Productos por categoría**: Distribución de productos
- **Tiempo de procesamiento**: Velocidad de clonación
- **Tasa de éxito**: Porcentaje de clonaciones exitosas
- **Uso de almacenamiento**: Espacio ocupado por imágenes
- **Actividad reciente**: Log de acciones del sistema

### Exportación de Datos
```typescript
// Exportar estadísticas
const exportStats = async () => {
  const response = await fetch('/api/cloning-stats')
  const data = await response.json()
  
  // Generar CSV o JSON
  const csv = generateCSV(data.stats)
  downloadFile(csv, 'estadisticas-clonacion.csv')
}
```

## 🔒 Seguridad y Compliance

### Medidas Implementadas
- **Rate Limiting**: Protección contra abuso
- **Validación de URLs**: Verificación de enlaces
- **User-Agent Realista**: Simulación de navegadores
- **Respeto a robots.txt**: Cumplimiento de directrices
- **Manejo de Errores**: Logging y monitoreo

### Disclaimer Legal
```
Este sistema es para uso educativo y de desarrollo.
El usuario es responsable de:
- Obtener autorización previa de los sitios web origen
- Respetar derechos de autor y marcas registradas
- Cumplir con las leyes locales de comercio electrónico
- No infringir términos de servicio de terceros
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

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/NuevaFuncionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/NuevaFuncionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🧠 Diseño de Psicólogos

### Características Especializadas
El diseño de psicólogos está optimizado para profesionales de la salud mental con:

- **🎨 Colores terapéuticos**: Púrpuras y azules que transmiten confianza y serenidad
- **🧠 Iconografía especializada**: Iconos relacionados con la mente y el bienestar
- **🛡️ Enfoque en confidencialidad**: Diseño que prioriza la privacidad del paciente
- **📋 Servicios especializados**: Terapia individual, de pareja, familiar y evaluaciones
- **⭐ Testimonios de pacientes**: Sección dedicada a experiencias reales
- **📅 Integración Calendly**: Agendamiento profesional de sesiones
- **💳 Enlaces Hotmart**: Para pagos seguros de servicios

### Aplicación Rápida
```bash
# Aplicar diseño de psicólogos
node scripts/apply-psicologos-design.js

# Para un tenant específico
node scripts/apply-psicologos-design.js psicologo-madrid
```

### Configuración Automática
El diseño incluye:
- **4 servicios terapéuticos** preconfigurados
- **Taller online** de gestión del estrés
- **Testimonios** realistas de pacientes
- **Información del centro** profesional
- **Tema visual** optimizado para psicólogos

### Personalización
Desde el panel de administración (`/admin`):
1. Seleccionar plantilla "Centro de Psicología"
2. Elegir diseño "Psicólogos"
3. Personalizar contenido y servicios
4. Configurar Calendly y Hotmart
5. Ajustar colores y tipografía

## 🆘 Soporte

### Documentación Adicional
- [Configuración de Firebase](FIREBASE_SETUP.md)
- [Solución de Problemas](TROUBLESHOOTING.md)
- [Guía de Administración](ADMIN_MODE_README.md)

### Contacto
- **Issues**: [GitHub Issues](https://github.com/loctime/plantillada/issues)
- **Documentación**: [README.md](readme.md)
- **Soporte**: Crear issue en GitHub

---

**Plantillada** - Sistema Multi-Plantilla para sitios web profesionales 🚀
