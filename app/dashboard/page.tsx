import { sql } from '@/lib/db'
import { Account, Holding, FundPrice } from '@/lib/types'
import { getStockPrices, getUsdNokRate } from '@/lib/prices'
import { buildPortfolioSummary } from '@/lib/calculations'
import { DashboardClient } from '@/components/dashboard/DashboardClient'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [accountRows, holdingRows, fundPriceRows, livePrices, usdNokRate] = await Promise.all([
    sql`SELECT * FROM accounts ORDER BY type`,
    sql`SELECT * FROM holdings ORDER BY account_id, type, name`,
    sql`SELECT * FROM fund_prices ORDER BY price_date DESC`,
    getStockPrices(['NOW', 'HUBS']),
    getUsdNokRate(),
  ])

  const accounts = accountRows as Account[]
  const holdings = holdingRows as Holding[]
  const fundPrices = fundPriceRows as FundPrice[]

  const summary = buildPortfolioSummary(accounts, holdings, livePrices, usdNokRate, fundPrices)

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <DashboardClient
        initialSummary={summary}
        accounts={accounts}
        holdings={holdings}
        fundPrices={fundPrices}
        initialLivePrices={livePrices}
        initialUsdNokRate={usdNokRate}
      />
    </main>
  )
}
