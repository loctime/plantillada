async function testAPISimple() {
  console.log('🧪 Probando API endpoint simple...\n')

  try {
    console.log('📡 Probando GET /api/config...')
    const response = await fetch('http://localhost:3000/api/config')
    
    console.log('📊 Status:', response.status)
    console.log('📊 Status Text:', response.statusText)
    console.log('📊 Headers:', Object.fromEntries(response.headers.entries()))
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ API funciona correctamente')
      console.log('📋 Datos recibidos:', JSON.stringify(data, null, 2))
    } else {
      const errorText = await response.text()
      console.log('❌ Error en API')
      console.log('📄 Error details:', errorText.substring(0, 500))
    }
  } catch (error) {
    console.log('❌ Error de conexión:', error.message)
  }

  console.log('\n🔧 Soluciones posibles:')
  console.log(`
1. 🔄 REINICIAR SERVIDOR:
   - Detener el servidor (Ctrl+C)
   - Ejecutar: npm run dev
   - Esperar a que se inicie completamente

2. 🔍 VERIFICAR RUTA:
   - La ruta debe ser: /api/config
   - El archivo debe estar en: app/api/config/route.ts

3. 🧹 LIMPIAR CACHE:
   - Eliminar carpeta .next
   - Ejecutar: npm run dev

4. 📝 VERIFICAR IMPORTS:
   - Asegurar que todos los imports sean correctos
   - Verificar que no haya errores de TypeScript
  `)
}

testAPISimple()
