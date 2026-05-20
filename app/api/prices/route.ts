import { NextResponse } from 'next/server'
import { getStockPrices, getUsdNokRate } from '@/lib/prices'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [prices, usdNokRate] = await Promise.all([
      getStockPrices(['NOW', 'HUBS']),
      getUsdNokRate(),
    ])

    return NextResponse.json({ prices, usdNokRate })
  } catch (err) {
    console.error('Price fetch error:', err)
    return NextResponse.json({ error: 'Failed to fetch prices' }, { status: 500 })
  }
}
