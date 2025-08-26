# 🍕 Sistema de Opciones y Variedades de Productos

Este documento describe las nuevas funcionalidades implementadas para permitir productos con opciones personalizables y adicionales, especialmente útil para tiendas de comida y restaurantes.

## ✨ Nuevas Funcionalidades

### 🎯 Opciones y Variedades
- **4 conjuntos de opciones** por producto (Opciones 1-4)
- **Variedades correspondientes** para cada opción
- **Sistema flexible** que se adapta a diferentes tipos de productos

### ➕ Adicionales
- **Adicionales personalizables** con precios individuales
- **Cálculo automático** del precio total
- **Gestión en el carrito** con precios actualizados

## 📊 Estructura de Datos

### Columnas del Excel/CSV

| Columna | Descripción | Ejemplo |
|---------|-------------|---------|
| **Nombre** | Nombre del producto | "Pizza Margarita" |
| **Descripción** | Descripción del producto | "Pizza clásica con tomate y mozzarella" |
| **Categoría** | Categoría del producto | "Pizzas" |
| **Precio** | Precio base del producto | "12.99" |
| **Marca** | Marca del producto | "Pizza Express" |
| **Opciones 1** | Nombre de la primera opción | "Tipo de masa" |
| **Variedades 1** | Opciones disponibles (separadas por coma) | "Masa fina, Masa gruesa, Media masa" |
| **Opciones 2** | Nombre de la segunda opción | "Tamaño" |
| **Variedades 2** | Opciones disponibles (separadas por coma) | "Pequeña, Mediana, Grande" |
| **Opciones 3** | Nombre de la tercera opción | "Sabor" |
| **Variedades 3** | Opciones disponibles (separadas por coma) | "Margarita, Pepperoni, Hawaiana" |
| **Opciones 4** | Nombre de la cuarta opción | "Extras" |
| **Variedades 4** | Opciones disponibles (separadas por coma) | "Sin extras, Queso extra, Aceitunas" |
| **Adicionales** | Nombres de adicionales (separados por coma) | "Queso extra, Aceitunas, Champiñones" |
| **Precio Adicional** | Precio que se suma por cada adicional | "2.50" |
| **URL Imagen** | URL de la imagen del producto | "/placeholder.jpg" |
| **Rating** | Calificación del producto | "4.5" |
| **Reviews** | Número de reseñas | "120" |
| **En Stock** | Disponibilidad | "Sí" |
| **Características** | Características del producto (separadas por coma) | "Fresca, Casera, Tradicional" |

## 🍕 Ejemplos de Uso

### Ejemplo 1: Pizza
```
Opciones 1: Tipo de masa
Variedades 1: Masa fina, Masa gruesa, Media masa

Opciones 2: Tamaño
Variedades 2: Pequeña, Mediana, Grande

Opciones 3: Sabor
Variedades 3: Margarita, Pepperoni, Hawaiana

Adicionales: Queso extra, Aceitunas, Champiñones
Precio Adicional: 2.50
```

### Ejemplo 2: Hamburguesa
```
Opciones 1: Tipo de carne
Variedades 1: Res, Pollo, Vegetariana

Opciones 2: Tamaño
Variedades 2: Regular, Grande

Opciones 3: Extras
Variedades 3: Cebolla, Sin cebolla

Adicionales: Lechuga extra, Tomate extra
Precio Adicional: 2.00
```

### Ejemplo 3: Ensalada
```
Opciones 1: Tipo de lechuga
Variedades 1: Romana, Iceberg, Mixta

Opciones 2: Tamaño
Variedades 2: Pequeña, Grande

Opciones 3: Proteína
Variedades 3: Pollo, Atún, Sin proteína

Adicionales: Queso parmesano, Crutones
Precio Adicional: 1.50
```

## 🛒 Experiencia del Cliente

### 1. Visualización del Producto
- Los productos con opciones muestran un indicador: **"⚙️ Opciones personalizables disponibles"**
- El botón "Agregar al Carrito" abre un modal de opciones

### 2. Modal de Opciones
- **Opciones obligatorias**: El cliente debe seleccionar una opción por cada conjunto
- **Adicionales opcionales**: El cliente puede seleccionar múltiples adicionales
- **Precio dinámico**: Se muestra el precio total actualizado en tiempo real
- **Interfaz intuitiva**: Radio buttons para opciones, checkboxes para adicionales

