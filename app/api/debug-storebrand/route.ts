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

  // Test new regex
  const match = html.match(/basicLabel">Kurs<\/span>:[\s\S]{0,200}?basicValue number2">([\d.,]+)<\/span>[\s\S]{0,100}?\((\d{2})\.(\d{2})\.(\d{4})\)/)

  // Show 400 chars around the Kurs span for context
  const kursIdx = html.indexOf('basicLabel">Kurs')
  const context = kursIdx >= 0 ? html.slice(kursIdx, kursIdx + 400) : 'NOT FOUND'

  return NextResponse.json({ matched: !!match, matchResult: match ? match[0].slice(0, 200) : null, context })
}
