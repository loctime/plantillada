# Modo Admin Inline - Documentación

## 🎯 Descripción

El modo admin inline permite editar la landing page directamente mientras navegas por ella, sin necesidad de ir a una página de administración separada. Es mucho más intuitivo y visual que el sistema anterior.

## 🚀 Cómo Activar el Modo Admin

### Método 1: Atajo de Teclado
- Presiona `Ctrl + Shift + A` en cualquier momento para activar/desactivar el modo admin

## 🎯 Gestión de Botones (NUEVO)

### Características Principales
- **Agregar/Eliminar botones** en cualquier sección
- **Editar texto** de los botones directamente
- **Configurar URL destino** para enlaces externos
- **Navegación interna** a secciones de la web
- **Modales personalizables** con contenido HTML
- **Iconos configurables** (calendario, enlace, sección, etc.)
- **Estilos personalizables** (principal, borde, secundario)

### Tipos de Botones Disponibles

#### 1. URL Externa
- Abre enlaces externos en nueva pestaña
- Ejemplo: `https://ejemplo.com`

#### 2. Sección de la Web
- Navegación interna con scroll suave
- Secciones disponibles: Hero, Sesiones, Curso Online, Testimonios, Contacto

#### 3. Modal Personalizable
- Abre un modal con contenido personalizado
- Título y contenido editables
- Soporte para HTML básico

### Cómo Usar

1. **Activar modo admin** con `Ctrl + Shift + A`
2. **Hacer clic en "Gestionar Botones"** en cualquier sección
3. **Agregar nuevo botón** con el botón verde "+"
4. **Configurar tipo, texto, URL y estilo**
5. **Guardar** - los cambios se aplican automáticamente

### Ejemplos de Uso

```json
{
  "id": "button-agendar",
  "text": "Agendar Sesión",
  "type": "modal",
  "modalTitle": "Agenda tu sesión",
  "modalContent": "Completa el formulario...",
  "variant": "default",
  "icon": "calendar"
}
```

```json
{
  "id": "button-curso",
  "text": "Ver Curso",
  "type": "section",
  "sectionId": "curso",
  "variant": "outline",
  "icon": "play"
}
```

### Método 2: Botón Flotante
- Haz clic en el botón "Admin" que aparece en la esquina inferior derecha de la pantalla

## ✨ Características del Modo Admin

### **Switch de Tema (Modo Claro/Nocturno)**
- **Ubicación**: Header de la página (ícono de sol/luna)
- **Funcionalidad**: Cambiar entre modo claro y nocturno
- **Persistencia**: La preferencia se guarda en localStorage
- **Detección automática**: Respeta la preferencia del sistema operativo
- **Colores personalizados**: Aplica los colores configurados en el modo admin

### 1. **Edición de Texto Inline**
- **Hover sobre cualquier texto editable**: Aparece un ícono de edición
- **Haz clic en el ícono**: Se convierte en un campo de texto editable
- **Presiona Enter**: Guarda los cambios
- **Presiona Escape**: Cancela la edición

### 2. **Edición de Listas**
- **Hover sobre listas**: Aparece ícono de edición
- **Modo edición**: Puedes agregar, eliminar y reordenar elementos
- **Agregar elementos**: Campo de texto + botón "+"
- **Eliminar elementos**: Botón de papelera junto a cada elemento

### 3. **Edición de URLs**
- **Validación automática**: Verifica que las URLs sean válidas
- **Vista previa**: Muestra el enlace actual
- **Indicador visual**: Bordes rojos para URLs inválidas

### 4. **Edición de Imágenes y Videos**
- **Vista previa en tiempo real**: Ve el contenido mientras lo editas
- **Detección automática**: Detecta automáticamente si es imagen o video
- **Soporte para videos**: YouTube, Vimeo, Dailymotion y archivos de video
- **Validación flexible**: Acepta cualquier URL de contenido válido
- **Manejo de errores**: Indicadores visuales cuando el contenido no carga
- **Sugerencias**: Tips para servicios de hosting de imágenes y videos
- **Botón de apertura**: Abre el contenido en nueva pestaña

