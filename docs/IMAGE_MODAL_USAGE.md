# Modal de Imagen Reutilizable

Este documento explica cómo usar el modal de imagen reutilizable que permite cambiar imágenes tanto por URL como subiendo archivos.

## Componentes

### 1. ImageModal
El componente principal del modal.

```tsx
import { ImageModal } from '@/components/image-modal'

<ImageModal
  isOpen={isOpen}
  onClose={onClose}
  onSave={handleSave}
  currentImage="https://ejemplo.com/imagen.jpg"
  title="Cambiar Imagen"
  placeholder="https://ejemplo.com/nueva-imagen.jpg"
  maxSize={5} // MB
  acceptedTypes={['image/jpeg', 'image/png', 'image/gif']}
/>
```

### 2. useImageModal Hook
Hook personalizado para manejar el estado del modal.

```tsx
import { useImageModal } from '@/hooks/use-image-modal'

const imageModal = useImageModal({
  onSave: (imageUrl) => {
    console.log('Nueva imagen:', imageUrl)
  },
  currentImage: 'https://ejemplo.com/imagen.jpg',
  title: 'Cambiar Imagen'
})

// Abrir modal
imageModal.openModal()

// Cerrar modal
imageModal.closeModal()
```

### 3. ImageModalTrigger
Componente de botón para abrir el modal.

```tsx
import { ImageModalTrigger } from '@/components/image-modal-trigger'

<ImageModalTrigger
  onClick={() => imageModal.openModal()}
  variant="outline"
  size="sm"
  icon="edit"
>
  Cambiar Imagen
</ImageModalTrigger>
```

## Ejemplos de Uso

### Ejemplo 1: Cambiar Logo
```tsx
import { useImageModal } from '@/hooks/use-image-modal'
import { ImageModal } from '@/components/image-modal'

function Header() {
  const logoModal = useImageModal({
    onSave: async (newLogoUrl) => {
      // Guardar el nuevo logo
      await saveLogo(newLogoUrl)
    }
  })

  return (
    <header>
      <div className="logo" onClick={() => logoModal.openModal()}>
        🍽️
      </div>
      
      <ImageModal
        isOpen={logoModal.isOpen}
        onClose={logoModal.closeModal}
        onSave={logoModal.handleSave}
        title="Cambiar Logo"
      />
    </header>
  )
}
```

### Ejemplo 2: Editar Imagen de Producto
```tsx
function ProductCard({ product }) {
  const imageModal = useImageModal()

  const handleEditImage = () => {
    imageModal.openModal({
      currentImage: product.image,
      title: `Editar Imagen - ${product.name}`,
      onSave: async (newImageUrl) => {
        // Actualizar producto
        await updateProduct(product.id, { image: newImageUrl })
      }
    })
  }

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <button onClick={handleEditImage}>
        <Edit3 className="h-4 w-4" />
      </button>
      
      <ImageModal
        isOpen={imageModal.isOpen}
        onClose={imageModal.closeModal}
        onSave={imageModal.handleSave}
        currentImage={imageModal.modalConfig.currentImage}
        title={imageModal.modalConfig.title}
      />
    </div>
  )
}
```

### Ejemplo 3: Con Botón Personalizado
```tsx
import { ImageModalTrigger } from '@/components/image-modal-trigger'

function ProfileSection() {
  const avatarModal = useImageModal({
    onSave: (newAvatarUrl) => {
      updateProfile({ avatar: newAvatarUrl })
    }
  })

  return (
    <div className="profile">
      <img src={user.avatar} alt="Avatar" />
      
      <ImageModalTrigger
        onClick={() => avatarModal.openModal({
          title: 'Cambiar Avatar',
          placeholder: 'https://ejemplo.com/avatar.jpg'
        })}
        variant="ghost"
        size="sm"
        icon="image"
      >
        Cambiar Foto
      </ImageModalTrigger>
      
      <ImageModal
        isOpen={avatarModal.isOpen}
        onClose={avatarModal.closeModal}
        onSave={avatarModal.handleSave}
        currentImage={avatarModal.modalConfig.currentImage}
        title={avatarModal.modalConfig.title}
      />
    </div>
  )
}
```

## Características

### ✅ Funcionalidades
- **URL de imagen**: Permite ingresar cualquier URL de imagen
- **Subir archivo**: Drag & drop o selección de archivo
- **Vista previa**: Muestra la imagen antes de guardar
- **Validación**: Tamaño y tipo de archivo
- **Reutilizable**: Un solo componente para toda la aplicación

### 🎨 Personalización
- **Título personalizable**
- **Placeholder personalizable**
- **Tamaño máximo configurable**
- **Tipos de archivo permitidos**
- **Estilos CSS personalizables**

### 🔧 Configuración
- **maxSize**: Tamaño máximo en MB (default: 5MB)
- **acceptedTypes**: Tipos de archivo permitidos
- **title**: Título del modal
- **placeholder**: Placeholder del campo URL

## API Endpoint

El modal utiliza el endpoint `/api/upload` para subir archivos. Asegúrate de que esté configurado correctamente.

## Estilos CSS

El modal incluye estilos responsivos y se adapta a diferentes tamaños de pantalla. Los estilos se pueden personalizar usando las clases CSS de Tailwind.
