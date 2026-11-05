'use client'

import { useBundle, useCart, useProduct, type LineItem } from '@moonbase.sh/react'
import { useState } from 'react'
import { formatCurrency } from '@/lib/format-currency'

export function CartLine({ item }: { item: LineItem }) {
  const { removeFromCart, setQuantity, currency } = useCart()
  const [expanded, setExpanded] = useState(false)
  const productId = item.type === 'Product' ? item.productId : ''
  const bundleId = item.type === 'Bundle' ? item.bundleId : ''
  const product = useProduct(productId)
  const bundle = useBundle(bundleId)

  const id = item.type === 'Product' ? item.productId : item.bundleId
  const name = product?.name || bundle?.name || id
  const icon = product?.iconUrl || bundle?.iconUrl || null
  const amount = item.price?.[currency]
  const linePrice = typeof amount === 'number' ? formatCurrency(amount * item.quantity, currency) : null

  function changeQuantity(delta: number) {
    const next = item.quantity + delta
    if (next <= 0) removeFromCart(item)
    else setQuantity(item, next)
  }

  const bundleProducts = bundle?.products ?? []

  return (
    <div className="cart-line-wrap">
      <div className="cart-line">
        <div className="cart-line-product">
          <div className="cart-line-icon">{icon ? <img src={icon} alt={name} /> : null}</div>
          <div className="cart-line-meta">
            <span className="name">{name}</span>
          </div>
        </div>
        <div className="qty-stepper" role="group" aria-label="Quantity">
          <button type="button" aria-label="Decrease quantity" onClick={() => changeQuantity(-1)}>−</button>
          <span className="qty-value">{item.quantity}</span>
          <button type="button" aria-label="Increase quantity" onClick={() => changeQuantity(1)}>+</button>
        </div>
        <span className="price">{linePrice}</span>
        <button className="remove" type="button" aria-label="Remove" onClick={() => removeFromCart(item)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      {bundleProducts.length > 0 ? (
        <div className="bundle-contents">
          <button
            type="button"
            className="bundle-toggle"
            aria-expanded={expanded}
            onClick={() => setExpanded((open) => !open)}
          >
            <span>{bundleProducts.length} products</span>
            <span>{expanded ? 'Hide' : 'Show'}</span>
          </button>
          {expanded ? (
            <ul className="bundle-product-list">
              {bundleProducts.map((p) => (
                <li key={p.id}>
                  <div className="cart-line-icon">{p.iconUrl ? <img src={p.iconUrl} alt={p.name} /> : null}</div>
                  <div className="bundle-product-meta">
                    <span className="name">✓ {p.name}</span>
                    {p.tagline ? <span className="tagline">{p.tagline}</span> : null}
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
