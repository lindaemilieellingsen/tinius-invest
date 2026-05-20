'use client'

import { useState } from 'react'
import { PortfolioSummary, LivePrice } from '@/lib/types'
import { PortfolioHeader } from './PortfolioHeader'
import { AccountCard } from './AccountCard'
import { PriceRefreshTimer } from './PriceRefreshTimer'
import { buildPortfolioSummary } from '@/lib/calculations'
import { Account, Holding, FundPrice } from '@/lib/types'

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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-2 border-b text-xs mb-4 gap-2"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
      >
        <div className="flex items-center gap-4">
          <span className="font-bold tracking-widest" style={{ color: 'var(--green)' }}>
            TINIUS INVEST
          </span>
          <span style={{ color: 'var(--border)' }}>|</span>
          <a
            href="/dashboard"
            className="tracking-wider"
            style={{ color: 'var(--foreground)' }}
          >
            DASHBOARD
          </a>
          <a
            href="/transactions"
            className="tracking-wider"
            style={{ color: 'var(--muted-foreground)' }}
          >
            TRANSAKSJONER
          </a>
        </div>
        <PriceRefreshTimer onPricesUpdate={handlePricesUpdate} />
      </nav>

      <div className="px-4 pb-8">
        <PortfolioHeader summary={summary} />

        {summary.accounts.map((accountSummary) => (
          <AccountCard
            key={accountSummary.account.id}
            summary={accountSummary}
            livePrices={livePrices}
            usdNokRate={usdNokRate}
          />
        ))}

        {/* USD/NOK rate info */}
        <div className="mt-2 text-xs text-right" style={{ color: 'var(--muted-foreground)' }}>
          USD/NOK: {usdNokRate.toFixed(4)} // Frankfurter API
        </div>
      </div>
    </div>
  )
}
