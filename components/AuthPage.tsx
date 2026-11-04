import type { ReactNode } from 'react'

export function AuthPage({ eyebrow, title, hint, children }: { eyebrow: string; title: string; hint?: string; children: ReactNode }) {
  return (
    <main className="auth-page">
      <div className="auth-head">
        <div className="section-num">[ {eyebrow} ]</div>
        <h1>{title}</h1>
        {hint ? <p className="hint">{hint}</p> : null}
      </div>
      <div className="auth-panel">{children}</div>
    </main>
  )
}