### 5. **Edición de Botones**
- **Texto editable**: Haz clic en el ícono de edición sobre cualquier botón
- **Tamaño automático**: El botón se ajusta automáticamente al texto
- **Validación**: No permite texto vacío
- **Atajos de teclado**: Enter para guardar, Escape para cancelar
- **Vista previa**: Ve el cambio en tiempo real

### 6. **Gestión de Sesiones**
- **Botón "Gestionar Sesiones"**: Panel completo de gestión
- **Agregar sesiones**: Crea nuevas sesiones con datos por defecto
- **Eliminar sesiones**: Botón de papelera para cada sesión
- **Editar todos los campos**: Nombre, resumen, precio, duración, características, URL

### 7. **Gestión de Testimonios**
- **Botón "Gestionar Testimonios"**: Panel de gestión de testimonios
- **Agregar testimonios**: Nuevos testimonios con datos por defecto
- **Eliminar testimonios**: Botón de papelera para cada testimonio
- **Editar campos**: Testimonio, autor, cargo/rol

### 8. **Gestión de Secciones**
- **Botón "Gestionar Secciones"**: Panel de gestión de secciones
- **Mostrar/ocultar secciones**: Toggle de visibilidad
- **Eliminar secciones**: Botón de papelera para cada sección
- **Agregar secciones**: Nuevas secciones personalizables

### 9. **Gestión del LinkHub (NUEVO)**
- **Botón "Gestionar LinkHub"**: Panel completo de gestión del LinkHub
- **Edición del perfil**:
  - Nombre del perfil (edición inline)
  - Biografía/descripción personal (multilínea)
  - Avatar/foto de perfil (con vista previa en tiempo real)
  - Ubicación, email y teléfono (campos opcionales)
- **Gestión de enlaces**:
  - Agregar nuevos enlaces con datos por defecto
  - Editar título, URL e icono de cada enlace
  - Mostrar/ocultar enlaces individuales (toggle de visibilidad)
  - Eliminar enlaces con confirmación visual
  - Panel de gestión avanzada con vista de todos los enlaces
- **Gestión de redes sociales**:
  - Instagram, Twitter, LinkedIn, YouTube, Facebook, Website
  - Edición de URLs de cada plataforma
  - Vista previa de iconos y estados
  - Campos opcionales que se muestran solo si tienen contenido
- **Funcionalidades avanzadas**:
  - Reordenamiento de enlaces (preparado para drag & drop)
  - Validación de URLs en tiempo real
  - Indicadores visuales de estado (activo/inactivo)
  - Guardado automático de todos los cambios

### 10. **Gestión de Colores y Temas**
- **Botón "Colores"**: Panel completo de gestión de colores
- **Switch de modo nocturno/claro**: Cambiar entre temas
- **Configuración independiente**: Colores separados para cada modo
- **Selector de colores**: Pickers visuales para cada elemento
- **Elementos personalizables**:
  - Fondo principal de la web
  - Fondo de secciones
  - Fondo de barra de navegación
  - Color de texto
  - Color de acento (elementos destacados y enlaces)
  - Botones principales (Agendar, CTA)
  - Botones secundarios (Comprar curso)
  - Botones outline (Ver curso, Ver sesiones)
- **Aplicación inmediata**: Los cambios se ven en tiempo real
- **Restaurar valores por defecto**: Botón para volver a la configuración inicial

## 🎨 Elementos Editables

### Header
- ✅ Título del sitio
- ✅ Tagline

### Contenido Multimedia Editable
- ✅ **Imagen Hero**: Edición con vista previa en tiempo real
- ✅ **Contenido Personal**: Foto o video profesional
- ✅ **Detección automática**: Detecta si es imagen o video
- ✅ **Soporte para videos**: YouTube, Vimeo, Dailymotion
- ✅ **Validación flexible**: Acepta cualquier URL de contenido válido
- ✅ **Manejo de errores**: Indicadores visuales cuando el contenido no carga

