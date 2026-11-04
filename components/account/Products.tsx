'use client'

import { useInventory, type OwnedProduct } from '@moonbase.sh/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function AccountProducts() {
  const { getProducts } = useInventory()
  const [products, setProducts] = useState<OwnedProduct[] | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        let response = await getProducts()
        const all = [...response.items]
        while (response.hasMore && response.next) {
          response = await getProducts(response.next)
          all.push(...response.items)
        }
        if (!cancelled) setProducts(all)
      } catch (err) {
        console.error('Failed to load products', err)
        if (!cancelled) setProducts([])
      }
    }
    void load()
    return () => { cancelled = true }
  }, [getProducts])

  return (
    <div className="account-section">
      {products === null ? (
        <p className="empty">Loading products…</p>
      ) : products.length === 0 ? (
        <p className="empty">You don&apos;t own any products yet.</p>
      ) : (
        <ul className="product-list">
          {products.map((product) => {
            const licenses = (product.numberOfLicenses ?? 0) + (product.subscriptionLicenses ?? 0)
            return (
              <li key={product.id} className="product-row">
                <div className="product-icon">
                  {product.iconUrl ? <img src={product.iconUrl} alt={product.name} /> : null}
                </div>
                <div className="product-meta">
                  <span className="name">{product.name}</span>
                  {licenses ? (
                    <span className="licenses">{licenses} license{licenses === 1 ? '' : 's'}</span>
                  ) : null}
                </div>
                <Link className="manage" href={`/account/products/${product.id}`}>
                  View
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" />
                  </svg>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
