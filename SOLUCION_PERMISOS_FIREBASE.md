# 🔧 Solución: Error "Missing or insufficient permissions" en Firebase

## 🚨 Problema Identificado

El error `FirebaseError: Missing or insufficient permissions` indica que las **reglas de seguridad de Firestore** no permiten las operaciones de escritura necesarias para:

1. **Crear backups** en la colección `backups`
2. **Guardar configuraciones** en la colección `config`
3. **Aplicar diseños** que requieren escritura en Firestore

## 🔍 Causa Raíz

Las reglas de Firestore por defecto **bloquean todas las operaciones** por seguridad. Necesitas configurar reglas específicas para permitir las operaciones de tu aplicación.

## ✅ Solución Paso a Paso

### 1. **Acceder a Firebase Console**

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Firestore Database** en el menú lateral
4. Haz clic en la pestaña **"Reglas"**

### 2. **Actualizar las Reglas de Firestore**

**REEMPLAZA** completamente las reglas existentes con estas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir acceso total a la colección config
    match /config/{document} {
      allow read, write: if true;
    }
    
    // Permitir acceso total a la colección backups
    match /backups/{document} {
      allow read, write: if true;
    }
    
    // Permitir acceso total a la colección tenants
    match /tenants/{document} {
      allow read, write: if true;
    }
    
    // Bloquear acceso a otras colecciones por seguridad
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 3. **Publicar las Reglas**

1. Haz clic en **"Publicar"** para aplicar los cambios
2. Espera unos segundos para que se propaguen

### 4. **Verificar Variables de Entorno**

Asegúrate de que tu archivo `.env.local` tenga todas las variables necesarias:

```bash
# Firebase Configuration
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

### 5. **Probar la Solución**

Ejecuta el script de diagnóstico:

```bash
node scripts/fix-firebase-permissions.js
```

## 🔧 Solución Temporal (Ya Implementada)

Si no puedes actualizar las reglas inmediatamente, **ya hemos implementado una solución temporal**:

- Los backups fallarán silenciosamente y se crearán localmente
- La aplicación seguirá funcionando normalmente
- Solo los backups no se guardarán en Firebase

## 🛡️ Seguridad para Producción

Para **producción**, considera estas reglas más seguras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir acceso solo desde dominios específicos
    match /config/{document} {
      allow read, write: if request.auth != null || 
        request.origin.matches('https://tu-dominio.com');
    }
    
    match /backups/{document} {
      allow read, write: if request.auth != null || 
        request.origin.matches('https://tu-dominio.com');
    }
    
    match /tenants/{document} {
      allow read, write: if request.auth != null || 
        request.origin.matches('https://tu-dominio.com');
    }
  }
}
```

## 🚨 Errores Comunes

### Error: "Invalid resource field value"
- **Causa**: Variables de entorno de Firebase mal configuradas
- **Solución**: Verificar que todas las variables estén correctas

### Error: "Failed to get document because the client is offline"
- **Causa**: Problemas de conectividad o configuración
- **Solución**: Verificar conexión a internet y configuración de Firebase

### Error: "Permission denied"
- **Causa**: Reglas de Firestore muy restrictivas
- **Solución**: Actualizar las reglas como se muestra arriba

## 📞 Soporte

Si el problema persiste:

1. **Verifica la configuración** con el script de diagnóstico
2. **Revisa los logs** en Firebase Console
3. **Confirma que las reglas** se hayan publicado correctamente
4. **Espera unos minutos** para que los cambios se propaguen

## ✅ Verificación Final

Después de aplicar la solución:

1. ✅ No más errores de "Missing or insufficient permissions"
2. ✅ Los backups se crean correctamente en Firebase
3. ✅ Los diseños se aplican sin errores
4. ✅ El panel de administración funciona normalmente

---

**¿Necesitas más ayuda?** Revisa la documentación completa en `FIREBASE_SETUP.md`
