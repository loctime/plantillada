import { Config } from "./config-loader"

// Tipos para los layouts
export interface LayoutComponent {
  (props: { config: Config }): JSX.Element
}

export interface LayoutRegistry {
  [key: string]: () => Promise<{ default: LayoutComponent }>
}

// Registro de layouts disponibles
export const layoutRegistry: LayoutRegistry = {
  fumigaciones: () => import('@/components/layouts/fumigaciones-layout'),
  'estudio-abogados': () => import('@/components/layouts/abogados-layout'),
  'estudio-contable': () => import('@/components/layouts/contable-layout'),
  'ingenieros': () => import('@/components/layouts/ingenieros-layout'),
  'blog-personal': () => import('@/components/layouts/blog-layout'),
  'coach-personal': () => import('@/components/layouts/coach-layout'),
  default: () => import('@/components/layouts/default-layout')
}

// Función para obtener el layout basado en el diseño seleccionado
export function getLayoutForDesign(designId: string): string {
  // Mapeo de diseños a layouts específicos
  const designToLayout: { [key: string]: string } = {
    'fumigaciones': 'fumigaciones',
    'estudio-abogados': 'estudio-abogados',
    'estudio-abogados-premium': 'estudio-abogados',
    'estudio-contable': 'estudio-contable',
    'ingenieros': 'ingenieros',
    'blog-personal': 'blog-personal',
    'coach-personal': 'coach-personal'
  }

  return designToLayout[designId] || 'default'
}

// Función para cargar un layout dinámicamente
export async function loadLayout(designId: string): Promise<LayoutComponent> {
  try {
    const layoutKey = getLayoutForDesign(designId)
    const layoutModule = await layoutRegistry[layoutKey]()
    return layoutModule.default
  } catch (error) {
    console.error(`Error loading layout for design ${designId}:`, error)
    // Fallback al layout por defecto
    const defaultModule = await layoutRegistry.default()
    return defaultModule.default
  }
}
