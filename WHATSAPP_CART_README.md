# 🛒 Carrito de Compras con WhatsApp

Este sistema permite a los clientes agregar productos al carrito y enviar sus pedidos directamente por WhatsApp, sin necesidad de métodos de pago integrados.

## ✨ Características

- **Carrito flotante**: Botón flotante que muestra la cantidad de productos
- **Gestión de productos**: Agregar, quitar y modificar cantidades
- **Envío por WhatsApp**: Genera automáticamente un mensaje formateado
- **Diseño responsive**: Funciona en móviles y desktop
- **Configuración fácil**: Personaliza el número y mensaje

## 🚀 Configuración

### 1. Configurar el número de WhatsApp

Edita el archivo `lib/whatsapp-config.ts`:

```typescript
export const whatsappConfig = {
  // Cambia este número por el tuyo
  phoneNumber: '5491112345678', // Formato internacional sin +
  
  // Personaliza el mensaje
  customMessage: '¡Hola! Quisiera realizar este pedido...',
  
  // Nombre de tu tienda
  storeName: 'Mi Tienda',
  
  // Configuración adicional
  settings: {
    clearCartAfterSend: true,
    closeCartAfterSend: true
  }
}
```

### 2. Formato del número de teléfono

El número debe estar en formato internacional **sin el símbolo +**:

- **Argentina**: `5491112345678` (54 9 11 1234-5678)
- **México**: `5215512345678` (52 1 55 1234-5678)
- **España**: `34612345678` (34 612 345 678)
- **Estados Unidos**: `15551234567` (1 555 123-4567)

### 3. Personalizar el mensaje

Puedes modificar el mensaje que se envía al final del pedido:

```typescript
customMessage: '¡Hola! Quisiera realizar este pedido. ¿Podrías confirmarme la disponibilidad y el tiempo de entrega?'
```

## 📱 Cómo funciona

### Para el cliente:

1. **Agregar productos**: Hace clic en "Agregar al Carrito" en cualquier producto
2. **Ver carrito**: El botón flotante muestra la cantidad de productos
3. **Gestionar carrito**: Hace clic en el botón flotante para abrir el carrito
4. **Modificar cantidades**: Usa los botones + y - para ajustar cantidades
5. **Enviar pedido**: Hace clic en "Enviar por WhatsApp"
6. **WhatsApp se abre**: Con el pedido formateado listo para enviar

### Para el administrador:

1. **Recibir pedido**: Llega un mensaje formateado por WhatsApp
2. **Procesar pedido**: El mensaje incluye todos los detalles del pedido
3. **Confirmar**: Responde al cliente con disponibilidad y tiempo de entrega

## 📋 Formato del mensaje

El mensaje que se envía por WhatsApp incluye:

```
🛒 NUEVO PEDIDO - Mi Tienda 🛒

📅 Fecha: 15 de diciembre de 2024, 14:30
📦 Total de productos: 3

PRODUCTOS:
━━━━━━━━━━━━━━━━━━━━

1. iPhone 15 Pro
   Cantidad: 1
   Precio: $999.00
   Subtotal: $999.00

2. AirPods Pro
   Cantidad: 2
   Precio: $249.00
   Subtotal: $498.00

━━━━━━━━━━━━━━━━━━━━
💰 TOTAL: $1497.00 💰

¡Hola! Quisiera realizar este pedido...
```

## 🎨 Personalización

### Cambiar colores del botón flotante

Edita `components/shop/cart-button.tsx`:

```typescript
<Button
  onClick={onClick}
  className="relative bg-blue-600 hover:bg-blue-700" // Cambia estos colores
  size="lg"
>
```

### Cambiar colores del carrito

Edita `components/shop/cart.tsx`:

```typescript
<Button
  onClick={handleSendWhatsApp}
  className="flex-1 bg-green-600 hover:bg-green-700" // Cambia estos colores
>
```

## 🔧 Componentes principales

- **`Cart`**: Modal del carrito con lista de productos
- **`CartButton`**: Botón flotante que muestra cantidad
- **`whatsapp-config.ts`**: Configuración del número y mensaje
- **`categories-section.tsx`**: Botones "Agregar al Carrito" en productos

## 📱 Responsive

El carrito funciona perfectamente en:
- 📱 Móviles (botón flotante en esquina inferior derecha)
- 💻 Tablets (diseño adaptativo)
- 🖥️ Desktop (modal centrado)

## 🚨 Solución de problemas

### El botón de WhatsApp no funciona
- Verifica que el número esté en formato internacional sin +
- Asegúrate de que el número sea válido

### El mensaje no se formatea correctamente
- Revisa la configuración en `whatsapp-config.ts`
- Verifica que los productos tengan todos los campos necesarios

### El carrito no se abre
- Verifica que los componentes estén importados correctamente
- Revisa la consola del navegador para errores

## 🔄 Actualizaciones futuras

Posibles mejoras:
- [ ] Guardar carrito en localStorage
- [ ] Historial de pedidos
- [ ] Múltiples números de WhatsApp
- [ ] Plantillas de mensaje personalizables
- [ ] Integración con WhatsApp Business API

## 📞 Soporte

Si tienes problemas con la configuración:
1. Verifica el formato del número de teléfono
2. Revisa la consola del navegador
3. Asegúrate de que todos los componentes estén importados
4. Verifica que el archivo `whatsapp-config.ts` esté configurado correctamente
