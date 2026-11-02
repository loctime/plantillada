'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Result = {
  slug: string
  sheetUrl: string
}

export default function RegistroPage() {
  const [email, setEmail] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Result | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, businessName }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Error creando el cliente')
      }
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Registrar negocio</CardTitle>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-4">
              <p className="text-sm">
                Listo. Tu sitio va a usar el identificador <strong>{result.slug}</strong>.
              </p>
              <p className="text-sm">
                Completá tus datos y productos en esta planilla (te compartimos acceso a tu email):
              </p>
              <a
                href={result.sheetUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline break-all"
              >
                {result.sheetUrl}
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Nombre del negocio</Label>
                <Input
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Kiosco Ejemplo"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vos@ejemplo.com"
                  required
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Creando...' : 'Registrar'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
