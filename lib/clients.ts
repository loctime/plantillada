import { db } from './firebase'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { slugFromEmail } from './slug'

export interface ClientRecord {
  email: string
  businessName: string
  sheetId: string
  folderId: string
  createdAt: unknown
}

const COLLECTION = 'clients'

export async function resolveAvailableSlug(email: string): Promise<string> {
  const base = slugFromEmail(email)
  if (!base) throw new Error('No se pudo derivar un slug de ese email')

  let candidate = base
  let attempt = 1
  while (await slugExists(candidate)) {
    attempt += 1
    candidate = `${base}-${attempt}`
  }
  return candidate
}

async function slugExists(slug: string): Promise<boolean> {
  const snap = await getDoc(doc(db, COLLECTION, slug))
  return snap.exists()
}

export async function saveClient(slug: string, data: Omit<ClientRecord, 'createdAt'>): Promise<void> {
  await setDoc(doc(db, COLLECTION, slug), {
    ...data,
    createdAt: serverTimestamp(),
  })
}

export async function getClient(slug: string): Promise<ClientRecord | null> {
  const snap = await getDoc(doc(db, COLLECTION, slug))
  if (!snap.exists()) return null
  return snap.data() as ClientRecord
}
