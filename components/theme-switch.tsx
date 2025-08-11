"use client"

import { useTheme } from '@/hooks/use-theme'
import { Button } from '@/components/ui/button'
import { Sun, Moon } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function ThemeSwitch() {
  const { isDarkMode, toggleTheme } = useTheme()
  
  console.log(`🎛️ ThemeSwitch: Renderizado con tema ${isDarkMode ? 'oscuro' : 'claro'}`)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => {
              console.log('🖱️ ThemeSwitch: Botón clickeado')
              toggleTheme()
            }}
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 text-yellow-500" />
            ) : (
              <Moon className="h-4 w-4 text-blue-600" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Cambiar a modo {isDarkMode ? 'claro' : 'nocturno'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
