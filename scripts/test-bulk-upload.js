const fs = require('fs')
const path = require('path')

async function testBulkUpload() {
  console.log('🧪 Probando funcionalidad de carga masiva...\n')

  // Verificar que existe el archivo CSV de ejemplo
  const csvPath = path.join(__dirname, '../public/productos_ejemplo.csv')
  
  if (!fs.existsSync(csvPath)) {
    console.log('❌ No se encontró el archivo productos_ejemplo.csv')
    return
  }

  try {
    // Leer el archivo CSV
    const csvContent = fs.readFileSync(csvPath, 'utf8')
    const lines = csvContent.trim().split('\n')
    
    console.log('✅ Archivo CSV encontrado')
    console.log(`📊 Líneas en el archivo: ${lines.length}`)
    console.log(`📦 Productos en el archivo: ${lines.length - 1}`) // -1 por el header
    
    // Parsear el header
    const headers = lines[0].split(',').map(h => h.trim())
    console.log('\n📋 Columnas del CSV:')
    headers.forEach((header, index) => {
      console.log(`   ${index + 1}. ${header}`)
    })
    
    // Mostrar algunos productos de ejemplo
    console.log('\n📦 Productos de ejemplo:')
    for (let i = 1; i <= Math.min(3, lines.length - 1); i++) {
      const values = lines[i].split(',').map(v => v.trim())
      const product = {}
      
      headers.forEach((header, index) => {
        product[header] = values[index]
      })
      
      console.log(`\n   Producto ${i}:`)
      console.log(`     Categoría: ${product.categoria}`)
      console.log(`     Nombre: ${product.nombre}`)
      console.log(`     Precio: $${product.precio}`)
      console.log(`     Marca: ${product.marca}`)
    }
    
    // Simular validación
    console.log('\n🔍 Simulando validación...')
    let errors = []
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      const rowNumber = i + 1
      
      // Validar campos requeridos
      if (!values[0]) errors.push(`Fila ${rowNumber}: Categoría es requerida`)
      if (!values[1]) errors.push(`Fila ${rowNumber}: Nombre es requerido`)
      if (!values[2]) errors.push(`Fila ${rowNumber}: Descripción es requerida`)
      if (!values[3]) errors.push(`Fila ${rowNumber}: URL de imagen es requerida`)
      if (!values[4] || parseFloat(values[4]) <= 0) errors.push(`Fila ${rowNumber}: Precio debe ser mayor a 0`)
    }
    
    if (errors.length > 0) {
      console.log('❌ Errores encontrados:')
      errors.forEach(error => console.log(`   ${error}`))
    } else {
      console.log('✅ Todos los productos son válidos')
    }
    
    // Simular conversión a formato de producto
    console.log('\n🔄 Simulando conversión a formato de producto...')
    const products = []
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      const product = {
        id: `bulk_${Date.now()}_${i}`,
        name: values[1],
        brand: values[6] || 'Sin marca',
        price: parseFloat(values[4]) || 0,
        originalPrice: values[5] && parseFloat(values[5]) > parseFloat(values[4]) ? parseFloat(values[5]) : undefined,
        image: values[3],
        rating: parseFloat(values[7]) || 4.0,
        reviews: parseInt(values[8]) || 0,
        category: values[0].toLowerCase(),
        inStock: values[9] === 'true' || values[9] === '1',
        description: values[2],
        features: values[10] ? values[10].replace(/"/g, '').split(',').map(f => f.trim()) : []
      }
      
      products.push(product)
    }
    
    console.log(`✅ ${products.length} productos convertidos exitosamente`)
    
    // Mostrar ejemplo de producto convertido
    if (products.length > 0) {
      console.log('\n📋 Ejemplo de producto convertido:')
      const example = products[0]
      console.log(JSON.stringify(example, null, 2))
    }
    
    console.log('\n🎉 Prueba completada exitosamente!')
    console.log('\n💡 Para usar la carga masiva:')
    console.log('   1. Ve a la tienda en modo admin')
    console.log('   2. Haz clic en "Subir Masivo"')
    console.log('   3. Sube el archivo CSV o pega los datos')
    console.log('   4. Revisa la vista previa y guarda')
    
  } catch (error) {
    console.log('❌ Error procesando el archivo CSV:')
    console.log(`   ${error.message}`)
  }
}

// Ejecutar prueba
testBulkUpload()
