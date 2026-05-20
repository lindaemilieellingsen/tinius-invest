'use client'

import { AccountSummary, LivePrice } from '@/lib/types'
import { formatNok, formatPercent } from '@/lib/calculations'
import { HoldingsTable } from './HoldingsTable'

interface Props {
  summary: AccountSummary
  livePrices?: LivePrice[]
  usdNokRate?: number
}

export function AccountCard({ summary, livePrices, usdNokRate }: Props) {
  const { account, holdings, totalValueNok, totalPlNok, cashNok } = summary
  const isPositive = totalPlNok >= 0
  const totalPlPercent = summary.totalCostNok > 0
    ? (totalPlNok / summary.totalCostNok) * 100
    : 0

  return (
    <div
      className="mb-4"
      style={{
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
      }}
    >
      {/* Account header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-3">
          <span
            className="text-xs px-2 py-0.5 font-bold"
            style={{
              backgroundColor: 'rgba(0,204,102,0.15)',
              color: 'var(--green)',
              border: '1px solid rgba(0,204,102,0.3)',
            }}
          >
            {account.type}
          </span>
          <span className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>
            {account.name}
          </span>
        </div>
        <div className="text-right">
          <div className="font-bold" style={{ color: 'var(--foreground)' }}>
            {formatNok(totalValueNok + cashNok)}
          </div>
          {totalPlNok !== 0 && (
            <div
              className="text-xs"
              style={{ color: isPositive ? 'var(--green)' : 'var(--red)' }}
            >
              {isPositive ? '+' : ''}{formatNok(totalPlNok)} ({formatPercent(totalPlPercent)})
            </div>
          )}
        </div>
      </div>

      {/* Holdings */}
      <div className="px-4 py-2">
        {holdings.length > 0 ? (
          <HoldingsTable
            holdings={holdings}
            livePrices={livePrices}
            usdNokRate={usdNokRate}
          />
        ) : (
          <div className="py-4 text-center text-xs" style={{ color: 'var(--muted-foreground)' }}>
            ingen holdings
          </div>
        )}
      </div>

      {/* Cash */}
      {cashNok > 0 && (
        <div
          className="flex items-center justify-between px-4 py-2 border-t text-xs"
          style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
        >
          <span>KONTANTER</span>
          <span style={{ color: 'var(--foreground)' }}>{formatNok(cashNok)}</span>
        </div>
      )}
    </div>
  )
}
