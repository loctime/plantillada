'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SyncPage() {
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)

  async function handleSync() {
    setLoading(true)
    setMessage(null)
    setIsError(false)

    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Error sincronizando')
      }
      setMessage(`Listo. Se actualizó "${data.title}" (${data.slug}).`)
    } catch (err) {
      setIsError(true)
      setMessage(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sincronizar cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="slug">Slug del cliente</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="kiosco-ejemplo"
            />
          </div>
          <Button onClick={handleSync} disabled={loading || !slug} className="w-full">
            {loading ? 'Sincronizando...' : 'Sincronizar'}
          </Button>
          {message && (
            <p className={`text-sm ${isError ? 'text-red-600' : 'text-green-600'}`}>{message}</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
