'use client'

import { useState, useEffect, useCallback } from 'react'
import { LivePrice } from '@/lib/types'

interface Props {
  onPricesUpdate: (prices: LivePrice[], usdNokRate: number) => void
  intervalSeconds?: number
}

export function PriceRefreshTimer({ onPricesUpdate, intervalSeconds = 60 }: Props) {
  const [countdown, setCountdown] = useState(intervalSeconds)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchPrices = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/prices')
      if (res.ok) {
        const data = await res.json()
        onPricesUpdate(data.prices, data.usdNokRate)
        setLastUpdated(new Date())
      }
    } catch (err) {
      console.error('Price refresh failed:', err)
    } finally {
      setIsLoading(false)
      setCountdown(intervalSeconds)
    }
  }, [onPricesUpdate, intervalSeconds])

  // Initial fetch
  useEffect(() => {
    fetchPrices()
  }, [fetchPrices])

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchPrices()
          return intervalSeconds
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [fetchPrices, intervalSeconds])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return m > 0 ? `${m}m${sec.toString().padStart(2, '0')}s` : `${sec}s`
  }

  return (
    <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>
      {/* Pulsing green dot */}
      <div className="flex items-center gap-1.5">
        <div
          className="w-1.5 h-1.5 rounded-full pulse-green"
          style={{ backgroundColor: isLoading ? '#ffcc00' : 'var(--green)' }}
        />
        <span>{isLoading ? 'HENTER...' : 'LIVE'}</span>
      </div>

      {/* Countdown */}
      {!isLoading && (
        <span>
          oppdateres om <span style={{ color: 'var(--foreground)' }}>{formatTime(countdown)}</span>
        </span>
      )}

      {/* Last updated */}
      {lastUpdated && (
        <span>
          | sist: <span style={{ color: 'var(--foreground)' }}>
            {lastUpdated.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </span>
      )}

      {/* Manual refresh */}
      <button
        onClick={fetchPrices}
        disabled={isLoading}
        className="text-xs px-2 py-0.5 transition-colors"
        style={{
          border: '1px solid var(--border)',
          color: 'var(--muted-foreground)',
        }}
      >
        ↻
      </button>
    </div>
  )
}
