# Sistema de Diseños - Documentación

## 🎨 Descripción

El sistema de diseños permite seleccionar estilos visuales específicos para cada tipo de plantilla (landing, shop, etc.) desde el panel de administración. Cada diseño incluye:

- **Paleta de colores personalizada**
- **Tipografías específicas**
- **Iconografía temática**
- **Variables CSS dinámicas**

## 📁 Estructura del Sistema

### Archivos Principales

```
lib/
├── designs.ts              # Configuración centralizada de diseños
├── config-loader.ts        # Carga y guarda configuraciones
└── config.ts              # Configuración base

components/
├── design-selector.tsx     # Selector de diseños en el admin
└── design-applier.tsx      # Aplicador automático de diseños

hooks/
└── use-design.ts          # Hook para aplicar diseños

scripts/
└── test-design-system.js  # Script de prueba
```

## 🎯 Diseños Disponibles

### Landing Page
- **Estudio Contable**: Azules profesionales, tipografía serif
- **Estudio de Abogados**: Oscuros elegantes, tipografía formal
- **Ingenieros**: Verdes y azules, tipografía técnica
- **Blog Personal**: Colores vibrantes, tipografía moderna
- **Coach Personal**: Colores cálidos, tipografía amigable

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
- Los diseños se aplican automáticamente

### 4. Guardar Configuración
- Haz clic en "Guardar Configuración"
- Los cambios se aplican inmediatamente

## 🔧 Configuración Técnica

### Estructura de un Diseño

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
}
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

### 1. Editar `lib/designs.ts`

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
node scripts/test-design-system.js
```

## 🧪 Pruebas

### Script de Prueba Automática
```bash
node scripts/test-design-system.js
```

### Prueba Manual
1. Ve a `/admin`
2. Inicia sesión: `admin` / `admin123`
3. Selecciona plantillas y diseños
4. Verifica que los cambios se apliquen

## 🔄 Flujo de Datos

1. **Selección**: Usuario selecciona diseño en `/admin`
2. **Guardado**: Configuración se guarda en Firestore
3. **Carga**: `DesignApplier` carga la configuración
4. **Aplicación**: `useDesign` hook aplica el diseño
5. **Renderizado**: Variables CSS se aplican al documento

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

## 🐛 Solución de Problemas

### Diseño No Se Aplica
1. Verificar que el diseño esté en `selectedDesigns`
2. Revisar la consola del navegador
3. Verificar que `DesignApplier` esté en el layout

### Error de Carga
1. Verificar conexión a Firestore
2. Revisar configuración de Firebase
3. Verificar estructura de datos

### Variables CSS No Funcionan
1. Verificar que las variables estén definidas
2. Revisar que `applyDesignToDocument` se ejecute
3. Verificar que el CSS use las variables

## 📈 Próximas Mejoras

- [ ] Previsualización en tiempo real
- [ ] Más opciones de tipografía
- [ ] Diseños para más plantillas
- [ ] Editor visual de colores
- [ ] Exportar/importar configuraciones
- [ ] Temas oscuros personalizados
