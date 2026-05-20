import { loginAction } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const hasError = params.error === '1'

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--background)' }}>
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <div style={{ color: 'var(--green)' }} className="text-xs mb-2 tracking-widest">
            NORDNET PORTEFØLJE
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
            TINIUS INVEST
          </h1>
          <div style={{ color: 'var(--muted-foreground)' }} className="text-xs mt-1">
            v1.0.0 // SECURE ACCESS
          </div>
        </div>

        {/* Terminal box */}
        <div
          className="p-6"
          style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ color: 'var(--muted-foreground)' }} className="text-xs mb-4">
            <span style={{ color: 'var(--green)' }}>$</span> authenticate --user tinius
          </div>

          {hasError && (
            <div
              className="mb-4 p-2 text-xs"
              style={{
                backgroundColor: 'rgba(255, 68, 68, 0.1)',
                border: '1px solid var(--red)',
                color: 'var(--red)',
              }}
            >
              FEIL PIN. PRØV IGJEN.
            </div>
          )}

          <form action={loginAction}>
            <div className="mb-4">
              <label className="block text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>
                ENTER PIN:
              </label>
              <div className="flex items-center gap-2">
                <span style={{ color: 'var(--green)' }} className="text-sm">›</span>
                <input
                  type="password"
                  name="pin"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="current-password"
                  autoFocus
                  className="flex-1 bg-transparent text-sm outline-none tracking-widest"
                  style={{
                    color: 'var(--foreground)',
                    caretColor: 'var(--green)',
                  }}
                  placeholder="••••"
                />
              </div>
              <div
                className="h-px mt-2"
                style={{ backgroundColor: 'var(--border)' }}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 text-xs tracking-widest font-bold transition-colors"
              style={{
                backgroundColor: 'var(--green)',
                color: 'var(--background)',
              }}
            >
              LOGG INN
            </button>
          </form>
        </div>

        <div className="mt-4 text-center text-xs" style={{ color: 'var(--muted-foreground)' }}>
          <span className="cursor-blink">_</span>
        </div>
      </div>
    </div>
  )
}
