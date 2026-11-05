'use client'

import { useCart, useProduct } from '@moonbase.sh/react'
import type { ReactNode } from 'react'
import { formatCurrency } from '@/lib/format-currency'
import { useAddToCart } from '@/lib/use-add-to-cart'
import { useUi } from '@/lib/ui-context'

export interface PluginCardProps {
  productId: string
  variant: 'halo' | 'drift'
  reverse?: boolean
  fallbackPrice: string
  fallbackOriginalPrice?: string
  art: ReactNode
  chrome: ReactNode
  meta: ReactNode
  tagline: ReactNode
  desc: ReactNode
  specs: ReactNode
  trial: ReactNode
}

const ARROW = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" />
  </svg>
)
const DOWNLOAD = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M7 2v8M4 7.5L7 10.5l3-3M2.5 12h9" />
  </svg>
)

export function PluginCard(props: PluginCardProps) {
  const { productId, variant, reverse, fallbackPrice, fallbackOriginalPrice } = props
  const product = useProduct(productId)
  const { currency } = useCart()
  const { showDownloads } = useUi()
  const addToCart = useAddToCart()

  const variation = product?.defaultVariation ?? null
  const price = variation ? formatCurrency(variation.price[currency], currency) : fallbackPrice
  const originalPrice = variation
    ? formatCurrency(variation.originalPrice[currency], currency)
    : fallbackOriginalPrice
  const hasDiscount = Boolean(variation?.hasDiscount)
  const discountName = variation?.discount?.name || 'INTRO'
  const owned = Boolean(product?.owned)

  function handleAddToCart() {
    if (!product) return
    addToCart(product)
  }

  return (
    <section className={`plugin${reverse ? ' reverse' : ''}`}>
      <div className={`plugin-art ${variant}-art`}>
        <div className="plugin-art-inner">{props.art}</div>
        <div className={`art-chrome ${variant}`}>
          <div className="corner tl" /><div className="corner tr" />
          <div className="corner bl" /><div className="corner br" />
          {props.chrome}
        </div>
      </div>
      <div className="plugin-info">
        <div>
          <div className="plugin-meta">{props.meta}</div>
          <h2 className="plugin-name">
            <span className={`${variant}-gradient`}>{variant === 'halo' ? 'HALO' : 'DRIFT'}</span>
          </h2>
          <p className="plugin-tagline">{props.tagline}</p>
          <p className="plugin-desc">{props.desc}</p>
          <div className="spec-strip">{props.specs}</div>
        </div>
        <div className="purchase">
          <div className="price-block">
            {hasDiscount ? <span className="price-old">{originalPrice}</span> : null}
            <span className="price-now"><span>{price}</span></span>
          </div>
          <div className="price-note">
            {hasDiscount ? <span className="badge">{discountName}</span> : null}
          </div>
          {owned ? (
            <button type="button" className={`add-btn ${variant}`} onClick={() => showDownloads(productId)}>
              DOWNLOAD {DOWNLOAD}
            </button>
          ) : (
            <button type="button" className={`add-btn ${variant}`} disabled={!product} onClick={handleAddToCart}>
              ADD TO CART {ARROW}
            </button>
          )}
        </div>
        {owned ? null : (
          <div className="trial-row">
            {props.trial}
            <span className="trial-note mono">NO CARD · FULL FEATURES</span>
          </div>
        )}
      </div>
    </section>
  )
}
