"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useAdmin } from '@/lib/admin-context'
import { useTheme } from '@/hooks/use-theme'
import { ColorConfig, ThemeConfig } from '@/lib/config-loader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Palette, Sun, Moon, Monitor, Sparkles, Save, Brush } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { getDesignById } from '@/lib/designs'

// Colores específicos de las plantillas
const templateThemes: { [key: string]: ThemeConfig } = {
  'estudio-contable': {
    light: {
      backgroundColor: '#ffffff',
      sectionBackground: '#f8fafc',
      navbarBackground: '#ffffff',
      textColor: '#1e293b',
      accentColor: '#f59e0b',
      primaryButtonColor: '#1e40af',
      secondaryButtonColor: '#64748b',
      outlineButtonColor: '#64748b'
    },
    dark: {
      backgroundColor: '#0f172a',
      sectionBackground: '#1e293b',
      navbarBackground: '#0f172a',
      textColor: '#f1f5f9',
      accentColor: '#f59e0b',
      primaryButtonColor: '#1e40af',
      secondaryButtonColor: '#64748b',
      outlineButtonColor: '#9ca3af'
    }
  },
  'estudio-abogados-premium': {
    light: {
      backgroundColor: '#ffffff',
      sectionBackground: '#f8f9fa',
      navbarBackground: '#ffffff',
      textColor: '#1a1a1a',
      accentColor: '#d4af37',
      primaryButtonColor: '#1a1a1a',
      secondaryButtonColor: '#8b8b8b',
      outlineButtonColor: '#8b8b8b'
    },
    dark: {
      backgroundColor: '#0f0f0f',
      sectionBackground: '#1a1a1a',
      navbarBackground: '#0f0f0f',
      textColor: '#f5f5f5',
      accentColor: '#d4af37',
      primaryButtonColor: '#d4af37',
      secondaryButtonColor: '#8b8b8b',
      outlineButtonColor: '#8b8b8b'
    }
  },
  'estudio-abogados': {
    light: {
      backgroundColor: '#f8f9fa',
      sectionBackground: '#ffffff',
      navbarBackground: '#1a1a1a',
      textColor: '#2c3e50',
      accentColor: '#d4af37',
      primaryButtonColor: '#1a1a1a',
      secondaryButtonColor: '#8b8b8b',
      outlineButtonColor: '#d4af37'
    },
    dark: {
      backgroundColor: '#1a1a1a',
      sectionBackground: '#2d2d2d',
      navbarBackground: '#000000',
      textColor: '#ffffff',
      accentColor: '#d4af37',
      primaryButtonColor: '#d4af37',
      secondaryButtonColor: '#8b8b8b',
      outlineButtonColor: '#ffffff'
    }
  },
  'ingenieros': {
    light: {
      backgroundColor: '#ffffff',
      sectionBackground: '#f8fafc',
      navbarBackground: '#ffffff',
      textColor: '#1e293b',
      accentColor: '#3b82f6',
      primaryButtonColor: '#059669',
      secondaryButtonColor: '#374151',
      outlineButtonColor: '#374151'
    },
    dark: {
      backgroundColor: '#0f172a',
      sectionBackground: '#1e293b',
      navbarBackground: '#0f172a',
      textColor: '#f1f5f9',
      accentColor: '#3b82f6',
      primaryButtonColor: '#059669',
      secondaryButtonColor: '#374151',
      outlineButtonColor: '#9ca3af'
    }
  },
  'psicologos': {
    light: {
      backgroundColor: '#ffffff',
      sectionBackground: '#f8fafc',
      navbarBackground: '#ffffff',
      textColor: '#1e293b',
      accentColor: '#8b5cf6',
      primaryButtonColor: '#6366f1',
      secondaryButtonColor: '#8b5cf6',
      outlineButtonColor: '#8b5cf6'
    },
    dark: {
      backgroundColor: '#0f172a',
      sectionBackground: '#1e293b',
      navbarBackground: '#0f172a',
      textColor: '#f1f5f9',
      accentColor: '#8b5cf6',
      primaryButtonColor: '#6366f1',
      secondaryButtonColor: '#8b5cf6',
      outlineButtonColor: '#a78bfa'
    }
  },
  'coaches': {
    light: {
      backgroundColor: '#ffffff',
      sectionBackground: '#f8fafc',
      navbarBackground: '#ffffff',
      textColor: '#1e293b',
      accentColor: '#f59e0b',
      primaryButtonColor: '#059669',
      secondaryButtonColor: '#3b82f6',
      outlineButtonColor: '#6b7280'
    },
    dark: {
      backgroundColor: '#0f172a',
      sectionBackground: '#1e293b',
      navbarBackground: '#0f172a',
      textColor: '#f1f5f9',
      accentColor: '#f59e0b',
      primaryButtonColor: '#059669',
      secondaryButtonColor: '#3b82f6',
      outlineButtonColor: '#9ca3af'
    }
  },
  'consultores': {
    light: {
      backgroundColor: '#ffffff',
      sectionBackground: '#f8fafc',
      navbarBackground: '#ffffff',
      textColor: '#1e293b',
      accentColor: '#10b981',
      primaryButtonColor: '#1e40af',
      secondaryButtonColor: '#64748b',
      outlineButtonColor: '#64748b'
    },
    dark: {
      backgroundColor: '#0f172a',
      sectionBackground: '#1e293b',
      navbarBackground: '#0f172a',
      textColor: '#f1f5f9',
      accentColor: '#10b981',
      primaryButtonColor: '#1e40af',
      secondaryButtonColor: '#64748b',
      outlineButtonColor: '#9ca3af'
    }
  }
}