### 3. Carrito de Compras
- **Items únicos**: Cada combinación de opciones se trata como un item separado
- **Nombres descriptivos**: Se incluyen las opciones seleccionadas en el nombre
- **Precios correctos**: Se suman los precios de los adicionales seleccionados
- **Gestión de cantidad**: Se pueden agregar múltiples unidades de la misma combinación

## 🔧 Funcionalidades Técnicas

### Tipos de Datos Actualizados
```typescript
interface Product {
  // ... campos existentes ...
  options?: {
    option1?: string
    option2?: string
    option3?: string
    option4?: string
  }
  varieties?: {
    variety1?: string[]
    variety2?: string[]
    variety3?: string[]
    variety4?: string[]
  }
  addons?: {
    name: string
    price: number
  }[]
}

interface CartItem {
  // ... campos existentes ...
  selectedOptions?: {
    option1?: string
    option2?: string
    option3?: string
    option4?: string
  }
  selectedAddons?: {
    name: string
    price: number
  }[]
}
```

### Componentes Actualizados
1. **ProductCard**: Muestra indicador de opciones y modal de selección
2. **BulkUploadProducts**: Incluye todas las nuevas columnas
3. **BulkEditProducts**: Permite editar opciones y adicionales
4. **useShop Hook**: Maneja la lógica del carrito con opciones

## 📁 Archivos de Ejemplo

### Archivo CSV de Ejemplo
Se ha creado `public/productos_ejemplo_nuevo.csv` con ejemplos de productos que incluyen:
- Pizzas con opciones de masa, tamaño y sabor
- Hamburguesas con opciones de carne y extras
- Ensaladas con opciones de lechuga y proteína

### Estructura del Excel Exportado
El sistema exporta archivos Excel con las siguientes columnas:
1. **Nombre** (sin ID - el cliente no debe tocar esto)
2. **Descripción**
3. **Categoría**
4. **Precio**
5. **Marca**
6. **Opciones 1-4** y **Variedades 1-4**
7. **Adicionales** y **Precio Adicional**
8. **URL Imagen**
9. **Rating**
10. **Reviews**
11. **En Stock**
12. **Características**

## 🚀 Cómo Usar

### 1. Carga Masiva de Productos
1. Ir al panel de administración
2. Seleccionar "Carga Masiva de Productos"
3. Usar el archivo CSV de ejemplo como plantilla
4. Llenar las columnas de opciones y variedades según necesites
5. Importar el archivo

### 2. Edición Individual
1. En modo admin, hacer clic en el botón de editar producto
2. Llenar las opciones y variedades en los campos correspondientes
3. Guardar los cambios

### 3. Personalización por Cliente
1. El cliente ve el indicador de opciones en productos personalizables
2. Al hacer clic en "Agregar al Carrito" se abre el modal
3. Selecciona las opciones deseadas
4. Agrega adicionales si lo desea
5. Confirma y el producto se agrega al carrito con las opciones seleccionadas

## 💡 Consejos de Uso

### Para Restaurantes de Comida
- **Opciones 1**: Tipo de base/masa
- **Opciones 2**: Tamaño
- **Opciones 3**: Sabor/ingredientes principales
- **Opciones 4**: Extras especiales

### Para Tiendas de Ropa
- **Opciones 1**: Talla
- **Opciones 2**: Color
- **Opciones 3**: Material
- **Opciones 4**: Estilo

### Para Tiendas de Tecnología
- **Opciones 1**: Capacidad
- **Opciones 2**: Color
- **Opciones 3**: Modelo
- **Opciones 4**: Garantía

## 🔄 Compatibilidad

### Productos Existentes
- Los productos sin opciones funcionan normalmente
- No se requiere migración de datos existentes
- Las nuevas funcionalidades son opcionales

### Importación/Exportación
- Compatible con archivos Excel existentes
- Las nuevas columnas se agregan automáticamente
- Se mantiene compatibilidad con JSON

## 🎯 Beneficios

1. **Flexibilidad**: Se adapta a diferentes tipos de productos
2. **Experiencia de Usuario**: Interfaz intuitiva para personalización
3. **Gestión Eficiente**: Carga masiva y edición en lote
4. **Precios Dinámicos**: Cálculo automático de precios con adicionales
5. **Carrito Inteligente**: Manejo correcto de combinaciones únicas

---

**Nota**: Esta funcionalidad está especialmente diseñada para tiendas de comida, pero es flexible enough para adaptarse a otros tipos de productos que requieran personalización.
