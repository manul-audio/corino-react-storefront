'use client'

import { useAuth } from '@moonbase.sh/react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'
import { AuthPage } from '@/components/AuthPage'
import { useMounted } from '@/components/Mounted'
import { useUi } from '@/lib/ui-context'

function DownloadInner() {
  const params = useSearchParams()
  const router = useRouter()
  const { user, loaded } = useAuth()
  const { showLogin } = useUi()
  const mounted = useMounted()

  const productId = params.get('product_id') || ''
  const signedIn = Boolean(user)

  // Once the user is loaded and signed in, send them straight to the product page.
  // Authenticated users see live download buttons there.
  useEffect(() => {
    if (loaded && signedIn && productId) router.replace(`/account/products/${productId}`)
  }, [loaded, signedIn, productId, router])

  return (
    <AuthPage eyebrow="DOWNLOAD" title="Download product" hint="Sign in to access your downloads and license keys.">
      {mounted ? (
        !loaded ? (
          <p className="empty">Loading…</p>
        ) : !productId ? (
          <p className="error">This link is missing a product reference.</p>
        ) : signedIn ? (
          <p className="empty">Loading downloads for {productId}…</p>
        ) : (
          <div className="auth-result">
            <p className="hint">
              You need to be signed in to download <strong>{productId}</strong>.
            </p>
            <button type="button" className="submit" onClick={showLogin}>
              Sign in
            </button>
            <p className="hint">Don&apos;t have an account? Purchase the product to get one.</p>
            <Link href="/" className="auth-link">
              Browse plugins
            </Link>
          </div>
        )
      ) : null}
    </AuthPage>
  )
}

export default function DownloadPage() {
  return (
    <Suspense fallback={null}>
      <DownloadInner />
    </Suspense>
  )
}
