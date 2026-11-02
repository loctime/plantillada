import { Config } from './config-loader'

type Row = string[]

function normalize(value: string | undefined): string {
  return (value || '').trim().toLowerCase()
}

function findValue(rows: Row[], label: string): string {
  const target = normalize(label)
  for (const row of rows) {
    if (normalize(row[0]).startsWith(target)) {
      return (row[1] || '').trim()
    }
  }
  return ''
}

function parseTestimonials(rows: Row[]): Array<{ quote: string; author: string; role: string }> {
  const headerIndex = rows.findIndex(
    (row) => normalize(row[0]) === 'nombre' && normalize(row[1]) === 'texto'
  )
  if (headerIndex === -1) return []

  const result: Array<{ quote: string; author: string; role: string }> = []
  for (let i = headerIndex + 1; i < rows.length; i++) {
    const row = rows[i]
    if (!row[0] || !row[0].trim()) continue
    result.push({ author: row[0].trim(), quote: (row[1] || '').trim(), role: '' })
  }
  return result
}

export function applyLandingTab(config: Config, rows: Row[]): void {
  const title = findValue(rows, 'Titulo del sitio')
  const tagline = findValue(rows, 'Tagline')
  const heroTitle = findValue(rows, 'Hero - Titulo')
  const heroSubtitle = findValue(rows, 'Hero - Subtitulo')
  const heroImageUrl = findValue(rows, 'Hero - Imagen')
  const whatsapp = findValue(rows, 'WhatsApp')
  const email = findValue(rows, 'Email de contacto')
  const calendly = findValue(rows, 'Calendly')
  const primary = findValue(rows, 'Color principal')
  const secondary = findValue(rows, 'Color secundario')
  const background = findValue(rows, 'Color de fondo')

  if (title) config.site.title = title
  if (tagline) config.site.tagline = tagline
  if (heroTitle) config.site.heroTitle = heroTitle
  if (heroSubtitle) config.site.heroSubtitle = heroSubtitle
  if (heroImageUrl) config.site.heroImageUrl = heroImageUrl
  if (background) config.site.backgroundColor = background

  if (whatsapp) config.contact.whatsappPhone = whatsapp
  if (email) config.contact.email = email
  if (calendly) config.integrations.calendlyUrl = calendly

  if (config.theme && (primary || secondary || background)) {
    for (const mode of ['light', 'dark'] as const) {
      if (primary) {
        config.theme[mode].accentColor = primary
        config.theme[mode].primaryButtonColor = primary
      }
      if (secondary) config.theme[mode].secondaryButtonColor = secondary
      if (background) config.theme[mode].backgroundColor = background
    }
  }

  const testimonials = parseTestimonials(rows)
  if (testimonials.length > 0) config.testimonials = testimonials
}

export function applyShopTab(config: Config, rows: Row[]): void {
  const headerIndex = rows.findIndex((row) => normalize(row[0]) === 'nombre' && normalize(row[1]) === 'precio')
  if (headerIndex === -1) return

  const products: NonNullable<Config['products']> = []
  const categories = new Set<string>()

  for (let i = headerIndex + 1; i < rows.length; i++) {
    const row = rows[i]
    const name = (row[0] || '').trim()
    if (!name) continue

    const price = parseFloat((row[1] || '0').replace(/[^0-9.,]/g, '').replace(',', '.')) || 0
    const category = (row[2] || 'General').trim()
    const description = (row[3] || '').trim()
    const image = (row[4] || '').trim()
    const inStock = normalize(row[5]) === 'si'

    categories.add(category)
    products.push({
      id: `${i}`,
      name,
      brand: '',
      price,
      image,
      rating: 5,
      reviews: 0,
      category,
      inStock,
      description,
      features: [],
    })
  }

  if (products.length === 0) return

  config.products = products
  config.shopConfig = {
    storeName: config.site.title,
    storeTagline: config.site.tagline,
    navigation: [],
    categories: Array.from(categories),
    searchPlaceholder: 'Buscar productos...',
    filterButtonText: 'Filtrar',
    bestSellersTitle: 'Más vendidos',
    breadcrumbText: 'Inicio',
    resultsText: 'resultados',
    sortOptions: [{ value: 'relevance', label: 'Relevancia' }],
    addToCartText: 'Agregar al carrito',
    outOfStockText: 'Sin stock',
    cartTitle: 'Carrito',
    emptyCartText: 'Tu carrito está vacío',
    checkoutText: 'Finalizar compra',
    totalText: 'Total',
  }
}

export function applyConfiguracionTab(config: Config, rows: Row[]): void {
  const businessName = findValue(rows, 'Nombre del negocio')
  const templates = normalize(findValue(rows, 'Templates activos'))
  const logo = findValue(rows, 'Logo')

  if (businessName && !config.site.title) config.site.title = businessName
  if (logo) config.site.logo = logo

  if (templates === 'ambos') config.selectedTemplates = ['landing', 'shop']
  else if (templates === 'shop') config.selectedTemplates = ['shop']
  else if (templates === 'landing') config.selectedTemplates = ['landing']
}
