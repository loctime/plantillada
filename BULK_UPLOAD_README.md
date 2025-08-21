# 📦 Carga Masiva de Productos

Sistema completo para subir múltiples productos de forma rápida y eficiente en la tienda, con soporte para archivos CSV y edición manual.

## ✨ Características

### 🚀 Funcionalidades Principales
- **Subida de archivos CSV**: Carga productos desde archivos CSV
- **Copiar y pegar**: Pega datos directamente desde Excel o Google Sheets
- **Edición manual**: Agrega productos uno por uno con formularios
- **Validación automática**: Verifica que todos los campos requeridos estén completos
- **Vista previa**: Revisa todos los productos antes de guardar
- **Subida de imágenes**: Sube imágenes individuales para cada producto
- **Plantilla descargable**: Descarga un archivo CSV de ejemplo

### 📊 Columnas del CSV
El archivo CSV debe tener las siguientes columnas:

| Columna | Descripción | Requerido | Ejemplo |
|---------|-------------|-----------|---------|
| `categoria` | Categoría del producto | ✅ | `tablets`, `smartphones`, `gaming` |
| `nombre` | Nombre del producto | ✅ | `iPad 11th (A16)` |
| `descripcion` | Descripción detallada | ✅ | `iPad de 11 pulgadas con chip A16...` |
| `urlImagen` | URL de la imagen | ✅ | `https://ejemplo.com/imagen.jpg` |
| `precio` | Precio actual | ✅ | `899.00` |
| `precioActual` | Precio original (opcional) | ❌ | `999.00` |
| `marca` | Marca del producto | ❌ | `iPad`, `Apple` |
| `rating` | Calificación (0-5) | ❌ | `4.5` |
| `reviews` | Número de reseñas | ❌ | `128` |
| `enStock` | Disponibilidad | ❌ | `true` o `false` |
| `caracteristicas` | Características separadas por comas | ❌ | `"Chip A16, 11 pulgadas, 128GB"` |

## 🏗️ Arquitectura

### Componentes
```
📁 components/
└── bulk-upload-products.tsx    # Componente principal de carga masiva

📁 public/
└── productos_ejemplo.csv       # Archivo CSV de ejemplo

📁 scripts/
└── test-bulk-upload.js         # Script de prueba
```

### Flujo de Carga Masiva
1. **Usuario activa modo admin** → Ve botón "Subir Masivo"
2. **Selecciona método** → CSV, copiar/pegar, o manual
3. **Procesa datos** → Validación automática
4. **Revisa vista previa** → Edita productos si es necesario
5. **Guarda productos** → Se agregan a la tienda

## 🚀 Uso

### 1. Activar Modo Admin
- Presiona `Ctrl + Shift + A` para activar el modo admin
- Ve a la página de la tienda (`/shop`)

### 2. Acceder a Carga Masiva
- Haz clic en el botón **"Subir Masivo"** (azul)
- Se abrirá el modal de carga masiva

### 3. Métodos de Carga

#### Opción A: Subir Archivo CSV
1. Haz clic en **"Seleccionar CSV"**
2. Elige tu archivo CSV
3. Los datos se procesarán automáticamente

#### Opción B: Copiar y Pegar
1. Haz clic en **"Cargar ejemplo"** para ver el formato
2. Copia tus datos desde Excel/Google Sheets
3. Pégalos en el editor CSV
4. Haz clic en **"Procesar CSV"**

#### Opción C: Descargar Plantilla
1. Haz clic en **"Plantilla CSV"**
2. Se descargará `productos_ejemplo.csv`
3. Llénalo con tus datos
4. Súbelo usando la Opción A

### 4. Revisar y Editar
- Revisa la **vista previa** de todos los productos
- Edita campos individuales si es necesario
- Agrega imágenes subiendo archivos
- Elimina productos que no quieras

### 5. Guardar
- Haz clic en **"Guardar X Productos"**
- Los productos se agregarán a tu tienda
- Recibirás confirmación del éxito

## 📋 Ejemplo de CSV

