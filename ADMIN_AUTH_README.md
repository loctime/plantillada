# Sistema de Autenticación de Admin

## Descripción

Se ha implementado un sistema de autenticación para el panel de administración que permite:

1. **Acceso fácil**: Enlace "Admin" en la barra de navegación que abre un modal de login
2. **Sesión persistente**: Una vez autenticado, el enlace cambia a un acceso directo a `/admin`
3. **No re-autenticación**: La sesión se mantiene activa por 24 horas
4. **Logout**: Botón para cerrar sesión tanto en `/admin` como en el modo admin
5. **Modo admin protegido**: Los botones del modo admin solo aparecen cuando el usuario está autenticado

## Componentes Creados

### 1. `AdminLoginModal` (`components/admin-login-modal.tsx`)
- Modal de login reutilizable
- Credenciales: `admin` / `admin123`
- Guarda estado en localStorage
- Manejo de errores y loading states

### 2. `useAdminAuth` (`hooks/use-admin-auth.ts`)
- Hook personalizado para manejar autenticación
- **Sistema reactivo**: Los componentes se actualizan automáticamente al cambiar la autenticación
- Verificación automática de sesión expirada (24h)
- Funciones: `login()`, `logout()`, `checkAuth()`
- Eventos personalizados para sincronización entre componentes

### 3. `AdminAuthStatus` (`components/admin-auth-status.tsx`)
- Muestra estado de autenticación en modo admin
- Tiempo restante de sesión
- Botón de logout rápido

## Modificaciones Realizadas

### 1. `DynamicNavigation` (`components/dynamic-navigation.tsx`)
- Agrega enlace "Admin" en la navegación
- Si no autenticado: abre modal de login
- Si autenticado: enlace directo a `/admin`

### 2. `AdminPage` (`app/admin/page.tsx`)
- Eliminado formulario de login local
- Usa sistema de autenticación global
- Agregado botón "Cerrar Sesión"
- Redirección automática si no autenticado

### 3. `AdminToggle` (`components/admin-toggle.tsx`)
- **Completamente oculto si no está autenticado**: No se renderiza nada hasta que el usuario se loguee
- **Layout compacto**: Botón "Admin" y estado de autenticación en la misma fila
- **Botón separado para gestor de colores**: No molesta cuando se editan otras cosas
- **Gestor de colores optimizado**: Scroll interno y tamaño compacto para pantallas normales
- Agregado indicador de estado de autenticación
- Muestra tiempo restante de sesión
- **Botones del modo admin protegidos**: Solo aparecen cuando el usuario está autenticado
- **Atajo de teclado protegido**: Ctrl+Shift+A solo funciona si está autenticado



### 4. `AdminDebug` (`components/admin-debug.tsx`)
- **Completamente oculto si no está autenticado**: No se renderiza nada hasta que el usuario se loguee
- Muestra estado del modo admin y botón de toggle
- Solo visible para usuarios autenticados

## Flujo de Usuario

### Login
1. Usuario hace clic en "Admin" en la barra de navegación
2. Se abre modal de login
3. Ingresa credenciales: `admin` / `admin123`
4. Al autenticarse exitosamente:
   - Se guarda estado en localStorage
   - **Los componentes se actualizan automáticamente** (no requiere refrescar)
   - Se cierra el modal
   - El enlace "Admin" cambia a acceso directo a `/admin`
   - Los botones del modo admin aparecen inmediatamente

### Sesión Activa
- La sesión dura 24 horas automáticamente
- El usuario puede acceder directamente a `/admin`
- Se muestra estado de autenticación en modo admin
- Tiempo restante visible en el indicador
- **Botones del modo admin habilitados**: Botón "Colores" separado, indicadores de guardado, etc.
- **Atajo de teclado habilitado**: Ctrl+Shift+A funciona para activar modo admin

### Logout
- Botón "Cerrar Sesión" en `/admin`
- Botón de logout rápido en el indicador de estado
- Al hacer logout:
  - Se limpia localStorage
  - Se redirige a página principal
  - El enlace "Admin" vuelve a abrir modal de login

## Características Técnicas

### Seguridad
- Credenciales hardcodeadas (para desarrollo)
- Sesión con expiración automática
- Verificación de autenticación en cada carga

### Persistencia
- Estado guardado en localStorage
- Timestamp de login para calcular expiración
- Recuperación automática de sesión

### UX
- Modal de login elegante
- Indicadores visuales de estado
- Tiempo restante de sesión
- Transiciones suaves
- **Actualización reactiva**: Los componentes se actualizan automáticamente sin refrescar
- **Layout compacto**: Botón admin y estado de autenticación en la misma fila para ahorrar espacio vertical
- **Gestor de colores optimizado**: Scroll interno y diseño compacto para mejor usabilidad

## Archivos de Prueba

### `scripts/test-admin-auth.js`
Script de prueba que simula el flujo completo de autenticación:
- Estado inicial
- Login
- Verificación de sesión
- Logout
- Instrucciones para probar en navegador

## Instrucciones de Uso

1. **Acceder al admin**:
   - Ve a la página principal
   - Haz clic en "Admin" en la barra de navegación
   - Ingresa: usuario `admin`, contraseña `admin123`

2. **Usar el panel**:
   - Una vez autenticado, "Admin" será un enlace directo
   - Accede a `/admin` para configurar el sitio
   - Usa el botón "Cerrar Sesión" cuando termines

3. **Modo admin**:
   - **Completamente oculto hasta que te loguees**
   - Presiona `Ctrl+Shift+A` para activar modo admin (requiere autenticación)
   - Verás indicador de estado de autenticación
   - Tiempo restante de sesión visible
   - Botón "Colores" separado para gestionar colores sin molestar
   - Botones del modo admin (indicadores) solo aparecen si estás logueado

## Notas de Desarrollo

- Las credenciales están hardcodeadas para simplicidad
- En producción, se debería implementar autenticación real
- El sistema es compatible con el modo admin existente
- No afecta la funcionalidad de otros componentes
