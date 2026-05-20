'use client'

import { useState } from 'react'
import { LivePrice, Account, Holding, FundPrice } from '@/lib/types'
import { PortfolioHeader } from './PortfolioHeader'
import { CombinedHoldingsTable } from './CombinedHoldingsTable'
import { PriceRefreshTimer } from './PriceRefreshTimer'
import { buildPortfolioSummary } from '@/lib/calculations'
import { PortfolioSummary } from '@/lib/types'

interface Props {
  initialSummary: PortfolioSummary
  accounts: Account[]
  holdings: Holding[]
  fundPrices: FundPrice[]
  initialLivePrices: LivePrice[]
  initialUsdNokRate: number
}

export function DashboardClient({
  initialSummary,
  accounts,
  holdings,
  fundPrices,
  initialLivePrices,
  initialUsdNokRate,
}: Props) {
  const [livePrices, setLivePrices] = useState<LivePrice[]>(initialLivePrices)
  const [usdNokRate, setUsdNokRate] = useState(initialUsdNokRate)

  const summary = buildPortfolioSummary(accounts, holdings, livePrices, usdNokRate, fundPrices)

  function handlePricesUpdate(prices: LivePrice[], rate: number) {
    setLivePrices(prices)
    setUsdNokRate(rate)
  }

  return (
    <div>
      {/* Nav */}
      <nav
        className="flex items-center justify-between px-4 py-3 border-b text-xs mb-4"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
      >
        <div className="flex items-center gap-3">
          <span className="font-bold tracking-widest" style={{ color: 'var(--green)' }}>
            TINIUS INVEST
          </span>
          <span style={{ color: 'var(--border)' }}>|</span>
          <a href="/dashboard" className="tracking-wider" style={{ color: 'var(--foreground)' }}>
            DASHBOARD
          </a>
          <a href="/transactions" className="tracking-wider hidden sm:inline" style={{ color: 'var(--muted-foreground)' }}>
            TRANSAKSJONER
          </a>
        </div>
        <PriceRefreshTimer onPricesUpdate={handlePricesUpdate} />
      </nav>

      <div className="px-4 pb-20 sm:pb-8">
        <PortfolioHeader summary={summary} />

        <CombinedHoldingsTable
          accounts={summary.accounts}
          livePrices={livePrices}
          usdNokRate={usdNokRate}
        />

        <div className="mt-2 text-xs text-right" style={{ color: 'var(--muted-foreground)' }}>
          USD/NOK: {usdNokRate.toFixed(4)} // Frankfurter API
        </div>
      </div>

      {/* Mobile tab bar */}
      <div
        className="fixed bottom-0 left-0 right-0 flex sm:hidden border-t text-xs"
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <a
          href="/dashboard"
          className="flex-1 py-4 text-center tracking-wider font-bold"
          style={{ color: 'var(--green)' }}
        >
          DASHBOARD
        </a>
        <a
          href="/transactions"
          className="flex-1 py-4 text-center tracking-wider"
          style={{ color: 'var(--muted-foreground)' }}
        >
          TRANSAKSJONER
        </a>
      </div>
    </div>
  )
}
