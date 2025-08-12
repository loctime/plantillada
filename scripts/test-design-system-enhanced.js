const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, setDoc } = require('firebase/firestore');

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para cargar configuración
async function loadConfig(tenantId) {
  try {
    const configDoc = doc(db, 'config', tenantId);
    const configSnapshot = await getDoc(configDoc);
    
    if (configSnapshot.exists()) {
      const data = configSnapshot.data();
      if (data.data && typeof data.data === 'string') {
        return JSON.parse(data.data);
      }
      return data;
    }
    return null;
  } catch (error) {
    console.error('Error loading config:', error);
    return null;
  }
}

// Función para guardar configuración
async function saveConfig(config, tenantId) {
  try {
    const configDoc = doc(db, 'config', tenantId);
    const dataToSave = { data: JSON.stringify(config) };
    await setDoc(configDoc, dataToSave);
    return true;
  } catch (error) {
    console.error('Error saving config:', error);
    return false;
  }
}

// Función para crear backup
async function createBackup(tenantId) {
  try {
    const currentConfig = await loadConfig(tenantId);
    if (!currentConfig) {
      console.log('❌ No hay configuración para hacer backup');
      return null;
    }
    
    const backup = {
      timestamp: new Date().toISOString(),
      tenantId,
      config: currentConfig,
      description: 'Backup automático antes de aplicar diseño'
    };
    
    const backupId = `backup_${tenantId}_${Date.now()}`;
    const backupDoc = doc(db, 'backups', backupId);
    await setDoc(backupDoc, backup);
    
    console.log('✅ Backup creado:', backupId);
    return backupId;
  } catch (error) {
    console.error('❌ Error creando backup:', error);
    return null;
  }
}

// Función para obtener backups
async function getBackups(tenantId) {
  try {
    const { collection, query, where, orderBy, getDocs } = require('firebase/firestore');
    
    const backupsRef = collection(db, 'backups');
    const q = query(
      backupsRef,
      where('tenantId', '==', tenantId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const backups = [];
    
    querySnapshot.forEach((doc) => {
      backups.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return backups;
  } catch (error) {
    console.error('❌ Error obteniendo backups:', error);
    return [];
  }
}

// Función para restaurar backup
async function restoreFromBackup(backupId, tenantId) {
  try {
    const { doc, getDoc } = require('firebase/firestore');
    
    const backupDoc = doc(db, 'backups', backupId);
    const backupSnapshot = await getDoc(backupDoc);
    
    if (!backupSnapshot.exists()) {
      console.log('❌ Backup no encontrado');
      return false;
    }
    
    const backup = backupSnapshot.data();
    const success = await saveConfig(backup.config, tenantId);
    
    if (success) {
      console.log('✅ Configuración restaurada exitosamente');
      return true;
    } else {
      console.log('❌ Error guardando configuración restaurada');
      return false;
    }
  } catch (error) {
    console.error('❌ Error restaurando backup:', error);
    return false;
  }
}

// Función para eliminar backup
async function deleteBackup(backupId) {
  try {
    const { doc, deleteDoc } = require('firebase/firestore');
    
    const backupDoc = doc(db, 'backups', backupId);
    await deleteDoc(backupDoc);
    
    console.log('✅ Backup eliminado:', backupId);
    return true;
  } catch (error) {
    console.error('❌ Error eliminando backup:', error);
    return false;
  }
}

// Función principal de prueba
async function testEnhancedDesignSystem() {
  console.log('🎨 Probando Sistema de Diseños Mejorado...\n');
  
  const tenantId = 'test-tenant';
  
  // 1. Crear configuración inicial
  console.log('1️⃣ Creando configuración inicial...');
  const initialConfig = {
    site: {
      title: "Mi Sitio Web",
      tagline: "Descripción inicial del sitio"
    },
    contact: {
      email: "test@example.com"
    },
    selectedDesigns: {
      landing: 'coach-personal'
    }
  };
  
  await saveConfig(initialConfig, tenantId);
  console.log('✅ Configuración inicial creada\n');
  
  // 2. Crear backup
  console.log('2️⃣ Creando backup...');
  const backupId = await createBackup(tenantId);
  if (backupId) {
    console.log('✅ Backup creado exitosamente\n');
  } else {
    console.log('❌ Error creando backup\n');
    return;
  }
  
  // 3. Listar backups
  console.log('3️⃣ Listando backups...');
  const backups = await getBackups(tenantId);
  console.log(`📋 Backups encontrados: ${backups.length}`);
  backups.forEach(backup => {
    console.log(`   - ${backup.id}: ${backup.description} (${new Date(backup.timestamp).toLocaleString()})`);
  });
  console.log();
  
  // 4. Modificar configuración
  console.log('4️⃣ Modificando configuración...');
  const modifiedConfig = {
    ...initialConfig,
    site: {
      title: "Sitio Modificado",
      tagline: "Descripción modificada"
    }
  };
  
  await saveConfig(modifiedConfig, tenantId);
  console.log('✅ Configuración modificada\n');
  
  // 5. Restaurar backup
  console.log('5️⃣ Restaurando backup...');
  const restoreSuccess = await restoreFromBackup(backupId, tenantId);
  if (restoreSuccess) {
    console.log('✅ Backup restaurado exitosamente\n');
  } else {
    console.log('❌ Error restaurando backup\n');
  }
  
  // 6. Verificar restauración
  console.log('6️⃣ Verificando restauración...');
  const restoredConfig = await loadConfig(tenantId);
  if (restoredConfig && restoredConfig.site.title === "Mi Sitio Web") {
    console.log('✅ Restauración verificada correctamente\n');
  } else {
    console.log('❌ Error en la verificación de restauración\n');
  }
  
  // 7. Eliminar backup
  console.log('7️⃣ Eliminando backup...');
  const deleteSuccess = await deleteBackup(backupId);
  if (deleteSuccess) {
    console.log('✅ Backup eliminado exitosamente\n');
  } else {
    console.log('❌ Error eliminando backup\n');
  }
  
  // 8. Verificar eliminación
  console.log('8️⃣ Verificando eliminación...');
  const remainingBackups = await getBackups(tenantId);
  if (remainingBackups.length === 0) {
    console.log('✅ Backup eliminado correctamente\n');
  } else {
    console.log(`❌ Aún quedan ${remainingBackups.length} backups\n`);
  }
  
  console.log('🎉 Prueba del Sistema de Diseños Mejorado completada');
}

// Ejecutar prueba
if (require.main === module) {
  testEnhancedDesignSystem().catch(console.error);
}

module.exports = {
  loadConfig,
  saveConfig,
  createBackup,
  getBackups,
  restoreFromBackup,
  deleteBackup
};
