const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, setDoc, collection, getDocs } = require('firebase/firestore');

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function consolidateConfig() {
  try {
    console.log('🔧 Consolidando configuración de documentos temporales...');
    
    // Obtener todos los documentos en la colección 'config'
    const configCollection = collection(db, 'config');
    const querySnapshot = await getDocs(configCollection);
    
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        data: doc.data()
      });
    });
    
    console.log(`📄 Encontrados ${documents.length} documentos:`);
    documents.forEach(doc => {
      console.log(`  - ${doc.id}`);
    });
    
    // Encontrar documentos que empiecen con 'plantilla-'
    const tempDocs = documents.filter(doc => doc.id.startsWith('plantilla-'));
    const mainDoc = documents.find(doc => doc.id === 'plantilla');
    
    console.log(`\n🔍 Documentos temporales encontrados: ${tempDocs.length}`);
    console.log(`🔍 Documento principal encontrado: ${mainDoc ? 'SÍ' : 'NO'}`);
    
    if (tempDocs.length === 0) {
      console.log('✅ No hay documentos temporales para consolidar');
      return;
    }
    
    // Encontrar el documento más reciente (con más datos)
    let latestDoc = null;
    let maxDataLength = 0;
    
    tempDocs.forEach(doc => {
      if (doc.data.data && typeof doc.data.data === 'string') {
        try {
          const config = JSON.parse(doc.data.data);
          const dataLength = JSON.stringify(config).length;
          if (dataLength > maxDataLength) {
            maxDataLength = dataLength;
            latestDoc = doc;
          }
        } catch (e) {
          console.log(`⚠️  Error parseando documento ${doc.id}:`, e.message);
        }
      }
    });
    
    if (!latestDoc) {
      console.log('❌ No se encontró un documento válido para consolidar');
      return;
    }
    
    console.log(`\n📋 Usando documento más reciente: ${latestDoc.id}`);
    console.log(`📊 Tamaño de datos: ${maxDataLength} caracteres`);
    
    // Parsear la configuración del documento más reciente
    const configData = JSON.parse(latestDoc.data.data);
    console.log('✅ Configuración parseada correctamente');
    
    // Guardar en el documento principal 'plantilla'
    const mainDocRef = doc(db, 'config', 'plantilla');
    const dataToSave = { data: JSON.stringify(configData) };
    
    await setDoc(mainDocRef, dataToSave);
    console.log('✅ Configuración consolidada en documento principal: plantilla');
    
    // Opcional: Eliminar documentos temporales (comentado por seguridad)
    /*
    console.log('\n🗑️  Eliminando documentos temporales...');
    for (const tempDoc of tempDocs) {
      const tempDocRef = doc(db, 'config', tempDoc.id);
      await deleteDoc(tempDocRef);
      console.log(`  - Eliminado: ${tempDoc.id}`);
    }
    */
    
    console.log('\n🎉 Consolidación completada exitosamente!');
    console.log('📝 Documento principal actualizado: plantilla');
    console.log('💡 Los documentos temporales se mantienen por seguridad');
    console.log('💡 Puedes eliminarlos manualmente desde Firebase Console si lo deseas');
    
  } catch (error) {
    console.error('❌ Error consolidando configuración:', error);
  }
}

// Ejecutar la consolidación
consolidateConfig();
