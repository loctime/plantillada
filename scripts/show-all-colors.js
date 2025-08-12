// Script para mostrar todos los colores que podemos manejar
console.log('🎨 Todos los colores que podemos manejar:')

// Definir todos los colores disponibles
const allColors = {
  // Colores principales (actuales)
  'Colores Principales': {
    'backgroundColor': 'Fondo principal de la página',
    'sectionBackground': 'Fondo de las secciones',
    'navbarBackground': 'Fondo de la barra de navegación',
    'textColor': 'Color del texto principal',
    'accentColor': 'Color de acento'
  },
  
  // Colores de botones (actuales)
  'Colores de Botones': {
    'primaryButtonColor': 'Color del botón primario',
    'secondaryButtonColor': 'Color del botón secundario',
    'outlineButtonColor': 'Color del botón outline'
  },
  
  // Nuevos colores de UI Components
  'Componentes UI': {
    'cardBackground': 'Fondo de tarjetas',
    'cardForeground': 'Texto de tarjetas',
    'popoverBackground': 'Fondo de popups',
    'popoverForeground': 'Texto de popups',
    'mutedBackground': 'Fondo de elementos muted',
    'mutedForeground': 'Texto de elementos muted',
    'borderColor': 'Color de bordes',
    'inputBackground': 'Fondo de campos de entrada',
    'ringColor': 'Color de anillos de focus'
  },
  
  // Colores de estado
  'Colores de Estado': {
    'destructiveColor': 'Color de error/destructivo',
    'destructiveForeground': 'Texto sobre color destructivo',
    'successColor': 'Color de éxito',
    'successForeground': 'Texto sobre color de éxito',
    'warningColor': 'Color de advertencia',
    'warningForeground': 'Texto sobre color de advertencia',
    'infoColor': 'Color de información',
    'infoForeground': 'Texto sobre color de información'
  },
  
  // Colores de navegación
  'Colores de Navegación': {
    'sidebarBackground': 'Fondo de barra lateral',
    'sidebarForeground': 'Texto de barra lateral',
    'sidebarPrimary': 'Color primario de sidebar',
    'sidebarPrimaryForeground': 'Texto sobre color primario de sidebar',
    'sidebarAccent': 'Color de acento de sidebar',
    'sidebarAccentForeground': 'Texto sobre acento de sidebar',
    'sidebarBorder': 'Borde de sidebar',
    'sidebarRing': 'Anillo de focus de sidebar'
  },
  
  // Colores de tipografía
  'Colores de Tipografía': {
    'headingColor': 'Color de títulos',
    'subtitleColor': 'Color de subtítulos',
    'linkColor': 'Color de enlaces',
    'linkHoverColor': 'Color de enlaces al pasar el mouse'
  },
  
  // Colores de elementos específicos
  'Elementos Específicos': {
    'footerBackground': 'Fondo del pie de página',
    'headerBackground': 'Fondo del encabezado',
    'modalBackground': 'Fondo de modales',
    'tooltipBackground': 'Fondo de tooltips',
    'tooltipForeground': 'Texto de tooltips'
  },
  
  // Colores de gradientes y efectos
  'Gradientes y Efectos': {
    'gradientStart': 'Color inicial del gradiente',
    'gradientEnd': 'Color final del gradiente',
    'gradientDirection': 'Dirección del gradiente',
    'shadowColor': 'Color de sombras',
    'shadowOpacity': 'Opacidad de sombras'
  }
}

// Mostrar todos los colores
Object.entries(allColors).forEach(([category, colors]) => {
  console.log(`\n📋 ${category}:`)
  Object.entries(colors).forEach(([colorName, description]) => {
    console.log(`   🎨 ${colorName}: ${description}`)
  })
})

// Función para aplicar un color específico
function applyColor(colorName, value) {
  const root = document.documentElement
  const cssVar = `--${colorName.replace(/([A-Z])/g, '-$1').toLowerCase()}`
  
  root.style.setProperty(cssVar, value)
  console.log(`✅ Aplicado: ${cssVar} = ${value}`)
}

// Función para mostrar el valor actual de un color
function getColorValue(colorName) {
  const root = document.documentElement
  const cssVar = `--${colorName.replace(/([A-Z])/g, '-$1').toLowerCase()}`
  const value = getComputedStyle(root).getPropertyValue(cssVar)
  
  console.log(`🎨 ${colorName}: ${value}`)
  return value
}

// Función para probar colores de estado
function testStateColors() {
  console.log('\n🧪 Probando colores de estado...')
  
  // Crear elementos de prueba
  const testDiv = document.createElement('div')
  testDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 20px;
    border-radius: 8px;
    z-index: 9999;
    font-family: monospace;
    font-size: 12px;
    max-width: 300px;
  `
  
  testDiv.innerHTML = `
    <div style="margin-bottom: 10px; padding: 5px; background: var(--success-color); color: var(--success-foreground);">✅ Éxito</div>
    <div style="margin-bottom: 10px; padding: 5px; background: var(--warning-color); color: var(--warning-foreground);">⚠️ Advertencia</div>
    <div style="margin-bottom: 10px; padding: 5px; background: var(--destructive-color); color: var(--destructive-foreground);">❌ Error</div>
    <div style="margin-bottom: 10px; padding: 5px; background: var(--info-color); color: var(--info-foreground);">ℹ️ Información</div>
    <button onclick="this.parentElement.remove()" style="width: 100%; padding: 5px; background: var(--muted-background); color: var(--muted-foreground); border: 1px solid var(--border-color); border-radius: 4px;">Cerrar</button>
  `
  
  document.body.appendChild(testDiv)
}

console.log('\n🎮 Comandos disponibles:')
console.log('- applyColor("colorName", "value") - Aplicar un color específico')
console.log('- getColorValue("colorName") - Obtener valor actual de un color')
console.log('- testStateColors() - Probar colores de estado')

console.log('\n💡 Ejemplos:')
console.log('- applyColor("headingColor", "#ff0000") - Títulos rojos')
console.log('- applyColor("linkColor", "#00ff00") - Enlaces verdes')
console.log('- getColorValue("accentColor") - Ver color de acento actual')
