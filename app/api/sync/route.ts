import { NextRequest, NextResponse } from 'next/server'
import { getClient } from '@/lib/clients'
import { getSheetsClient } from '@/lib/drive-client'
import { getDefaultConfig, saveConfig } from '@/lib/config-loader'
import { applyLandingTab, applyShopTab, applyConfiguracionTab } from '@/lib/sheet-to-config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const slug = String(body.slug || '').trim()
    if (!slug) {
      return NextResponse.json({ error: 'Falta el slug' }, { status: 400 })
    }

    const client = await getClient(slug)
    if (!client) {
      return NextResponse.json({ error: `No existe el cliente "${slug}"` }, { status: 404 })
    }

    const sheets = getSheetsClient()
    const res = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: client.sheetId,
      ranges: ['landing', 'shop', 'configuracion'],
    })

    const [landingRows, shopRows, configRows] = (res.data.valueRanges || []).map(
      (r) => (r.values || []) as string[][]
    )

    const config = getDefaultConfig(slug)
    if (landingRows) applyLandingTab(config, landingRows)
    if (shopRows) applyShopTab(config, shopRows)
    if (configRows) applyConfiguracionTab(config, configRows)

    const success = await saveConfig(config, slug)
    if (!success) {
      return NextResponse.json({ error: 'No se pudo guardar la configuración' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, slug, title: config.site.title })
  } catch (error) {
    console.error('Error sincronizando:', error)
    return NextResponse.json(
      { error: 'Error sincronizando', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
