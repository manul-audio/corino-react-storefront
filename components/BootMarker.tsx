'use client'

import { useStorefront } from '@moonbase.sh/react'

/** Test hook: exposes hydration state on the plugins section head. Renders nothing visible. */
export function BootMarker() {
  const { storefront, loaded } = useStorefront()
  return <span hidden data-boot={loaded ? 'ok' : 'loading'} data-products={storefront.products.length} />
}
