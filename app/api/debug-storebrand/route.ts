import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/html, */*',
  'Accept-Language': 'nb-NO,no;q=0.9,en;q=0.8',
}

async function tryUrl(url: string) {
  try {
    const r = await fetch(url, { cache: 'no-store', headers: HEADERS })
    const ct = r.headers.get('content-type') ?? ''
    const body = await r.text()
    return { status: r.status, ct, body: body.slice(0, 300) }
  } catch (e) { return { error: String(e) } }
}

export async function GET() {
  const isin = 'NO0010817893'

  const [a, b, c, d, e] = await Promise.all([
    tryUrl(`https://www.storebrand.no/api/fund/${isin}`),
    tryUrl(`https://www.storebrand.no/api/funds?isin=${isin}`),
    tryUrl(`https://www.storebrand.no/global/components/FundSheet/GetFundByIsin?isin=${isin}`),
    tryUrl(`https://connect.storebrand.no/api/v1/funds/${isin}/nav`),
    tryUrl(`https://www.storebrand.no/privat/fondsark/storebrand/data?isin=${isin}`),
  ])

  // Extract all script src tags from fondsark page
  let scripts: string[] = []
  try {
    const r = await fetch(`https://www.storebrand.no/privat/fondsark/storebrand?isin=${isin}`, { cache: 'no-store', headers: HEADERS })
    const html = await r.text()
    scripts = [...html.matchAll(/src="([^"]+)"/g)]
      .map(m => m[1])
      .filter(s => s.includes('storebrand') || s.includes('fund') || s.includes('fond'))
  } catch {}

  return NextResponse.json({ scripts, endpoints: { a, b, c, d, e } })
}
