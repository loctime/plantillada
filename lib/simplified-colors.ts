// Sistema de Colores Simplificado - Plantillada
// Este archivo define un esquema de colores simple y manejable

export interface SimplifiedColorScheme {
  // Colores principales
  primary: string      // Color principal
  secondary: string    // Color secundario  
  tertiary: string     // Color 3
  border1: string      // Color de bordes
  border2: string      // Color de bordes 2
  text: string         // Color de letras
}

export interface SimplifiedTheme {
  light: SimplifiedColorScheme
  dark: SimplifiedColorScheme
}

// Esquema de colores por defecto según tu especificación
export const DEFAULT_SIMPLIFIED_THEME: SimplifiedTheme = {
  light: {
    primary: '#f5f5dc',      // beige
    secondary: '#87ceeb',    // celeste
    tertiary: '#90ee90',     // verde claro
    border1: '#0000ff',      // azul
    border2: '#000000',      // negro
    text: '#000000'          // negro
  },
  dark: {
    primary: '#2f2f2f',      // negro mate
    secondary: '#4a90e2',    // azul (puedes cambiar por el que prefieras)
    tertiary: '#6b8e23',     // verde oliva (puedes cambiar por el que prefieras)
    border1: '#8a2be2',      // violeta
    border2: '#0000ff',      // azul
    text: '#ffffff'          // blanco
  }
}

// Mapeo de colores simplificados a variables CSS del sistema
export const SIMPLIFIED_TO_CSS_MAP: Record<keyof SimplifiedColorScheme, string> = {
  primary: '--background-color',
  secondary: '--accent-color', 
  tertiary: '--secondary-button-color',
  border1: '--border-color',
  border2: '--card-foreground',
  text: '--text-color'
}

// Función para aplicar el esquema simplificado
export function applySimplifiedColors(theme: SimplifiedTheme, isDarkMode: boolean = false) {
  const colorScheme = isDarkMode ? theme.dark : theme.light
  
  Object.entries(SIMPLIFIED_TO_CSS_MAP).forEach(([key, cssVar]) => {
    const color = colorScheme[key as keyof SimplifiedColorScheme]
    if (color) {
      document.documentElement.style.setProperty(cssVar, color)
    }
  })
  
  // Aplicar colores adicionales derivados
  const root = document.documentElement
  
  // Colores derivados para modo claro
  if (!isDarkMode) {
    root.style.setProperty('--section-background', colorScheme.primary)
    root.style.setProperty('--navbar-background', colorScheme.primary)
    root.style.setProperty('--primary-button-color', colorScheme.secondary)
    root.style.setProperty('--card-background', colorScheme.primary)
    root.style.setProperty('--heading-color', colorScheme.text)
  } else {
    // Colores derivados para modo oscuro
    root.style.setProperty('--section-background', colorScheme.primary)
    root.style.setProperty('--navbar-background', colorScheme.primary)
    root.style.setProperty('--primary-button-color', colorScheme.secondary)
    root.style.setProperty('--card-background', colorScheme.primary)
    root.style.setProperty('--heading-color', colorScheme.text)
  }
}

// Función para obtener el esquema actual
export function getCurrentSimplifiedTheme(): SimplifiedTheme {
  const root = document.documentElement
  const isDark = root.classList.contains('dark')
  
  const getColor = (cssVar: string) => {
    return getComputedStyle(root).getPropertyValue(cssVar).trim() || undefined
  }
  
  const light: SimplifiedColorScheme = {
    primary: getColor('--background-color') || DEFAULT_SIMPLIFIED_THEME.light.primary,
    secondary: getColor('--accent-color') || DEFAULT_SIMPLIFIED_THEME.light.secondary,
    tertiary: getColor('--secondary-button-color') || DEFAULT_SIMPLIFIED_THEME.light.tertiary,
    border1: getColor('--border-color') || DEFAULT_SIMPLIFIED_THEME.light.border1,
    border2: getColor('--card-foreground') || DEFAULT_SIMPLIFIED_THEME.light.border2,
    text: getColor('--text-color') || DEFAULT_SIMPLIFIED_THEME.light.text
  }
  
  const dark: SimplifiedColorScheme = {
    primary: getColor('--background-color') || DEFAULT_SIMPLIFIED_THEME.dark.primary,
    secondary: getColor('--accent-color') || DEFAULT_SIMPLIFIED_THEME.dark.secondary,
    tertiary: getColor('--secondary-button-color') || DEFAULT_SIMPLIFIED_THEME.dark.tertiary,
    border1: getColor('--border-color') || DEFAULT_SIMPLIFIED_THEME.dark.border1,
    border2: getColor('--card-foreground') || DEFAULT_SIMPLIFIED_THEME.dark.border2,
    text: getColor('--text-color') || DEFAULT_SIMPLIFIED_THEME.dark.text
  }
  
  return { light, dark }
}

// Función para resetear a los colores por defecto
export function resetToDefaultColors() {
  applySimplifiedColors(DEFAULT_SIMPLIFIED_THEME, document.documentElement.classList.contains('dark'))
}
