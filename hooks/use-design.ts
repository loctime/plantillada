import { useEffect } from 'react'
import { getDesignById, applyDesignToDocument } from '@/lib/designs'

export function useDesign(designId?: string) {
  useEffect(() => {
    if (!designId) return
    
    const design = getDesignById(designId)
    if (design) {
      applyDesignToDocument(design)
    }
  }, [designId])
}

export function useDesigns(selectedDesigns?: {[key: string]: string}, currentTemplate?: string) {
  useEffect(() => {
    if (!selectedDesigns || !currentTemplate) return
    
    const designId = selectedDesigns[currentTemplate]
    if (designId) {
      const design = getDesignById(designId)
      if (design) {
        applyDesignToDocument(design)
      }
    }
  }, [selectedDesigns, currentTemplate])
}
