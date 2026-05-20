/**
 * Fetches daily NAV for Norwegian Storebrand funds.
 * Scrapes the public fondsark page which shows "Kurs: XXXX.XX NOK (DD.MM.YYYY)"
 */
export async function fetchStorebrandNAV(isin: string): Promise<{ price: number; date: string } | null> {
  try {
    const res = await fetch(
      `https://www.storebrand.no/privat/fondsark/storebrand?isin=${isin}`,
      {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; tinius-invest/1.0)' },
        next: { revalidate: 0 },
      }
    )
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const html = await res.text()

    // Pattern: "Kurs:  2817.12  NOK  (19.05.2026)"
    const match = html.match(/Kurs[:\s]+([\d.]+)\s*NOK\s*\((\d{2})\.(\d{2})\.(\d{4})\)/)
    if (!match) return null

    const price = parseFloat(match[1])
    const date = `${match[4]}-${match[3]}-${match[2]}` // YYYY-MM-DD

    if (isNaN(price) || price <= 0) return null
    return { price, date }
  } catch (err) {
    console.error(`Failed to fetch NAV for ${isin}:`, err)
    return null
  }
}
