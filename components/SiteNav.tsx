'use client'

import { useAuth, useCart } from '@moonbase.sh/react'
import Link from 'next/link'
import { useEmbedMode } from '@/lib/embed-mode'
import { useUi } from '@/lib/ui-context'

export function SiteNav() {
  const { user, loaded } = useAuth()
  const { items } = useCart()
  const { showCart, showLogin } = useUi()
  const { mode } = useEmbedMode()
  // The embedded storefront keeps its own cart, so our count would not match it.
  const cartCount = mode === 'embedded' ? 0 : items.reduce((sum, item) => sum + (item.quantity ?? 1), 0)

  return (
    <nav className="top">
      <div className="nav-inner">
        <Link href="/" className="logo">
          <span className="logo-mark" />
          CORINO
        </Link>
        <div className="nav-links">
          <Link href="/#plugins" className="active">Plugins</Link>
          <Link href="/#bundle">Bundle</Link>
        </div>
        <div className="nav-right">
          {loaded && !user ? (
            <button type="button" className="login-btn" onClick={showLogin}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="8" cy="5.5" r="2.5" /><path d="M3 14c0-2.5 2.2-4.5 5-4.5s5 2 5 4.5" />
              </svg>
              Log in
            </button>
          ) : user ? (
            <Link href="/account" className="login-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="8" cy="5.5" r="2.5" /><path d="M3 14c0-2.5 2.2-4.5 5-4.5s5 2 5 4.5" />
              </svg>
              <span>{user.name || 'My account'}</span>
            </Link>
          ) : null}
          <button type="button" className="icon-btn" aria-label="Cart" onClick={showCart}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 3h1.5l1.7 7.3a1 1 0 0 0 1 .7h5.5a1 1 0 0 0 1-.75L14 5H4.5" />
              <circle cx="6" cy="13.5" r="0.8" fill="currentColor" />
              <circle cx="11.5" cy="13.5" r="0.8" fill="currentColor" />
            </svg>
            {cartCount > 0 ? <span className="cart-count">{cartCount}</span> : null}
          </button>
        </div>
      </div>
    </nav>
  )
}
