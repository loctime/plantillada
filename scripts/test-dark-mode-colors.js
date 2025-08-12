// Script para probar el gestor de colores en modo oscuro
console.log('🌙 Probando gestor de colores en modo oscuro...')

// Función para verificar el modo actual
function checkCurrentMode() {
  const root = document.documentElement
  const isDark = root.classList.contains('dark')
  const backgroundColor = getComputedStyle(root).getPropertyValue('--background-color')
  const textColor = getComputedStyle(root).getPropertyValue('--text-color')
  
  console.log(`🎯 Modo actual: ${isDark ? 'OSCURO' : 'CLARO'}`)
  console.log(`🎨 Fondo: ${backgroundColor}`)
  console.log(`🎨 Texto: ${textColor}`)
  
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
  
  // Esperar un momento y verificar
  setTimeout(() => {
    checkCurrentMode()
  }, 100)
}

// Función para probar colores específicos del modo oscuro
function testDarkModeColors() {
  console.log('\n🧪 Probando colores específicos del modo oscuro...')
  
  const root = document.documentElement
  const colors = {
    'background-color': getComputedStyle(root).getPropertyValue('--background-color'),
    'text-color': getComputedStyle(root).getPropertyValue('--text-color'),
    'section-background': getComputedStyle(root).getPropertyValue('--section-background'),
    'accent-color': getComputedStyle(root).getPropertyValue('--accent-color'),
    'card-background': getComputedStyle(root).getPropertyValue('--card-background'),
    'card-foreground': getComputedStyle(root).getPropertyValue('--card-foreground'),
    'border-color': getComputedStyle(root).getPropertyValue('--border-color'),
    'muted-background': getComputedStyle(root).getPropertyValue('--muted-background'),
    'muted-foreground': getComputedStyle(root).getPropertyValue('--muted-foreground')
  }
  
  Object.entries(colors).forEach(([name, value]) => {
    console.log(`🎨 ${name}: ${value}`)
  })
  
  return colors
}

// Función para crear un panel de prueba visual
function createTestPanel() {
  console.log('\n🎨 Creando panel de prueba visual...')
  
  // Remover panel existente si existe
  const existingPanel = document.getElementById('test-panel')
  if (existingPanel) {
    existingPanel.remove()
  }
  
  const panel = document.createElement('div')
  panel.id = 'test-panel'
  panel.style.cssText = `
    position: fixed;
    top: 20px;
    left: 20px;
    padding: 20px;
    border-radius: 8px;
    z-index: 9999;
    font-family: monospace;
    font-size: 12px;
    max-width: 300px;
    background: var(--card-background);
    color: var(--card-foreground);
    border: 1px solid var(--border-color);
    box-shadow: 0 4px 6px -1px var(--shadow-color);
  `
  
  const isDark = document.documentElement.classList.contains('dark')
  
  panel.innerHTML = `
    <div style="margin-bottom: 15px; font-weight: bold; color: var(--accent-color);">
      🎨 Panel de Prueba - Modo ${isDark ? 'OSCURO' : 'CLARO'}
    </div>
    
    <div style="margin-bottom: 10px; padding: 8px; background: var(--background-color); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 4px;">
      Fondo Principal
    </div>
    
    <div style="margin-bottom: 10px; padding: 8px; background: var(--section-background); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 4px;">
      Fondo Sección
    </div>
    
    <div style="margin-bottom: 10px; padding: 8px; background: var(--muted-background); color: var(--muted-foreground); border: 1px solid var(--border-color); border-radius: 4px;">
      Elemento Muted
    </div>
    
    <div style="margin-bottom: 10px; padding: 8px; background: var(--accent-color); color: white; border-radius: 4px;">
      Color Acento
    </div>
    
    <div style="display: flex; gap: 5px; margin-bottom: 10px;">
      <button onclick="toggleMode()" style="flex: 1; padding: 5px; background: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer;">
        ${isDark ? '☀️ Claro' : '🌙 Oscuro'}
      </button>
      <button onclick="this.parentElement.parentElement.remove()" style="flex: 1; padding: 5px; background: var(--muted-background); color: var(--muted-foreground); border: 1px solid var(--border-color); border-radius: 4px; cursor: pointer;">
        Cerrar
      </button>
    </div>
  `
  
  document.body.appendChild(panel)
}

// Verificar estado inicial
checkCurrentMode()

console.log('\n🎮 Comandos disponibles:')
console.log('- checkCurrentMode() - Verificar modo actual')
console.log('- toggleMode() - Cambiar entre modo claro/oscuro')
console.log('- testDarkModeColors() - Probar colores del modo oscuro')
console.log('- createTestPanel() - Crear panel de prueba visual')

console.log('\n💡 Instrucciones:')
console.log('1. Abre el gestor de colores')
console.log('2. Cambia entre modo claro y oscuro')
console.log('3. Verifica que los colores se actualizan correctamente')
console.log('4. Prueba las paletas en ambos modos')
