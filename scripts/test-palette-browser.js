// Script para probar las paletas de colores en el navegador
console.log('🎨 Probando paletas de colores en el navegador...')

// Función para verificar el modo actual
function checkCurrentMode() {
  const root = document.documentElement
  const isDark = root.classList.contains('dark')
  console.log(`🎯 Modo actual: ${isDark ? 'OSCURO' : 'CLARO'}`)
  return isDark
}

// Función para cambiar modo manualmente
function toggleMode() {
  const root = document.documentElement
  const isDark = root.classList.contains('dark')
  
  if (isDark) {
    root.classList.remove('dark')
    console.log('☀️ Cambiado a modo CLARO')
  } else {
    root.classList.add('dark')
    console.log('🌙 Cambiado a modo OSCURO')
  }
  
  setTimeout(() => {
    checkCurrentMode()
    showCurrentColors()
  }, 100)
}

// Función para mostrar colores actuales
function showCurrentColors() {
  const root = document.documentElement
  const computedStyle = getComputedStyle(root)
  
  console.log('\n🎨 Colores actuales:')
  console.log('--background-color:', computedStyle.getPropertyValue('--background-color'))
  console.log('--text-color:', computedStyle.getPropertyValue('--text-color'))
  console.log('--accent-color:', computedStyle.getPropertyValue('--accent-color'))
  console.log('--section-background:', computedStyle.getPropertyValue('--section-background'))
  console.log('--primary-button-color:', computedStyle.getPropertyValue('--primary-button-color'))
  console.log('--secondary-button-color:', computedStyle.getPropertyValue('--secondary-button-color'))
}

// Función para aplicar una paleta específica
function applyPalette(paletteName) {
  console.log(`\n🎨 Aplicando paleta: ${paletteName}`)
  
  const palettes = {
    'default': {
      light: {
        backgroundColor: '#ffffff',
        sectionBackground: '#f8fafc',
        navbarBackground: '#ffffff',
        textColor: '#1e293b',
        accentColor: '#10b981',
        primaryButtonColor: '#10b981',
        secondaryButtonColor: '#3b82f6',
        outlineButtonColor: '#6b7280'
      },
      dark: {
        backgroundColor: '#0f172a',
        sectionBackground: '#1e293b',
        navbarBackground: '#0f172a',
        textColor: '#f1f5f9',
        accentColor: '#10b981',
        primaryButtonColor: '#10b981',
        secondaryButtonColor: '#3b82f6',
        outlineButtonColor: '#9ca3af'
      }
    },
    'abogados': {
      light: {
        backgroundColor: '#fafafa',
        sectionBackground: '#f5f5f5',
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
        backgroundColor: '#faf5ff',
        sectionBackground: '#f3e8ff',
        navbarBackground: '#ffffff',
        textColor: '#1e293b',
        accentColor: '#8b5cf6',
        primaryButtonColor: '#6366f1',
        secondaryButtonColor: '#8b5cf6',
        outlineButtonColor: '#8b5cf6'
      },
      dark: {
        backgroundColor: '#1a0b2e',
        sectionBackground: '#1e293b',
        navbarBackground: '#1a0b2e',
        textColor: '#f1f5f9',
        accentColor: '#8b5cf6',
        primaryButtonColor: '#6366f1',
        secondaryButtonColor: '#8b5cf6',
        outlineButtonColor: '#a78bfa'
      }
    }
  }
  
  const palette = palettes[paletteName]
  if (!palette) {
    console.log(`❌ Paleta ${paletteName} no encontrada`)
    return
  }
  
  const isDark = document.documentElement.classList.contains('dark')
  const colors = isDark ? palette.dark : palette.light
  
  console.log(`Aplicando colores para modo ${isDark ? 'oscuro' : 'claro'}:`, colors)
  
  const root = document.documentElement
  Object.entries(colors).forEach(([key, value]) => {
    const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
    root.style.setProperty(cssVar, value)
    console.log(`✅ ${cssVar} = ${value}`)
  })
  
  // Aplicar también al body
  if (colors.backgroundColor) {
    document.body.style.backgroundColor = colors.backgroundColor
  }
  if (colors.textColor) {
    document.body.style.color = colors.textColor
  }
  
  console.log('✅ Paleta aplicada exitosamente')
  showCurrentColors()
}

