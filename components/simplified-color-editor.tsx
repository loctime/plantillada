"use client"

import { useState, useEffect } from 'react'
import { useAdmin } from '@/lib/admin-context'
import { useTheme } from '@/hooks/use-theme'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Palette, RotateCcw, Sun, Moon } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { 
  SimplifiedTheme, 
  SimplifiedColorScheme, 
  DEFAULT_SIMPLIFIED_THEME,
  applySimplifiedColors,
  getCurrentSimplifiedTheme
} from '@/lib/simplified-colors'

// Etiquetas en español para los colores
const COLOR_LABELS: Record<keyof SimplifiedColorScheme, string> = {
  primary: 'Color Principal',
  secondary: 'Color Secundario', 
  tertiary: 'Color 3',
  border1: 'Color de Bordes',
  border2: 'Color de Bordes 2',
  text: 'Color de Letras'
}

export function SimplifiedColorEditor() {
  const { config, updateConfig, isAdminMode } = useAdmin()
  const { isDarkMode } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<SimplifiedTheme>(DEFAULT_SIMPLIFIED_THEME)
  const [activeMode, setActiveMode] = useState<'light' | 'dark'>('light')

  // Cargar tema actual al abrir
  useEffect(() => {
    if (isOpen) {
      const theme = getCurrentSimplifiedTheme()
      setCurrentTheme(theme)
      setActiveMode(isDarkMode ? 'dark' : 'light')
    }
  }, [isOpen, isDarkMode])

  if (!isAdminMode || !config) return null

  const handleColorChange = async (colorKey: keyof SimplifiedColorScheme, value: string) => {
    // Actualizar estado local
    setCurrentTheme(prev => ({
      ...prev,
      [activeMode]: {
        ...prev[activeMode],
        [colorKey]: value
      }
    }))

    // Aplicar inmediatamente al DOM
    const newTheme = {
      ...currentTheme,
      [activeMode]: {
        ...currentTheme[activeMode],
        [colorKey]: value
      }
    }
    applySimplifiedColors(newTheme, isDarkMode)

    // Guardar en configuración
    try {
      await updateConfig({
        simplifiedColors: newTheme
      } as any)
      console.log('✅ Colores simplificados guardados')
    } catch (error) {
      console.error('❌ Error al guardar colores:', error)
    }
  }

  const handleReset = async () => {
    setCurrentTheme(DEFAULT_SIMPLIFIED_THEME)
    applySimplifiedColors(DEFAULT_SIMPLIFIED_THEME, isDarkMode)
    
    try {
      await updateConfig({
        simplifiedColors: DEFAULT_SIMPLIFIED_THEME
      } as any)
      console.log('✅ Colores reseteados a valores por defecto')
    } catch (error) {
      console.error('❌ Error al resetear colores:', error)
    }
  }

  const currentColors = currentTheme[activeMode]

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0"
              >
                <Palette className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-96">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Editor de Colores Simplificado
                </SheetTitle>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                {/* Selector de modo */}
                <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                  <Button
                    variant={activeMode === 'light' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveMode('light')}
                    className="flex items-center gap-2"
                  >
                    <Sun className="h-4 w-4" />
                    Claro
                  </Button>
                  <Button
                    variant={activeMode === 'dark' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveMode('dark')}
                    className="flex items-center gap-2"
                  >
                    <Moon className="h-4 w-4" />
                    Oscuro
                  </Button>
                </div>

                {/* Editor de colores */}
                <div className="space-y-4">
                  {Object.entries(COLOR_LABELS).map(([key, label]) => (
                    <div key={key} className="space-y-2">
                      <Label className="text-sm font-medium">
                        {label}
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={currentColors[key as keyof SimplifiedColorScheme]}
                          onChange={(e) => handleColorChange(
                            key as keyof SimplifiedColorScheme, 
                            e.target.value
                          )}
                          className="w-12 h-10 p-1 border rounded"
                        />
                        <Input
                          type="text"
                          value={currentColors[key as keyof SimplifiedColorScheme]}
                          onChange={(e) => handleColorChange(
                            key as keyof SimplifiedColorScheme, 
                            e.target.value
                          )}
                          placeholder="#000000"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Botón de reset */}
                <div className="pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="w-full flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Restablecer Colores por Defecto
                  </Button>
                </div>

                {/* Vista previa */}
                <div className="pt-4 border-t">
                  <Label className="text-sm font-medium mb-2 block">
                    Vista Previa
                  </Label>
                  <div 
                    className="p-4 rounded-lg border"
                    style={{
                      backgroundColor: currentColors.primary,
                      color: currentColors.text,
                      borderColor: currentColors.border1
                    }}
                  >
                    <div className="space-y-2">
                      <div 
                        className="h-8 rounded"
                        style={{ backgroundColor: currentColors.secondary }}
                      />
                      <div 
                        className="h-6 rounded"
                        style={{ backgroundColor: currentColors.tertiary }}
                      />
                      <div 
                        className="h-4 rounded border-2"
                        style={{ 
                          backgroundColor: 'transparent',
                          borderColor: currentColors.border2 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </TooltipTrigger>
        <TooltipContent>
          <p>Editor de Colores Simplificado</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
