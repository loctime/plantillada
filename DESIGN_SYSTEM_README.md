# 🎨 Sistema de Diseños de Tienda - Plantillada

## 📋 Índice
- [Descripción General](#descripción-general)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Diseños Disponibles](#diseños-disponibles)
- [Cómo Usar el Sistema](#cómo-usar-el-sistema)
- [Personalización Avanzada](#personalización-avanzada)
- [Extensión del Sistema](#extensión-del-sistema)
- [Troubleshooting](#troubleshooting)

## 🎯 Descripción General

El Sistema de Diseños de Tienda es una solución completa que permite cambiar dinámicamente la apariencia y funcionalidad de la página de tienda sin necesidad de modificar código. Cada diseño incluye:

- **Layouts específicos**: Sidebar izquierda/derecha, sin sidebar, minimal, mobile-first
- **Estilos de productos**: Tarjetas cuadradas, listas horizontales, tarjetas redondeadas, grid compacto
- **Paletas de colores**: Especializadas por sector comercial
- **Configuraciones predefinidas**: Productos y categorías específicas del nicho
- **Responsive design**: Adaptación automática a diferentes dispositivos

## 🏗️ Arquitectura del Sistema

### Estructura de Archivos
```
app/shop/
├── page.tsx                 # Página principal con lógica de diseños
├── layout-styles.css        # Estilos CSS dinámicos
└── components/
    └── shop-design-selector.tsx  # Selector visual de diseños

lib/
└── designs.tsx              # Definición de diseños disponibles

public/
├── tech-shop-design.json    # Configuración del diseño Tech
├── moda-shop-design.json    # Configuración del diseño Moda
├── gym-shop-design.json     # Configuración del diseño Gym
├── lifestyle-shop-design.json # Configuración del diseño Lifestyle
└── food-shop-design.json    # Configuración del diseño Food
```

### Flujo de Datos
1. **Selección de Diseño**: Usuario selecciona un diseño desde el selector
2. **Carga de Configuración**: Se carga el JSON correspondiente del diseño
3. **Aplicación de Variables CSS**: Se aplican colores y propiedades de layout
4. **Actualización de Estado**: Se actualiza el estado de la aplicación
5. **Renderizado Dinámico**: Los componentes se renderizan con las nuevas propiedades

### Sistema de Atributos Data-*
El sistema utiliza atributos HTML `data-*` para aplicar estilos CSS dinámicamente:

```html
<div 
  data-layout="sidebar-left"
  data-product-style="cards-square"
  data-header-style="dark"
  data-sidebar-style="white-shadow"
  data-background-color="white"
>
```

## 🎨 Diseños Disponibles

### 1. 🖥️ Tech Shop
**Archivo**: `public/tech-shop-design.json`

**Características**:
- **Layout**: Sidebar izquierda
- **Productos**: Tarjetas cuadradas con sombras
- **Colores**: Azules tecnológicos (#1e40af, #3b82f6)
- **Header**: Fondo oscuro con gradiente
- **Sidebar**: Sombra blanca con efecto glass-morphism

**Ideal para**: Tiendas de tecnología, gadgets, software

### 2. 👗 Moda Shop
**Archivo**: `public/moda-shop-design.json`

**Características**:
- **Layout**: Sidebar derecha
- **Productos**: Lista horizontal elegante
- **Colores**: Rosas y dorados (#ec4899, #fbbf24)
- **Header**: Gradiente rosa con efectos sutiles
- **Sidebar**: Efecto glass-morphism con transparencia

**Ideal para**: Ropa, accesorios, moda femenina

### 3. 💪 Gym Shop
**Archivo**: `public/gym-shop-design.json`

**Características**:
- **Layout**: Sin sidebar (full-width)
- **Productos**: Tarjetas redondeadas energéticas
- **Colores**: Rojos y naranjas (#dc2626, #ea580c)
- **Header**: Gradiente rojo intenso
- **Sidebar**: Sin sidebar para máximo espacio

**Ideal para**: Suplementos, equipamiento deportivo, ropa de gym

### 4. 🌿 Lifestyle Shop
**Archivo**: `public/lifestyle-shop-design.json`

**Características**:
- **Layout**: Minimal con sidebar flotante
- **Productos**: Grid compacto y organizado
- **Colores**: Verdes naturales (#059669, #10b981)
- **Header**: Minimal con fondo verde claro
- **Sidebar**: Flotante con efecto de elevación

**Ideal para**: Productos orgánicos, bienestar, decoración

### 5. 🍕 Food Shop
**Archivo**: `public/food-shop-design.json`

**Características**:
- **Layout**: Mobile-first con navegación táctil
- **Productos**: Tarjetas especializadas para comida
- **Colores**: Amarillo y negro (#fbbf24, #1f2937)
- **Header**: Estilo "PedidoRapido" con fondo amarillo
- **Sidebar**: Adaptada para móviles con navegación táctil

**Ideal para**: Restaurantes, delivery, comida rápida

## 🚀 Cómo Usar el Sistema

### 1. Acceder al Selector de Diseños
```tsx
// En la barra de navegación de la tienda
<ShopDesignSelector 
  selectedDesign={selectedDesign}
  onDesignSelect={handleDesignSelect}
/>
```

### 2. Seleccionar un Diseño
1. Hacer clic en el selector de diseños
2. Elegir el diseño deseado de la lista
3. El sistema aplicará automáticamente:
   - Colores y tipografías
   - Layout y posicionamiento
   - Productos de ejemplo
   - Configuraciones específicas

### 3. Personalizar el Diseño
```tsx
// Modificar colores en tiempo real
const handleColorChange = (color: string) => {
  document.documentElement.style.setProperty('--primary-color', color);
};

// Cambiar layout dinámicamente
const handleLayoutChange = (layout: string) => {
  setLayoutConfig(prev => ({ ...prev, layout }));
};
```

## 🎛️ Personalización Avanzada

### Variables CSS Dinámicas
Cada diseño define variables CSS que se aplican automáticamente:

```css
:root {
  --primary-color: #1e40af;
  --secondary-color: #3b82f6;
  --background-color: #ffffff;
  --text-color: #1f2937;
  --accent-color: #fbbf24;
}
```

### Configuración de Layout
```json
{
  "layout": {
    "type": "sidebar-left",
    "productStyle": "cards-square",
    "headerStyle": "dark",
    "sidebarStyle": "white-shadow",
    "backgroundColor": "white"
  }
}
```

### Configuración de Productos
```json
{
  "shopConfig": {
    "products": [
      {
        "id": "1",
        "name": "Producto Ejemplo",
        "price": 99.99,
        "category": "Electrónicos",
        "image": "https://ejemplo.com/imagen.jpg"
      }
    ]
  }
}
```

## 🔧 Extensión del Sistema

### Crear un Nuevo Diseño

#### 1. Definir el Diseño en `lib/designs.tsx`
```tsx
export const shopDesigns: Design[] = [
  // ... diseños existentes
  {
    id: 'mi-nuevo-diseno',
    name: 'Mi Nuevo Diseño',
    description: 'Descripción del nuevo diseño',
    icon: ShoppingBag,
    colorScheme: {
      primary: '#ff6b6b',
      secondary: '#4ecdc4',
      background: '#f8f9fa',
      text: '#2d3436'
    },
    features: ['Responsive', 'Moderno', 'Elegante'],
    status: 'active',
    cssVariables: {
      '--primary-color': '#ff6b6b',
      '--secondary-color': '#4ecdc4'
    },
    predefinedConfig: {
      // Configuración completa del diseño
    }
  }
];
```

#### 2. Crear el Archivo JSON
```json
// public/mi-nuevo-diseno.json
{
  "name": "Mi Nuevo Diseño",
  "description": "Diseño personalizado para mi tienda",
  "category": "personalizado",
  "colorScheme": {
    "primary": "#ff6b6b",
    "secondary": "#4ecdc4",
    "background": "#f8f9fa",
    "text": "#2d3436"
  },
  "config": {
    "shopConfig": {
      "title": "Mi Tienda",
      "description": "Descripción de mi tienda",
      "products": [
        // Productos de ejemplo
      ]
    },
    "layout": {
      "type": "sidebar-left",
      "productStyle": "cards-square",
      "headerStyle": "dark",
      "sidebarStyle": "white-shadow",
      "backgroundColor": "white"
    }
  },
  "theme": {
    "light": {
      "primary": "#ff6b6b",
      "secondary": "#4ecdc4"
    },
    "dark": {
      "primary": "#ff5252",
      "secondary": "#26a69a"
    }
  }
}
```

#### 3. Agregar Estilos CSS
```css
/* En app/shop/layout-styles.css */

/* Layout específico */
[data-layout="mi-nuevo-layout"] {
  /* Estilos específicos del layout */
}

/* Estilo de productos específico */
[data-product-style="mi-nuevo-estilo"] {
  /* Estilos específicos de productos */
}

/* Header específico */
[data-header-style="mi-nuevo-header"] {
  /* Estilos específicos del header */
}
```

### Modificar un Diseño Existente

#### 1. Actualizar el JSON
```json
{
  "colorScheme": {
    "primary": "#nuevo-color",
    "secondary": "#nuevo-color-secundario"
  }
}
```

#### 2. Actualizar los Estilos CSS
```css
[data-layout="layout-modificado"] {
  /* Nuevos estilos */
}
```

## 🐛 Troubleshooting

### Problemas Comunes

#### El diseño no se aplica correctamente
**Síntomas**: Los colores o layout no cambian
**Solución**:
1. Verificar que el archivo JSON existe en `public/`
2. Revisar la consola del navegador para errores
3. Verificar que las variables CSS se están aplicando

```javascript
// Debug: Verificar variables CSS
console.log(getComputedStyle(document.documentElement).getPropertyValue('--primary-color'));
```

#### Los productos no se cargan
**Síntomas**: No aparecen productos en la tienda
**Solución**:
1. Verificar la estructura del JSON
2. Revisar que `shopConfig.products` esté definido
3. Verificar la función `handleDesignSelect`

#### El layout no responde en móviles
**Síntomas**: El diseño no se adapta a pantallas pequeñas
**Solución**:
1. Verificar las media queries en CSS
2. Asegurar que el layout sea responsive
3. Probar con diferentes tamaños de pantalla

### Herramientas de Debug

#### Verificar Estado del Diseño
```javascript
// En la consola del navegador
console.log('Diseño actual:', selectedDesign);
console.log('Configuración de layout:', layoutConfig);
```

#### Verificar Variables CSS
```javascript
// Listar todas las variables CSS aplicadas
const root = document.documentElement;
const styles = getComputedStyle(root);
Array.from(styles).forEach(prop => {
  if (prop.startsWith('--')) {
    console.log(`${prop}: ${styles.getPropertyValue(prop)}`);
  }
});
```

#### Verificar Atributos Data-*
```javascript
// Verificar atributos en el contenedor principal
const container = document.querySelector('[data-layout]');
console.log('Atributos data-*:', container.dataset);
```

## 📚 Referencias Técnicas

### Tipos TypeScript
```typescript
interface Design {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  colorScheme: ColorScheme;
  features: string[];
  status: 'active' | 'inactive';
  cssVariables: Record<string, string>;
  predefinedConfig: ShopDesignConfig;
}

interface ShopDesignConfig {
  name: string;
  description: string;
  category: string;
  colorScheme: ColorScheme;
  config: {
    shopConfig: ShopConfig;
    layout: LayoutConfig;
  };
  theme: {
    light: ColorScheme;
    dark: ColorScheme;
  };
}
```

### Hooks Personalizados
```typescript
// Hook para manejar diseños
const useShopDesign = () => {
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig | null>(null);

  const handleDesignSelect = async (design: Design) => {
    // Lógica de aplicación del diseño
  };

  return { selectedDesign, layoutConfig, handleDesignSelect };
};
```

### Funciones de Utilidad
```typescript
// Aplicar variables CSS
export const applyCSSVariables = (variables: Record<string, string>) => {
  Object.entries(variables).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
};

// Cargar configuración de diseño
export const loadDesignConfig = async (designId: string) => {
  const response = await fetch(`/${designId}.json`);
  return response.json();
};
```

## 🎯 Mejores Prácticas

### 1. Nomenclatura Consistente
- Usar kebab-case para IDs de diseños
- Usar camelCase para propiedades JavaScript
- Usar snake_case para variables CSS

### 2. Organización de Archivos
- Mantener un diseño por archivo JSON
- Agrupar estilos CSS por funcionalidad
- Documentar cambios en el código

### 3. Performance
- Cargar diseños bajo demanda
- Optimizar imágenes de productos
- Usar lazy loading para componentes pesados

### 4. Accesibilidad
- Mantener contraste de colores adecuado
- Usar atributos ARIA cuando sea necesario
- Probar con lectores de pantalla

## 🚀 Roadmap del Sistema

### Fase 1 - Funcionalidades Básicas ✅
- [x] Sistema de selección de diseños
- [x] Configuración JSON por diseño
- [x] Variables CSS dinámicas
- [x] Layouts responsivos

### Fase 2 - Funcionalidades Avanzadas 🔄
- [ ] Editor visual de diseños
- [ ] Previsualización en tiempo real
- [ ] Exportar/importar diseños
- [ ] Plantillas de diseños

### Fase 3 - Funcionalidades Premium 📋
- [ ] A/B testing de diseños
- [ ] Analytics por diseño
- [ ] Diseños personalizados por usuario
- [ ] Marketplace de diseños

---

**Sistema de Diseños de Tienda** - Parte integral de Plantillada 🎨

*Cada diseño es una experiencia única para tu tienda online.*
