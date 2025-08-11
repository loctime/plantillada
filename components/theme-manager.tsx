"use client"

import { useState } from 'react'
import { useAdmin } from '@/lib/admin-context'
import { useTheme } from '@/hooks/use-theme'
import { ColorConfig, ThemeConfig } from '@/lib/config-loader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Palette, Sun, Moon, Monitor } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'



export function ThemeManager() {
  const { config, updateConfig } = useAdmin()
  const [isOpen, setIsOpen] = useState(false)
  const { isDarkMode, setTheme } = useTheme()

  // Configuración por defecto de colores
  const defaultTheme: ThemeConfig = {
    light: {
      backgroundColor: '#ffffff',
      sectionBackground: '#f8fafc',
      navbarBackground: '#ffffff',
      textColor: '#1e293b',
      accentColor: '#10b981',
      primaryButtonColor: '#10b981',
      secondaryButtonColor: '#3b82f6',
      outlineButtonColor: '#6b7280'
    },
    dark: {
      backgroundColor: '#0f172a',
      sectionBackground: '#1e293b',
      navbarBackground: '#0f172a',
      textColor: '#f1f5f9',
      accentColor: '#10b981',
      primaryButtonColor: '#10b981',
      secondaryButtonColor: '#3b82f6',
      outlineButtonColor: '#9ca3af'
    }
  }

  // Obtener configuración actual o usar valores por defecto
  const currentTheme = config?.theme || defaultTheme
  const activeTheme = isDarkMode ? currentTheme.dark : currentTheme.light

  const handleColorChange = async (colorType: keyof ColorConfig, value: string) => {
    const newTheme = {
      ...currentTheme,
      [isDarkMode ? 'dark' : 'light']: {
        ...currentTheme[isDarkMode ? 'dark' : 'light'],
        [colorType]: value
      }
    }

    await updateConfig({ theme: newTheme })
  }

  const toggleDarkMode = () => {
    setTheme(!isDarkMode)
  }

  const ColorPicker = ({ 
    label, 
    colorType, 
    currentColor, 
    description 
  }: { 
    label: string
    colorType: keyof ColorConfig
    currentColor: string
    description: string
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              className="w-8 h-8 rounded border-2 border-gray-300 cursor-pointer"
              style={{ backgroundColor: currentColor }}
              onClick={() => {
                const input = document.createElement('input')
                input.type = 'color'
                input.value = currentColor
                input.onchange = (e) => {
                  const target = e.target as HTMLInputElement
                  handleColorChange(colorType, target.value)
                }
                input.click()
              }}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Haz clic para cambiar color</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )

  if (!isOpen) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsOpen(true)}
              variant="outline"
              size="sm"
              className="shadow-lg"
            >
              <Palette className="h-4 w-4 mr-2" />
              Colores
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Gestionar colores del tema</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <Card className="w-96 shadow-xl border-2 max-h-[80vh] flex flex-col">
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Gestor de Colores
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              ×
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 flex-1 overflow-y-auto">
          {/* Switch de modo nocturno */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              {isDarkMode ? (
                <Moon className="h-4 w-4 text-blue-600" />
              ) : (
                <Sun className="h-4 w-4 text-yellow-600" />
              )}
              <span className="text-sm font-medium">
                {isDarkMode ? 'Modo Nocturno' : 'Modo Claro'}
              </span>
            </div>
            <Switch
              checked={isDarkMode}
              onCheckedChange={toggleDarkMode}
            />
          </div>

          <Separator />

          {/* Selector de colores */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Monitor className="h-4 w-4" />
              Colores del {isDarkMode ? 'Modo Nocturno' : 'Modo Claro'}
            </div>

            <ColorPicker
              label="Fondo Principal"
              colorType="backgroundColor"
              currentColor={activeTheme.backgroundColor}
              description="Color de fondo de toda la página web"
            />

            <ColorPicker
              label="Fondo de Secciones"
              colorType="sectionBackground"
              currentColor={activeTheme.sectionBackground}
              description="Color de fondo de las secciones de contenido"
            />

            <ColorPicker
              label="Fondo de Navegación"
              colorType="navbarBackground"
              currentColor={activeTheme.navbarBackground}
              description="Color de fondo de la barra de navegación (se aplica con transparencia)"
            />

            <ColorPicker
              label="Color de Texto"
              colorType="textColor"
              currentColor={activeTheme.textColor}
              description="Color principal del texto"
            />

            <ColorPicker
              label="Color de Acento"
              colorType="accentColor"
              currentColor={activeTheme.accentColor}
              description="Color de elementos destacados y enlaces"
            />

            <ColorPicker
              label="Botones Principales"
              colorType="primaryButtonColor"
              currentColor={activeTheme.primaryButtonColor}
              description="Color de fondo de botones principales (Agendar, CTA)"
            />

            <ColorPicker
              label="Botones Secundarios"
              colorType="secondaryButtonColor"
              currentColor={activeTheme.secondaryButtonColor}
              description="Color de fondo de botones secundarios"
            />

            <ColorPicker
              label="Botones Outline"
              colorType="outlineButtonColor"
              currentColor={activeTheme.outlineButtonColor}
              description="Color de borde y texto de botones outline"
            />
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2 pt-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                updateConfig({ theme: defaultTheme })
              }}
              className="flex-1"
            >
              Restaurar
            </Button>
            <Button
              size="sm"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cerrar
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
