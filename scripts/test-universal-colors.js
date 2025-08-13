#!/usr/bin/env node

/**
 * Script para probar el sistema de colores universal
 * Verifica que todas las clases CSS del tema funcionen correctamente
 */

const fs = require('fs')
const path = require('path')

console.log('🎨 Probando Sistema de Colores Universal...\n')

// Función para verificar que las variables CSS estén definidas
function checkCSSVariables() {
  console.log('📋 Verificando variables CSS del tema...')
  
  const cssFile = path.join(__dirname, '../app/globals.css')
  const cssContent = fs.readFileSync(cssFile, 'utf8')
  
  const requiredVariables = [
    '--background-color',
    '--section-background', 
    '--navbar-background',
    '--navbar-background-transparent',
    '--text-color',
    '--accent-color',
    '--primary-button-color',
    '--secondary-button-color',
    '--outline-button-color',
    '--card-background',
    '--card-foreground',
    '--footer-background',
    '--header-background',
    '--border-color',
    '--shadow-color'
  ]
  
  const missingVariables = []
  
  requiredVariables.forEach(variable => {
    if (!cssContent.includes(variable)) {
      missingVariables.push(variable)
    }
  })
  
  if (missingVariables.length > 0) {
    console.log('❌ Variables CSS faltantes:')
    missingVariables.forEach(variable => console.log(`   - ${variable}`))
    return false
  } else {
    console.log('✅ Todas las variables CSS están definidas')
    return true
  }
}

// Función para verificar que las clases CSS del tema estén definidas
function checkThemeClasses() {
  console.log('\n📋 Verificando clases CSS del tema...')
  
  const cssFile = path.join(__dirname, '../app/globals.css')
  const cssContent = fs.readFileSync(cssFile, 'utf8')
  
  const requiredClasses = [
    '.theme-bg-primary',
    '.theme-bg-section',
    '.theme-bg-navbar',
    '.theme-bg-navbar-transparent',
    '.theme-bg-card',
    '.theme-bg-footer',
    '.theme-bg-header',
    '.theme-text-primary',
    '.theme-text-accent',
    '.theme-text-heading',
    '.theme-text-subtitle',
    '.theme-text-link',
    '.theme-btn-primary',
    '.theme-btn-secondary',
    '.theme-btn-outline',
    '.theme-border',
    '.theme-border-accent',
    '.theme-shadow',
    '.theme-shadow-lg',
    '.theme-gradient',
    '.theme-success',
    '.theme-warning',
    '.theme-error',
    '.theme-info',
    '.theme-nav-bg',
    '.theme-nav-text',
    '.theme-nav-link',
    '.theme-section-bg',
    '.theme-section-text',
    '.theme-input-bg',
    '.theme-input-border',
    '.theme-input-text',
    '.theme-tooltip-bg',
    '.theme-tooltip-text',
    '.theme-sidebar-bg',
    '.theme-sidebar-text',
    '.theme-sidebar-border',
    '.theme-hover-bg',
    '.theme-hover-text',
    '.theme-transition',
    '.theme-opacity-80',
    '.theme-opacity-90',
    '.theme-backdrop-blur',
    '.theme-scrollbar',
    '.theme-focus',
    '.theme-selection',
    '.theme-placeholder',
    '.theme-disabled',
    '.theme-loading'
  ]
  
  const missingClasses = []
  
  requiredClasses.forEach(className => {
    if (!cssContent.includes(className)) {
      missingClasses.push(className)
    }
  })
  
  if (missingClasses.length > 0) {
    console.log('❌ Clases CSS del tema faltantes:')
    missingClasses.forEach(className => console.log(`   - ${className}`))
    return false
  } else {
    console.log('✅ Todas las clases CSS del tema están definidas')
    return true
  }
}

