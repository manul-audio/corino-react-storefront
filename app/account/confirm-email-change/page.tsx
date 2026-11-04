'use client'

import { useAuth } from '@moonbase.sh/react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef, useState } from 'react'
import { AuthPage } from '@/components/AuthPage'
import { useMounted } from '@/components/Mounted'

const MISSING = 'This confirmation link is missing required information.'

type Status = 'pending' | 'success' | 'error'

function ConfirmEmailChangeInner() {
  const params = useSearchParams()
  const { confirmEmailChange } = useAuth()
  const mounted = useMounted()

  const email = params.get('email') || ''
  const code = params.get('code') || ''

  const [status, setStatus] = useState<Status>('pending')
  const [error, setError] = useState<string | null>(null)
  const inflight = useRef<{ key: string; p: Promise<unknown> } | null>(null)

  useEffect(() => {
    if (!email || !code) {
      setStatus('error')
      setError(MISSING)
      return
    }
    let cancelled = false
    const key = `${email}:${code}`
    if (inflight.current?.key !== key) inflight.current = { key, p: confirmEmailChange(email, code) }
    inflight.current.p
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
  }, [email, code, confirmEmailChange])

  return (
    <AuthPage eyebrow="CONFIRM EMAIL CHANGE" title="Email change">
      {mounted ? (
        status === 'pending' ? (
          <p className="empty">Confirming your new email…</p>
        ) : status === 'success' ? (
          <div className="auth-result">
            <p className="success">
              Your email is updated to <strong>{email}</strong>.
            </p>
            <Link href="/account" className="submit">
              Go to my account
            </Link>
          </div>
        ) : (
          <div className="auth-result">
            <p className="error">{error}</p>
            <Link href="/account" className="auth-link">
              Back to account
            </Link>
          </div>
        )
      ) : null}
    </AuthPage>
  )
}

export default function ConfirmEmailChangePage() {
  return (
    <Suspense fallback={null}>
      <ConfirmEmailChangeInner />
    </Suspense>
  )
}
