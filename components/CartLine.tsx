'use client'

import { useBundle, useCart, useProduct, type LineItem } from '@moonbase.sh/react'
import { formatCurrency } from '@/lib/format-currency'

export function CartLine({ item }: { item: LineItem }) {
  const { removeFromCart, currency } = useCart()
  const productId = item.type === 'Product' ? item.productId : ''
  const bundleId = item.type === 'Bundle' ? item.bundleId : ''
  const product = useProduct(productId)
  const bundle = useBundle(bundleId)

  const id = item.type === 'Product' ? item.productId : item.bundleId
  const name = product?.name || bundle?.name || id
  const icon = product?.iconUrl || bundle?.iconUrl || null
  const amount = item.price?.[currency]
  const linePrice = typeof amount === 'number' ? formatCurrency(amount * item.quantity, currency) : null

  return (
    <div className="cart-line">
      <div className="cart-line-product">
        <div className="cart-line-icon">{icon ? <img src={icon} alt={name} /> : null}</div>
        <div className="cart-line-meta">
          <span className="name">{name}</span>
          {item.quantity > 1 ? <span className="qty">× {item.quantity}</span> : null}
        </div>
      </div>
      <span className="price">{linePrice}</span>
      <button className="remove" type="button" aria-label="Remove" onClick={() => removeFromCart(item)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}
