"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Palette, CheckCircle } from "lucide-react"
import { shopDesigns, Design } from "@/lib/designs"

interface ShopDesignSelectorProps {
  selectedDesign?: string
  onDesignSelect: (design: Design) => void
  className?: string
}

export function ShopDesignSelector({ 
  selectedDesign, 
  onDesignSelect, 
  className = "" 
}: ShopDesignSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleDesignSelect = (designId: string) => {
    const design = shopDesigns.find(d => d.id === designId)
    if (design) {
      onDesignSelect(design)
      setIsOpen(false)
    }
  }

  const currentDesign = shopDesigns.find(d => d.id === selectedDesign)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`${className}`}
        >
          <Palette className="h-4 w-4 mr-2" />
          {currentDesign ? currentDesign.name : "Diseños"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm">Seleccionar Diseño</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Elige el estilo visual de tu tienda
          </p>
        </div>
        <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
          {shopDesigns.map((design) => (
            <Card 
              key={design.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedDesign === design.id 
                  ? 'ring-2 ring-blue-500 border-blue-500' 
                  : 'hover:border-gray-300'
              }`}
              onClick={() => handleDesignSelect(design.id)}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-md text-white"
                      style={{ backgroundColor: design.colorScheme.primary }}
                    >
                      {design.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{design.name}</span>
                        {selectedDesign === design.id && (
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {design.description}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 flex gap-2">
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: design.colorScheme.primary }}
                    title="Color primario"
                  />
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: design.colorScheme.secondary }}
                    title="Color secundario"
                  />
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: design.colorScheme.accent }}
                    title="Color de acento"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
