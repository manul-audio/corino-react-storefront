'use client'

import { useMounted } from '@/components/Mounted'
import { useCookieConsent } from '@/lib/cookie-consent'

export function CookieBanner() {
  const mounted = useMounted()
  const { open, answer, setAnswer } = useCookieConsent()
  if (!mounted || !open) return null

  return (
    <div className="cookie-banner" role="dialog" aria-labelledby="cookie-banner-title">
      <h2 id="cookie-banner-title">Cookies</h2>
      <p>
        Can we remember which ad brought you here? It helps us see which campaigns lead to sales.
        Your cart and account work the same either way.
      </p>
      {answer !== null ? <p className="current">You&apos;ve {answer ? 'accepted' : 'declined'}.</p> : null}
      <div className="actions">
        <button type="button" className="decline" onClick={() => setAnswer(false)}>Decline</button>
        <button type="button" className="accept" onClick={() => setAnswer(true)}>Accept</button>
      </div>
    </div>
  )
}
