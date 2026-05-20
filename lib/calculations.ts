import { Account, Holding, FundPrice, LivePrice, HoldingWithPrice, AccountSummary, PortfolioSummary } from './types'

export function calculateHoldingValue(
  holding: Holding,
  account: Account,
  livePrices: LivePrice[],
  usdNokRate: number,
  fundPrices: FundPrice[]
): HoldingWithPrice {
  const shares = parseFloat(holding.shares)
  const gavPerShare = parseFloat(holding.gav_per_share)

  let valueNok = 0
  let livePrice: number | undefined
  let livePriceNok: number | undefined
  let fundPriceNok: number | undefined

  if (holding.type === 'stock' && holding.ticker) {
    const lp = livePrices.find((p) => p.ticker === holding.ticker)
    if (lp) {
      livePrice = lp.price
      if (lp.currency === 'USD') {
        livePriceNok = lp.price * usdNokRate
      } else {
        livePriceNok = lp.price
      }
      valueNok = livePriceNok * shares
    }
  } else if (holding.type === 'fund') {
    // Find most recent fund price
    const latestPrice = fundPrices
      .filter((fp) => fp.holding_id === holding.id)
      .sort((a, b) => new Date(b.price_date).getTime() - new Date(a.price_date).getTime())[0]

    if (latestPrice) {
      fundPriceNok = parseFloat(latestPrice.price_nok)
      valueNok = fundPriceNok * shares
    }
  }

  // Cost in NOK
  let costNok = 0
  if (holding.currency === 'USD') {
    costNok = gavPerShare * shares * usdNokRate
  } else {
    costNok = gavPerShare * shares
  }

  const plNok = valueNok - costNok
  const plPercent = costNok > 0 ? (plNok / costNok) * 100 : 0

  return {
    ...holding,
    account,
    livePrice,
    livePriceNok,
    fundPriceNok,
    valueNok,
    costNok,
    plNok,
    plPercent,
  }
}

export function buildPortfolioSummary(
  accounts: Account[],
  holdings: Holding[],
  livePrices: LivePrice[],
  usdNokRate: number,
  fundPrices: FundPrice[]
): PortfolioSummary {
  const accountSummaries: AccountSummary[] = accounts.map((account) => {
    const accountHoldings = holdings
      .filter((h) => h.account_id === account.id && h.status !== 'sold')
      .map((h) => calculateHoldingValue(h, account, livePrices, usdNokRate, fundPrices))

    const totalValueNok = accountHoldings.reduce((sum, h) => sum + h.valueNok, 0)
    const totalCostNok = accountHoldings.reduce((sum, h) => sum + h.costNok, 0)
    const totalPlNok = totalValueNok - totalCostNok
    const cashNok = parseFloat(account.cash_nok)

    return {
      account,
      holdings: accountHoldings,
      totalValueNok,
      totalCostNok,
      totalPlNok,
      cashNok,
    }
  })

  const totalValueNok = accountSummaries.reduce((sum, a) => sum + a.totalValueNok + a.cashNok, 0)
  const totalCostNok = accountSummaries.reduce((sum, a) => sum + a.totalCostNok, 0)
  const totalPlNok = accountSummaries.reduce((sum, a) => sum + a.totalPlNok, 0)
  const cashNok = accountSummaries.reduce((sum, a) => sum + a.cashNok, 0)
  const totalPlPercent = totalCostNok > 0 ? (totalPlNok / totalCostNok) * 100 : 0

  return {
    totalValueNok,
    totalCostNok,
    totalPlNok,
    totalPlPercent,
    cashNok,
    accounts: accountSummaries,
  }
}

export function formatNok(amount: number): string {
  return new Intl.NumberFormat('nb-NO', {
    style: 'currency',
    currency: 'NOK',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}
