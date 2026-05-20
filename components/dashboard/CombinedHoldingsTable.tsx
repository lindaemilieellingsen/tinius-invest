'use client'

import { AccountSummary, LivePrice } from '@/lib/types'
import { formatNok, formatUsd, formatPercent } from '@/lib/calculations'

interface Props {
  accounts: AccountSummary[]
  livePrices?: LivePrice[]
  usdNokRate?: number
}

export function CombinedHoldingsTable({ accounts, livePrices, usdNokRate }: Props) {
  return (
    <div
      className="mb-4 overflow-x-auto"
      style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <table className="w-full">
        <thead>
          <tr
            className="border-b"
            style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
          >
            <th className="px-5 py-3 text-left font-normal tracking-wider text-xs">HOLDING</th>
            <th className="px-5 py-3 text-right font-normal tracking-wider text-xs hidden sm:table-cell">ANTALL</th>
            <th className="px-5 py-3 text-right font-normal tracking-wider text-xs hidden sm:table-cell">GAV</th>
            <th className="px-5 py-3 text-right font-normal tracking-wider text-xs hidden sm:table-cell">PRIS</th>
            <th className="px-5 py-3 text-right font-normal tracking-wider text-xs">VERDI</th>
            <th className="px-5 py-3 text-right font-normal tracking-wider text-xs hidden sm:table-cell">P&L</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((accountSummary) => {
            const { account, holdings, totalValueNok, totalPlNok, cashNok } = accountSummary
            const isAccountPositive = totalPlNok >= 0
            const totalPlPercent = accountSummary.totalCostNok > 0
              ? (totalPlNok / accountSummary.totalCostNok) * 100
              : 0

            return (
              <>
                {/* Account header row */}
                <tr
                  key={`account-${account.id}`}
                  className="border-b border-t"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}
                >
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs px-1.5 py-0.5 font-bold"
                        style={{
                          backgroundColor: 'rgba(0,204,102,0.15)',
                          color: 'var(--green)',
                          border: '1px solid rgba(0,204,102,0.3)',
                        }}
                      >
                        {account.type}
                      </span>
                      <span className="font-bold tracking-wide" style={{ color: 'var(--foreground)', fontSize: '0.95rem' }}>
                        {account.name}
                      </span>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell" />
                  <td className="hidden sm:table-cell" />
                  <td className="hidden sm:table-cell" />
                  <td className="px-5 py-5 text-right">
                    <div className="font-bold" style={{ color: 'var(--foreground)', fontSize: '1.05rem' }}>
                      {formatNok(totalValueNok + cashNok)}
                    </div>
                    {totalPlNok !== 0 && (
                      <div className="text-sm mt-0.5 sm:hidden" style={{ color: isAccountPositive ? 'var(--green)' : 'var(--red)' }}>
                        {formatPercent(totalPlPercent)}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-5 text-right text-sm hidden sm:table-cell">
                    {totalPlNok !== 0 && (
                      <span style={{ color: isAccountPositive ? 'var(--green)' : 'var(--red)' }}>
                        {formatPercent(totalPlPercent)}
                      </span>
                    )}
                  </td>
                </tr>

                {/* Holdings rows */}
                {holdings.map((holding) => {
                  let displayPrice = holding.livePrice
                  let displayValueNok = holding.valueNok
                  let displayPlNok = holding.plNok
                  let displayPlPercent = holding.plPercent

                  if (livePrices && usdNokRate && holding.ticker) {
                    const lp = livePrices.find((p) => p.ticker === holding.ticker)
                    if (lp) {
                      displayPrice = lp.price
                      const displayPriceNok = holding.currency === 'USD' ? lp.price * usdNokRate : lp.price
                      const shares = parseFloat(holding.shares)
                      displayValueNok = displayPriceNok * shares
                      displayPlNok = displayValueNok - holding.costNok
                      displayPlPercent = holding.costNok > 0 ? (displayPlNok / holding.costNok) * 100 : 0
                    }
                  }

                  const isPending = holding.status === 'pending'
                  const hasPrice = displayValueNok > 0
                  const isPositive = displayPlNok >= 0

                  const sharesDisplay = holding.type === 'fund'
                    ? parseFloat(holding.shares).toFixed(4).replace(/\.?0+$/, '')
                    : parseFloat(holding.shares).toFixed(0)

                  const gavDisplay = holding.currency === 'USD'
                    ? formatUsd(parseFloat(holding.gav_per_share))
                    : formatNok(parseFloat(holding.gav_per_share))

                  return (
                    <tr
                      key={holding.id}
                      className="border-b"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      {/* Name */}
                      <td className="px-5 py-6">
                        {holding.ticker && (
                          <div className="font-bold" style={{ color: 'var(--green)', fontSize: '1.15rem' }}>
                            {holding.ticker}
                          </div>
                        )}
                        <div className="mt-0.5" style={{ color: 'var(--muted-foreground)', fontSize: '0.8rem' }}>
                          {holding.name}
                        </div>
                        {isPending && (
                          <span
                            className="text-xs px-1 mt-2 inline-block"
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

                      {/* Shares — desktop only */}
                      <td className="px-5 py-6 text-right hidden sm:table-cell text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        {sharesDisplay}
                      </td>

                      {/* GAV — desktop only */}
                      <td className="px-5 py-6 text-right hidden sm:table-cell text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        {gavDisplay}
                      </td>

                      {/* Price — desktop only */}
                      <td className="px-5 py-6 text-right hidden sm:table-cell text-sm">
                        {isPending || !hasPrice ? (
                          <span style={{ color: 'var(--muted-foreground)' }}>—</span>
                        ) : holding.type === 'stock' && displayPrice ? (
                          <span style={{ color: 'var(--foreground)' }}>{formatUsd(displayPrice)}</span>
                        ) : holding.type === 'fund' && holding.fundPriceNok ? (
                          <span style={{ color: 'var(--foreground)' }}>{formatNok(holding.fundPriceNok)}</span>
                        ) : (
                          <span style={{ color: 'var(--muted-foreground)' }}>—</span>
                        )}
                      </td>

                      {/* Value NOK + P&L on mobile */}
                      <td className="px-5 py-6 text-right">
                        {hasPrice ? (
                          <>
                            <div style={{ color: 'var(--foreground)', fontSize: '1.05rem', fontWeight: 600 }}>
                              {formatNok(displayValueNok)}
                            </div>
                            <div className="mt-1" style={{ color: isPositive ? 'var(--green)' : 'var(--red)', fontSize: '0.85rem' }}>
                              {isPositive ? '+' : ''}{formatNok(displayPlNok)}
                              <span className="ml-1 opacity-75" style={{ fontSize: '0.75rem' }}>
                                {formatPercent(displayPlPercent)}
                              </span>
                            </div>
                          </>
                        ) : (
                          <span style={{ color: 'var(--muted-foreground)' }}>—</span>
                        )}
                      </td>

                      {/* P&L — desktop only */}
                      <td className="px-5 py-6 text-right hidden sm:table-cell">
                        {hasPrice ? (
                          <div>
                            <div className="text-sm font-medium" style={{ color: isPositive ? 'var(--green)' : 'var(--red)' }}>
                              {isPositive ? '+' : ''}{formatNok(displayPlNok)}
                            </div>
                            <div className="text-xs mt-0.5" style={{ color: isPositive ? 'var(--green)' : 'var(--red)', opacity: 0.8 }}>
                              {formatPercent(displayPlPercent)}
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--muted-foreground)' }}>—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}

                {/* Cash row */}
                {cashNok > 0 && (
                  <tr key={`cash-${account.id}`}>
                    <td className="px-5 py-5" style={{ color: 'var(--muted-foreground)', fontSize: '0.85rem' }}>
                      Kontanter
                    </td>
                    <td className="hidden sm:table-cell" />
                    <td className="hidden sm:table-cell" />
                    <td className="hidden sm:table-cell" />
                    <td className="px-5 py-5 text-right text-sm" style={{ color: 'var(--foreground)' }}>
                      {formatNok(cashNok)}
                    </td>
                    <td className="hidden sm:table-cell" />
                  </tr>
                )}
              </>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
