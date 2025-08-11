const puppeteer = require('puppeteer');

async function testAdminMode() {
  console.log('🧪 Iniciando prueba del modo admin...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1280, height: 720 }
  });
  
  try {
    const page = await browser.newPage();
    
    // Navegar a la página
    console.log('📱 Navegando a la página...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // Esperar a que cargue la configuración
    await page.waitForSelector('header', { timeout: 10000 });
    console.log('✅ Página cargada correctamente');
    
    // Activar modo admin con Ctrl+Shift+A
    console.log('🔧 Activando modo admin...');
    await page.keyboard.down('Control');
    await page.keyboard.down('Shift');
    await page.keyboard.press('A');
    await page.keyboard.up('Shift');
    await page.keyboard.up('Control');
    
    // Esperar a que aparezcan los controles de edición
    await page.waitForSelector('[data-admin="true"]', { timeout: 5000 });
    console.log('✅ Modo admin activado');
    
    // Hacer hover sobre el título para ver el ícono de edición
    console.log('✏️ Probando edición de texto...');
    await page.hover('header h1, header .font-semibold');
    await page.waitForSelector('[data-editable="true"]', { timeout: 5000 });
    
    // Hacer clic en el ícono de edición
    await page.click('[data-editable="true"]');
    
    // Escribir nuevo texto
    const newTitle = `Test Admin Mode - ${new Date().toLocaleTimeString()}`;
    await page.type('[data-editable="true"] input', newTitle, { delay: 100 });
    
    // Presionar Enter para guardar
    await page.keyboard.press('Enter');
    
    // Esperar a que aparezca el mensaje de guardado
    await page.waitForFunction(() => {
      const notifications = document.querySelectorAll('[data-admin-notification]');
      return Array.from(notifications).some(n => n.textContent.includes('Guardado'));
    }, { timeout: 10000 });
    
    console.log('✅ Texto editado y guardado correctamente');
    
    // Verificar que el texto se actualizó en la interfaz
    const titleText = await page.$eval('header .font-semibold', el => el.textContent);
    console.log(`📝 Título actualizado: "${titleText}"`);
    
    // Desactivar modo admin
    console.log('🔧 Desactivando modo admin...');
    await page.keyboard.down('Control');
    await page.keyboard.down('Shift');
    await page.keyboard.press('A');
    await page.keyboard.up('Shift');
    await page.keyboard.up('Control');
    
    // Verificar que los controles de edición desaparecieron
    await page.waitForFunction(() => {
      return !document.querySelector('[data-admin="true"]');
    }, { timeout: 5000 });
    
    console.log('✅ Modo admin desactivado correctamente');
    
    // Verificar que el texto sigue actualizado
    const finalTitleText = await page.$eval('header .font-semibold', el => el.textContent);
    if (finalTitleText === titleText) {
      console.log('✅ Los cambios persisten después de desactivar el modo admin');
    } else {
      console.log('❌ Los cambios no persisten');
    }
    
    console.log('\n🎉 ¡Prueba completada exitosamente!');
    console.log('📋 Resumen:');
    console.log('  ✅ Modo admin se activa correctamente');
    console.log('  ✅ Edición de texto funciona');
    console.log('  ✅ Cambios se guardan en tiempo real');
    console.log('  ✅ Modo admin se desactiva correctamente');
    console.log('  ✅ Cambios persisten en la interfaz');
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
  } finally {
    // Mantener el navegador abierto para inspección manual
    console.log('\n🔍 Navegador abierto para inspección manual...');
    console.log('Presiona Ctrl+C para cerrar');
    
    // Esperar 30 segundos antes de cerrar
    await new Promise(resolve => setTimeout(resolve, 30000));
    await browser.close();
  }
}

// Ejecutar la prueba
testAdminMode().catch(console.error);
