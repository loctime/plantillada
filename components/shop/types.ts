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
