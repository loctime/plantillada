const fs = require('fs')
const path = require('path')

// Colores específicos de las plantillas (copiados del ThemeManager)
const templateThemes = {
  'estudio-contable': {
    light: {
      backgroundColor: '#ffffff',
      sectionBackground: '#f8fafc',
      navbarBackground: '#ffffff',
      textColor: '#1e293b',
      accentColor: '#f59e0b',
      primaryButtonColor: '#1e40af',
      secondaryButtonColor: '#64748b',
      outlineButtonColor: '#64748b'
    },
    dark: {
      backgroundColor: '#0f172a',
      sectionBackground: '#1e293b',
      navbarBackground: '#0f172a',
      textColor: '#f1f5f9',
      accentColor: '#f59e0b',
      primaryButtonColor: '#1e40af',
      secondaryButtonColor: '#64748b',
      outlineButtonColor: '#9ca3af'
    }
  },
  'estudio-abogados-premium': {
    light: {
      backgroundColor: '#ffffff',
      sectionBackground: '#f8f9fa',
      navbarBackground: '#ffffff',
      textColor: '#1a1a1a',
      accentColor: '#d4af37',
      primaryButtonColor: '#1a1a1a',
      secondaryButtonColor: '#8b8b8b',
      outlineButtonColor: '#8b8b8b'
    },
    dark: {
      backgroundColor: '#0f0f0f',
      sectionBackground: '#1a1a1a',
      navbarBackground: '#0f0f0f',
      textColor: '#f5f5f5',
      accentColor: '#d4af37',
      primaryButtonColor: '#d4af37',
      secondaryButtonColor: '#8b8b8b',
      outlineButtonColor: '#8b8b8b'
    }
  },
  'psicologos': {
    light: {
      backgroundColor: '#fafafa',
      sectionBackground: '#ffffff',
      navbarBackground: '#ffffff',
      textColor: '#374151',
      accentColor: '#8b5cf6',
      primaryButtonColor: '#6366f1',
      secondaryButtonColor: '#64748b',
      outlineButtonColor: '#8b5cf6'
    },
    dark: {
      backgroundColor: '#111827',
      sectionBackground: '#1f2937',
      navbarBackground: '#111827',
      textColor: '#f9fafb',
      accentColor: '#8b5cf6',
      primaryButtonColor: '#6366f1',
      secondaryButtonColor: '#64748b',
      outlineButtonColor: '#a78bfa'
    }
  }
}

// Función para obtener el tema activo (simulando la lógica del ThemeManager)
function getActiveTheme(selectedDesigns, configTheme) {
  if (!selectedDesigns) {
    console.log('🎨 No hay diseños seleccionados, usando tema por defecto')
    return null
  }

  const activeDesignId = selectedDesigns.landing
  if (!activeDesignId) {
    console.log('🎨 No hay diseño activo para landing, usando tema por defecto')
    return null
  }

  const templateTheme = templateThemes[activeDesignId]
  if (templateTheme) {
    console.log(`🎨 Usando tema específico para ${activeDesignId}`)
    return templateTheme
  }

  if (configTheme) {
    console.log('🎨 Usando tema de la configuración guardada')
    return configTheme
  }

  console.log('🎨 Usando tema por defecto')
  return null
}

// Función para mostrar los colores de un tema
function displayThemeColors(theme, themeName) {
  console.log(`\n🎨 Colores del tema: ${themeName}`)
  console.log('=' * 50)
  
  console.log('\n📱 Modo Claro:')
  Object.entries(theme.light).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`)
  })
  
  console.log('\n🌙 Modo Oscuro:')
  Object.entries(theme.dark).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`)
  })
}

// Función principal de prueba
function testThemeColors() {
  console.log('🧪 Probando sistema de colores de plantillas...\n')
  
  // Caso 1: Estudio de Abogados
  console.log('📋 Caso 1: Estudio de Abogados')
  const abogadosConfig = {
    selectedDesigns: { landing: 'estudio-abogados-premium' },
    theme: null
  }
  
  const abogadosTheme = getActiveTheme(abogadosConfig.selectedDesigns, abogadosConfig.theme)
  if (abogadosTheme) {
    displayThemeColors(abogadosTheme, 'Estudio de Abogados')
  }
  
  // Caso 2: Psicólogos
  console.log('\n📋 Caso 2: Psicólogos')
  const psicologosConfig = {
    selectedDesigns: { landing: 'psicologos' },
    theme: null
  }
  
  const psicologosTheme = getActiveTheme(psicologosConfig.selectedDesigns, psicologosConfig.theme)
  if (psicologosTheme) {
    displayThemeColors(psicologosTheme, 'Psicólogos')
  }
  
  // Caso 3: Estudio Contable
  console.log('\n📋 Caso 3: Estudio Contable')
  const contableConfig = {
    selectedDesigns: { landing: 'estudio-contable' },
    theme: null
  }
  
  const contableTheme = getActiveTheme(contableConfig.selectedDesigns, contableConfig.theme)
  if (contableTheme) {
    displayThemeColors(contableTheme, 'Estudio Contable')
  }
  
  // Caso 4: Sin diseño seleccionado
  console.log('\n📋 Caso 4: Sin diseño seleccionado')
  const noDesignConfig = {
    selectedDesigns: null,
    theme: null
  }
  
  const noDesignTheme = getActiveTheme(noDesignConfig.selectedDesigns, noDesignConfig.theme)
  if (noDesignTheme) {
    displayThemeColors(noDesignTheme, 'Sin diseño')
  } else {
    console.log('✅ Correcto: No se encontró tema (usará tema por defecto)')
  }
  
  console.log('\n✅ Pruebas completadas!')
}

// Ejecutar las pruebas
testThemeColors()
