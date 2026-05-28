import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/html, */*',
  'Accept-Language': 'nb-NO,no;q=0.9,en;q=0.8',
}

export async function GET() {
  const isin = 'NO0010817893'

  // Test 1: ?format=json
  let jsonResult: unknown = null
  try {
    const r = await fetch(`https://www.storebrand.no/privat/fondsark/storebrand?isin=${isin}&format=json`, { cache: 'no-store', headers: HEADERS })
    const contentType = r.headers.get('content-type') ?? ''
    const body = await r.text()
    jsonResult = { status: r.status, contentType, bodyStart: body.slice(0, 500) }
  } catch (e) { jsonResult = { error: String(e) } }

  // Test 2: plain HTML
  let htmlResult: unknown = null
  try {
    const r = await fetch(`https://www.storebrand.no/privat/fondsark/storebrand?isin=${isin}`, { cache: 'no-store', headers: HEADERS })
    const body = await r.text()
    const match = body.match(/Kurs[:\s]+([\d.,]+)\s*NOK\s*\((\d{2})\.(\d{2})\.(\d{4})\)/)
    htmlResult = { status: r.status, match: match?.[0] ?? null, bodyStart: body.slice(0, 800) }
  } catch (e) { htmlResult = { error: String(e) } }

  return NextResponse.json({ jsonResult, htmlResult })
}
