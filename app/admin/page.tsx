import { sql } from '@/lib/db'
import { Account, Holding, FundPrice } from '@/lib/types'
import { addFundPriceAction, addTransactionAction, updateCashAction } from './actions'
import { FetchFundPricesButton } from '@/components/admin/FetchFundPricesButton'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const [accounts, holdings, recentFundPrices] = await Promise.all([
    sql`SELECT * FROM accounts ORDER BY type`,
    sql`SELECT * FROM holdings WHERE type = 'fund' ORDER BY name`,
    sql`SELECT fp.*, h.name as holding_name
        FROM fund_prices fp
        JOIN holdings h ON fp.holding_id = h.id
        ORDER BY fp.price_date DESC
        LIMIT 10`,
  ])

  const funds = holdings as Holding[]
  const accts = accounts as Account[]

  const inputStyle = {
    backgroundColor: 'var(--muted)',
    border: '1px solid var(--border)',
    color: 'var(--foreground)',
    padding: '0.375rem 0.5rem',
    fontSize: '0.75rem',
    width: '100%',
    outline: 'none',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.65rem',
    color: 'var(--muted-foreground)',
    marginBottom: '0.25rem',
    letterSpacing: '0.1em',
  }

  const cardStyle = {
    backgroundColor: 'var(--card)',
    border: '1px solid var(--border)',
    padding: '1rem',
    marginBottom: '1rem',
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Nav */}
      <nav
        className="flex items-center justify-between px-4 py-2 border-b text-xs mb-4"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
      >
        <div className="flex items-center gap-4">
          <span className="font-bold tracking-widest" style={{ color: 'var(--green)' }}>
            TINIUS INVEST
          </span>
          <span style={{ color: 'var(--border)' }}>|</span>
          <a href="/dashboard" className="tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
            DASHBOARD
          </a>
          <a href="/transactions" className="tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
            TRANSAKSJONER
          </a>
          <a href="/admin" className="tracking-wider" style={{ color: 'var(--foreground)' }}>
            ADMIN
          </a>
        </div>
        <span className="text-xs px-2 py-0.5" style={{ color: '#ffcc00', border: '1px solid #ffcc0040', backgroundColor: 'rgba(255,200,0,0.05)' }}>
          LINDA-TILGANG
        </span>
      </nav>

      <div className="px-4 pb-8 max-w-2xl">
        <h1 className="text-sm font-bold mb-4 tracking-widest" style={{ color: 'var(--foreground)' }}>
          ADMIN PANEL
        </h1>

        {/* Auto-fetch fund prices */}
        <div style={cardStyle} className="mb-4">
          <div className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
            <span style={{ color: 'var(--green)' }}>$</span> cron --fund-prices
          </div>
          <h2 className="text-xs font-bold mb-1 tracking-wider" style={{ color: 'var(--foreground)' }}>
            AUTO-HENTING AV FONDSPRISER
          </h2>
          <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
            Henter daglig kurs fra storebrand.no automatisk kl. 18:00 (man–fre). Trykk for å kjøre nå.
          </p>
          <FetchFundPricesButton />
        </div>

        {/* Fund price form */}
        <div style={cardStyle}>
          <div className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
            <span style={{ color: 'var(--green)' }}>$</span> update --fund-price
          </div>
          <h2 className="text-xs font-bold mb-3 tracking-wider" style={{ color: 'var(--foreground)' }}>
            LEGG INN FONDSPRIS
          </h2>
          <form action={addFundPriceAction} className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>FOND</label>
              <select name="holding_id" style={inputStyle as React.CSSProperties} required>
                <option value="">Velg fond...</option>
                {funds.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>PRIS (NOK)</label>
              <input type="number" name="price_nok" step="0.0001" style={inputStyle as React.CSSProperties} placeholder="12345.67" required />
            </div>
            <div>
              <label style={labelStyle}>DATO</label>
              <input type="date" name="price_date" style={inputStyle as React.CSSProperties} defaultValue={new Date().toISOString().split('T')[0]} required />
            </div>
            <div>
              <label style={labelStyle}>NOTAT (valgfritt)</label>
              <input type="text" name="note" style={inputStyle as React.CSSProperties} placeholder="f.eks. månedlig kurs" />
            </div>
            <div className="col-span-2">
              <button
                type="submit"
                className="w-full py-2 text-xs tracking-widest font-bold"
                style={{ backgroundColor: 'var(--green)', color: 'var(--background)' }}
              >
                LAGRE FONDSPRIS
              </button>
            </div>
          </form>

          {/* Recent fund prices */}
          {recentFundPrices.length > 0 && (
            <div className="mt-4">
              <div className="text-xs mb-2 tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
                SISTE PRISER:
              </div>
              <table className="w-full text-xs">
                <tbody>
                  {(recentFundPrices as any[]).map((fp) => (
                    <tr key={fp.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                      <td className="py-1 pr-4" style={{ color: 'var(--muted-foreground)' }}>
                        {new Date(fp.price_date).toLocaleDateString('nb-NO')}
                      </td>
                      <td className="py-1 pr-4" style={{ color: 'var(--foreground)' }}>
                        {fp.holding_name}
                      </td>
                      <td className="py-1 text-right" style={{ color: 'var(--green)' }}>
                        {parseFloat(fp.price_nok).toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Cash update */}
        <div style={cardStyle}>
          <div className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
            <span style={{ color: 'var(--green)' }}>$</span> update --cash
          </div>
          <h2 className="text-xs font-bold mb-3 tracking-wider" style={{ color: 'var(--foreground)' }}>
            OPPDATER KONTANTER
          </h2>
          <form action={updateCashAction} className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>KONTO</label>
              <select name="account_id" style={inputStyle as React.CSSProperties} required>
                {accts.map((a) => (
                  <option key={a.id} value={a.id}>[{a.type}] {a.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>KONTANTER (NOK)</label>
              <input type="number" name="cash_nok" step="0.01" style={inputStyle as React.CSSProperties} placeholder="3457.00" required />
            </div>
            <div className="col-span-2">
              <button
                type="submit"
                className="w-full py-2 text-xs tracking-widest font-bold"
                style={{ backgroundColor: 'var(--green)', color: 'var(--background)' }}
              >
                OPPDATER KONTANTER
              </button>
            </div>
          </form>
        </div>

        {/* Transaction form */}
        <div style={cardStyle}>
          <div className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
            <span style={{ color: 'var(--green)' }}>$</span> add --transaction
          </div>
          <h2 className="text-xs font-bold mb-3 tracking-wider" style={{ color: 'var(--foreground)' }}>
            LEGG TIL TRANSAKSJON
          </h2>
          <form action={addTransactionAction} className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>KONTO</label>
              <select name="account_id" style={inputStyle as React.CSSProperties} required>
                {accts.map((a) => (
                  <option key={a.id} value={a.id}>[{a.type}] {a.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>TYPE</label>
              <select name="type" style={inputStyle as React.CSSProperties} required>
                <option value="buy">KJØP</option>
                <option value="sell">SALG</option>
                <option value="deposit">INNSKUDD</option>
                <option value="withdrawal">UTTAK</option>
              </select>
            </div>
            <div className="col-span-2">
              <label style={labelStyle}>NAVN PÅ HOLDING</label>
              <input type="text" name="holding_name" style={inputStyle as React.CSSProperties} placeholder="f.eks. ServiceNow" required />
            </div>
            <div>
              <label style={labelStyle}>TICKER (valgfritt)</label>
              <input type="text" name="ticker" style={inputStyle as React.CSSProperties} placeholder="NOW" />
            </div>
            <div>
              <label style={labelStyle}>VALUTA</label>
              <select name="currency" style={inputStyle as React.CSSProperties}>
                <option value="NOK">NOK</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>ANTALL</label>
              <input type="number" name="shares" step="0.000001" style={inputStyle as React.CSSProperties} placeholder="15" />
            </div>
            <div>
              <label style={labelStyle}>PRIS PER AKSJE/ANDEL</label>
              <input type="number" name="price_per_share" step="0.000001" style={inputStyle as React.CSSProperties} placeholder="102.26" />
            </div>
            <div>
              <label style={labelStyle}>TOTAL (NOK)</label>
              <input type="number" name="total_nok" step="0.01" style={inputStyle as React.CSSProperties} placeholder="15000.00" />
            </div>
            <div>
              <label style={labelStyle}>DATO</label>
              <input type="date" name="executed_at" style={inputStyle as React.CSSProperties} defaultValue={new Date().toISOString().split('T')[0]} required />
            </div>
            <div className="col-span-2">
              <label style={labelStyle}>NOTAT (valgfritt)</label>
              <input type="text" name="note" style={inputStyle as React.CSSProperties} placeholder="Valgfri merknad" />
            </div>
            <div className="col-span-2">
              <button
                type="submit"
                className="w-full py-2 text-xs tracking-widest font-bold"
                style={{ backgroundColor: 'var(--green)', color: 'var(--background)' }}
              >
                LAGRE TRANSAKSJON
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
