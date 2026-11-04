'use client'

import { useAuth } from '@moonbase.sh/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, type FormEvent } from 'react'
import { AuthPage } from '@/components/AuthPage'
import { useMounted } from '@/components/Mounted'

export default function LoginPage() {
  const { user, loaded, signIn } = useAuth()
  const router = useRouter()
  const mounted = useMounted()
  const signedIn = Boolean(user)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // If the user is already signed in when they land here, send them to their account.
  useEffect(() => {
    if (loaded && signedIn) router.replace('/account')
  }, [loaded, signedIn, router])

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoggingIn(true)
    setError(null)
    try {
      await signIn(email, password)
      router.replace('/account')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoggingIn(false)
    }
  }

  return (
    <AuthPage eyebrow="LOG IN" title="Sign in" hint="Sign in to manage your account, downloads, and licenses.">
      {mounted ? (
        <form className="account-form" onSubmit={submit}>
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="submit" disabled={loggingIn}>
            {loggingIn ? 'Signing in…' : 'Sign in'}
          </button>

          {error ? <p className="error">{error}</p> : null}

          <Link href="/forgot-password" className="auth-link">
            Forgot your password?
          </Link>
        </form>
      ) : null}
    </AuthPage>
  )
}
