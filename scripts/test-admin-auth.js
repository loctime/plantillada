// Script de prueba para el sistema de autenticación de admin
console.log('🧪 Probando sistema de autenticación de admin...')

// Simular localStorage
const mockLocalStorage = {
  data: {},
  getItem(key) {
    return this.data[key] || null
  },
  setItem(key, value) {
    this.data[key] = value
    console.log(`💾 localStorage.setItem('${key}', '${value}')`)
  },
  removeItem(key) {
    delete this.data[key]
    console.log(`🗑️ localStorage.removeItem('${key}')`)
  }
}

// Simular window
global.window = {
  localStorage: mockLocalStorage
}

// Función de prueba para verificar autenticación
function testAuth() {
  console.log('\n📋 Estado inicial:')
  console.log('admin-authenticated:', mockLocalStorage.getItem('admin-authenticated'))
  console.log('admin-login-time:', mockLocalStorage.getItem('admin-login-time'))
  
  // Simular login
  console.log('\n🔐 Simulando login...')
  mockLocalStorage.setItem('admin-authenticated', 'true')
  mockLocalStorage.setItem('admin-login-time', Date.now().toString())
  
  console.log('\n✅ Después del login:')
  console.log('admin-authenticated:', mockLocalStorage.getItem('admin-authenticated'))
  console.log('admin-login-time:', mockLocalStorage.getItem('admin-login-time'))
  
  // Verificar autenticación
  const authStatus = mockLocalStorage.getItem('admin-authenticated')
  const loginTime = mockLocalStorage.getItem('admin-login-time')
  
  if (authStatus === 'true' && loginTime) {
    const loginTimestamp = parseInt(loginTime)
    const currentTime = Date.now()
    const hoursSinceLogin = (currentTime - loginTimestamp) / (1000 * 60 * 60)
    
    console.log(`\n⏰ Horas desde el login: ${hoursSinceLogin.toFixed(2)}`)
    
    if (hoursSinceLogin < 24) {
      console.log('✅ Usuario autenticado y sesión válida')
    } else {
      console.log('❌ Sesión expirada')
    }
  } else {
    console.log('❌ Usuario no autenticado')
  }
  
  // Simular logout
  console.log('\n🚪 Simulando logout...')
  mockLocalStorage.removeItem('admin-authenticated')
  mockLocalStorage.removeItem('admin-login-time')
  
  console.log('\n❌ Después del logout:')
  console.log('admin-authenticated:', mockLocalStorage.getItem('admin-authenticated'))
  console.log('admin-login-time:', mockLocalStorage.getItem('admin-login-time'))
}

// Ejecutar prueba
testAuth()

console.log('\n🎉 Prueba completada!')
console.log('\n📝 Instrucciones para probar en el navegador:')
console.log('1. Ve a la página principal')
console.log('2. Haz clic en "Admin" en la barra de navegación')
console.log('3. Ingresa usuario: admin, contraseña: admin123')
console.log('4. Una vez autenticado, verás "Admin" como enlace directo a /admin')
console.log('5. En /admin, verás un botón "Cerrar Sesión"')
console.log('6. La sesión dura 24 horas automáticamente')
console.log('7. **NUEVO**: El componente AdminToggle está completamente oculto si no estás autenticado')
console.log('8. **NUEVO**: El componente AdminDebug está completamente oculto si no estás autenticado')
console.log('9. **NUEVO**: Los botones del modo admin solo aparecen si estás autenticado')
console.log('10. **NUEVO**: Ctrl+Shift+A solo funciona si estás autenticado')
console.log('11. **NUEVO**: Sistema reactivo - los componentes se actualizan automáticamente al loguearse')
console.log('12. **NUEVO**: Layout compacto - botón admin y estado de autenticación en la misma fila')
console.log('13. **NUEVO**: Botón "Colores" separado - no molesta cuando se editan otras cosas')
console.log('14. **NUEVO**: Gestor de colores optimizado - scroll interno y diseño compacto')
