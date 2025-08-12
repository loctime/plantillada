# Sistema de Diseños - Documentación

## 🎨 Descripción

El sistema de diseños permite seleccionar estilos visuales específicos para cada tipo de plantilla (landing, shop, etc.) desde el panel de administración. Cada diseño incluye:

- **Paleta de colores personalizada**
- **Tipografías específicas**
- **Iconografía temática**
- **Variables CSS dinámicas**
- **JSON predefinido completo** (NUEVO)
- **Sistema de backup automático** (NUEVO)

## 📁 Estructura del Sistema

### Archivos Principales

```
lib/
├── designs.tsx              # Configuración centralizada de diseños + JSONs predefinidos
├── config-loader.ts         # Carga y guarda configuraciones
└── config.ts               # Configuración base

components/
├── design-selector.tsx      # Selector de diseños en el admin (mejorado)
├── design-applier.tsx       # Aplicador automático de diseños
└── backup-manager.tsx       # Gestión de backups (NUEVO)

hooks/
└── use-design.ts           # Hook para aplicar diseños

scripts/
├── test-design-system.js   # Script de prueba original
└── test-design-system-enhanced.js  # Script de prueba mejorado (NUEVO)
```

## 🎯 Diseños Disponibles

### Landing Page
- **Estudio Contable**: Azules profesionales, tipografía serif + contenido contable
- **Estudio de Abogados**: Oscuros elegantes, tipografía formal + contenido legal
- **Ingenieros**: Verdes y azules, tipografía técnica + contenido técnico
- **Blog Personal**: Colores vibrantes, tipografía moderna + contenido personal
- **Coach Personal**: Colores cálidos, tipografía amigable + contenido coaching

### Tienda Online
- **Tech Shop**: Azules tecnológicos, tipografía futurista
- **Moda Shop**: Rosas y dorados, tipografía elegante
- **Gym Shop**: Rojos energéticos, tipografía deportiva
- **Lifestyle Shop**: Verdes naturales, tipografía minimalista

## 🚀 Cómo Usar

### 1. Acceder al Panel de Administración
```
/admin
```

### 2. Seleccionar Plantillas
- Ve a la pestaña "General"
- Haz clic en "Cambiar Plantilla"
- Selecciona las plantillas deseadas (landing, shop, etc.)

### 3. Seleccionar Diseños
- Haz clic en "Seleccionar Diseño"
- Para cada plantilla seleccionada, elige un diseño
- **NUEVO**: Selecciona qué aplicar:
  - ✅ Aplicar colores y tipografías
  - ✅ Aplicar contenido predefinido (si está disponible)

### 4. Aplicar Diseño
- **NUEVO**: El sistema crea automáticamente un backup
- **NUEVO**: Puedes elegir aplicar solo colores o contenido completo
- Los cambios se aplican inmediatamente

### 5. Gestionar Backups (NUEVO)
- Ve a la pestaña "Backups"
- Visualiza todos los backups automáticos
- Restaura configuraciones anteriores
- Elimina backups antiguos

## 🔧 Configuración Técnica

### Estructura de un Diseño Mejorado

```typescript
interface Design {
  id: string                    // Identificador único
  name: string                  // Nombre del diseño
  description: string           // Descripción
  icon: React.ReactNode         // Icono representativo
  category: string              // Tipo de plantilla (landing/shop)
  colorScheme: {
    primary: string             // Color primario
    secondary: string           // Color secundario
    accent: string              // Color de acento
  }
  features: string[]            // Características del diseño
  status: 'active' | 'coming-soon' | 'beta'
  cssVariables?: {              // Variables CSS personalizadas
    [key: string]: string
  }
  // NUEVO: JSON predefinido completo
  predefinedConfig?: Partial<Config> {
    site: {
      title: string
      tagline: string
      heroTitle?: string
      heroSubtitle?: string
      // ... más campos
    }
    sessions: Session[]
    course: Course
    about: About
    testimonials: Testimonial[]
    contact: Contact
    integrations: Integrations
  }
}
```

### Sistema de Backup

```typescript
// Estructura de un backup
interface Backup {
  id: string                    // ID único del backup
  timestamp: string             // Fecha de creación
  tenantId: string              // Tenant asociado
  config: Config                // Configuración completa
  description: string           // Descripción del backup
}

// Funciones disponibles
createBackup(tenantId: string): Promise<string>
getBackups(tenantId: string): Promise<Backup[]>
restoreFromBackup(backupId: string, tenantId: string): Promise<boolean>
deleteBackup(backupId: string): Promise<boolean>
```

### Variables CSS Aplicadas

Cada diseño aplica automáticamente:

```css
:root {
  --color-primary: #1e40af;     /* Color primario */
  --color-secondary: #64748b;   /* Color secundario */
  --color-accent: #f59e0b;      /* Color de acento */
  --font-family: Georgia, serif; /* Tipografía */
}
```

## 📝 Agregar Nuevos Diseños

### 1. Editar `lib/designs.tsx`

