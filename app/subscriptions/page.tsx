'use client'

import { useAuth, useInventory } from '@moonbase.sh/react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { AuthPage } from '@/components/AuthPage'
import { useMounted } from '@/components/Mounted'
import { useUi } from '@/lib/ui-context'

interface SubscriptionSummary {
  id: string
  status?: string
}

function SubscriptionsInner() {
  const params = useSearchParams()
  const { user, loaded } = useAuth()
  const { getSubscription } = useInventory()
  const { showLogin } = useUi()
  const mounted = useMounted()

  const subscriptionId = params.get('subscription_id') || ''
  const signedIn = Boolean(user)

  const [subscription, setSubscription] = useState<SubscriptionSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loaded || !signedIn || !subscriptionId) return
    let cancelled = false
    setLoading(true)
    setError(null)
    getSubscription(subscriptionId)
      .then((result) => {
        if (!cancelled) setSubscription({ id: result.id, status: result.status })
      })
      .catch((err: unknown) => {
        if (!cancelled) setError((err as Error).message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once per subscription id; SDK callbacks are not stable identities
  }, [loaded, signedIn, subscriptionId])

  return (
    <AuthPage eyebrow="SUBSCRIPTION" title="Manage subscription" hint="View your subscription details.">
      {mounted ? (
        !loaded ? (
          <p className="empty">Loading…</p>
        ) : !subscriptionId ? (
          <p className="error">This link is missing a subscription reference.</p>
        ) : !signedIn ? (
          <div className="auth-result">
            <p className="hint">You need to be signed in to manage your subscription.</p>
            <button type="button" className="submit" onClick={showLogin}>
              Sign in
            </button>
          </div>
        ) : loading ? (
          <p className="empty">Loading subscription…</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : subscription ? (
          <div className="auth-result">
            <p className="hint">
              Subscription <strong>{subscription.id}</strong>
            </p>
            {subscription.status ? <p className="hint">Status: {subscription.status}</p> : null}
            <p className="hint">
              Subscription management isn&apos;t built out in this reference app. Corino doesn&apos;t sell subscription products — your tenant may.
            </p>
            <Link href="/account" className="submit">
              Go to my account
            </Link>
          </div>
        ) : null
      ) : null}
    </AuthPage>
  )
}

export default function SubscriptionsPage() {
  return (
    <Suspense fallback={null}>
      <SubscriptionsInner />
    </Suspense>
  )
}
