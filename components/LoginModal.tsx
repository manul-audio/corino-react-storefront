'use client'

import { useAuth } from '@moonbase.sh/react'
import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import { Portal } from '@/components/Portal'
import { useEscapeKey } from '@/lib/use-escape'
import { useUi } from '@/lib/ui-context'

export function LoginModal() {
  const { loginOpen, hideLogin } = useUi()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function tryLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoggingIn(true)
    setError(null)
    try {
      await signIn(email, password)
      hideLogin()
      setEmail('')
      setPassword('')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoggingIn(false)
    }
  }

  useEscapeKey(loginOpen, hideLogin)

  if (!loginOpen) return null

  return (
    <Portal>
      <div className="modal-mask" onClick={hideLogin}>
        <form className="modal" role="dialog" aria-modal="true" aria-labelledby="login-modal-title" onClick={(e) => e.stopPropagation()} onSubmit={tryLogin}>
          <h2 id="login-modal-title">Sign in</h2>
          <label htmlFor="login-email">Email</label>
          <input id="login-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label htmlFor="login-password">Password</label>
          <input id="login-password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error ? <p className="error">{error}</p> : null}
          <button type="submit" className="submit" disabled={loggingIn}>
            {loggingIn ? 'Signing in…' : 'Sign in'}
          </button>
          <div className="secondary-row">
            <Link href="/forgot-password" onClick={hideLogin}>Forgot password?</Link>
            <button type="button" onClick={hideLogin}>Cancel</button>
          </div>
        </form>
      </div>
    </Portal>
  )
}
