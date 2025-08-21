"use client"

import { useState } from 'react'
import { CartItem } from '@/components/shop/types'
import { Button } from '@/components/ui/button'
import { 
  ShoppingCart, 
  X, 
  Plus, 
  Minus, 
  Trash2,
  MessageCircle,
  Package
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { getWhatsAppUrl, createWhatsAppMessage } from '@/lib/whatsapp-config'

interface CartProps {
  items: CartItem[]
  isOpen: boolean
  onClose: () => void
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  onClearCart: () => void
}

export function Cart({ 
  items, 
  isOpen, 
  onClose, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart 
}: CartProps) {
  const { toast } = useToast()
  const [isSending, setIsSending] = useState(false)

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleSendWhatsApp = async () => {
    if (items.length === 0) {
      toast({
        title: 'Carrito vacío',
        description: 'Agrega productos antes de enviar el pedido',
        variant: 'destructive'
      })
      return
    }

    setIsSending(true)

    try {
      // Crear mensaje para WhatsApp
      const message = createWhatsAppMessage(items, total)
      
      // Crear URL de WhatsApp
      const whatsappUrl = getWhatsAppUrl(message)
      
      // Abrir WhatsApp en nueva pestaña
      window.open(whatsappUrl, '_blank')
      
      toast({
        title: 'Pedido enviado',
        description: 'Se abrió WhatsApp con tu pedido'
      })
      
      // Limpiar carrito después de enviar
      onClearCart()
      onClose()
      
    } catch (error) {
      console.error('Error enviando pedido:', error)
      toast({
        title: 'Error',
        description: 'No se pudo enviar el pedido. Inténtalo de nuevo.',
        variant: 'destructive'
      })
    } finally {
      setIsSending(false)
    }
  }



  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold">Carrito de Compras</h2>
            {itemCount > 0 && (
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                {itemCount}
              </span>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-gray-500">
                Agrega algunos productos para comenzar tu pedido
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                  {/* Imagen */}
                  <img 
                    src={item.image || '/placeholder.jpg'} 
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                  
                  {/* Información */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      ${item.price.toFixed(2)} c/u
                    </p>
                  </div>
                  
                  {/* Controles de cantidad */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    
                    <span className="text-sm font-medium w-8 text-center">
                      {item.quantity}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {/* Subtotal y eliminar */}
                  <div className="flex flex-col items-end space-y-1">
                    <span className="text-sm font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(item.id)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold text-blue-600">
                ${total.toFixed(2)}
              </span>
            </div>
            
            {/* Botones */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={onClearCart}
                className="flex-1"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Vaciar
              </Button>
              
              <Button
                onClick={handleSendWhatsApp}
                disabled={isSending}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                {isSending ? 'Enviando...' : 'Enviar por WhatsApp'}
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 text-center">
              Al hacer clic en "Enviar por WhatsApp" se abrirá la aplicación con tu pedido listo
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
