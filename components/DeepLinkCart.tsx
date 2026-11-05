'use client'

import { useBundle, useProduct } from '@moonbase.sh/react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useAddToCart } from '@/lib/use-add-to-cart'

/** `?add_product=…` / `?add_bundle=…` marketing links drop the visitor straight into the cart drawer. */
export function DeepLinkCart() {
  const params = useSearchParams()
  const productId = params.get('add_product') ?? ''
  const bundleId = params.get('add_bundle') ?? ''
  const product = useProduct(productId)
  const bundle = useBundle(bundleId)
  const addToCart = useAddToCart()
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current) return
    const item = bundle ?? product
    if (!item) return
    handled.current = true
    addToCart(item)
  }, [product, bundle, addToCart])

  return null
}
