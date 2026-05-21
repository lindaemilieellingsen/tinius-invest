import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { fetchStorebrandNAV } from '@/lib/storebrand'

export const dynamic = 'force-dynamic'

// Vercel Cron calls this daily. Also callable from admin panel.
export async function GET(request: Request) {
  // Protect: only allow Vercel Cron or requests with correct auth header
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET || process.env.AUTH_SECRET
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch all active funds with an ISIN
  const funds = await sql`
    SELECT id, name, isin FROM holdings
    WHERE type = 'fund' AND isin IS NOT NULL AND status != 'sold'
  `

  const results = []

  for (const fund of funds as { id: number; name: string; isin: string }[]) {
    const nav = await fetchStorebrandNAV(fund.isin)

    if (!nav) {
      results.push({ fund: fund.name, status: 'failed' })
      continue
    }

    // Insert price if we don't already have one for this date
    await sql`
      INSERT INTO fund_prices (holding_id, price_nok, price_date, note)
      VALUES (${fund.id}, ${nav.price}, ${nav.date}, 'auto-hentet fra storebrand.no')
      ON CONFLICT (holding_id, price_date) DO UPDATE SET price_nok = EXCLUDED.price_nok, note = EXCLUDED.note
    `

    // Activate holding if it was pending
    await sql`
      UPDATE holdings SET status = 'active', updated_at = NOW()
      WHERE id = ${fund.id} AND status = 'pending'
    `

    results.push({ fund: fund.name, price: nav.price, date: nav.date, status: 'ok' })
  }

  return NextResponse.json({ updated: results, timestamp: new Date().toISOString() })
}
