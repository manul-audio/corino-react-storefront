export type UnavailableKind = 'closed' | 'unavailable'

export function Unavailable({ kind }: { kind: UnavailableKind }) {
  const closed = kind === 'closed'
  return (
    <main className="auth-page">
      <div className="auth-head">
        <div className="section-num">[ {closed ? 'STORE CLOSED' : 'STORE UNAVAILABLE'} ]</div>
        <h1>{closed ? 'The store is closed right now.' : 'The store is unavailable.'}</h1>
        <p className="hint">
          {closed
            ? 'Corino is not taking orders at the moment. Please check back soon.'
            : 'We could not reach the catalog. Please try again in a moment.'}
        </p>
      </div>
      <div className="auth-panel">
        <div className="auth-actions">
          <a href="/" className="submit">Try again</a>
        </div>
      </div>
    </main>
  )
}
