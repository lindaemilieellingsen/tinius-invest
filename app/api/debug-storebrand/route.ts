import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,*/*',
  'Accept-Language': 'nb-NO,no;q=0.9,en;q=0.8',
}

export async function GET() {
  const isin = 'NO0010817893'
  const r = await fetch(`https://www.storebrand.no/privat/fondsark/storebrand?isin=${isin}`, { cache: 'no-store', headers: HEADERS })
  const html = await r.text()

  // Find all occurrences of "Kurs" with surrounding context
  const kursContexts: string[] = []
  let idx = 0
  while ((idx = html.indexOf('Kurs', idx)) !== -1) {
    kursContexts.push(html.slice(Math.max(0, idx - 50), idx + 100))
    idx += 4
  }

  // Also look for any data-* attributes that might contain NAV
  const dataAttrs = [...html.matchAll(/data-[a-z-]*(?:nav|kurs|pris|price|nav)[^=]*="([^"]+)"/gi)].map(m => m[0])

  // Look for any JSON-like objects with price data
  const pricePatterns = [...html.matchAll(/["'](?:nav|kurs|price|pris|nav)["']\s*:\s*["']?[\d.,]+["']?/gi)].map(m => m[0])

  return NextResponse.json({ kursContexts, dataAttrs, pricePatterns, htmlLength: html.length })
}
