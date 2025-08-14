const puppeteer = require('puppeteer');

async function testThemeFix() {
  console.log('🧪 Probando que el error del tema se haya solucionado...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Configurar timeout más largo
    page.setDefaultTimeout(30000);
    
    console.log('🌐 Navegando a la página...');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle0' });
    
    console.log('⏳ Esperando a que la página cargue completamente...');
    await page.waitForTimeout(3000);
    
    // Verificar que no hay errores en la consola
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Hacer clic en el botón de tema varias veces para probar
    console.log('🖱️ Probando el botón de tema...');
    for (let i = 0; i < 5; i++) {
      await page.click('[data-testid="theme-switch"]').catch(() => {
        // Si no encuentra el testid, intentar con el selector normal
        return page.click('button[aria-label*="tema"], button[aria-label*="theme"]');
      });
      await page.waitForTimeout(500);
    }
    
    // Esperar un poco más para ver si aparecen errores
    await page.waitForTimeout(2000);
    
    if (errors.length > 0) {
      console.log('❌ Se encontraron errores:');
      errors.forEach(error => console.log('  -', error));
      return false;
    } else {
      console.log('✅ No se encontraron errores en la consola');
      return true;
    }
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
    return false;
  } finally {
    await browser.close();
  }
}

// Ejecutar la prueba
testThemeFix().then(success => {
  if (success) {
    console.log('🎉 ¡Prueba exitosa! El error del tema se ha solucionado.');
    process.exit(0);
  } else {
    console.log('💥 La prueba falló. El error del tema persiste.');
    process.exit(1);
  }
}).catch(error => {
  console.error('💥 Error ejecutando la prueba:', error);
  process.exit(1);
});
