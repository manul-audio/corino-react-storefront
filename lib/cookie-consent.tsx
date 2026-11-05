'use client'

import { useStorefront } from '@moonbase.sh/react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

const ANSWER_KEY = 'corino:cookie-consent'

/** The visitor's remembered answer, or null before they answer. Safe on the server (returns null). */
export function readStoredConsent(): boolean | null {
  if (typeof window === 'undefined') return null
  const stored = window.localStorage.getItem(ANSWER_KEY)
  return stored === null ? null : stored === 'true'
}

interface ConsentApi {
  answer: boolean | null
  /** Banner visibility: every visitor is asked until they answer; the footer can reopen it. */
  open: boolean
  setAnswer: (granted: boolean) => void
  reopen: () => void
}

const ConsentContext = createContext<ConsentApi | null>(null)

export function CookieConsentProvider({
  initialAnswer,
  children,
}: {
  initialAnswer: boolean | null
  children: ReactNode
}) {
  const { context } = useStorefront()
  const [answer, setAnswerState] = useState<boolean | null>(initialAnswer)
  const [reopened, setReopened] = useState(false)

  // The SSR catalog reflects the server's location. Refetch once in the browser so
  // the display currency and the store's attribution setting are this visitor's.
  useEffect(() => {
    void context.updateStorefront().catch(() => {})
  }, [context])

  const setAnswer = useCallback(
    (granted: boolean) => {
      window.localStorage.setItem(ANSWER_KEY, String(granted))
      setAnswerState(granted)
      setReopened(false)
      context.setAttributionConsent(granted)
    },
    [context],
  )
  const reopen = useCallback(() => setReopened(true), [])

  const api = useMemo<ConsentApi>(
    () => ({ answer, open: reopened || answer === null, setAnswer, reopen }),
    [answer, reopened, setAnswer, reopen],
  )

  return <ConsentContext.Provider value={api}>{children}</ConsentContext.Provider>
}

export function useCookieConsent(): ConsentApi {
  const ctx = useContext(ConsentContext)
  if (!ctx) throw new Error('useCookieConsent must be used inside <CookieConsentProvider>')
  return ctx
}
