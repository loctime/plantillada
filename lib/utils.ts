import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Genera un ID único para productos y otros elementos
 * Combina timestamp, valores aleatorios y un contador para evitar colisiones
 */
let idCounter = 0
export function generateUniqueId(prefix: string = 'item'): string {
  const timestamp = Date.now()
  const randomPart = Math.random().toString(36).substr(2, 9)
  const counter = ++idCounter
  return `${prefix}-${timestamp}-${randomPart}-${counter}`
}