```csv
categoria,nombre,descripcion,urlImagen,precio,precioActual,marca,rating,reviews,enStock,caracteristicas
tablets,iPad 11th (A16),iPad de 11 pulgadas con chip A16,https://ejemplo.com/ipad.jpg,899.00,999.00,iPad,4.5,128,true,"Chip A16 Bionic, 11 pulgadas, 128GB"
smartphones,iPhone 15 Pro,Smartphone premium con chip A17,https://ejemplo.com/iphone.jpg,1299.00,1399.00,Apple,4.8,256,true,"Chip A17 Pro, 6.1 pulgadas, 256GB"
gaming,ROG Phone 8,Smartphone gaming con refrigeración líquida,https://ejemplo.com/rog.jpg,1299.00,1499.00,ASUS,4.6,234,true,"Snapdragon 8 Gen 3, 16GB RAM, Gaming"
```

## 🔍 Validación

### Campos Requeridos
- **Categoría**: Debe estar especificada
- **Nombre**: No puede estar vacío
- **Descripción**: Debe tener contenido
- **URL de imagen**: Debe ser una URL válida (o imagen subida)
- **Precio**: Debe ser mayor a 0

### Validaciones Adicionales
- **Precio actual**: Si se especifica, debe ser mayor al precio normal
- **Rating**: Debe estar entre 0 y 5
- **Reviews**: Debe ser un número entero positivo
- **En stock**: Debe ser `true` o `false`

## 🧪 Pruebas

### 1. Probar Funcionalidad
```bash
node scripts/test-bulk-upload.js
```

### 2. Verificar Archivo CSV
```bash
# Verificar que existe el archivo de ejemplo
ls public/productos_ejemplo.csv
```

### 3. Probar en el Navegador
1. Inicia el servidor: `npm run dev`
2. Ve a `/shop`
3. Activa el modo admin (`Ctrl + Shift + A`)
4. Haz clic en "Subir Masivo"
5. Prueba los diferentes métodos

## 🎯 Casos de Uso

### Para Tiendas Nuevas
1. **Descarga la plantilla** CSV
2. **Llena con tus productos** en Excel/Google Sheets
3. **Sube el archivo** completo
4. **Revisa y guarda**

### Para Agregar Productos Existentes
1. **Exporta desde tu sistema** actual a CSV
2. **Ajusta el formato** si es necesario
3. **Pega los datos** en el editor
4. **Procesa y guarda**

### Para Actualizaciones Rápidas
1. **Copia desde Excel** los productos nuevos
2. **Pega directamente** en el editor
3. **Revisa y guarda** rápidamente

## 🔧 Personalización

### Agregar Nuevas Categorías
1. Edita el archivo `app/shop/page.tsx`
2. Busca el array de categorías
3. Agrega tus nuevas categorías

### Modificar Validaciones
1. Edita `components/bulk-upload-products.tsx`
2. Busca la función `validateProducts`
3. Agrega tus validaciones personalizadas

### Cambiar Formato de Producto
1. Edita la función `saveProducts`
2. Modifica el mapeo de campos
3. Ajusta según tus necesidades

## 🚨 Solución de Problemas

### Error: "Archivo CSV no válido"
- Verifica que el archivo tenga extensión `.csv`
- Asegúrate de que tenga el header correcto
- Revisa que no tenga caracteres especiales

### Error: "Campos requeridos faltantes"
- Revisa que todas las columnas requeridas estén llenas
- Verifica que no haya filas vacías
- Asegúrate de que los precios sean números válidos

### Error: "No se pueden guardar productos"
- Verifica tu conexión a internet
- Asegúrate de que Firebase esté configurado
- Revisa la consola del navegador para errores

## 📈 Rendimiento

### Límites Recomendados
- **Máximo 100 productos** por carga
- **Archivos CSV menores a 1MB**
- **Imágenes optimizadas** (máximo 5MB cada una)

### Optimizaciones
- Los productos se procesan en lotes
- Las imágenes se suben a Cloudinary automáticamente
- La validación es en tiempo real

## 🎉 ¡Listo!

Ahora puedes cargar cientos de productos en minutos en lugar de horas. La funcionalidad de carga masiva hace que gestionar tu tienda sea mucho más eficiente y rápido.
