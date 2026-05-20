'use client'

import { PortfolioSummary } from '@/lib/types'
import { formatNok, formatPercent } from '@/lib/calculations'

interface Props {
  summary: PortfolioSummary
}

export function PortfolioHeader({ summary }: Props) {
  const isPositive = summary.totalPlNok >= 0

  return (
    <div
      className="p-4 mb-4"
      style={{
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
      }}
    >
      {/* Top line */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          <span style={{ color: 'var(--green)' }}>$</span> portfolio --status
        </div>
        <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          TINIUS INVEST // NORDNET ASK + AF
        </div>
      </div>

      {/* Total value */}
      <div className="mb-2">
        <div className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>
          TOTAL PORTEFØLJEVERDI
        </div>
        <div className="text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
          {formatNok(summary.totalValueNok)}
        </div>
      </div>

      {/* P&L */}
      <div className="flex items-center gap-4 text-sm">
        <div>
          <span style={{ color: 'var(--muted-foreground)' }} className="text-xs mr-2">
            UREALISERT P&L:
          </span>
          <span
            className="font-bold"
            style={{ color: isPositive ? 'var(--green)' : 'var(--red)' }}
          >
            {isPositive ? '+' : ''}{formatNok(summary.totalPlNok)}
          </span>
        </div>
        <div>
          <span
            className="text-xs font-bold px-1"
            style={{
              backgroundColor: isPositive ? 'rgba(0,204,102,0.15)' : 'rgba(255,68,68,0.15)',
              color: isPositive ? 'var(--green)' : 'var(--red)',
            }}
          >
            {formatPercent(summary.totalPlPercent)}
          </span>
        </div>
        <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          KONTANTER: {formatNok(summary.cashNok)}
        </div>
      </div>
    </div>
  )
}
