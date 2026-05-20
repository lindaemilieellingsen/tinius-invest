'use client'

import { HoldingWithPrice, LivePrice } from '@/lib/types'
import { HoldingRow } from './HoldingRow'

interface Props {
  holdings: HoldingWithPrice[]
  livePrices?: LivePrice[]
  usdNokRate?: number
}

export function HoldingsTable({ holdings, livePrices, usdNokRate }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr
            className="border-b"
            style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
          >
            <th className="py-2 pr-4 text-left font-normal tracking-wider">HOLDING</th>
            <th className="py-2 pr-4 text-right font-normal tracking-wider">ANTALL</th>
            <th className="py-2 pr-4 text-right font-normal tracking-wider">GAV</th>
            <th className="py-2 pr-4 text-right font-normal tracking-wider">PRIS</th>
            <th className="py-2 pr-4 text-right font-normal tracking-wider">VERDI (NOK)</th>
            <th className="py-2 text-right font-normal tracking-wider">P&L</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding) => (
            <HoldingRow
              key={holding.id}
              holding={holding}
              livePrices={livePrices}
              usdNokRate={usdNokRate}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
