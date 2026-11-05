'use client'

import { useCartOffer, type StorefrontOffer } from '@moonbase.sh/react'
import { formatCurrency } from '@/lib/format-currency'

const CHECK = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 7.5L6 10.5L11.5 4" />
  </svg>
)

function discountLabel(offer: StorefrontOffer, currency: string): string {
  const discount = offer.discount
  if (!discount) return 'Discount'
  if (discount.type === 'PercentageOffDiscount') return `${Math.round(discount.percentage * 100)}% off`
  const amount = discount.total?.[currency]
  return typeof amount === 'number' ? `${formatCurrency(amount, currency)} off` : 'Discount'
}

/**
 * The cart-total offer on the current order: the tier already applied with its
 * saving, and the next tier with progress towards it. Everything comes from
 * the SDK's `useCartOffer()`; the component only formats it.
 */
export function CartOfferCard() {
  const cartOffer = useCartOffer()
  if (!cartOffer || (!cartOffer.applied && !cartOffer.next)) return null

  const { applied, next, currency } = cartOffer
  const headline = (applied ?? next)!.offer
  const fraction = next ? Math.max(0, Math.min(1, next.progress.fraction)) : 1

  return (
    <div className={applied ? 'offer-card applied' : 'offer-card'}>
      <div className="offer-head">
        <span className="offer-name">
          {applied ? <span className="check">{CHECK}</span> : null}
          {headline.discount?.name ?? 'Offer'}
        </span>
        <span className="offer-badge">{discountLabel(headline, currency)}</span>
      </div>
      {headline.discount?.description ? <p className="offer-desc">{headline.discount.description}</p> : null}
      {next ? (
        <>
          <div className="offer-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(fraction * 100)}>
            <div className="offer-bar-fill" style={{ width: `${Math.round(fraction * 100)}%` }} />
          </div>
          <p className="offer-note">
            Spend {formatCurrency(next.progress.remaining, currency)} more to unlock {discountLabel(next.offer, currency)}
          </p>
        </>
      ) : (
        <div className="offer-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={100}>
          <div className="offer-bar-fill" style={{ width: '100%' }} />
        </div>
      )}
      {applied ? (
        <p className="offer-note ok">
          {discountLabel(applied.offer, currency)} applied, saving {formatCurrency(applied.saving, currency)}
        </p>
      ) : null}
    </div>
  )
}
