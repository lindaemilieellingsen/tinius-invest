import { sql } from '@/lib/db'
import { Transaction, Account } from '@/lib/types'
import { formatNok } from '@/lib/calculations'

export const dynamic = 'force-dynamic'

export default async function TransactionsPage() {
  const [txRows, accountRows] = await Promise.all([
    sql`SELECT t.*, a.name as account_name, a.type as account_type
        FROM transactions t
        JOIN accounts a ON t.account_id = a.id
        ORDER BY t.executed_at DESC, t.created_at DESC`,
    sql`SELECT * FROM accounts`,
  ])

  const transactions = txRows as (Transaction & { account_name: string; account_type: string })[]

  const typeLabel: Record<string, string> = {
    buy: 'KJØP',
    sell: 'SALG',
    deposit: 'INNSKUDD',
    withdrawal: 'UTTAK',
  }

  const typeColor: Record<string, string> = {
    buy: 'var(--green)',
    sell: 'var(--red)',
    deposit: '#4499ff',
    withdrawal: '#ff9900',
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
          <a href="/transactions" className="tracking-wider" style={{ color: 'var(--foreground)' }}>
            TRANSAKSJONER
          </a>
        </div>
      </nav>

      <div className="px-4 pb-8">
        <div
          className="p-4"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>
            <span style={{ color: 'var(--green)' }}>$</span> transactions --all
          </div>

          {transactions.length === 0 ? (
            <div className="text-xs py-8 text-center" style={{ color: 'var(--muted-foreground)' }}>
              ingen transaksjoner enda
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr
                    className="border-b"
                    style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
                  >
                    <th className="py-2 pr-4 text-left font-normal tracking-wider">DATO</th>
                    <th className="py-2 pr-4 text-left font-normal tracking-wider">TYPE</th>
                    <th className="py-2 pr-4 text-left font-normal tracking-wider">KONTO</th>
                    <th className="py-2 pr-4 text-left font-normal tracking-wider">HOLDING</th>
                    <th className="py-2 pr-4 text-right font-normal tracking-wider">ANTALL</th>
                    <th className="py-2 pr-4 text-right font-normal tracking-wider">PRIS</th>
                    <th className="py-2 text-right font-normal tracking-wider">TOTAL (NOK)</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-b"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <td className="py-2 pr-4" style={{ color: 'var(--muted-foreground)' }}>
                        {new Date(tx.executed_at).toLocaleDateString('nb-NO')}
                      </td>
                      <td className="py-2 pr-4">
                        <span
                          className="px-1 font-bold"
                          style={{
                            color: typeColor[tx.type] || 'var(--foreground)',
                            backgroundColor: `${typeColor[tx.type]}20` || 'transparent',
                          }}
                        >
                          {typeLabel[tx.type] || tx.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2 pr-4" style={{ color: 'var(--muted-foreground)' }}>
                        <span style={{ color: 'var(--green)' }}>{tx.account_type}</span>
                        {' '}{tx.account_name}
                      </td>
                      <td className="py-2 pr-4" style={{ color: 'var(--foreground)' }}>
                        {tx.ticker && (
                          <span style={{ color: 'var(--green)' }} className="mr-1">
                            {tx.ticker}
                          </span>
                        )}
                        <span style={{ color: 'var(--muted-foreground)' }}>{tx.holding_name}</span>
                      </td>
                      <td className="py-2 pr-4 text-right" style={{ color: 'var(--muted-foreground)' }}>
                        {tx.shares ? parseFloat(tx.shares).toFixed(4) : '—'}
                      </td>
                      <td className="py-2 pr-4 text-right" style={{ color: 'var(--muted-foreground)' }}>
                        {tx.price_per_share
                          ? `${parseFloat(tx.price_per_share).toFixed(2)} ${tx.currency}`
                          : '—'}
                      </td>
                      <td className="py-2 text-right" style={{ color: 'var(--foreground)' }}>
                        {tx.total_nok ? formatNok(parseFloat(tx.total_nok)) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
