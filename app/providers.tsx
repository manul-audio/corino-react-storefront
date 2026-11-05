'use client'

import { StorefrontProvider, type StorefrontHydrationState } from '@moonbase.sh/react'
import { Suspense, useMemo, useState, type ReactNode } from 'react'
import { CartDrawer } from '@/components/CartDrawer'
import { CookieBanner } from '@/components/CookieBanner'
import { CheckoutCompletion } from '@/components/CheckoutCompletion'
import { DeepLinkCart } from '@/components/DeepLinkCart'
import { DemoBanner } from '@/components/DemoBanner'
import { AuthPanel } from '@/components/AuthPanel'
import { ProductDownloadModal } from '@/components/ProductDownloadModal'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'
import { CookieConsentProvider, readStoredConsent } from '@/lib/cookie-consent'
import { EmbedModeProvider, type UiMode } from '@/lib/embed-mode'
import { UiProvider } from '@/lib/ui-context'

export function Providers({
  endpoint,
  initialState,
  defaultMode,
  children,
}: {
  endpoint: string
  initialState: StorefrontHydrationState
  defaultMode: UiMode
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
      <EmbedModeProvider endpoint={endpoint} defaultMode={defaultMode}>
      <UiProvider>
        <CookieConsentProvider initialAnswer={consent}>
          <CheckoutCompletion />
          <DemoBanner />
          <SiteNav />
          {children}
          <SiteFooter />
          <CartDrawer />
          <AuthPanel />
          <ProductDownloadModal />
          <CookieBanner />
          <Suspense fallback={null}>
            <DeepLinkCart />
          </Suspense>
        </CookieConsentProvider>
      </UiProvider>
      </EmbedModeProvider>
    </StorefrontProvider>
  )
}
