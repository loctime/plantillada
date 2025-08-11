# Configuración de ControlDoc - Multi-Tenant

Guía completa para configurar tu dominio `controldoc.app` con el sistema multi-tenant.

## 🚀 Configuración Rápida

### 1. Preparar el Entorno

Asegúrate de tener las variables de entorno de Firebase configuradas en tu archivo `.env.local`:

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

### 2. Configurar ControlDoc en Firebase

Ejecuta el script de configuración automática:

```bash
node scripts/setup-controldoc.js
```

Este script creará automáticamente:
- ✅ Configuración personalizada para ControlDoc
- ✅ 3 sesiones de servicios documentales
- ✅ Curso de gestión documental
- ✅ Testimonios relevantes
- ✅ Información de contacto

### 3. Desplegar en Producción

#### Opción A: Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno de Firebase en Vercel
3. Despliega automáticamente

#### Opción B: Netlify
1. Conecta tu repositorio a Netlify
2. Configura las variables de entorno
3. Configura el build command: `npm run build`
4. Configura el publish directory: `.next`

### 4. Configurar el Dominio

#### En tu proveedor de DNS:
1. Crea un registro A que apunte a tu hosting (Vercel/Netlify)
2. O configura un CNAME si tu hosting lo requiere

#### En Vercel (si usas Vercel):
1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Domains
3. Agrega `controldoc.app`
4. Sigue las instrucciones para configurar DNS

### 5. Personalizar la Configuración

Una vez desplegado, accede a:
```
https://controldoc.app/admin
```

Credenciales por defecto:
- Usuario: `admin`
- Contraseña: `admin123`

## 🎯 Configuración Personalizada

### URLs que Necesitas Actualizar

#### Calendly
1. Crea un nuevo tipo de evento en Calendly para ControlDoc
2. Actualiza la URL en el panel de administración:
   - Sección: "Integraciones"
   - Campo: "URL de Calendly"

#### Hotmart
1. Crea productos en Hotmart para cada servicio:
   - Auditoría Documental
   - Implementación de Sistema
   - Mantenimiento Mensual
   - Curso de Gestión Documental

2. Actualiza las URLs en el panel:
   - Sección: "Sesiones 1:1" → Cada sesión
   - Sección: "Curso Online" → URL del curso

### Contenido Personalizable

#### Información de la Empresa
- **Título**: "ControlDoc" (ya configurado)
- **Tagline**: "Control y gestión documental profesional para empresas"
- **Historia**: Personaliza la sección "Sobre mí"
- **Foto/Video**: Agrega tu foto profesional o video de presentación

#### Servicios
El script ya configura 3 servicios principales:
1. **Auditoría Documental** - €150
2. **Implementación de Sistema** - €250
3. **Mantenimiento Mensual** - €99/mes

#### Curso Online
- **Título**: "Curso: Gestión Documental Eficiente"
- **Precio**: €299
- **Video**: Agrega un video de presentación del curso

## 🔧 Verificación

### 1. Verificar que Funciona
1. Visita `https://controldoc.app`
2. Verifica que el título sea "ControlDoc"
3. Confirma que las sesiones aparezcan correctamente
4. Prueba el botón de Calendly

### 2. Verificar el Panel de Administración
1. Ve a `https://controldoc.app/admin`
2. Inicia sesión con las credenciales
3. Verifica que puedas editar la configuración
4. Haz un cambio de prueba y guárdalo

### 3. Verificar Firebase
1. Ve a Firebase Console → Firestore
2. Busca la colección `config`
3. Verifica que exista el documento `controldoc`
4. Confirma que los datos estén correctos

## 🚨 Solución de Problemas

### Error: "No se puede cargar la configuración"
- Verifica que las variables de entorno de Firebase estén correctas
- Confirma que Firestore esté habilitado
- Verifica las reglas de Firestore

### Error: "Dominio no reconocido"
- Verifica que `controldoc.app` esté en el mapeo de dominios
- Confirma que el DNS esté configurado correctamente
- Espera a que se propague el DNS (puede tomar hasta 24 horas)

### Error: "No se puede acceder al panel de administración"
- Verifica las credenciales de administración
- Confirma que las variables `ADMIN_USERNAME` y `ADMIN_PASSWORD` estén configuradas
- Intenta cambiar las credenciales por defecto

## 📊 Monitoreo

### Métricas a Seguir
1. **Visitas al sitio**: Google Analytics
2. **Conversiones de Calendly**: Dashboard de Calendly
3. **Ventas de Hotmart**: Dashboard de Hotmart
4. **Rendimiento**: Core Web Vitals

### Herramientas Recomendadas
- **Google Analytics**: Para tracking de visitas
- **Hotjar**: Para análisis de comportamiento
- **Sentry**: Para monitoreo de errores

## 🔄 Mantenimiento

### Actualizaciones Regulares
1. **Revisar testimonios**: Agregar nuevos testimonios mensualmente
2. **Actualizar precios**: Según la inflación y competencia
3. **Optimizar contenido**: Basado en análisis de conversiones
4. **Backup de configuración**: Exportar configuración periódicamente

### Escalabilidad
El sistema está preparado para:
- ✅ Múltiples dominios
- ✅ Diferentes configuraciones por tenant
- ✅ Panel de administración independiente
- ✅ Analytics separados por dominio

## 📞 Soporte

Si necesitas ayuda:
1. Revisa esta documentación
2. Verifica los logs de Firebase
3. Consulta el README principal del proyecto
4. Revisa la documentación de Firebase

---

**¡Listo!** Tu dominio `controldoc.app` ya está configurado con el sistema multi-tenant y listo para recibir visitantes.
