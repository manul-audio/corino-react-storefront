import type { OwnedProduct, StorefrontProduct } from '@moonbase.sh/react'
import type { ReactNode } from 'react'

export function ActivationProductCard({
  product,
  description,
  children,
}: {
  product: StorefrontProduct | OwnedProduct
  description?: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="activation-product-card">
      <div className="activation-product-card-icon">
        {product.iconUrl ? <img src={product.iconUrl} alt={product.name} /> : null}
      </div>
      <div className="activation-product-card-content">
        <h2>{product.name}</h2>
        {product.tagline ? <p className="tagline">{product.tagline}</p> : null}
        {description}
      </div>
      {children}
    </div>
  )
}
