// Script para verificar la sincronización de configuración
// Ejecutar en la consola del navegador cuando esté en modo admin

console.log('🔍 Verificando sincronización de configuración...')

// Función para verificar el estado de sincronización
async function verifyConfigSync() {
  try {
    console.log('📡 Obteniendo configuración del servidor...')
    const response = await fetch('/api/config')
    
    if (!response.ok) {
      console.error('❌ Error al obtener configuración del servidor:', response.status)
      return false
    }
    
    const serverConfig = await response.json()
    console.log('✅ Configuración del servidor obtenida')
    
    // Obtener configuración del contexto local (si está disponible)
    if (typeof window !== 'undefined' && window.__NEXT_DATA__) {
      console.log('🔍 Verificando configuración del contexto...')
      
      // Intentar acceder al contexto de admin
      const adminContext = document.querySelector('[data-admin-context]')
      if (adminContext) {
        console.log('✅ Contexto de admin encontrado')
      } else {
        console.log('⚠️ Contexto de admin no encontrado')
      }
    }
    
    // Mostrar resumen de la configuración del servidor
    console.log('📋 Resumen de configuración del servidor:')
    console.log(`   - Título: ${serverConfig.site?.title || 'No definido'}`)
    console.log(`   - Tagline: ${serverConfig.site?.tagline || 'No definido'}`)
    console.log(`   - Plantillas activas: ${serverConfig.activeTemplates?.length || 0}`)
    console.log(`   - Sesiones: ${serverConfig.sessions?.length || 0}`)
    console.log(`   - Testimonios: ${serverConfig.testimonials?.length || 0}`)
    
    // Verificar si hay configuración de tema
    if (serverConfig.theme) {
      console.log('🎨 Configuración de tema encontrada')
      console.log(`   - Modo claro: ${serverConfig.theme.light ? 'Configurado' : 'No configurado'}`)
      console.log(`   - Modo oscuro: ${serverConfig.theme.dark ? 'Configurado' : 'No configurado'}`)
    }
    
    // Verificar integraciones
    if (serverConfig.integrations) {
      console.log('🔗 Integraciones:')
      console.log(`   - Calendly: ${serverConfig.integrations.calendlyUrl || 'No configurado'}`)
      console.log(`   - Hotmart: ${serverConfig.integrations.hotmartBaseUrl || 'No configurado'}`)
    }
    
    return true
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error)
    return false
  }
}

// Función para comparar configuraciones
async function compareConfigs() {
  try {
    console.log('🔄 Comparando configuraciones...')
    
    // Obtener configuración del servidor
    const serverResponse = await fetch('/api/config')
    const serverConfig = await serverResponse.json()
    
    // Obtener configuración del localStorage (cache local)
    const localCache = localStorage.getItem('config-cache')
    let localConfig = null
    
    if (localCache) {
      try {
        localConfig = JSON.parse(localCache)
        console.log('📦 Cache local encontrado')
      } catch (e) {
        console.log('⚠️ Error al parsear cache local')
      }
    } else {
      console.log('📦 No hay cache local')
    }
    
    // Comparar configuraciones
    if (localConfig) {
      const isSynced = JSON.stringify(serverConfig) === JSON.stringify(localConfig)
      console.log(`🔄 Estado de sincronización: ${isSynced ? '✅ Sincronizado' : '❌ Desincronizado'}`)
      
      if (!isSynced) {
        console.log('🔍 Diferencias encontradas:')
        
        // Comparar campos específicos
        const fields = ['site', 'sessions', 'course', 'about', 'testimonials', 'theme']
        fields.forEach(field => {
          if (JSON.stringify(serverConfig[field]) !== JSON.stringify(localConfig[field])) {
            console.log(`   - ${field}: Diferente`)
          }
        })
      }
    }
    
    return true
    
  } catch (error) {
    console.error('❌ Error durante la comparación:', error)
    return false
  }
}

// Función para forzar sincronización
async function forceSync() {
  try {
    console.log('🔄 Forzando sincronización...')
    
    // Recargar configuración desde el servidor
    const response = await fetch('/api/config')
    if (response.ok) {
      const config = await response.json()
      
      // Actualizar cache local
      localStorage.setItem('config-cache', JSON.stringify(config))
      console.log('✅ Cache local actualizado')
      
      // Recargar la página para aplicar cambios
      console.log('🔄 Recargando página para aplicar cambios...')
      setTimeout(() => {
        window.location.reload()
      }, 1000)
      
      return true
    } else {
      console.error('❌ Error al obtener configuración del servidor')
      return false
    }
    
  } catch (error) {
    console.error('❌ Error durante la sincronización forzada:', error)
    return false
  }
}

// Función principal de verificación
async function runFullVerification() {
  console.log('🚀 Iniciando verificación completa...')
  console.log('=' .repeat(50))
  
  const step1 = await verifyConfigSync()
  console.log('=' .repeat(50))
  
  const step2 = await compareConfigs()
  console.log('=' .repeat(50))
  
  if (step1 && step2) {
    console.log('✅ Verificación completada exitosamente')
  } else {
    console.log('❌ Verificación completada con errores')
  }
  
  console.log('=' .repeat(50))
  console.log('📚 Comandos disponibles:')
  console.log('   - verifyConfigSync() - Verificar configuración del servidor')
  console.log('   - compareConfigs() - Comparar configuraciones')
  console.log('   - forceSync() - Forzar sincronización')
  console.log('   - runFullVerification() - Ejecutar verificación completa')
}

// Ejecutar verificación automáticamente
runFullVerification()

// Exportar funciones para uso manual
window.verifyConfigSync = verifyConfigSync
window.compareConfigs = compareConfigs
window.forceSync = forceSync
window.runFullVerification = runFullVerification

console.log('🎯 Script de verificación cargado. Usa runFullVerification() para verificar.')
