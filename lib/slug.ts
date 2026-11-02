export function slugFromEmail(email: string): string {
  const localPart = email.split('@')[0] || ''
  return localPart
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // saca acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
