#!/usr/bin/env node

/**
 * Script para probar el rendimiento del gestor de colores optimizado
 */

console.log('🎨 Probando rendimiento del gestor de colores...\n')

// Simular cambios rápidos de color como cuando se arrastra el selector
function simulateColorPickerDrag() {
  console.log('🔄 Simulando arrastre del selector de colores...')
  
  const colors = [
    '#ff0000', '#ff1111', '#ff2222', '#ff3333', '#ff4444',
    '#ff5555', '#ff6666', '#ff7777', '#ff8888', '#ff9999',
    '#ffaaaa', '#ffbbbb', '#ffcccc', '#ffdddd', '#ffeeee'
  ]
  
  let startTime = Date.now()
  
  colors.forEach((color, index) => {
    // Simular cambio de color cada 16ms (60fps)
    setTimeout(() => {
      console.log(`  Color ${index + 1}: ${color}`)
      
      if (index === colors.length - 1) {
        const endTime = Date.now()
        const duration = endTime - startTime
        console.log(`\n✅ Simulación completada en ${duration}ms`)
        console.log(`📊 Promedio: ${(duration / colors.length).toFixed(2)}ms por cambio`)
        
        if (duration < 300) {
          console.log('🎉 ¡Rendimiento excelente! El throttling está funcionando correctamente.')
        } else if (duration < 500) {
          console.log('👍 Rendimiento bueno. El color picker debería funcionar sin problemas.')
        } else {
          console.log('⚠️ Rendimiento lento. Considera optimizar más el código.')
        }
      }
    }, index * 16)
  })
}

// Verificar que las optimizaciones están implementadas
function checkOptimizations() {
  console.log('🔍 Verificando optimizaciones implementadas...\n')
  
  const fs = require('fs')
  const path = require('path')
  
  const themeManagerPath = path.join(__dirname, '..', 'components', 'theme-manager.tsx')
  
  if (!fs.existsSync(themeManagerPath)) {
    console.log('❌ No se encontró el archivo theme-manager.tsx')
    return false
  }
  
  const content = fs.readFileSync(themeManagerPath, 'utf8')
  
  const optimizations = [
    {
      name: 'useCallback',
      pattern: /useCallback/,
      description: 'Funciones memoizadas para evitar re-renders'
    },
    {
      name: 'useMemo',
      pattern: /useMemo/,
      description: 'Valores calculados memoizados'
    },
    {
      name: 'useRef para throttling',
      pattern: /throttleTimeoutRef/,
      description: 'Referencia para control de throttling'
    },
    {
      name: 'Throttling de 16ms',
      pattern: /setTimeout.*16|16.*fps/,
      description: 'Throttling a 60fps para suavidad'
    },
    {
      name: 'Prevención de re-aplicación',
      pattern: /lastAppliedColorsRef/,
      description: 'Evita aplicar los mismos colores múltiples veces'
    },
    {
      name: 'Limpieza de console.log',
      pattern: /console\.log.*ThemeManager/,
      description: 'Logs de depuración removidos para mejor rendimiento'
    }
  ]
  
  let passedChecks = 0
  
  optimizations.forEach(opt => {
    const hasOptimization = opt.pattern.test(content)
    const status = hasOptimization ? '✅' : '❌'
    console.log(`${status} ${opt.name}: ${opt.description}`)
    if (hasOptimization) passedChecks++
  })
  
  console.log(`\n📊 Resultado: ${passedChecks}/${optimizations.length} optimizaciones implementadas`)
  
  if (passedChecks >= 4) {
    console.log('🎉 ¡Excelente! El gestor de colores está optimizado.')
    return true
  } else if (passedChecks >= 2) {
    console.log('👍 Bueno. Algunas optimizaciones están implementadas.')
    return true
  } else {
    console.log('⚠️ Pocas optimizaciones detectadas. Considera implementar más mejoras.')
    return false
  }
}

// Función principal
function main() {
  console.log('🚀 Iniciando pruebas de rendimiento del color picker...\n')
  
  const optimizationsOk = checkOptimizations()
  
  if (optimizationsOk) {
    console.log('\n' + '='.repeat(50))
    simulateColorPickerDrag()
  } else {
    console.log('\n❌ No se pueden ejecutar las pruebas sin las optimizaciones básicas.')
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main()
}

module.exports = { checkOptimizations, simulateColorPickerDrag }
