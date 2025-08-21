import { Product } from './types'

export const sampleProducts: Product[] = [
  {
    id: 'sample-1',
    name: 'iPad 11th (A16)',
    brand: 'iPad',
    price: 899.00,
    originalPrice: 999.00,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
    rating: 4.5,
    reviews: 128,
    category: 'tablets',
    inStock: true,
    description: 'iPad de 11 pulgadas con chip A16, perfecto para productividad y creatividad.',
    features: ['Chip A16 Bionic', '11 pulgadas', '128GB', 'WiFi + Cellular']
  },
  {
    id: 'sample-2',
    name: 'iPad Mini (A17)',
    brand: 'iPad',
    price: 599.00,
    originalPrice: 699.00,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
    rating: 4.3,
    reviews: 89,
    category: 'tablets',
    inStock: true,
    description: 'iPad Mini compacto con chip A17, ideal para uso portátil.',
    features: ['Chip A17 Pro', '8.3 pulgadas', '64GB', 'WiFi']
  },
  {
    id: 'sample-3',
    name: 'iPad Air M2',
    brand: 'iPad',
    price: 799.00,
    originalPrice: 899.00,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
    rating: 4.7,
    reviews: 156,
    category: 'tablets',
    inStock: true,
    description: 'iPad Air con chip M2, potencia profesional en formato ligero.',
    features: ['Chip M2', '10.9 pulgadas', '256GB', 'WiFi + Cellular']
  },
  {
    id: 'sample-4',
    name: 'NUBIA FLIP',
    brand: 'Nubia',
    price: 757.00,
    originalPrice: 899.00,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    rating: 4.2,
    reviews: 67,
    category: 'smartphones',
    inStock: true,
    description: 'Smartphone plegable con diseño innovador y tecnología avanzada.',
    features: ['Pantalla plegable', '6.9 pulgadas', '256GB', '5G']
  },
  {
    id: 'sample-5',
    name: 'ROG PHONE 8',
    brand: 'ASUS',
    price: 1299.00,
    originalPrice: 1499.00,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    rating: 4.8,
    reviews: 234,
    category: 'smartphones',
    inStock: true,
    description: 'Smartphone gaming con refrigeración líquida y rendimiento extremo.',
    features: ['Snapdragon 8 Gen 3', '16GB RAM', '512GB', 'Gaming']
  },
  {
    id: 'sample-6',
    name: 'Nubia Red Magic 6',
    brand: 'Nubia',
    price: 757.00,
    originalPrice: 899.00,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    rating: 4.1,
    reviews: 45,
    category: 'smartphones',
    inStock: true,
    description: 'Smartphone gaming con ventilador integrado y diseño agresivo.',
    features: ['Snapdragon 888', '12GB RAM', '256GB', 'Gaming']
  }
]