```typescript
export const landingDesigns: Design[] = [
  // ... diseños existentes
  {
    id: 'nuevo-diseno',
    name: 'Nuevo Diseño',
    description: 'Descripción del nuevo diseño',
    icon: <NuevoIcon className="h-6 w-6" />,
    category: 'landing',
    colorScheme: {
      primary: '#tu-color',
      secondary: '#tu-color',
      accent: '#tu-color'
    },
    features: [
      'Característica 1',
      'Característica 2'
    ],
    status: 'active',
    cssVariables: {
      '--primary': '#tu-color',
      '--font-family': 'Tu Fuente, sans-serif'
    },
    // NUEVO: JSON predefinido completo
    predefinedConfig: {
      site: {
        title: "Título específico del sector",
        tagline: "Descripción adaptada al sector",
        heroTitle: "Título hero específico",
        heroSubtitle: "Subtítulo hero específico",
        sessionsTitle: "Nuestros Servicios",
        sessionsSubtitle: "Servicios específicos del sector",
        aboutTitle: "Sobre Nosotros",
        testimonialsTitle: "Lo que dicen nuestros clientes",
        testimonialsSubtitle: "Testimonios del sector",
        ctaTitle: "¿Necesitas nuestros servicios?",
        ctaSubtitle: "Contacta con nosotros"
      },
      sessions: [
        {
          id: "servicio-especifico",
          name: "Servicio Específico",
          summary: "Descripción del servicio específico del sector",
          duration: "60 min",
          price: "€150",
          features: [
            "Característica específica 1",
            "Característica específica 2",
            "Característica específica 3"
          ],
          hotmartUrl: "https://pay.hotmart.com/SERVICIO_ESPECIFICO"
        }
      ],
      course: {
        title: "Curso: Especialización del Sector",
        blurb: "Descripción del curso específico del sector",
        price: "€299",
        hotmartUrl: "https://pay.hotmart.com/CURSO_ESPECIFICO",
        videoUrl: "",
        bullets: [
          "Beneficio específico 1",
          "Beneficio específico 2",
          "Beneficio específico 3"
        ]
      },
      about: {
        photoUrl: "/placeholder.svg?height=520&width=420",
        videoUrl: "",
        story: "Historia específica del sector con experiencia relevante",
        whyMe: "Experiencia específica en el sector con resultados comprobados"
      },
      testimonials: [
        {
          quote: "Testimonio específico del sector",
          author: "Cliente del Sector",
          role: "Profesión del Sector"
        }
      ],
      contact: {
        email: "info@sector.com"
      }
    }
  }
]
```

### 2. Agregar Icono (si es necesario)
```typescript
import { NuevoIcon } from "lucide-react"
```

### 3. Probar el Diseño
```bash
# Prueba original
node scripts/test-design-system.js

# Prueba mejorada (NUEVO)
node scripts/test-design-system-enhanced.js
```

## 🧪 Pruebas

### Script de Prueba Mejorado (NUEVO)
```bash
node scripts/test-design-system-enhanced.js
```

Este script prueba:
1. ✅ Creación de configuración inicial
2. ✅ Creación de backup automático
3. ✅ Listado de backups
4. ✅ Modificación de configuración
5. ✅ Restauración desde backup
6. ✅ Verificación de restauración
7. ✅ Eliminación de backup
8. ✅ Verificación de eliminación

### Prueba Manual
1. Ve a `/admin`
2. Inicia sesión: `admin` / `admin123`
3. Selecciona plantillas y diseños
4. **NUEVO**: Prueba las opciones de aplicación
5. **NUEVO**: Ve a la pestaña "Backups"
6. Verifica que los cambios se apliquen

## 🔄 Flujo de Datos Mejorado

1. **Selección**: Usuario selecciona diseño en `/admin`
2. **Backup**: Sistema crea backup automático (NUEVO)
3. **Aplicación**: `applyDesignToConfig` aplica el diseño
4. **Opciones**: Usuario elige aplicar colores y/o contenido (NUEVO)
5. **Guardado**: Configuración se guarda en Firestore
6. **Carga**: `DesignApplier` carga la configuración
7. **Aplicación**: `useDesign` hook aplica el diseño
8. **Renderizado**: Variables CSS se aplican al documento

## 🎨 Personalización Avanzada

### Agregar Nuevas Variables CSS
```typescript
cssVariables: {
  '--primary': '#color',
  '--secondary': '#color',
  '--accent': '#color',
  '--font-family': 'font-family',
  '--border-radius': '8px',        // Nueva variable
  '--shadow': '0 4px 6px rgba(0,0,0,0.1)'  // Nueva variable
}
```

### Agregar Nuevas Categorías
1. Crear array de diseños: `nuevaCategoriaDesigns`
2. Actualizar `getDesignsForTemplate()`
3. Agregar caso en el switch

### Personalizar JSONs Predefinidos
Cada diseño puede tener contenido específico del sector:
- **Títulos y descripciones** adaptados al nicho
- **Servicios específicos** del sector
- **Testimonios relevantes** del sector
- **Información de contacto** profesional
- **Cursos y productos** del sector

## 🐛 Solución de Problemas

### Diseño No Se Aplica
1. Verificar que el diseño esté en `selectedDesigns`
2. Revisar la consola del navegador
3. Verificar que `DesignApplier` esté en el layout
4. **NUEVO**: Verificar que las opciones de aplicación estén seleccionadas

### Error de Carga
1. Verificar conexión a Firestore
2. Revisar configuración de Firebase
3. Verificar estructura de datos

### Variables CSS No Funcionan
1. Verificar que las variables estén definidas
2. Revisar que `applyDesignToDocument` se ejecute
3. Verificar que el CSS use las variables

### Problemas con Backups (NUEVO)
1. **Backup no se crea**: Verificar permisos de Firestore
2. **No se puede restaurar**: Verificar que el backup existe
3. **Error al eliminar**: Verificar permisos de eliminación

## 📈 Próximas Mejoras

- [x] JSONs predefinidos por diseño
- [x] Sistema de backup automático
- [x] Gestión de backups desde admin
- [x] Opciones de aplicación (colores vs contenido)
- [ ] Previsualización en tiempo real
- [ ] Más opciones de tipografía
- [ ] Diseños para más plantillas
- [ ] Editor visual de colores
- [ ] Exportar/importar configuraciones
- [ ] Temas oscuros personalizados
- [ ] Historial de cambios detallado
- [ ] Comparación entre versiones
- [ ] Backup programado automático
