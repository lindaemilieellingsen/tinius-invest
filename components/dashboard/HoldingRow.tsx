'use client'

import { HoldingWithPrice, LivePrice } from '@/lib/types'
import { formatNok, formatUsd, formatPercent } from '@/lib/calculations'

interface Props {
  holding: HoldingWithPrice
  livePrices?: LivePrice[]
  usdNokRate?: number
}

export function HoldingRow({ holding, livePrices, usdNokRate }: Props) {
  // Get live price from passed livePrices if available (from client-side polling)
  let displayPrice = holding.livePrice
  let displayPriceNok = holding.livePriceNok
  let displayValueNok = holding.valueNok
  let displayPlNok = holding.plNok
  let displayPlPercent = holding.plPercent

  if (livePrices && usdNokRate && holding.ticker) {
    const lp = livePrices.find((p) => p.ticker === holding.ticker)
    if (lp) {
      displayPrice = lp.price
      displayPriceNok = holding.currency === 'USD' ? lp.price * usdNokRate : lp.price
      const shares = parseFloat(holding.shares)
      displayValueNok = displayPriceNok * shares
      displayPlNok = displayValueNok - holding.costNok
      displayPlPercent = holding.costNok > 0 ? (displayPlNok / holding.costNok) * 100 : 0
    }
  }

  const isPending = holding.status === 'pending'
  const hasPrice = displayValueNok > 0
  const isPositive = displayPlNok >= 0

  return (
    <tr
      className="border-b text-sm"
      style={{ borderColor: 'var(--border)' }}
    >
      {/* Name + ticker */}
      <td className="py-2 pr-4">
        <div className="font-bold" style={{ color: 'var(--foreground)' }}>
          {holding.ticker ? (
            <span style={{ color: 'var(--green)' }}>{holding.ticker}</span>
          ) : null}
          {holding.ticker ? ' ' : ''}
          <span className="font-normal text-sm" style={{ color: 'var(--muted-foreground)' }}>
            {holding.name}
          </span>
        </div>
        {isPending && (
          <span
            className="text-xs px-1 mt-0.5 inline-block"
            style={{
              backgroundColor: 'rgba(255,200,0,0.1)',
              color: '#ffcc00',
              border: '1px solid #ffcc0040',
            }}
          >
            UNDER BEHANDLING
          </span>
        )}
      </td>

      {/* Shares */}
      <td className="py-2 pr-4 text-right" style={{ color: 'var(--muted-foreground)' }}>
        {parseFloat(holding.shares).toFixed(holding.type === 'fund' ? 0 : 4)}
      </td>

      {/* GAV */}
      <td className="py-2 pr-4 text-right" style={{ color: 'var(--muted-foreground)' }}>
        {holding.currency === 'USD'
          ? formatUsd(parseFloat(holding.gav_per_share))
          : formatNok(parseFloat(holding.gav_per_share))}
      </td>

      {/* Current price */}
      <td className="py-2 pr-4 text-right">
        {isPending || !hasPrice ? (
          <span style={{ color: 'var(--muted-foreground)' }}>—</span>
        ) : holding.type === 'stock' && displayPrice ? (
          <span style={{ color: 'var(--foreground)' }}>
            {formatUsd(displayPrice)}
          </span>
        ) : holding.type === 'fund' && holding.fundPriceNok ? (
          <span style={{ color: 'var(--foreground)' }}>
            {formatNok(holding.fundPriceNok)}
          </span>
        ) : (
          <span style={{ color: 'var(--muted-foreground)' }}>—</span>
        )}
      </td>

      {/* Value NOK */}
      <td className="py-2 pr-4 text-right">
        {hasPrice ? (
          <span style={{ color: 'var(--foreground)' }}>{formatNok(displayValueNok)}</span>
        ) : (
          <span style={{ color: 'var(--muted-foreground)' }}>—</span>
        )}
      </td>

      {/* P&L */}
      <td className="py-2 text-right">
        {hasPrice ? (
          <div>
            <div style={{ color: isPositive ? 'var(--green)' : 'var(--red)' }}>
              {isPositive ? '+' : ''}{formatNok(displayPlNok)}
            </div>
            <div
              className="text-xs"
              style={{ color: isPositive ? 'var(--green)' : 'var(--red)', opacity: 0.8 }}
            >
              {formatPercent(displayPlPercent)}
            </div>
          </div>
        ) : (
          <span style={{ color: 'var(--muted-foreground)' }}>—</span>
        )}
      </td>
    </tr>
  )
}
