const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, setDoc } = require('firebase/firestore');

// Configuración de Firebase (usar las mismas variables de entorno que el proyecto)
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

async function testShopSaving() {
  console.log('🧪 Probando guardado de configuración de tienda...');
  
  const tenantId = 'default'; // o el tenant que quieras probar
  
  try {
    // 1. Cargar configuración actual
    console.log('📥 Cargando configuración actual...');
    const configDoc = doc(db, 'config', tenantId);
    const configSnapshot = await getDoc(configDoc);
    
    let currentConfig = {};
    if (configSnapshot.exists()) {
      const data = configSnapshot.data();
      if (data.data && typeof data.data === 'string') {
        currentConfig = JSON.parse(data.data);
      } else {
        currentConfig = data;
      }
      console.log('✅ Configuración cargada:', currentConfig.site?.title);
    } else {
      console.log('⚠️ No existe configuración, se creará una nueva');
    }
    
    // 2. Simular cambios en la tienda
    console.log('🛒 Simulando cambios en la tienda...');
    const updatedConfig = {
      ...currentConfig,
      currentTemplate: 'shop',
      shopConfig: {
        storeName: "MI TIENDA DE PRUEBA",
        storeTagline: "Probando guardado de configuración",
        navigation: ["TIENDA", "PRODUCTOS", "CONTACTO"],
        categories: ["Todos", "Electrónicos", "Ropa"],
        searchPlaceholder: "Buscar productos...",
        filterButtonText: "FILTRAR",
        bestSellersTitle: "Productos Destacados",
        breadcrumbText: "Inicio / Tienda",
        resultsText: "Mostrando {count} de {total} productos",
        sortOptions: [
          { value: "latest", label: "Más recientes" },
          { value: "price-low", label: "Precio: Menor a Mayor" },
          { value: "price-high", label: "Precio: Mayor a Menor" }
        ],
        addToCartText: "Agregar al Carrito",
        outOfStockText: "Sin Stock",
        cartTitle: "Carrito de Compras",
        emptyCartText: "Tu carrito está vacío",
        checkoutText: "Proceder al Pago",
        totalText: "Total:"
      },
      products: [
        {
          id: 'test-1',
          name: 'Producto de Prueba 1',
          brand: 'Marca Test',
          price: 99.99,
          originalPrice: 129.99,
          image: 'https://via.placeholder.com/300x200?text=Producto+1',
          rating: 4.5,
          reviews: 10,
          category: 'electronics',
          inStock: true,
          description: 'Este es un producto de prueba para verificar el guardado.',
          features: ['Característica 1', 'Característica 2', 'Característica 3']
        },
        {
          id: 'test-2',
          name: 'Producto de Prueba 2',
          brand: 'Marca Test',
          price: 149.99,
          image: 'https://via.placeholder.com/300x200?text=Producto+2',
          rating: 4.2,
          reviews: 5,
          category: 'clothing',
          inStock: true,
          description: 'Segundo producto de prueba.',
          features: ['Característica A', 'Característica B']
        }
      ]
    };
    
    // 3. Guardar configuración actualizada
    console.log('💾 Guardando configuración actualizada...');
    const dataToSave = { data: JSON.stringify(updatedConfig) };
    await setDoc(configDoc, dataToSave);
    console.log('✅ Configuración guardada exitosamente');
    
    // 4. Verificar que se guardó correctamente
    console.log('🔍 Verificando guardado...');
    const verifySnapshot = await getDoc(configDoc);
    if (verifySnapshot.exists()) {
      const verifyData = verifySnapshot.data();
      let verifyConfig = {};
      if (verifyData.data && typeof verifyData.data === 'string') {
        verifyConfig = JSON.parse(verifyData.data);
      } else {
        verifyConfig = verifyData;
      }
      
      console.log('✅ Verificación exitosa:');
      console.log('  - Nombre de tienda:', verifyConfig.shopConfig?.storeName);
      console.log('  - Productos guardados:', verifyConfig.products?.length || 0);
      console.log('  - Template actual:', verifyConfig.currentTemplate);
      
      if (verifyConfig.shopConfig?.storeName === "MI TIENDA DE PRUEBA") {
        console.log('🎉 ¡El guardado funciona correctamente!');
      } else {
        console.log('❌ Error: Los datos no se guardaron correctamente');
      }
    } else {
      console.log('❌ Error: No se pudo verificar el guardado');
    }
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  }
}

// Ejecutar la prueba
testShopSaving().then(() => {
  console.log('🏁 Prueba completada');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Error fatal:', error);
  process.exit(1);
});
