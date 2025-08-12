const fs = require('fs');
const path = require('path');

// Función para cargar la configuración actual
function loadConfig() {
  try {
    const configPath = path.join(__dirname, '../public/config.json');
    const configData = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configData);
  } catch (error) {
    console.error('Error loading config:', error);
    return null;
  }
}

// Función para guardar la configuración
function saveConfig(config) {
  try {
    const configPath = path.join(__dirname, '../public/config.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log('✅ Configuración guardada exitosamente');
  } catch (error) {
    console.error('Error saving config:', error);
  }
}

// Función para migrar botones
function migrateButtons() {
  console.log('🔄 Iniciando migración de botones...');
  
  const config = loadConfig();
  if (!config) {
    console.error('❌ No se pudo cargar la configuración');
    return;
  }

  // Inicializar buttons si no existe
  if (!config.buttons) {
    config.buttons = {};
  }

  // Migrar botón hero existente a heroButtons
  if (config.buttons.heroButton && !config.buttons.heroButtons) {
    console.log('📝 Migrando botón hero existente...');
    
    config.buttons.heroButtons = [
      {
        id: 'button-hero-agendar',
        text: config.buttons.heroButton,
        type: 'modal',
        modalTitle: 'Agenda tu sesión',
        modalContent: 'Aquí puedes agendar tu sesión personalizada. Completa el formulario y te contactaremos pronto.',
        variant: 'default',
        icon: 'calendar',
        order: 0
      },
      {
        id: 'button-hero-curso',
        text: 'Ver curso online',
        type: 'section',
        sectionId: 'curso',
        variant: 'outline',
        icon: 'play',
        order: 1
      }
    ];
    
    console.log('✅ Botones hero migrados exitosamente');
  }

  // Agregar botones de ejemplo si no hay ninguno
  if (!config.buttons.heroButtons || config.buttons.heroButtons.length === 0) {
    console.log('📝 Agregando botones de ejemplo...');
    
    config.buttons.heroButtons = [
      {
        id: 'button-hero-agendar',
        text: 'Agendar una sesión',
        type: 'modal',
        modalTitle: 'Agenda tu sesión',
        modalContent: 'Aquí puedes agendar tu sesión personalizada. Completa el formulario y te contactaremos pronto.',
        variant: 'default',
        icon: 'calendar',
        order: 0
      },
      {
        id: 'button-hero-curso',
        text: 'Ver curso online',
        type: 'section',
        sectionId: 'curso',
        variant: 'outline',
        icon: 'play',
        order: 1
      },
      {
        id: 'button-hero-contacto',
        text: 'Contactar',
        type: 'url',
        url: 'mailto:contacto@ejemplo.com',
        variant: 'secondary',
        icon: 'mail',
        order: 2
      }
    ];
    
    console.log('✅ Botones de ejemplo agregados');
  }

  // Guardar configuración actualizada
  saveConfig(config);
  
  console.log('🎉 Migración completada exitosamente!');
  console.log('📋 Botones configurados:');
  config.buttons.heroButtons.forEach((button, index) => {
    console.log(`   ${index + 1}. ${button.text} (${button.type})`);
  });
}

// Ejecutar migración
if (require.main === module) {
  migrateButtons();
}

module.exports = { migrateButtons };