// Función para crear un panel de prueba visual
function createPaletteTestPanel() {
  console.log('\n🎨 Creando panel de prueba de paletas...')
  
  // Remover panel existente si existe
  const existingPanel = document.getElementById('palette-test-panel')
  if (existingPanel) {
    existingPanel.remove()
  }
  
  const panel = document.createElement('div')
  panel.id = 'palette-test-panel'
  panel.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 20px;
    border-radius: 8px;
    z-index: 9999;
    font-family: monospace;
    font-size: 12px;
    max-width: 300px;
    background: var(--card-background, #ffffff);
    color: var(--card-foreground, #000000);
    border: 1px solid var(--border-color, #e5e7eb);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  `
  
  const isDark = document.documentElement.classList.contains('dark')
  
  panel.innerHTML = `
    <div style="margin-bottom: 15px; font-weight: bold; color: var(--accent-color, #10b981);">
      🎨 Test Paletas - Modo ${isDark ? 'OSCURO' : 'CLARO'}
    </div>
    
    <div style="margin-bottom: 10px;">
      <button onclick="applyPalette('default')" style="width: 100%; padding: 8px; margin-bottom: 5px; background: var(--accent-color, #10b981); color: white; border: none; border-radius: 4px; cursor: pointer;">
        🎨 Por Defecto
      </button>
      <button onclick="applyPalette('abogados')" style="width: 100%; padding: 8px; margin-bottom: 5px; background: var(--accent-color, #10b981); color: white; border: none; border-radius: 4px; cursor: pointer;">
        ⚖️ Abogados
      </button>
      <button onclick="applyPalette('psicologos')" style="width: 100%; padding: 8px; margin-bottom: 5px; background: var(--accent-color, #10b981); color: white; border: none; border-radius: 4px; cursor: pointer;">
        🧠 Psicólogos
      </button>
    </div>
    
    <div style="margin-bottom: 10px;">
      <button onclick="toggleMode()" style="width: 100%; padding: 8px; margin-bottom: 5px; background: var(--muted-background, #f3f4f6); color: var(--muted-foreground, #374151); border: 1px solid var(--border-color, #e5e7eb); border-radius: 4px; cursor: pointer;">
        ${isDark ? '☀️ Cambiar a Claro' : '🌙 Cambiar a Oscuro'}
      </button>
    </div>
    
    <div style="margin-bottom: 10px;">
      <button onclick="showCurrentColors()" style="width: 100%; padding: 8px; margin-bottom: 5px; background: var(--muted-background, #f3f4f6); color: var(--muted-foreground, #374151); border: 1px solid var(--border-color, #e5e7eb); border-radius: 4px; cursor: pointer;">
        📊 Ver Colores Actuales
      </button>
    </div>
    
    <button onclick="this.parentElement.remove()" style="width: 100%; padding: 8px; background: var(--destructive-color, #ef4444); color: white; border: none; border-radius: 4px; cursor: pointer;">
      ❌ Cerrar
    </button>
  `
  
  document.body.appendChild(panel)
}

// Verificar estado inicial
checkCurrentMode()
showCurrentColors()

console.log('\n🎮 Comandos disponibles:')
console.log('- checkCurrentMode() - Verificar modo actual')
console.log('- toggleMode() - Cambiar entre modo claro/oscuro')
console.log('- showCurrentColors() - Mostrar colores actuales')
console.log('- applyPalette("nombre") - Aplicar paleta específica')
console.log('- createPaletteTestPanel() - Crear panel de prueba')

console.log('\n💡 Paletas disponibles:')
console.log('- applyPalette("default") - Paleta por defecto')
console.log('- applyPalette("abogados") - Paleta de abogados')
console.log('- applyPalette("psicologos") - Paleta de psicólogos')

console.log('\n🔧 Instrucciones:')
console.log('1. Ejecuta createPaletteTestPanel() para crear el panel de prueba')
console.log('2. Cambia entre modo claro y oscuro')
console.log('3. Prueba las diferentes paletas')
console.log('4. Verifica que los colores cambian correctamente en ambos modos')
