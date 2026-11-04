'use client'

import { StorefrontProvider, type StorefrontHydrationState } from '@moonbase.sh/react'
import { useMemo, useState, type ReactNode } from 'react'
import { CheckoutCompletion } from '@/components/CheckoutCompletion'
import { CookieConsentProvider, readStoredConsent } from '@/lib/cookie-consent'
import { UiProvider } from '@/lib/ui-context'

export function Providers({
  endpoint,
  initialState,
  children,
}: {
  endpoint: string
  initialState: StorefrontHydrationState
  children: ReactNode
}) {
  // Read once on first client render; null on the server. Only feeds the SDK config, never the DOM.
  const [consent] = useState<boolean | null>(() => readStoredConsent())
  const config = useMemo(
    () => ({ persistUtm: true, attributionConsent: consent ?? undefined }),
    [consent],
  )

  return (
    <StorefrontProvider endpoint={endpoint} initialState={initialState} config={config}>
      <UiProvider>
        <CookieConsentProvider initialAnswer={consent}>
          <CheckoutCompletion />
          {children}
        </CookieConsentProvider>
      </UiProvider>
    </StorefrontProvider>
  )
}
