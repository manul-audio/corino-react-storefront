'use client'

import { useAuth } from '@moonbase.sh/react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState, type FormEvent } from 'react'
import { AuthPage } from '@/components/AuthPage'
import { useMounted } from '@/components/Mounted'

const MISSING = 'This confirmation link is missing required information.'

type Status = 'confirming' | 'set-password' | 'error'

function SignUpInner() {
  const params = useSearchParams()
  const router = useRouter()
  const { confirmAccount, resetPassword, signIn } = useAuth()
  const mounted = useMounted()

  const email = params.get('email') || ''
  const code = params.get('code') || ''

  const [status, setStatus] = useState<Status>('confirming')
  const [error, setError] = useState<string | null>(null)
  const [confirmedEmail, setConfirmedEmail] = useState('')
  const [resetPasswordToken, setResetPasswordToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (!email || !code) {
      setStatus('error')
      setError(MISSING)
      return
    }
    let cancelled = false
    confirmAccount(email, code)
      .then((result) => {
        if (cancelled) return
        if (result.status === 'PasswordSetupRequired') {
          setConfirmedEmail(result.email)
          setResetPasswordToken(result.resetPasswordToken ?? '')
          setStatus('set-password')
        } else {
          router.replace('/account')
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError((err as Error).message)
        setStatus('error')
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once per link; SDK callbacks are not stable identities
  }, [email, code])

  async function submitPassword(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setSaveError(null)
    try {
      await resetPassword(confirmedEmail, newPassword, resetPasswordToken)
      try {
        await signIn(confirmedEmail, newPassword)
        router.replace('/account')
      } catch {
        router.replace('/login')
      }
    } catch (err) {
      setSaveError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AuthPage eyebrow="CONFIRM ACCOUNT" title="Welcome to Corino">
      {mounted ? (
        status === 'confirming' ? (
          <p className="empty">Confirming your account…</p>
        ) : status === 'set-password' ? (
          <form className="account-form" onSubmit={submitPassword}>
            <p className="hint">
              Your account is confirmed. Choose a password for <strong>{confirmedEmail}</strong> to finish setting up.
            </p>

            <label htmlFor="new-password">Password</label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button type="submit" className="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save and continue'}
            </button>

            {saveError ? <p className="error">{saveError}</p> : null}
          </form>
        ) : (
          <div className="auth-result">
            <p className="error">{error}</p>
            <Link href="/login" className="auth-link">
              Go to sign-in
            </Link>
          </div>
        )
      ) : null}
    </AuthPage>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <SignUpInner />
    </Suspense>
  )
}
