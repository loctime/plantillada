const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore');

// Configuración de Firebase (usar las variables de entorno)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function setupActiveTemplates() {
  try {
    console.log('🔄 Configurando sistema de plantillas activas...');
    
    // Obtener la configuración actual
    const configRef = doc(db, 'config', 'main');
    const configSnap = await getDoc(configRef);
    
    let currentConfig = {};
    if (configSnap.exists()) {
      currentConfig = configSnap.data();
      console.log('📋 Configuración actual encontrada');
    }
    
    // Configurar plantillas activas en orden de selección
    // La primera en el array será la página principal
    const updatedConfig = {
      ...currentConfig,
      // Migrar de currentTemplate a activeTemplates
      activeTemplates: currentConfig.activeTemplates || ['shop'], // Por defecto: tienda como primera
      // Mantener currentTemplate para compatibilidad
      currentTemplate: currentConfig.currentTemplate || 'shop',
      
      // Configuración específica de la tienda (si es la primera)
      shopConfig: currentConfig.shopConfig || {
        storeName: "MI TIENDA",
        storeTagline: "Tu tienda de confianza",
        navigation: ["INICIO", "PRODUCTOS", "CATEGORÍAS", "CONTACTO"],
        categories: ["Todos", "Electrónicos", "Ropa", "Hogar"],
        searchPlaceholder: "Buscar productos...",
        filterButtonText: "FILTRAR",
        bestSellersTitle: "Productos Destacados",
        breadcrumbText: "Inicio / Productos",
        resultsText: "Mostrando 1-{count} de {total} resultados",
        sortOptions: [
          { value: "latest", label: "Más recientes" },
          { value: "price-low", label: "Precio: Menor a Mayor" },
          { value: "price-high", label: "Precio: Mayor a Menor" },
          { value: "rating", label: "Mejor Valorados" }
        ],
        addToCartText: "Agregar al Carrito",
        outOfStockText: "Sin Stock",
        cartTitle: "Carrito de Compras",
        emptyCartText: "Tu carrito está vacío",
        checkoutText: "Proceder al Pago",
        totalText: "Total:"
      },
      
      // Productos de ejemplo
      products: currentConfig.products || [
        {
          id: '1',
          name: 'Producto Ejemplo 1',
          brand: 'Marca A',
          price: 99.99,
          originalPrice: 129.99,
          image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
          rating: 4.5,
          reviews: 128,
          category: 'electronics',
          inStock: true,
          description: 'Descripción del producto ejemplo 1.',
          features: ['Característica 1', 'Característica 2', 'Característica 3']
        },
        {
          id: '2',
          name: 'Producto Ejemplo 2',
          brand: 'Marca B',
          price: 149.99,
          image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
          rating: 4.3,
          reviews: 89,
          category: 'clothing',
          inStock: true,
          description: 'Descripción del producto ejemplo 2.',
          features: ['Característica 1', 'Característica 2']
        }
      ],
      
      // Configuración de layout
      layout: currentConfig.layout || {
        type: 'sidebar-left',
        productStyle: 'cards-square',
        backgroundColor: '#f8fafc',
        cardStyle: 'modern',
        headerStyle: 'dark',
        sidebarStyle: 'white-shadow'
      },
      
      // Configuración del sitio
      site: {
        ...currentConfig.site,
        title: currentConfig.site?.title || 'Mi Tienda Online',
        tagline: currentConfig.site?.tagline || 'Tu tienda de confianza',
        description: currentConfig.site?.description || 'Tienda online con productos de calidad'
      }
    };
    
    // Guardar la configuración actualizada
    await setDoc(configRef, updatedConfig);
    
    console.log('✅ Configuración completada exitosamente');
    console.log('📝 Plantillas activas configuradas:', updatedConfig.activeTemplates);
    console.log('🎯 Página principal:', updatedConfig.activeTemplates[0]);
    console.log('🔗 Accede a http://localhost:3000 para ver la página principal');
    console.log('⚙️  Accede a http://localhost:3000/admin para administrar');
    
  } catch (error) {
    console.error('❌ Error configurando plantillas activas:', error);
    process.exit(1);
  }
}

// Ejecutar el script
setupActiveTemplates();
