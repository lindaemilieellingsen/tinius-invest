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
      className="px-4 pt-6 pb-5 mb-4"
      style={{
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
      }}
    >
      <div className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
        TOTAL PORTEFØLJEVERDI
      </div>

      <div className="text-4xl sm:text-5xl font-bold tracking-tight mb-4" style={{ color: 'var(--foreground)' }}>
        {formatNok(summary.totalValueNok)}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex items-center gap-2">
          <span
            className="text-base font-bold"
            style={{ color: isPositive ? 'var(--green)' : 'var(--red)' }}
          >
            {isPositive ? '+' : ''}{formatNok(summary.totalPlNok)}
          </span>
          <span
            className="text-sm font-bold px-1.5 py-0.5"
            style={{
              backgroundColor: isPositive ? 'rgba(0,204,102,0.15)' : 'rgba(255,68,68,0.15)',
              color: isPositive ? 'var(--green)' : 'var(--red)',
            }}
          >
            {formatPercent(summary.totalPlPercent)}
          </span>
        </div>
        <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          kontanter: {formatNok(summary.cashNok)}
        </div>
      </div>
    </div>
  )
}
