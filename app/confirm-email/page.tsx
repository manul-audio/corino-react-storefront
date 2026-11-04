'use client'

import { useAuth } from '@moonbase.sh/react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { AuthPage } from '@/components/AuthPage'
import { useMounted } from '@/components/Mounted'

const MISSING = 'This confirmation link is missing required information.'

type Status = 'pending' | 'success' | 'error'

function ConfirmEmailInner() {
  const params = useSearchParams()
  const { confirmEmail } = useAuth()
  const mounted = useMounted()

  const email = params.get('email') || ''
  const code = params.get('code') || ''

  const [status, setStatus] = useState<Status>('pending')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!email || !code) {
      setStatus('error')
      setError(MISSING)
      return
    }
    let cancelled = false
    confirmEmail(email, code)
      .then(() => {
        if (!cancelled) setStatus('success')
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

  return (
    <AuthPage eyebrow="CONFIRM EMAIL" title="Email confirmation">
      {mounted ? (
        status === 'pending' ? (
          <p className="empty">Confirming your email…</p>
        ) : status === 'success' ? (
          <div className="auth-result">
            <p className="success">Your email address is confirmed.</p>
            <Link href="/account" className="submit">
              Go to my account
            </Link>
          </div>
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

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmEmailInner />
    </Suspense>
  )
}
