'use client'

import { useAuth } from '@moonbase.sh/react'
import { useState, type FormEvent } from 'react'
import { Portal } from '@/components/Portal'
import { useBodyScrollLock } from '@/lib/use-scroll-lock'
import { useEscapeKey } from '@/lib/use-escape'
import { useUi, type AuthView } from '@/lib/ui-context'

const TITLES: Record<AuthView, { title: string; hint: string }> = {
  'sign-in': { title: 'Sign in', hint: 'to manage your products' },
  'create-account': { title: 'Create account', hint: 'to buy, download and activate' },
  'forgot-password': { title: 'Forgot password', hint: 'we will email you a reset link' },
}

const CLOSE_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)
const BACK_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
)

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}

function SignInForm() {
  const { hideLogin, setAuthView } = useUi()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await signIn(email, password)
      hideLogin()
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      <label htmlFor="auth-email">Email</label>
      <input id="auth-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <label htmlFor="auth-password">Password</label>
      <input id="auth-password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error ? <p className="error">{error}</p> : null}
      <button type="submit" className="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      <div className="secondary-row">
        <button type="button" onClick={() => setAuthView('create-account')}>Create account</button>
        <button type="button" onClick={() => setAuthView('forgot-password')}>Forgot password</button>
      </div>
    </form>
  )
}

function CreateAccountForm() {
  const { hideLogin, setAuthView } = useUi()
  const { signUp } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [newsletter, setNewsletter] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingEmail, setPendingEmail] = useState<string | null>(null)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const result = await signUp(name, email, password, null, acceptedPrivacy, acceptedTerms, newsletter)
      if (result.status === 'signed-in') {
        hideLogin()
      } else {
        setPendingEmail(result.email)
      }
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  if (pendingEmail) {
    return (
      <div className="auth-form">
        <p className="success">Almost there. Check {pendingEmail} for a link to confirm your account.</p>
        <button type="button" className="submit secondary" onClick={() => setAuthView('sign-in')}>Back to sign in</button>
      </div>
    )
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      <label htmlFor="auth-name">Name</label>
      <input id="auth-name" type="text" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
      <label htmlFor="auth-signup-email">Email</label>
      <input id="auth-signup-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <label htmlFor="auth-signup-password">Password</label>
      <input id="auth-signup-password" type="password" required autoComplete="new-password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
      <label className="checkbox-row">
        <input type="checkbox" required checked={acceptedPrivacy} onChange={(e) => setAcceptedPrivacy(e.target.checked)} />
        <span>I accept the privacy policy</span>
      </label>
      <label className="checkbox-row">
        <input type="checkbox" required checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} />
        <span>I accept the terms and conditions</span>
      </label>
      <label className="checkbox-row">
        <input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} />
        <span>Send me product news and offers</span>
      </label>
      {error ? <p className="error">{error}</p> : null}
      <button type="submit" className="submit" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
    </form>
  )
}

function ForgotPasswordForm() {
  const { setAuthView } = useUi()
  const { forgotPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await forgotPassword(email)
      setSent(true)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  if (sent) {
    return (
      <div className="auth-form">
        <p className="success">If an account exists for {email}, a reset link is on its way.</p>
        <button type="button" className="submit secondary" onClick={() => setAuthView('sign-in')}>Back to sign in</button>
      </div>
    )
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      <label htmlFor="auth-forgot-email">Email</label>
      <input id="auth-forgot-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      {error ? <p className="error">{error}</p> : null}
      <button type="submit" className="submit" disabled={busy}>{busy ? 'Sending…' : 'Send reset link'}</button>
    </form>
  )
}

/** Right-hand auth drawer: sign in, create account, and forgot password, all through the SDK. */
export function AuthPanel() {
  const { loginOpen, hideLogin, authView, setAuthView } = useUi()
  useEscapeKey(loginOpen, hideLogin)
  useBodyScrollLock(loginOpen)
  if (!loginOpen) return null

  const { title, hint } = TITLES[authView]

  return (
    <Portal>
      <div className="drawer-mask" onClick={hideLogin} />
      <aside className="drawer auth-drawer" role="dialog" aria-modal="true" aria-labelledby="auth-panel-title">
        <header>
          {authView === 'sign-in' ? (
            <span />
          ) : (
            <button className="close-btn" type="button" aria-label="Back" onClick={() => setAuthView('sign-in')}>{BACK_ICON}</button>
          )}
          <button className="close-btn" type="button" aria-label="Close" onClick={hideLogin}>{CLOSE_ICON}</button>
        </header>
        <h2 id="auth-panel-title">{title}</h2>
        <p className="auth-drawer-hint">{hint}</p>
        {authView === 'sign-in' ? <SignInForm /> : null}
        {authView === 'create-account' ? <CreateAccountForm /> : null}
        {authView === 'forgot-password' ? <ForgotPasswordForm /> : null}
      </aside>
    </Portal>
  )
}
