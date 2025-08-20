"use client"

import { Edit3, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ImageModalTriggerProps {
  onClick: () => void
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: 'edit' | 'image'
  children?: React.ReactNode
  className?: string
  disabled?: boolean
}

export function ImageModalTrigger({
  onClick,
  variant = 'outline',
  size = 'sm',
  icon = 'edit',
  children,
  className,
  disabled = false
}: ImageModalTriggerProps) {
  const getIcon = () => {
    switch (icon) {
      case 'image':
        return <ImageIcon className="h-4 w-4" />
      case 'edit':
      default:
        return <Edit3 className="h-4 w-4" />
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "transition-all duration-200",
        className
      )}
    >
      {getIcon()}
      {children && <span className="ml-2">{children}</span>}
    </Button>
  )
}
