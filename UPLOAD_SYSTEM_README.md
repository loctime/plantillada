# 📤 Sistema de Upload de Archivos

Sistema completo para subir imágenes directamente desde el modo admin, con optimización automática y almacenamiento en Cloudinary.

## ✨ Características

### 🚀 Funcionalidades Principales
- **Upload directo**: Sube imágenes desde tu dispositivo
- **Drag & Drop**: Arrastra y suelta archivos fácilmente
- **Optimización automática**: Cloudinary optimiza las imágenes automáticamente
- **Validación**: Verificación de tipos y tamaños de archivo
- **Preview en tiempo real**: Vista previa antes de confirmar
- **CDN global**: Mejor rendimiento de carga
- **Transformaciones**: Cambia tamaño/formato sin re-upload

### 🎯 Tipos de Archivo Soportados
- JPEG/JPG
- PNG
- GIF
- WebP
- SVG

### 📏 Límites
- **Tamaño máximo**: 5MB por archivo
- **Almacenamiento**: 25GB (plan gratuito de Cloudinary)
- **Ancho de banda**: 25GB/mes (plan gratuito)

## 🏗️ Arquitectura

### Componentes
```
📁 app/api/upload/
└── route.ts              # API de upload a Cloudinary

📁 components/
├── editable-image.tsx    # Componente editable con upload
└── image-upload.tsx      # Componente de upload con drag & drop

📁 hooks/
└── use-image-upload.ts   # Hook para manejar uploads

📁 scripts/
├── test-upload-api.js    # Script de prueba de la API
└── verify-cloudinary-config.js # Verificación de configuración
```

### Flujo de Upload
1. **Usuario selecciona archivo** → Drag & drop o click
2. **Validación local** → Tipo y tamaño
3. **Preview** → Vista previa del archivo
4. **Upload a Cloudinary** → Optimización automática
5. **Respuesta** → URL optimizada lista para usar

## 🔧 Configuración

### 1. Variables de Entorno
Agrega estas variables a tu archivo `.env.local`:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### 2. Dependencias
Las dependencias ya están agregadas al `package.json`:

```json
{
  "cloudinary": "^2.0.1",
  "form-data": "^4.0.0"
}
```

### 3. Instalación
```bash
npm install
```

## 🚀 Uso

### En Modo Admin
1. **Activa el modo admin** (`Ctrl + Shift + A`)
2. **Haz clic en una imagen** para editarla
3. **Selecciona "Subir"** en lugar de "URL"
4. **Arrastra o selecciona** tu archivo
5. **Confirma** el upload

### Programáticamente
```tsx
import { useImageUpload } from '@/hooks/use-image-upload'

function MyComponent() {
  const { uploadImage, isUploading, error } = useImageUpload()

  const handleFileSelect = async (file: File) => {
    try {
      const result = await uploadImage(file)
      console.log('URL de la imagen:', result.url)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div>
      {isUploading && <p>Subiendo...</p>}
      {error && <p>Error: {error}</p>}
      {/* Tu componente aquí */}
    </div>
  )
}
```

## 🧪 Pruebas

### 1. Verificar Configuración
```bash
node scripts/verify-cloudinary-config.js
```

### 2. Probar API
```bash
# Asegúrate de tener un archivo en public/placeholder.jpg
node scripts/test-upload-api.js
```

### 3. Probar en el Navegador
1. Inicia el servidor: `npm run dev`
2. Ve a cualquier página con imágenes editables
3. Activa el modo admin
4. Prueba subir una imagen

## 🔍 API Endpoints

### POST /api/upload
Sube un archivo a Cloudinary.

**Request:**
```typescript
// FormData con campo 'file'
const formData = new FormData()
formData.append('file', file)
```

**Response:**
```typescript
{
  success: true,
  url: "https://res.cloudinary.com/...",
  publicId: "plantillada/1234567890_filename",
  width: 1920,
  height: 1080,
  format: "jpg",
  size: 123456,
  message: "Archivo subido exitosamente"
}
```

**Errores:**
```typescript
{
  error: "Mensaje de error",
  details?: "Detalles adicionales"
}
```

## 🎨 Optimizaciones de Cloudinary

### Automáticas
- **Formato**: Conversión automática a WebP si es soportado
- **Calidad**: Optimización automática de calidad
- **Compresión**: Compresión inteligente

### Transformaciones Disponibles
```typescript
// Cambiar tamaño
https://res.cloudinary.com/cloud_name/image/upload/w_300,h_200/plantillada/image.jpg

// Cambiar formato
https://res.cloudinary.com/cloud_name/image/upload/f_webp/plantillada/image.jpg

// Aplicar filtros
https://res.cloudinary.com/cloud_name/image/upload/e_brightness:10/plantillada/image.jpg
```

## 🔒 Seguridad

### Validaciones Implementadas
- ✅ **Tipos de archivo**: Solo imágenes permitidas
- ✅ **Tamaño máximo**: 5MB por archivo
- ✅ **Sanitización**: Nombres de archivo seguros
- ✅ **Rate limiting**: Protección contra abuso

### Recomendaciones
- 🔐 Usa HTTPS en producción
- 📝 Monitorea el uso de Cloudinary
- 🗑️ Limpia archivos no utilizados
- 🔄 Rota las claves API periódicamente

## 🚨 Solución de Problemas

### Error: "Cloudinary no está configurado"
```bash
# Verifica las variables de entorno
node scripts/verify-cloudinary-config.js
```

### Error: "Tipo de archivo no permitido"
- Verifica que el archivo sea una imagen
- Tipos soportados: JPEG, PNG, GIF, WebP, SVG

### Error: "Archivo demasiado grande"
- Reduce el tamaño del archivo
- Máximo permitido: 5MB

### Error de conexión
- Verifica tu conexión a internet
- Asegúrate de que Cloudinary esté disponible
- Revisa las credenciales de API

### Imagen no se muestra
- Verifica que la URL sea accesible
- Revisa la consola del navegador
- Comprueba que Cloudinary esté funcionando

## 📈 Monitoreo

### Métricas de Cloudinary
- **Almacenamiento usado**: Dashboard de Cloudinary
- **Ancho de banda**: Métricas de uso
- **Transformaciones**: Estadísticas de procesamiento

### Logs
- **Servidor**: Console logs en desarrollo
- **Cliente**: Console logs del navegador
- **Cloudinary**: Dashboard de Cloudinary

## 🔄 Mantenimiento

### Limpieza de Archivos
```javascript
// Script para limpiar archivos no utilizados
// (Implementar según necesidades específicas)
```

### Backup
- Los archivos se almacenan en Cloudinary
- Considera hacer backup de metadatos importantes
- Exporta URLs de imágenes críticas

## 🆘 Soporte

### Documentación Adicional
- **Cloudinary Docs**: https://cloudinary.com/documentation
- **Next.js API Routes**: https://nextjs.org/docs/api-routes/introduction
- **FormData API**: https://developer.mozilla.org/en-US/docs/Web/API/FormData

### Contacto
- **Issues**: Crear issue en GitHub
- **Cloudinary Support**: Soporte oficial de Cloudinary
- **Documentación**: Este archivo README

---

**Sistema de Upload** - Sube imágenes fácilmente con optimización automática 🚀
