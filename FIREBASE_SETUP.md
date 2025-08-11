# Configuración de Firebase

Para resolver el error 500 en producción, hemos migrado la configuración del sitio a Firestore.

## Pasos para configurar Firebase:

### 1. Crear proyecto en Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o usa uno existente
3. Habilita Firestore Database en tu proyecto

### 2. Obtener las credenciales
1. En Firebase Console, ve a Configuración del proyecto > General
2. En la sección "Tus apps", crea una nueva app web
3. Copia las credenciales de configuración

### 3. Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto con:

```
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 4. Configurar reglas de Firestore (IMPORTANTE)
En Firebase Console > Firestore Database > Reglas, **REEMPLAZA** las reglas existentes con:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /config/{document} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ IMPORTANTE:** Estas reglas permiten acceso total. Para producción, considera agregar autenticación.

### 5. Migrar configuración existente
Si ya tienes un archivo `config.json`, puedes migrar los datos manualmente:
1. Ve a Firestore Database en Firebase Console
2. Crea una colección llamada `config`
3. Crea un documento con ID `site`
4. Crea un campo llamado `data` de tipo `string`
5. Copia el contenido de tu `config.json` actual como valor del campo `data`

## Beneficios de esta solución:
- ✅ Funciona en producción (Vercel, Netlify, etc.)
- ✅ Datos persistentes y seguros
- ✅ Actualizaciones en tiempo real
- ✅ Escalable y confiable
- ✅ No depende del sistema de archivos del servidor

## Nota importante:
Recuerda agregar las variables de entorno en tu plataforma de hosting (Vercel, Netlify, etc.) para que funcionen en producción.
