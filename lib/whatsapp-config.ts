// Configuración de WhatsApp para el carrito
export const whatsappConfig = {
  // Número de WhatsApp (formato internacional sin +)
  // Ejemplos:
  // Argentina: 5491112345678 (54 9 11 1234-5678)
  // México: 5215512345678 (52 1 55 1234-5678)
  // España: 34612345678 (34 612 345 678)
  // Estados Unidos: 15551234567 (1 555 123-4567)
  phoneNumber: '5491112345678', // Cambia este número por el tuyo
  
  // Mensaje personalizado que se envía al final del pedido
  customMessage: '¡Hola! Quisiera realizar este pedido. ¿Podrías confirmarme la disponibilidad y el tiempo de entrega?',
  
  // Nombre de la tienda que aparece en el mensaje
  storeName: 'Mi Tienda',
  
  // Configuración adicional
  settings: {
    // Si es true, limpia el carrito automáticamente después de enviar
    clearCartAfterSend: true,
    
    // Si es true, cierra el modal del carrito después de enviar
    closeCartAfterSend: true,
    
    // Formato de fecha para el mensaje
    dateFormat: {
      locale: 'es-ES',
      options: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    }
  }
}

// Función para obtener la URL de WhatsApp con el mensaje
export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${whatsappConfig.phoneNumber}?text=${encodeURIComponent(message)}`
}

// Función para crear el mensaje de WhatsApp
export function createWhatsAppMessage(items: any[], total: number): string {
  const date = new Date().toLocaleDateString(
    whatsappConfig.settings.dateFormat.locale,
    whatsappConfig.settings.dateFormat.options
  )

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  let message = `🛒 *NUEVO PEDIDO - ${whatsappConfig.storeName}* 🛒\n\n`
  message += `📅 *Fecha:* ${date}\n`
  message += `📦 *Total de productos:* ${itemCount}\n\n`
  message += `*PRODUCTOS:*\n`
  message += `━━━━━━━━━━━━━━━━━━━━\n\n`

  items.forEach((item, index) => {
    const subtotal = item.price * item.quantity
    message += `${index + 1}. *${item.name}*\n`
    message += `   Cantidad: ${item.quantity}\n`
    message += `   Precio: $${item.price.toFixed(2)}\n`
    message += `   Subtotal: $${subtotal.toFixed(2)}\n\n`
  })

  message += `━━━━━━━━━━━━━━━━━━━━\n`
  message += `💰 *TOTAL: $${total.toFixed(2)}* 💰\n\n`
  message += whatsappConfig.customMessage

  return message
}
