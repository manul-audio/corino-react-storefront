'use client'

import { useCommunicationPreferences } from '@moonbase.sh/react'
import Link from 'next/link'
import { useEffect, useState, type FormEvent } from 'react'
import { useCookieConsent } from '@/lib/cookie-consent'
import { readNewsletterState, rememberSubscribed, type NewsletterState } from '@/lib/newsletter'

type SubscribeStatus = 'subscribed' | 'confirmation_sent'

export function SiteFooter() {
  const { subscribe } = useCommunicationPreferences()
  const { reopen: openCookieSettings } = useCookieConsent()
  const [newsletter, setNewsletter] = useState<NewsletterState>({ subscribed: false, email: null })
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [justSubscribed, setJustSubscribed] = useState<SubscribeStatus | null>(null)

  useEffect(() => setNewsletter(readNewsletterState()), [])

  async function trySubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const result = await subscribe({ email })
      setJustSubscribed(result.status)
      rememberSubscribed(email)
      setNewsletter({ subscribed: true, email })
      setEmail('')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <footer>
      <div className="footer-top">
        <div className="footer-brand">
          <Link href="/" className="logo">
            <span className="logo-mark" />
            CORINO
          </Link>
          <p>Two plugins, made carefully, by people who still mix records. Based in Oslo, Norway.</p>
          <div className="footer-email">
            <span className="flag" aria-label="Norway" role="img">🇳🇴</span>
            hello@corino.audio
          </div>

          <div className="footer-newsletter">
            <h4>Newsletter</h4>
            {newsletter.subscribed ? (
              <p className="subscribed">
                {justSubscribed === 'confirmation_sent'
                  ? `Almost there — check ${newsletter.email} to confirm.`
                  : justSubscribed === 'subscribed'
                    ? `You're subscribed as ${newsletter.email}.`
                    : `Subscribed as ${newsletter.email}.`}
              </p>
            ) : (
              <>
                <p className="hint">New releases, presets, and the occasional studio note. No spam.</p>
                <form onSubmit={trySubscribe}>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@studio.com"
                    aria-label="Email address"
                  />
                  <button type="submit" disabled={submitting}>
                    {submitting ? 'Subscribing…' : 'Subscribe'}
                  </button>
                </form>
                {error ? <p className="error">{error}</p> : null}
              </>
            )}
          </div>
        </div>
        <div className="footer-col">
          <h4>Plugins</h4>
          <ul>
            <li><Link href="/#plugins">HALO Saturator</Link></li>
            <li><Link href="/#plugins">DRIFT Granular</Link></li>
            <li><Link href="/#bundle">Studio Bundle</Link></li>
            <li><a href="#">Sound Packs</a></li>
            <li><a href="#">Free Trials</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Resources</h4>
          <ul>
            <li><a href="#">Manuals</a></li>
            <li><a href="#">Tutorials</a></li>
            <li><a href="#">Preset Library</a></li>
            <li><a href="#">Changelog</a></li>
            <li><a href="#">Status</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="#">About</a></li>
            <li><a href="#">Journal</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Press</a></li>
            <li><a href="#">Contact</a></li>
            <li>
              <button type="button" onClick={openCookieSettings}>
                Cookie settings
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Moonbase AS</span>
        <span>VST3 · AU · AAX · macOS · WIN · APPLE SILICON NATIVE</span>
        <span>v2.1.04 · BUILD 2026.05</span>
      </div>
    </footer>
  )
}
