export default function Loading() {
  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: 'var(--background)' }}>
      <div className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>
        <span style={{ color: 'var(--green)' }}>$</span> loading portfolio data
        <span className="cursor-blink">_</span>
      </div>
      {/* Skeleton */}
      <div
        className="p-4 mb-4 animate-pulse"
        style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <div className="h-4 w-48 mb-2 rounded" style={{ backgroundColor: 'var(--border)' }} />
        <div className="h-8 w-64 mb-2 rounded" style={{ backgroundColor: 'var(--border)' }} />
        <div className="h-4 w-32 rounded" style={{ backgroundColor: 'var(--border)' }} />
      </div>
      {[1, 2].map((i) => (
        <div
          key={i}
          className="mb-4 animate-pulse"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="h-4 w-32 rounded" style={{ backgroundColor: 'var(--border)' }} />
          </div>
          <div className="p-4">
            {[1, 2].map((j) => (
              <div key={j} className="flex gap-4 mb-2">
                <div className="h-3 flex-1 rounded" style={{ backgroundColor: 'var(--border)' }} />
                <div className="h-3 w-16 rounded" style={{ backgroundColor: 'var(--border)' }} />
                <div className="h-3 w-20 rounded" style={{ backgroundColor: 'var(--border)' }} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
