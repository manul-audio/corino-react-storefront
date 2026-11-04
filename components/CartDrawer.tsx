'use client'

import { useCart } from '@moonbase.sh/react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { CartLine } from '@/components/CartLine'
import { Portal } from '@/components/Portal'
import { formatCurrency } from '@/lib/format-currency'
import { useUi } from '@/lib/ui-context'

export function CartDrawer() {
  const { cartOpen, hideCart } = useUi()
  const { items, total, currency, checkout } = useCart()
  const pathname = usePathname()
  const [checkingOut, setCheckingOut] = useState(false)

  const totalLabel = total ? formatCurrency(total.amount, total.currency) : formatCurrency(0, currency)

  async function initCheckout() {
    try {
      setCheckingOut(true)
      await checkout({ redirect: false, returnUrl: pathname })
    } catch (err) {
      console.error('Could not checkout', err)
    } finally {
      setCheckingOut(false)
    }
  }

  if (!cartOpen) return null

  return (
    <Portal>
      <div className="drawer-mask" onClick={hideCart} />
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <header>
          <h2>Basket</h2>
          <button className="close-btn" type="button" aria-label="Close" onClick={hideCart}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>
        <div className="items">
          {items.length === 0 ? <p className="empty">Your cart is empty.</p> : null}
          {items.map((item) => <CartLine key={item.id} item={item} />)}
        </div>
        {items.length > 0 ? (
          <div className="footer-row">
            <div className="total">
              <span className="total-label">Total</span>
              <span className="total-amount">{totalLabel}</span>
            </div>
            <button type="button" className="checkout-btn" disabled={checkingOut} onClick={initCheckout}>
              {checkingOut ? 'Loading…' : 'Checkout'}
            </button>
          </div>
        ) : null}
      </aside>
    </Portal>
  )
}
