import { useEffect } from 'react'
import { useAdmin } from '@/lib/admin-context'

export function useDynamicTitle() {
  const { config } = useAdmin()

  useEffect(() => {
    if (typeof document === 'undefined') return
    
    const siteTitle = config?.site?.title || 'Tu Marca Personal'
    
    // Actualizar el título de la página
    document.title = siteTitle
    
    // Actualizar el favicon
    const initial = (siteTitle.trim()[0] || 'T').toUpperCase()
    const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'>\n  <rect x='0' y='0' width='64' height='64' rx='12' fill='#10b981'/>\n  <text x='32' y='42' text-anchor='middle' font-family='Arial, Helvetica, sans-serif' font-size='36' fill='#ffffff'>${initial}</text>\n</svg>`
    const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`

    let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null
    if (!link) {
      link = document.createElement('link')
      link.setAttribute('rel', 'icon')
      document.head.appendChild(link)
    }
    link.setAttribute('href', dataUrl)
    
    // Actualizar también las meta tags de Open Graph y Twitter
    let ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null
    if (!ogTitle) {
      ogTitle = document.createElement('meta')
      ogTitle.setAttribute('property', 'og:title')
      document.head.appendChild(ogTitle)
    }
    ogTitle.setAttribute('content', siteTitle)
    
    let twitterTitle = document.querySelector('meta[name="twitter:title"]') as HTMLMetaElement | null
    if (!twitterTitle) {
      twitterTitle = document.createElement('meta')
      twitterTitle.setAttribute('name', 'twitter:title')
      document.head.appendChild(twitterTitle)
    }
    twitterTitle.setAttribute('content', siteTitle)
    
  }, [config?.site?.title])
}
