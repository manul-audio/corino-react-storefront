'use client'

import { useBundle, useCart, useProduct, type StorefrontProduct } from '@moonbase.sh/react'
import { formatCurrency } from '@/lib/format-currency'
import { useAddToCart } from '@/lib/use-add-to-cart'

const BUNDLE_ID = 'duo-bundle'

const CHECK = (
  <span className="check">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 7.5L6 10.5L11.5 4" />
    </svg>
  </span>
)

export function BundleSection() {
  const bundle = useBundle(BUNDLE_ID)
  const halo = useProduct('halo')
  const drift = useProduct('drift')
  const { currency } = useCart()
  const addToCart = useAddToCart()

  const price = (p: StorefrontProduct | null, fallback: string) =>
    p?.defaultVariation ? formatCurrency(p.defaultVariation.price[currency], currency) : fallback
  const original = (p: StorefrontProduct | null, fallback: string) =>
    p?.defaultVariation ? formatCurrency(p.defaultVariation.originalPrice[currency], currency) : fallback

  const bundleVariation = bundle?.defaultVariation ?? null
  const bundlePrice = bundleVariation ? formatCurrency(bundleVariation.price[currency], currency) : '$249'
  const bundleHasDiscount = Boolean(bundleVariation?.hasDiscount)
  const bundleDiscountTotal = bundleVariation
    ? formatCurrency(bundleVariation.originalPrice[currency] - bundleVariation.price[currency], currency)
    : '$29'

  function addBundleToCart() {
    if (!bundle) return
    addToCart(bundle)
  }

  return (
    <>
      <div id="bundle" className="section-head">
        <div className="section-num">[02 / BUNDLE]</div>
        <div className="section-title">Save 38% when you take both.</div>
        <div className="section-aside">PAGE 03 OF 04</div>
      </div>
      <section className="bundle">
        <div className="bundle-inner">
          <div>
            <div
              className="mono"
              style={{ fontSize: 11, color: 'var(--fg-3)', marginBottom: 16, letterSpacing: '0.08em' }}
            >
              STUDIO BUNDLE · S/N 002
            </div>
            <h2>Own <span className="both">both plugins.</span><br />Save 38%.</h2>
            <p>
              HALO and DRIFT together at a single price. One checkout, separate licenses for each plugin,
              lifetime updates across both. The complete tone &amp; space pairing.
            </p>
            <ul className="bundle-bullets">
              <li>{CHECK}Both plugins, all formats</li>
              <li>{CHECK}Lifetime updates · v3.x roadmap included</li>
              <li>{CHECK}3 machine license · transferable</li>
            </ul>
          </div>
          <div className="bundle-card">
            <div className="bundle-row">
              <span>HALO Saturator</span>
              <span>
                {halo?.defaultVariation?.hasDiscount ? <span className="strike">{original(halo, '$199')}</span> : null}
                <span>{price(halo, '$129')}</span>
              </span>
            </div>
            <div className="bundle-row">
              <span>DRIFT Granular</span>
              <span>
                {drift?.defaultVariation?.hasDiscount ? <span className="strike">{original(drift, '$229')}</span> : null}
                <span>{price(drift, '$149')}</span>
              </span>
            </div>
            {bundleHasDiscount ? (
              <div className="bundle-row">
                <span>Bundle discount</span>
                <span className="save">−<span>{bundleDiscountTotal}</span></span>
              </div>
            ) : null}
            <div className="bundle-row total">
              <span>Studio Bundle</span>
              <span>{bundlePrice}</span>
            </div>
            <button type="button" className="bundle-add" disabled={!bundle} onClick={addBundleToCart}>
              ADD BUNDLE TO CART
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" />
              </svg>
            </button>
            <div className="bundle-fineprint">14-DAY MONEY BACK · INSTANT DOWNLOAD</div>
          </div>
        </div>
      </section>
    </>
  )
}
