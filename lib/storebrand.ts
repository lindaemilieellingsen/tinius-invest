/**
 * Fetches daily NAV for Norwegian Storebrand funds.
 * Scrapes the public fondsark page which shows "Kurs: XXXX.XX NOK (DD.MM.YYYY)"
 */
export async function fetchStorebrandNAV(isin: string): Promise<{ price: number; date: string } | null> {
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
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const html = await res.text()

    // Pattern in HTML: <span class="basicLabel">Kurs</span>:&nbsp;<span class="basicValue number2">2891.31</span>&nbsp;NOK&nbsp;(27.05.2026)
    const match = html.match(/basicLabel">Kurs<\/span>:[\s\S]{0,200}?basicValue number2">([\d.,]+)<\/span>[\s\S]{0,100}?\((\d{2})\.(\d{2})\.(\d{4})\)/)
    if (!match) {
      console.error(`NAV pattern not found for ${isin}`)
      return null
    }

    const price = parseFloat(match[1].replace(',', '.'))
    const date = `${match[4]}-${match[3]}-${match[2]}` // YYYY-MM-DD

    if (isNaN(price) || price <= 0) return null
    return { price, date }
  } catch (err) {
    console.error(`Failed to fetch NAV for ${isin}:`, err)
    return null
  }
}
