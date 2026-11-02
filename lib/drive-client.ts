import { google } from 'googleapis'

// OAuth como Diego (no service account): un service account personal tiene
// cuota de almacenamiento cero y no puede ser dueño de archivos nuevos, ni
// creándolos dentro de una carpeta compartida. Por eso la creación de
// carpetas/copias por cliente usa este refresh token en vez del service
// account (que sigue sirviendo para lecturas/ediciones de contenido).
function getOAuthClient() {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET
  )
  client.setCredentials({ refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN })
  return client
}

export function getDriveClient() {
  return google.drive({ version: 'v3', auth: getOAuthClient() })
}

export function getSheetsClient() {
  return google.sheets({ version: 'v4', auth: getOAuthClient() })
}

export async function createClientFolder(slug: string): Promise<string> {
  const drive = getDriveClient()
  const rootFolderId = process.env.DRIVE_ROOT_FOLDER_ID
  if (!rootFolderId) throw new Error('Falta DRIVE_ROOT_FOLDER_ID')

  const res = await drive.files.create({
    requestBody: {
      name: slug,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [rootFolderId],
    },
    fields: 'id',
  })
  if (!res.data.id) throw new Error('No se pudo crear la carpeta del cliente')
  return res.data.id
}

export async function copyTemplateSheet(folderId: string, name: string): Promise<string> {
  const drive = getDriveClient()
  const templateId = process.env.DRIVE_TEMPLATE_SHEET_ID
  if (!templateId) throw new Error('Falta DRIVE_TEMPLATE_SHEET_ID')

  const res = await drive.files.copy({
    fileId: templateId,
    requestBody: {
      name,
      parents: [folderId],
    },
    fields: 'id',
  })
  if (!res.data.id) throw new Error('No se pudo copiar la planilla plantilla')
  return res.data.id
}

export async function shareWithEmail(fileId: string, email: string): Promise<void> {
  const drive = getDriveClient()
  await drive.permissions.create({
    fileId,
    sendNotificationEmail: true,
    requestBody: {
      type: 'user',
      role: 'writer',
      emailAddress: email,
    },
  })
}
