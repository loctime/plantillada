import { NextRequest, NextResponse } from 'next/server'
import { resolveAvailableSlug, saveClient } from '@/lib/clients'
import { createClientFolder, copyTemplateSheet, shareWithEmail } from '@/lib/drive-client'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = String(body.email || '').trim().toLowerCase()
    const businessName = String(body.businessName || '').trim()

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }
    if (!businessName) {
      return NextResponse.json({ error: 'Falta el nombre del negocio' }, { status: 400 })
    }

    const slug = await resolveAvailableSlug(email)

    const folderId = await createClientFolder(slug)
    const sheetId = await copyTemplateSheet(folderId, `${businessName} - Planilla`)
    await shareWithEmail(sheetId, email)

    await saveClient(slug, { email, businessName, sheetId, folderId })

    return NextResponse.json({
      slug,
      folderId,
      sheetId,
      sheetUrl: `https://docs.google.com/spreadsheets/d/${sheetId}/edit`,
    })
  } catch (error) {
    console.error('Error creando cliente:', error)
    return NextResponse.json(
      { error: 'Error creando el cliente', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
