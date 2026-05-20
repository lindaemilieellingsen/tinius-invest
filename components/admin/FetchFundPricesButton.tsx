'use client'

import { useState } from 'react'
import { fetchFundPricesAction } from '@/app/admin/actions'

export function FetchFundPricesButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [results, setResults] = useState<{ fund: string; price?: number; date?: string; status: string }[]>([])

  async function handleFetch() {
    setStatus('loading')
    setResults([])
    try {
      const data = await fetchFundPricesAction()
      setResults(data)
      setStatus('ok')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div>
      <button
        onClick={handleFetch}
        disabled={status === 'loading'}
        className="w-full py-2 text-xs tracking-widest font-bold mb-3"
        style={{
          backgroundColor: 'var(--accent)',
          color: status === 'loading' ? 'var(--muted-foreground)' : 'var(--green)',
          border: '1px solid var(--green)',
        }}
      >
        {status === 'loading' ? 'HENTER...' : '↻ HENT FONDSPRISER NÅ'}
      </button>

      {results.length > 0 && (
        <div className="text-xs space-y-1">
          {results.map((r, i) => (
            <div key={i} className="flex justify-between">
              <span style={{ color: 'var(--muted-foreground)' }}>{r.fund}</span>
              <span style={{ color: r.status === 'ok' ? 'var(--green)' : 'var(--red)' }}>
                {r.status === 'ok' ? `${r.price} NOK (${r.date})` : 'FEIL'}
              </span>
            </div>
          ))}
        </div>
      )}

      {status === 'error' && (
        <div className="text-xs" style={{ color: 'var(--red)' }}>Klarte ikke å hente priser.</div>
      )}
    </div>
  )
}
