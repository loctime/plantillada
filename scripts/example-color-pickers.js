// Ejemplo de uso de los nuevos selectores de color
// Este script muestra cómo implementar selectores de color individuales

console.log('🎨 Ejemplo de implementación de selectores de color individuales\n');

console.log('✅ Ventajas del nuevo sistema:');
console.log('1. Cada elemento tiene su propio selector de color');
console.log('2. Más intuitivo y fácil de usar');
console.log('3. No hay conflictos entre temas');
console.log('4. Los colores se guardan directamente en cada elemento');
console.log('5. Interfaz más limpia y directa\n');

console.log('📋 Cómo usar EditableText con selector de color:');
console.log(`
<EditableText 
  value={config.site?.title}
  onSave={(value) => updateConfig({...config, site: {...config.site, title: value}})}
  textColor={config.site?.titleColor}
  onColorChange={(color) => updateConfig({...config, site: {...config.site, titleColor: color}})}
  showColorPicker={true}
  tag="h1"
  className="text-2xl font-bold"
/>
`);

console.log('📋 Cómo usar EditableButton con selectores de color:');
console.log(`
<EditableButton
  value="Agendar Sesión"
  onSave={(value) => updateConfig({...config, buttonText: value})}
  backgroundColor={config.button?.backgroundColor}
  textColor={config.button?.textColor}
  onBackgroundColorChange={(color) => updateConfig({...config, button: {...config.button, backgroundColor: color}})}
  onTextColorChange={(color) => updateConfig({...config, button: {...config.button, textColor: color}})}
  showColorPickers={true}
  variant="default"
  size="lg"
/>
`);

console.log('🎯 Elementos que pueden tener selectores de color:');
console.log('- Títulos (h1, h2, h3)');
console.log('- Texto de párrafos');
console.log('- Botones (fondo y texto)');
console.log('- Enlaces');
console.log('- Iconos');
console.log('- Bordes de imágenes');
console.log('- Fondos de secciones');
console.log('- Navbar');
console.log('- Footer\n');

console.log('💡 Para implementar en un nuevo componente:');
console.log('1. Importar ColorPicker: import { ColorPicker } from "@/components/color-picker"');
console.log('2. Agregar props de color al componente');
console.log('3. Usar el ColorPicker en modo compact para elementos pequeños');
console.log('4. Guardar el color en la configuración del elemento específico\n');

console.log('🔧 Ejemplo de componente personalizado con selector de color:');
console.log(`
function MyCustomComponent({ config, updateConfig }) {
  return (
    <div className="relative group">
      <div 
        className="p-4 rounded-lg"
        style={{ 
          backgroundColor: config.myComponent?.backgroundColor || '#ffffff',
          color: config.myComponent?.textColor || '#000000'
        }}
      >
        <EditableText 
          value={config.myComponent?.text || "Mi texto"}
          onSave={(value) => updateConfig({...config, myComponent: {...config.myComponent, text: value}})}
          textColor={config.myComponent?.textColor}
          onColorChange={(color) => updateConfig({...config, myComponent: {...config.myComponent, textColor: color}})}
          showColorPicker={true}
        />
      </div>
      
      {/* Selector de color para el fondo */}
      {isAdminMode && (
        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ColorPicker
            value={config.myComponent?.backgroundColor || '#ffffff'}
            onChange={(color) => updateConfig({...config, myComponent: {...config.myComponent, backgroundColor: color}})}
            compact={true}
            label="Fondo"
          />
        </div>
      )}
    </div>
  );
}
`);

console.log('\n✅ ¡Sistema de colores individuales implementado!');
console.log('Ahora cada elemento puede tener su propio color sin conflictos.');