// Tema por defecto
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

// Opciones de paletas de colores
const colorPalettes = [
  {
    id: 'default',
    name: 'Por Defecto',
    description: 'Paleta clásica verde y azul',
    colors: {
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
  },
  {
    id: 'abogados',
    name: 'Abogados',
    description: 'Elegante dorado y negro',
    colors: {
      light: {
        backgroundColor: '#fafafa',
        sectionBackground: '#f5f5f5',
        navbarBackground: '#ffffff',
        textColor: '#1a1a1a',
        accentColor: '#d4af37',
        primaryButtonColor: '#1a1a1a',
        secondaryButtonColor: '#8b8b8b',
        outlineButtonColor: '#8b8b8b'
      },
      dark: {
        backgroundColor: '#0f0f0f',
        sectionBackground: '#1a1a1a',
        navbarBackground: '#0f0f0f',
        textColor: '#f5f5f5',
        accentColor: '#d4af37',
        primaryButtonColor: '#d4af37',
        secondaryButtonColor: '#8b8b8b',
        outlineButtonColor: '#8b8b8b'
      }
    }
  },
  {
    id: 'contable',
    name: 'Contable',
    description: 'Profesional azul y naranja',
    colors: {
      light: {
        backgroundColor: '#f0f8ff',
        sectionBackground: '#e6f3ff',
        navbarBackground: '#ffffff',
        textColor: '#1e293b',
        accentColor: '#f59e0b',
        primaryButtonColor: '#1e40af',
        secondaryButtonColor: '#64748b',
        outlineButtonColor: '#64748b'
      },
      dark: {
        backgroundColor: '#0a1428',
        sectionBackground: '#1e293b',
        navbarBackground: '#0a1428',
        textColor: '#f1f5f9',
        accentColor: '#f59e0b',
        primaryButtonColor: '#1e40af',
        secondaryButtonColor: '#64748b',
        outlineButtonColor: '#9ca3af'
      }
    }
  },
  {
    id: 'ingenieros',
    name: 'Ingenieros',
    description: 'Técnico azul y verde',
    colors: {
      light: {
        backgroundColor: '#f0f9ff',
        sectionBackground: '#e0f2fe',
        navbarBackground: '#ffffff',
        textColor: '#1e293b',
        accentColor: '#3b82f6',
        primaryButtonColor: '#059669',
        secondaryButtonColor: '#374151',
        outlineButtonColor: '#374151'
      },
      dark: {
        backgroundColor: '#0c1a2e',
        sectionBackground: '#1e293b',
        navbarBackground: '#0c1a2e',
        textColor: '#f1f5f9',
        accentColor: '#3b82f6',
        primaryButtonColor: '#059669',
        secondaryButtonColor: '#374151',
        outlineButtonColor: '#9ca3af'
      }
    }
  },
  {
    id: 'psicologos',
    name: 'Psicólogos',
    description: 'Tranquilo púrpura y azul',
    colors: {
      light: {
        backgroundColor: '#faf5ff',
        sectionBackground: '#f3e8ff',
        navbarBackground: '#ffffff',
        textColor: '#1e293b',
        accentColor: '#8b5cf6',
        primaryButtonColor: '#6366f1',
        secondaryButtonColor: '#8b5cf6',
        outlineButtonColor: '#8b5cf6'
      },
      dark: {
        backgroundColor: '#1a0b2e',
        sectionBackground: '#1e293b',
        navbarBackground: '#1a0b2e',
        textColor: '#f1f5f9',
        accentColor: '#8b5cf6',
        primaryButtonColor: '#6366f1',
        secondaryButtonColor: '#8b5cf6',
        outlineButtonColor: '#a78bfa'
      }
    }
  },
  {
    id: 'coaches',
    name: 'Coaches',
    description: 'Energético naranja y verde',
    colors: {
      light: {
        backgroundColor: '#fffbeb',
        sectionBackground: '#fef3c7',
        navbarBackground: '#ffffff',
        textColor: '#1e293b',
        accentColor: '#f59e0b',
        primaryButtonColor: '#059669',
        secondaryButtonColor: '#3b82f6',
        outlineButtonColor: '#6b7280'
      },
      dark: {
        backgroundColor: '#2e1a0f',
        sectionBackground: '#1e293b',
        navbarBackground: '#2e1a0f',
        textColor: '#f1f5f9',
        accentColor: '#f59e0b',
        primaryButtonColor: '#059669',
        secondaryButtonColor: '#3b82f6',
        outlineButtonColor: '#9ca3af'
      }
    }
  },
  {
    id: 'consultores',
    name: 'Consultores',
    description: 'Profesional verde y azul',
    colors: {
      light: {
        backgroundColor: '#f0fdf4',
        sectionBackground: '#dcfce7',
        navbarBackground: '#ffffff',
        textColor: '#1e293b',
        accentColor: '#10b981',
        primaryButtonColor: '#1e40af',
        secondaryButtonColor: '#64748b',
        outlineButtonColor: '#64748b'
      },
      dark: {
        backgroundColor: '#0a1f0a',
        sectionBackground: '#1e293b',
        navbarBackground: '#0a1f0a',
        textColor: '#f1f5f9',
        accentColor: '#10b981',
        primaryButtonColor: '#1e40af',
        secondaryButtonColor: '#64748b',
        outlineButtonColor: '#9ca3af'
      }
    }
  }
]

export function ThemeManager() {
  const { config, updateConfig } = useAdmin()
  const { isDarkMode, toggleTheme } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [selectedPalette, setSelectedPalette] = useState<string>('default')
  const [editedColors, setEditedColors] = useState<ColorConfig>({
    backgroundColor: '#ffffff',
    sectionBackground: '#f8fafc',
    navbarBackground: '#ffffff',
    textColor: '#1e293b',
    accentColor: '#10b981',
    primaryButtonColor: '#10b981',
    secondaryButtonColor: '#3b82f6',
    outlineButtonColor: '#6b7280'
  })

  // Ref para throttling
  const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastAppliedColorsRef = useRef<string>('')

  // Función para obtener el tema activo basado en la plantilla seleccionada
  const getActiveTheme = useCallback((): ThemeConfig => {
    if (!config?.selectedDesigns) {
      return defaultTheme
    }

    // Buscar el diseño activo para la plantilla landing
    const activeDesignId = config.selectedDesigns.landing
    if (!activeDesignId) {
      return defaultTheme
    }

    // Buscar en los temas de plantillas
    const templateTheme = templateThemes[activeDesignId]
    if (templateTheme) {
      return templateTheme
    }

    // Si no se encuentra en las plantillas, usar el tema de la configuración
    if (config.theme) {
      return config.theme
    }

    return defaultTheme
  }, [config?.selectedDesigns, config?.theme])

  // Función para obtener los colores activos considerando la paleta seleccionada
  const getActiveColors = useCallback((): ColorConfig => {
    // Si hay una paleta seleccionada, usar sus colores
    if (selectedPalette !== 'default') {
      const palette = colorPalettes.find(p => p.id === selectedPalette)
      if (palette) {
        const paletteColors = isDarkMode ? palette.colors.dark : palette.colors.light
        return paletteColors
      }
    }

    // Si no hay paleta seleccionada o no se encuentra, usar el tema configurado
    const currentTheme = getActiveTheme()
    const activeTheme = isDarkMode ? currentTheme.dark : currentTheme.light
    return activeTheme
  }, [selectedPalette, isDarkMode, getActiveTheme])

  // Obtener configuración actual o usar valores por defecto
  const currentTheme = useMemo(() => getActiveTheme(), [getActiveTheme])
  const activeTheme = useMemo(() => getActiveColors(), [getActiveColors])

  // Función para aplicar colores inmediatamente (optimizada)
  const applyColors = useCallback((colors: ColorConfig) => {
    if (typeof document === 'undefined') {
      return
    }

    // Crear una clave única para los colores
    const colorsKey = JSON.stringify(colors)
    
    // Evitar aplicar los mismos colores múltiples veces
    if (lastAppliedColorsRef.current === colorsKey) {
      return
    }

    const root = document.documentElement
    const body = document.body

    // Aplicar colores de forma más eficiente
    const updates = [
      () => {
        Object.entries(colors).forEach(([key, value]) => {
          if (value) {
            const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
            root.style.setProperty(cssVar, value)
          }
        })
      },
      () => {
        // Crear color de navegación con transparencia
        if (colors.navbarBackground) {
          const navbarColor = colors.navbarBackground
          let navbarWithOpacity = navbarColor
          
          if (navbarColor.startsWith('#')) {
            const r = parseInt(navbarColor.slice(1, 3), 16)
            const g = parseInt(navbarColor.slice(3, 5), 16)
            const b = parseInt(navbarColor.slice(5, 7), 16)
            navbarWithOpacity = `rgba(${r}, ${g}, ${b}, 0.8)`
          } else if (navbarColor.startsWith('rgb(')) {
            navbarWithOpacity = navbarColor.replace('rgb(', 'rgba(').replace(')', ', 0.8)')
          }
          
          root.style.setProperty('--navbar-background-transparent', navbarWithOpacity)
        }
      },
      () => {
        // Aplicar colores directamente a elementos principales
        if (colors.backgroundColor) {
          body.style.backgroundColor = colors.backgroundColor
          root.style.backgroundColor = colors.backgroundColor
        }

        if (colors.textColor) {
          body.style.color = colors.textColor
        }
      }
    ]

    // Ejecutar todas las actualizaciones de una vez
    updates.forEach(update => update())
    
    // Actualizar la referencia de colores aplicados
    lastAppliedColorsRef.current = colorsKey
  }, [])

  // Aplicar colores del tema activo cuando cambia el modo o el tema
  useEffect(() => {
    applyColors(activeTheme)
  }, [activeTheme, applyColors])

  // Inicializar colores editados cuando se activa la edición
  useEffect(() => {
    if (isEditing) {
      setEditedColors(activeTheme)
    }
  }, [isEditing, activeTheme])

  // Función para aplicar paleta de colores
  const applyPalette = useCallback((paletteId: string) => {
    const palette = colorPalettes.find(p => p.id === paletteId)
    if (!palette) {
      return
    }
    
    // Actualizar la paleta seleccionada
    setSelectedPalette(paletteId)
    
    // Si estamos editando, actualizar los colores editados
    if (isEditing) {
      const paletteColors = isDarkMode ? palette.colors.dark : palette.colors.light
      setEditedColors(paletteColors)
    }
  }, [isEditing, isDarkMode])

  // Función para guardar cambios
  const saveChanges = useCallback(async () => {
    try {
      // Si hay una paleta seleccionada, crear un tema completo con ambos modos
      let newTheme: ThemeConfig
      
      if (selectedPalette !== 'default') {
        const palette = colorPalettes.find(p => p.id === selectedPalette)
        if (palette) {
          // Usar los colores de la paleta para ambos modos
          newTheme = {
            light: palette.colors.light,
            dark: palette.colors.dark
          }
        } else {
          // Fallback al tema actual
          newTheme = {
            ...currentTheme,
            [isDarkMode ? 'dark' : 'light']: editedColors
          }
        }
      } else {
        // Usar el tema actual con los cambios editados
        newTheme = {
          ...currentTheme,
          [isDarkMode ? 'dark' : 'light']: editedColors
        }
      }

      // Actualizar la configuración
      if (updateConfig) {
        await updateConfig({
          ...config,
          theme: newTheme
        })
      }

      setIsEditing(false)
    } catch (error) {
      console.error('Error al guardar cambios:', error)
    }
  }, [selectedPalette, currentTheme, isDarkMode, editedColors, config, updateConfig])

  // Función para cancelar edición
  const cancelEditing = useCallback(() => {
    setEditedColors(activeTheme)
    setIsEditing(false)
  }, [activeTheme])

  // Función para manejar cambios en colores (con throttling)
  const handleColorChange = useCallback((key: keyof ColorConfig, value: string) => {
    const newColors = { ...editedColors, [key]: value }
    setEditedColors(newColors)
    
    // Limpiar timeout anterior si existe
    if (throttleTimeoutRef.current) {
      clearTimeout(throttleTimeoutRef.current)
    }
    
    // Aplicar cambios con throttling para mejorar rendimiento
    throttleTimeoutRef.current = setTimeout(() => {
      applyColors(newColors)
    }, 16) // ~60fps
  }, [editedColors, applyColors])

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current)
      }
    }
  }, [])

  return (
    <Card className="w-full max-w-md max-h-[70vh] flex flex-col shadow-xl">
      <CardHeader className="pb-2 flex-shrink-0 bg-gray-50/50 dark:bg-gray-800/50">
        <CardTitle className="flex items-center gap-2 text-base">
          <Palette className="h-4 w-4" />
          Gestor de Colores
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 flex-1 overflow-y-auto pr-2 max-h-[calc(70vh-80px)]">
        {/* Selector de modo */}
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Modo de Tema</Label>
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={!isDarkMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => !isDarkMode || toggleTheme()}
                    className="h-8 w-8 p-0"
                  >
                    <Sun className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Modo Claro</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isDarkMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => isDarkMode || toggleTheme()}
                    className="h-8 w-8 p-0"
                  >
                    <Moon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Modo Oscuro</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Switch de modo oscuro/claro más prominente */}
        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2">
            {isDarkMode ? (
              <Moon className="h-4 w-4 text-blue-600" />
            ) : (
              <Sun className="h-4 w-4 text-yellow-600" />
            )}
            <span className="text-sm font-medium">
              {isDarkMode ? 'Modo Oscuro' : 'Modo Claro'}
            </span>
          </div>
          <Switch
            checked={isDarkMode}
            onCheckedChange={toggleTheme}
          />
        </div>

        <Separator />

        {/* Información de plantilla activa */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" />
          <span>
            Plantilla: {config?.selectedDesigns?.landing || 'Por defecto'}
          </span>
        </div>

        <Separator />

        {/* Selector de paletas de colores */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brush className="h-4 w-4" />
              <Label className="text-sm font-medium">Paletas de Colores</Label>
            </div>
            {selectedPalette !== 'default' && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedPalette('default')
                        console.log('🎨 ThemeManager: Reseteando a tema configurado')
                      }}
                      className="h-7 px-2 text-xs"
                    >
                      Resetear
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Volver al tema configurado</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-1.5">
            {colorPalettes.map((palette) => {
              const paletteColors = isDarkMode ? palette.colors.dark : palette.colors.light
              return (
                <TooltipProvider key={palette.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={selectedPalette === palette.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => applyPalette(palette.id)}
                        className="h-auto p-2 flex flex-col items-center gap-1.5"
                      >
                        <div className="flex gap-1">
                          <div
                            className="w-2.5 h-2.5 rounded border"
                            style={{ backgroundColor: paletteColors.accentColor }}
                          />
                          <div
                            className="w-2.5 h-2.5 rounded border"
                            style={{ backgroundColor: paletteColors.primaryButtonColor }}
                          />
                          <div
                            className="w-2.5 h-2.5 rounded border"
                            style={{ backgroundColor: paletteColors.secondaryButtonColor }}
                          />
                        </div>
                        <span className="text-xs font-medium">{palette.name}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{palette.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            })}
          </div>
        </div>

        <Separator />

        {/* Controles de edición */}
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Editar Colores</Label>
          <Switch
            checked={isEditing}
            onCheckedChange={setIsEditing}
          />
        </div>

        {/* Colores editables */}
        {isEditing ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs">Fondo Principal</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={editedColors.backgroundColor || '#ffffff'}
                    onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                    className="w-12 h-8 p-1"
                  />
                  <Input
                    type="text"
                    value={editedColors.backgroundColor || ''}
                    onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                    className="flex-1 text-xs"
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Fondo Secciones</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={editedColors.sectionBackground || '#f8fafc'}
                    onChange={(e) => handleColorChange('sectionBackground', e.target.value)}
                    className="w-12 h-8 p-1"
                  />
                  <Input
                    type="text"
                    value={editedColors.sectionBackground || ''}
                    onChange={(e) => handleColorChange('sectionBackground', e.target.value)}
                    className="flex-1 text-xs"
                    placeholder="#f8fafc"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Color Texto</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={editedColors.textColor || '#1e293b'}
                    onChange={(e) => handleColorChange('textColor', e.target.value)}
                    className="w-12 h-8 p-1"
                  />
                  <Input
                    type="text"
                    value={editedColors.textColor || ''}
                    onChange={(e) => handleColorChange('textColor', e.target.value)}
                    className="flex-1 text-xs"
                    placeholder="#1e293b"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Color Acento</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={editedColors.accentColor || '#10b981'}
                    onChange={(e) => handleColorChange('accentColor', e.target.value)}
                    className="w-12 h-8 p-1"
                  />
                  <Input
                    type="text"
                    value={editedColors.accentColor || ''}
                    onChange={(e) => handleColorChange('accentColor', e.target.value)}
                    className="flex-1 text-xs"
                    placeholder="#10b981"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Botón Primario</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={editedColors.primaryButtonColor || '#10b981'}
                    onChange={(e) => handleColorChange('primaryButtonColor', e.target.value)}
                    className="w-12 h-8 p-1"
                  />
                  <Input
                    type="text"
                    value={editedColors.primaryButtonColor || ''}
                    onChange={(e) => handleColorChange('primaryButtonColor', e.target.value)}
                    className="flex-1 text-xs"
                    placeholder="#10b981"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Botón Secundario</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={editedColors.secondaryButtonColor || '#3b82f6'}
                    onChange={(e) => handleColorChange('secondaryButtonColor', e.target.value)}
                    className="w-12 h-8 p-1"
                  />
                  <Input
                    type="text"
                    value={editedColors.secondaryButtonColor || ''}
                    onChange={(e) => handleColorChange('secondaryButtonColor', e.target.value)}
                    className="flex-1 text-xs"
                    placeholder="#3b82f6"
                  />
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-2 pt-2 pb-4">
              <Button
                onClick={saveChanges}
                size="sm"
                className="flex-1"
              >
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </Button>
              <Button
                onClick={cancelEditing}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          /* Vista previa de colores */
          <div className="space-y-3 pb-4">
            {/* Indicador del modo activo y paleta */}
            <div className="flex items-center justify-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2">
                {isDarkMode ? (
                  <Moon className="h-4 w-4 text-blue-600" />
                ) : (
                  <Sun className="h-4 w-4 text-yellow-600" />
                )}
                <span className="text-sm font-medium">
                  Vista previa: {isDarkMode ? 'Modo Oscuro' : 'Modo Claro'}
                </span>
                {selectedPalette !== 'default' && (
                  <>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs font-medium text-blue-600">
                      {colorPalettes.find(p => p.id === selectedPalette)?.name || selectedPalette}
                    </span>
                  </>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs">Fondo Principal</Label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-6 rounded border"
                    style={{ backgroundColor: activeTheme.backgroundColor }}
                  />
                  <span className="text-xs font-mono">{activeTheme.backgroundColor}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Fondo Secciones</Label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-6 rounded border"
                    style={{ backgroundColor: activeTheme.sectionBackground }}
                  />
                  <span className="text-xs font-mono">{activeTheme.sectionBackground}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Color Texto</Label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-6 rounded border"
                    style={{ backgroundColor: activeTheme.textColor }}
                  />
                  <span className="text-xs font-mono">{activeTheme.textColor}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Color Acento</Label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-6 rounded border"
                    style={{ backgroundColor: activeTheme.accentColor }}
                  />
                  <span className="text-xs font-mono">{activeTheme.accentColor}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Botón Primario</Label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-6 rounded border"
                    style={{ backgroundColor: activeTheme.primaryButtonColor }}
                  />
                  <span className="text-xs font-mono">{activeTheme.primaryButtonColor}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Botón Secundario</Label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-6 rounded border"
                    style={{ backgroundColor: activeTheme.secondaryButtonColor }}
                  />
                  <span className="text-xs font-mono">{activeTheme.secondaryButtonColor}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
