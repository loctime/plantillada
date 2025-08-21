"use client"

import { CartItem } from '@/components/shop/types'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'

interface CartButtonProps {
  items: CartItem[]
  onClick: () => void
}

export function CartButton({ items, onClick }: CartButtonProps) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Button
        onClick={onClick}
        className="relative bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200"
        size="lg"
      >
        <ShoppingCart className="h-6 w-6" />
        
        {/* Badge con cantidad */}
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
        
        {/* Tooltip con total */}
        {itemCount > 0 && (
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Total: ${total.toFixed(2)}
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </Button>
    </div>
  )
}
