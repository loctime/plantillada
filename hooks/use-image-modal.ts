import { useState } from 'react'

interface UseImageModalProps {
  onSave?: (imageUrl: string) => void
  currentImage?: string
  title?: string
}

export function useImageModal({ onSave, currentImage = '', title }: UseImageModalProps = {}) {
  const [isOpen, setIsOpen] = useState(false)
  const [modalConfig, setModalConfig] = useState({
    currentImage,
    title: title || 'Cambiar Imagen',
    onSave: onSave || (() => {})
  })

  const openModal = (config?: Partial<UseImageModalProps>) => {
    setModalConfig({
      currentImage: config?.currentImage || currentImage,
      title: config?.title || title || 'Cambiar Imagen',
      onSave: config?.onSave || onSave || (() => {})
    })
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  const handleSave = (imageUrl: string) => {
    modalConfig.onSave(imageUrl)
    closeModal()
  }

  return {
    isOpen,
    modalConfig,
    openModal,
    closeModal,
    handleSave
  }
}
