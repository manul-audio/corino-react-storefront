'use client'

import { useAuth } from '@moonbase.sh/react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState, type FormEvent } from 'react'
import { AuthPage } from '@/components/AuthPage'
import { useMounted } from '@/components/Mounted'

function ForgotPasswordInner() {
  const params = useSearchParams()
  const router = useRouter()
  const { forgotPassword, resetPassword, signIn } = useAuth()
  const mounted = useMounted()

  const linkEmail = params.get('email') || ''
  const linkCode = params.get('code') || ''
  const hasResetLink = Boolean(linkEmail) && Boolean(linkCode)

  // Request mode state
  const [requestEmail, setRequestEmail] = useState('')
  const [requesting, setRequesting] = useState(false)
  const [requestError, setRequestError] = useState<string | null>(null)
  const [requestSent, setRequestSent] = useState(false)

  async function submitRequest(event: FormEvent) {
    event.preventDefault()
    setRequesting(true)
    setRequestError(null)
    try {
      await forgotPassword(requestEmail)
      setRequestSent(true)
    } catch (err) {
      setRequestError((err as Error).message)
    } finally {
      setRequesting(false)
    }
  }

  // Reset mode state
  const [newPassword, setNewPassword] = useState('')
  const [resetting, setResetting] = useState(false)
  const [resetError, setResetError] = useState<string | null>(null)
  const [resetDone, setResetDone] = useState(false)

  async function submitReset(event: FormEvent) {
    event.preventDefault()
    setResetting(true)
    setResetError(null)
    try {
      await resetPassword(linkEmail, newPassword, linkCode)
      try {
        await signIn(linkEmail, newPassword)
        router.replace('/account')
      } catch {
        setResetDone(true)
      }
    } catch (err) {
      setResetError((err as Error).message)
    } finally {
      setResetting(false)
    }
  }

  function goLogin() {
    router.push('/login')
  }

  return (
    <AuthPage eyebrow="RESET PASSWORD" title={hasResetLink ? 'Set a new password' : 'Reset your password'}>
      {mounted ? (
        hasResetLink ? (
          !resetDone ? (
            <form className="account-form" onSubmit={submitReset}>
              <p className="hint">
                Setting a new password for <strong>{linkEmail}</strong>.
              </p>

              <label htmlFor="new-password">New password</label>
              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <button type="submit" className="submit" disabled={resetting}>
                {resetting ? 'Saving…' : 'Save password'}
              </button>

              {resetError ? <p className="error">{resetError}</p> : null}
            </form>
          ) : (
            <div className="auth-result">
              <p className="success">Your password is updated.</p>
              <button type="button" className="submit" onClick={goLogin}>
                Sign in
              </button>
            </div>
          )
        ) : !requestSent ? (
          <form className="account-form" onSubmit={submitRequest}>
            <p className="hint">Enter your email and we&apos;ll send you a link to reset your password.</p>

            <label htmlFor="request-email">Email</label>
            <input
              id="request-email"
              type="email"
              autoComplete="email"
              required
              value={requestEmail}
              onChange={(e) => setRequestEmail(e.target.value)}
            />

            <button type="submit" className="submit" disabled={requesting}>
              {requesting ? 'Sending…' : 'Send reset link'}
            </button>

            {requestError ? <p className="error">{requestError}</p> : null}

            <Link href="/login" className="auth-link">
              Back to sign-in
            </Link>
          </form>
        ) : (
          <div className="auth-result">
            <p className="success">Check your inbox.</p>
            <p className="hint">
              If an account exists for <strong>{requestEmail}</strong>, you&apos;ll receive a reset link shortly.
            </p>
            <Link href="/login" className="auth-link">
              Back to sign-in
            </Link>
          </div>
        )
      ) : null}
    </AuthPage>
  )
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordInner />
    </Suspense>
  )
}
