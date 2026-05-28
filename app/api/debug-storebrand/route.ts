import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const isin = 'NO0010817893'
  try {
    const res = await fetch(
      `https://www.storebrand.no/privat/fondsark/storebrand?isin=${isin}`,
      {
        cache: 'no-store',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'nb-NO,no;q=0.9,en;q=0.8',
        },
      }
    )
    const html = await res.text()
    const snippet = html.slice(0, 3000)
    const hasKurs = html.includes('Kurs')
    const match = html.match(/Kurs[:\s]+([\d.,]+)\s*NOK\s*\((\d{2})\.(\d{2})\.(\d{4})\)/)
    return NextResponse.json({
      status: res.status,
      url: res.url,
      hasKurs,
      match: match ? match[0] : null,
      snippet,
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