### Botones Editables
- ✅ **Botón Hero**: Texto principal del botón de agendar
- ✅ **Botón Sesiones**: Texto del botón en sección de sesiones
- ✅ **Botón Curso**: Texto del botón en sección de curso
- ✅ **Botón Sobre Mí**: Texto del botón en sección personal
- ✅ **Botón CTA**: Texto del botón de call-to-action
- ✅ **Tamaño automático**: Se ajusta al contenido del texto

### Sección Hero
- ✅ Tagline
- ✅ Título principal
- ✅ Subtítulo
- ✅ URLs de Calendly

### Sección Sesiones
- ✅ Título de la sección
- ✅ Subtítulo de la sección
- ✅ **Gestión completa de sesiones**:
  - Nombre de cada sesión
  - Resumen/descripción
  - Precio
  - Duración
  - Lista de características
  - URL de Hotmart

### Sección Curso
- ✅ Título del curso
- ✅ Descripción del curso
- ✅ Lista de beneficios
- ✅ Precio
- ✅ URL de Hotmart
- ✅ URL del video de presentación

### Sección Sobre Mí
- ✅ Título de la sección
- ✅ Historia personal
- ✅ Por qué elegirte
- ✅ **Contenido multimedia**: Foto o video profesional con detección automática
- ✅ URL del video de presentación

### Sección Testimonios
- ✅ Título de la sección
- ✅ Subtítulo de la sección
- ✅ **Gestión completa de testimonios**:
  - Texto del testimonio
  - Nombre del autor
  - Cargo/rol del autor

### Sección CTA
- ✅ Título del CTA
- ✅ Subtítulo del CTA

### Sección LinkHub (NUEVO)
- ✅ **Gestión completa del perfil**:
  - Nombre del perfil
  - Biografía/descripción personal
  - Avatar/foto de perfil (con vista previa en tiempo real)
  - Ubicación
  - Email de contacto
  - Teléfono de contacto
- ✅ **Gestión completa de enlaces**:
  - Agregar nuevos enlaces
  - Editar título de cada enlace
  - Editar URL de cada enlace
  - Editar icono de cada enlace
  - Mostrar/ocultar enlaces individuales
  - Eliminar enlaces
  - Panel de gestión avanzada con vista de todos los enlaces
- ✅ **Gestión de redes sociales**:
  - Instagram, Twitter, LinkedIn, YouTube, Facebook, Website
  - Edición de URLs de cada plataforma
  - Vista previa de iconos
- ✅ **Botón de gestión específico**: Panel completo para gestionar todos los elementos del LinkHub

### Footer
- ✅ Email de contacto
- ✅ URLs de términos y privacidad

## 💾 Guardado Automático

- **Guardado en tiempo real**: Los cambios se guardan automáticamente en Firebase
- **Indicador de estado**: 
  - 🔄 "Guardando..." durante el proceso
  - ✅ "Guardado [hora]" cuando se completa
  - 💾 "Sin cambios" cuando no hay modificaciones pendientes

## 🎯 Flujo de Trabajo Recomendado

1. **Activa el modo admin** con `Ctrl + Shift + A`
2. **Navega por la página** y haz hover sobre elementos para ver qué es editable
3. **Edita textos** haciendo clic en los íconos de edición
4. **Edita contenido multimedia** (imágenes o videos) haciendo hover y clic en el ícono de edición
5. **Edita textos de botones** haciendo clic en el ícono de edición sobre cualquier botón
6. **Gestiona sesiones** usando el botón "Gestionar Sesiones"
7. **Gestiona testimonios** usando el botón "Gestionar Testimonios"
8. **Gestiona el LinkHub** usando el botón "Gestionar LinkHub":
   - Edita el perfil (nombre, bio, avatar, contacto)
   - Agrega, edita y elimina enlaces
   - Configura redes sociales
   - Usa el panel de gestión avanzada para una vista completa
9. **Configura colores** usando el botón "Colores":
   - Selecciona modo claro o nocturno
   - Ajusta los colores de cada elemento
   - Ve la vista previa en tiempo real
   - Guarda los cambios automáticamente
10. **Prueba el switch de tema** en el header para ver los cambios
11. **Verifica los cambios** desactivando el modo admin
12. **Los cambios se guardan automáticamente** en la base de datos

