'use client'

import { StorefrontProvider, type StorefrontHydrationState } from '@moonbase.sh/react'
import { Suspense, useMemo, useState, type ReactNode } from 'react'
import { CartDrawer } from '@/components/CartDrawer'
import { CookieBanner } from '@/components/CookieBanner'
import { CheckoutCompletion } from '@/components/CheckoutCompletion'
import { DeepLinkCart } from '@/components/DeepLinkCart'
import { DemoBanner } from '@/components/DemoBanner'
import { LoginModal } from '@/components/LoginModal'
import { ProductDownloadModal } from '@/components/ProductDownloadModal'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'
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
          <DemoBanner />
          <SiteNav />
          {children}
          <SiteFooter />
          <CartDrawer />
          <LoginModal />
          <ProductDownloadModal />
          <CookieBanner />
          <Suspense fallback={null}>
            <DeepLinkCart />
          </Suspense>
        </CookieConsentProvider>
      </UiProvider>
    </StorefrontProvider>
  )
}
