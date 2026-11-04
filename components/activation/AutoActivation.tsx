'use client'

import { ActivationRequestStatus, useActivationRequest, useAuth, useCart, useProduct } from '@moonbase.sh/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import { ActivationProductCard } from '@/components/activation/ProductCard'
import { formatCurrency } from '@/lib/format-currency'
import { useUi } from '@/lib/ui-context'

export function AutoActivation({ token }: { token: string }) {
  const router = useRouter()
  const { user, loaded: userLoaded, signOut } = useAuth()
  const { showLogin, showCart } = useUi()
  const { currency, addToCart, setQuantity } = useCart()
  const { activationRequest, loading, fulfilling, completing, error, fulfillLicense, fulfillTrial } = useActivationRequest(token)
  const [newsletterOptIn, setNewsletterOptIn] = useState(false)
  const [activationError, setActivationError] = useState<string | null>(null)

  const storefrontProduct = useProduct(activationRequest?.product.id ?? '')
  const purchasable = Boolean(storefrontProduct?.defaultVariation)
  const trial = activationRequest?.trialEligibility ?? null
  const needsNewsletterOptIn = Boolean(trial?.requiresNewsletterOptIn) && !user?.communicationPreferences?.newsletterOptIn
  const ownsProduct = Boolean(
    activationRequest && user &&
    (user.ownedProducts?.includes(activationRequest.product.id) || user.subscribedProducts?.includes(activationRequest.product.id)),
  )

  // Auto-fulfil the moment the user has an eligible licence, as the embedded storefront does.
  const requestStatus = activationRequest?.status ?? null
  const eligible = Boolean(activationRequest?.licenseEligibility?.eligible)
  // Once an attempt has failed (SDK `error` or a rejection) do not try again: the SDK
  // resets `fulfilling` after a failure, which would otherwise re-trigger this effect.
  const failed = Boolean(error) || activationError !== null
  useEffect(() => {
    if (!fulfilling && !completing && !failed && requestStatus === ActivationRequestStatus.Requested && eligible) {
      fulfillLicense().catch((err: unknown) => setActivationError(err instanceof Error ? err.message : String(err)))
    }
  }, [fulfilling, completing, failed, requestStatus, eligible, fulfillLicense])

  function buy() {
    if (!storefrontProduct) return
    const item = addToCart(storefrontProduct)
    setQuantity(item, 1)
    showCart()
  }

  if (loading || !userLoaded) {
    return (
      <div className="auto-activation">
        <div className="activation-loader"><p>Loading activation request…</p></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="auto-activation">
        <div className="activation-loader">
          <h2>Uh oh</h2>
          <p>{String(error)}</p>
        </div>
      </div>
    )
  }

  if (!activationRequest) {
    return (
      <div className="auto-activation">
        <div className="activation-loader">
          <h2>Uh oh</h2>
          <p>Could not find activation request</p>
        </div>
      </div>
    )
  }

  const optionNumber = (n: number) => (purchasable ? n + 1 : n)
  const defaultVariation = storefrontProduct?.defaultVariation

  let body: ReactNode
  if (activationRequest.status === ActivationRequestStatus.Cancelled) {
    body = (
      <div className="activation-loader">
        <h2>Cancelled</h2>
        <p>This activation request was cancelled. Open your app and try again.</p>
      </div>
    )
  } else if (fulfilling || completing) {
    body = (
      <div className="activation-loader">
        <p>Activating {activationRequest.product.name}…</p>
      </div>
    )
  } else if (activationRequest.status === ActivationRequestStatus.Completed) {
    body = (
      <div className="activation-loader">
        <h2>Done!</h2>
        <p>Your product is activated. You may close this window and return to the app.</p>
      </div>
    )
  } else {
    body = (
      <div className="activation-options">
        {activationError ? <p className="error">{activationError}</p> : null}
        {purchasable && storefrontProduct && defaultVariation ? (
          <section className="activation-option">
            <h3>Option 1 · Purchase product</h3>
            <p>
              Buy a copy of {storefrontProduct.name} for{' '}
              <strong>{formatCurrency(defaultVariation.price[currency], currency)}</strong>.
            </p>
            <button type="button" className="submit" onClick={buy}>
              Purchase
            </button>
          </section>
        ) : null}

        {!user ? (
          <section className="activation-option">
            <h3>Option {optionNumber(1)} · Use license</h3>
            <p>Sign in to use a license you already own.</p>
            <button type="button" className="submit secondary" onClick={showLogin}>
              Sign in
            </button>
          </section>
        ) : !ownsProduct ? (
          <section className="activation-option">
            <h3>Option {optionNumber(1)} · Use license</h3>
            <p>You don&apos;t own any licenses for this product.</p>
            <p className="hint">
              Signed in as {user.email}. Not you?{' '}
              <button type="button" className="link" onClick={() => void signOut()}>
                Sign out
              </button>
            </p>
          </section>
        ) : (
          <section className="activation-option">
            <h3>Option {optionNumber(1)} · Use license</h3>
            <p>
              You don&apos;t have free seats for this product. Free up a seat in your account or buy another license.
            </p>
            <button type="button" className="submit secondary" onClick={() => router.push('/account')}>
              View licenses
            </button>
          </section>
        )}

        {trial ? (
          <section className="activation-option">
            <h3>Option {optionNumber(2)} · Start trial</h3>

            {trial.eligible && trial.requiresAccount && !user ? (
              <p>You need to be signed in to start a trial.</p>
            ) : trial.eligible && trial.existing ? (
              <p>
                You&apos;re eligible for a {trial.numberOfDaysPerProduct}-day trial.{' '}
                {trial.numberOfDaysRemaining} days remaining.
              </p>
            ) : trial.eligible ? (
              <p>You&apos;re eligible for a {trial.numberOfDaysPerProduct}-day trial.</p>
            ) : (
              <p>This device or product is not eligible for a trial.</p>
            )}

            {trial.eligible && trial.requiresAccount && !user ? (
              <button type="button" className="submit secondary" onClick={showLogin}>
                Sign in
              </button>
            ) : trial.eligible ? (
              <>
                {needsNewsletterOptIn ? (
                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={newsletterOptIn}
                      onChange={(e) => setNewsletterOptIn(e.target.checked)}
                    />
                    <span>Receive updates and offers by email (required to start a trial)</span>
                  </label>
                ) : null}
                <button
                  type="button"
                  className="submit secondary"
                  disabled={needsNewsletterOptIn && !newsletterOptIn}
                  onClick={() => void fulfillTrial(newsletterOptIn)}
                >
                  Start trial
                </button>
              </>
            ) : null}
          </section>
        ) : null}

        <p className="redeem-row">
          Have a voucher code?{' '}
          <button type="button" className="link" onClick={() => router.push('/account')}>
            Redeem it
          </button>
        </p>
      </div>
    )
  }

  return (
    <div className="auto-activation">
      <ActivationProductCard product={activationRequest.product} />
      {body}
    </div>
  )
}
