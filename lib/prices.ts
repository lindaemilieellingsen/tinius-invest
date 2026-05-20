import YahooFinanceClass from 'yahoo-finance2'
import type { LivePrice } from './types'

// yahoo-finance2 v3: must instantiate the class
const yf = new YahooFinanceClass()

export async function getStockPrices(tickers: string[]): Promise<LivePrice[]> {
  const results: LivePrice[] = []

  for (const ticker of tickers) {
    try {
      const quote = await yf.quote(ticker)
      results.push({
        ticker,
        price: quote.regularMarketPrice ?? 0,
        change: quote.regularMarketChange ?? 0,
        changePercent: quote.regularMarketChangePercent ?? 0,
        currency: quote.currency ?? 'USD',
      })
    } catch (err) {
      console.error(`Failed to fetch price for ${ticker}:`, err)
    }
  }

  return results
}

export async function getUsdNokRate(): Promise<number> {
  try {
    const res = await fetch('https://api.frankfurter.dev/v1/latest?base=USD&symbols=NOK', {
      next: { revalidate: 300 },
    })
    if (!res.ok) throw new Error('Frankfurter API error')
    const data = await res.json()
    return data.rates.NOK as number
  } catch (err) {
    console.error('Failed to fetch USD/NOK rate:', err)
    return 10.5 // fallback
  }
}
