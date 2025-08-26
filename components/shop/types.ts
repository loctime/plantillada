export interface Product {
  id: string
  name: string
  brand: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  category: string
  inStock: boolean
  description: string
  features: string[]
  // Nuevas funcionalidades para opciones y variedades
  options?: {
    option1?: string // Ejemplo: "Tipo de masa"
    option2?: string // Ejemplo: "Tamaño"
    option3?: string // Ejemplo: "Sabor"
    option4?: string // Ejemplo: "Extras"
  }
  varieties?: {
    variety1?: string[] // Ejemplo: ["Masa fina", "Masa gruesa", "Media masa"]
    variety2?: string[] // Ejemplo: ["Pequeña", "Mediana", "Grande"]
    variety3?: string[] // Ejemplo: ["Margarita", "Pepperoni", "Hawaiana"]
    variety4?: string[] // Ejemplo: ["Sin extras", "Queso extra", "Aceitunas"]
  }
  // Adicionales
  addons?: {
    name: string
    price: number
  }[]
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  isPromotion?: boolean
  promotionDetails?: {
    promotionId: string
    selectedProducts: string[]
    selectedBeverages: string[]
  }
  // Nuevas propiedades para opciones seleccionadas
  selectedOptions?: {
    option1?: string
    option2?: string
    option3?: string
    option4?: string
  }
  selectedAddons?: {
    name: string
    price: number
  }[]
}

export interface ShopConfig {
  title: string
  bestSellersTitle: string
  breadcrumbText: string
  resultsText: string
  sortOptions: { value: string; label: string }[]
}

export interface LayoutConfig {
  type: string
  productStyle: string
}