// Función para verificar que los componentes usen las clases del tema
function checkComponentUsage() {
  console.log('\n📋 Verificando uso de clases del tema en componentes...')
  
  const componentsToCheck = [
    '../app/page.tsx',
    '../components/dynamic-navigation.tsx',
    '../components/editable-button.tsx',
    '../components/theme-manager.tsx'
  ]
  
  const themeClassesUsed = []
  const hardcodedColors = []
  
  componentsToCheck.forEach(componentPath => {
    const fullPath = path.join(__dirname, componentPath)
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8')
      
      // Buscar clases del tema
      const themeClassMatches = content.match(/theme-[a-zA-Z-]+/g) || []
      themeClassesUsed.push(...themeClassMatches)
      
      // Buscar colores hardcodeados
      const hardcodedMatches = content.match(/(bg-white|bg-gray|text-gray|border-gray|hover:bg-gray|hover:text-gray)/g) || []
      hardcodedColors.push(...hardcodedMatches)
    }
  })
  
  // Eliminar duplicados
  const uniqueThemeClasses = [...new Set(themeClassesUsed)]
  const uniqueHardcodedColors = [...new Set(hardcodedColors)]
  
  console.log(`✅ Clases del tema encontradas: ${uniqueThemeClasses.length}`)
  uniqueThemeClasses.forEach(className => console.log(`   - ${className}`))
  
  if (uniqueHardcodedColors.length > 0) {
    console.log(`⚠️  Colores hardcodeados encontrados: ${uniqueHardcodedColors.length}`)
    uniqueHardcodedColors.forEach(color => console.log(`   - ${color}`))
    console.log('💡 Considera reemplazar estos colores con clases del tema')
  } else {
    console.log('✅ No se encontraron colores hardcodeados')
  }
  
  return uniqueThemeClasses.length > 0
}

// Función para verificar el gestor de temas
function checkThemeManager() {
  console.log('\n📋 Verificando gestor de temas...')
  
  const themeManagerPath = path.join(__dirname, '../components/theme-manager.tsx')
  const content = fs.readFileSync(themeManagerPath, 'utf8')
  
  const checks = [
    {
      name: 'Variables CSS aplicadas',
      pattern: /root\.style\.setProperty/,
      required: true
    },
    {
      name: 'Paletas de colores definidas',
      pattern: /colorPalettes/,
      required: true
    },
    {
      name: 'Temas de plantillas',
      pattern: /templateThemes/,
      required: true
    },
    {
      name: 'Modo claro/oscuro',
      pattern: /isDarkMode/,
      required: true
    },
    {
      name: 'Aplicación de colores',
      pattern: /applyColors/,
      required: true
    }
  ]
  
  let allChecksPassed = true
  
  checks.forEach(check => {
    const found = check.pattern.test(content)
    if (found) {
      console.log(`✅ ${check.name}`)
    } else {
      console.log(`❌ ${check.name}`)
      if (check.required) {
        allChecksPassed = false
      }
    }
  })
  
  return allChecksPassed
}

// Función para generar reporte de colores
function generateColorReport() {
  console.log('\n📊 Generando reporte de colores...')
  
  const configPath = path.join(__dirname, '../public/config.json')
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
    
    if (config.theme) {
      console.log('🎨 Colores actuales del tema:')
      console.log('\nModo Claro:')
      Object.entries(config.theme.light).forEach(([key, value]) => {
        console.log(`   ${key}: ${value}`)
      })
      
      console.log('\nModo Oscuro:')
      Object.entries(config.theme.dark).forEach(([key, value]) => {
        console.log(`   ${key}: ${value}`)
      })
    } else {
      console.log('⚠️  No se encontró configuración de tema')
    }
  } else {
    console.log('⚠️  No se encontró archivo de configuración')
  }
}

// Función principal
function main() {
  console.log('🚀 Iniciando pruebas del sistema de colores universal...\n')
  
  const results = {
    cssVariables: checkCSSVariables(),
    themeClasses: checkThemeClasses(),
    componentUsage: checkComponentUsage(),
    themeManager: checkThemeManager()
  }
  
  generateColorReport()
  
  console.log('\n📋 Resumen de resultados:')
  console.log(`✅ Variables CSS: ${results.cssVariables ? 'OK' : 'ERROR'}`)
  console.log(`✅ Clases del tema: ${results.themeClasses ? 'OK' : 'ERROR'}`)
  console.log(`✅ Uso en componentes: ${results.componentUsage ? 'OK' : 'ERROR'}`)
  console.log(`✅ Gestor de temas: ${results.themeManager ? 'OK' : 'ERROR'}`)
  
  const allPassed = Object.values(results).every(result => result)
  
  if (allPassed) {
    console.log('\n🎉 ¡Sistema de colores universal funcionando correctamente!')
    console.log('\n💡 Próximos pasos:')
    console.log('   1. Prueba cambiar colores en el gestor de temas')
    console.log('   2. Verifica que los cambios se apliquen en tiempo real')
    console.log('   3. Comprueba que funcionen en modo claro y oscuro')
    console.log('   4. Testea en diferentes páginas y componentes')
  } else {
    console.log('\n❌ Hay problemas en el sistema de colores universal')
    console.log('💡 Revisa los errores anteriores y corrígelos')
  }
  
  process.exit(allPassed ? 0 : 1)
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  main()
}

module.exports = {
  checkCSSVariables,
  checkThemeClasses,
  checkComponentUsage,
  checkThemeManager,
  generateColorReport
}