## 🔧 Características Técnicas

### Atajos de Teclado
- `Ctrl + Shift + A`: Activar/desactivar modo admin
- `Enter`: Guardar cambios en campos de texto
- `Escape`: Cancelar edición
- `Enter` en listas: Agregar nuevo elemento

### Validaciones
- **URLs**: Validación automática de formato
- **Contenido multimedia**: Detección automática de imágenes y videos
- **Videos**: Soporte para YouTube, Vimeo, Dailymotion y archivos de video
- **Campos requeridos**: Indicadores visuales
- **Longitud de texto**: Sin límites artificiales

### Responsive Design
- **Móvil**: Controles adaptados para pantallas pequeñas
- **Tablet**: Layout optimizado
- **Desktop**: Experiencia completa

## 🚨 Solución de Problemas

### El modo admin no se activa
- Verifica que estés en la página principal
- Intenta refrescar la página
- Usa el botón flotante en lugar del atajo de teclado

### Los cambios no se guardan
- Verifica la conexión a internet
- Revisa la consola del navegador para errores
- Intenta editar un campo simple primero

### No veo los íconos de edición
- Asegúrate de que el modo admin esté activo
- Haz hover sobre los elementos de texto e imágenes
- Verifica que no haya conflictos de CSS

### El contenido multimedia no se carga
- Verifica que la URL sea de un contenido válido (imagen o video)
- Asegúrate de que el contenido sea accesible públicamente
- Para imágenes: Prueba con servicios como Imgur, Cloudinary, Unsplash
- Para videos: Prueba con YouTube, Vimeo, Dailymotion o archivos de video directos

## 🎨 Personalización

### Colores del Modo Admin
- **Verde emerald**: Color principal del modo admin
- **Rojo**: Para acciones de eliminación
- **Gris**: Para elementos deshabilitados

### Estilos de los Controles
- **Hover effects**: Transiciones suaves
- **Focus states**: Indicadores claros
- **Loading states**: Animaciones de carga

## 🔮 Próximas Mejoras

- [ ] Drag & drop para reordenar secciones
- [ ] Upload directo de imágenes (sin necesidad de URLs externas)
- [ ] Editor de imágenes integrado con filtros y ajustes
- [ ] Vista previa en tiempo real de todos los cambios
- [ ] Historial de cambios
- [ ] Modo colaborativo
- [ ] Plantillas predefinidas
- [ ] Exportar/importar configuración
- [ ] **Temas predefinidos**: Paletas de colores preestablecidas
- [ ] **Gradientes personalizables**: Fondos con gradientes en lugar de colores sólidos
- [ ] **Tipografías personalizables**: Selección de fuentes para diferentes elementos
- [ ] **Animaciones de transición**: Efectos suaves al cambiar entre temas
- [ ] **Modo automático**: Cambio automático según la hora del día

## 📸 Servicios Recomendados para Contenido Multimedia

### Servicios de Imágenes Gratuitos
- **Imgur**: `https://imgur.com` - Sube y obtén URLs directas
- **Cloudinary**: `https://cloudinary.com` - CDN con optimización automática
- **Unsplash**: `https://unsplash.com` - Imágenes de alta calidad gratuitas
- **Pexels**: `https://pexels.com` - Banco de imágenes gratuito

### Servicios de Videos Gratuitos
- **YouTube**: `https://youtube.com` - Sube videos y obtén URLs de embed
- **Vimeo**: `https://vimeo.com` - Plataforma profesional de videos
- **Dailymotion**: `https://dailymotion.com` - Alternativa a YouTube

### Servicios de Pago
- **AWS S3**: Almacenamiento escalable con CDN
- **Cloudinary Pro**: Optimización avanzada para imágenes y videos
- **Vimeo Pro**: Funciones avanzadas para videos

### Cómo Usar
1. Sube tu contenido al servicio elegido
2. Copia la URL directa del contenido
3. Pega la URL en el campo de edición
4. El contenido se detectará automáticamente y se mostrará en la vista previa

---

**¡El modo admin inline hace que editar tu landing page sea tan fácil como navegar por ella!** 🎉
