"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Palette } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  label?: string
  className?: string
  showLabel?: boolean
  compact?: boolean
}

export function ColorPicker({ 
  value, 
  onChange, 
  label = "Color", 
  className = "",
  showLabel = true,
  compact = false
}: ColorPickerProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleColorChange = (newColor: string) => {
    onChange(newColor)
  }

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className={`h-8 w-8 p-1 ${className}`}
              style={{ backgroundColor: value }}
            >
              <Palette className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{label}: {value}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && (
        <Label className="text-xs font-medium">{label}</Label>
      )}
      
      <div className="flex gap-2">
        <Input
          type="color"
          value={value || '#000000'}
          onChange={(e) => handleColorChange(e.target.value)}
          className="w-12 h-8 p-1 cursor-pointer"
        />
        <Input
          type="text"
          value={value || ''}
          onChange={(e) => handleColorChange(e.target.value)}
          className="flex-1 text-xs"
          placeholder="#000000"
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 w-8 p-1"
                style={{ backgroundColor: value }}
              >
                <Palette className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Selector de color</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Colores predefinidos */}
      {isExpanded && (
        <div className="grid grid-cols-8 gap-1 pt-2">
          {[
            '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
            '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080',
            '#008000', '#ffc0cb', '#a52a2a', '#808080', '#000080',
            '#800000', '#808000', '#008080', '#ff6347', '#40e0d0',
            '#ee82ee', '#f5deb3', '#ffffff', '#f0f8ff', '#faf0e6',
            '#f0fff0', '#fff0f5', '#ffe4e1', '#fff5ee', '#f0f0f0',
            '#e6e6fa', '#fffacd', '#f0f8ff', '#f5f5dc', '#ffe4c4',
            '#ffefd5', '#fdf5e6', '#faf0e6', '#f5f5f5', '#f8f8ff'
          ].map((color) => (
            <button
              key={color}
              onClick={() => handleColorChange(color)}
              className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      )}
    </div>
  )
}
