'use client'

import { useStorefront } from '@moonbase.sh/react'

export default function Home() {
  const { storefront, loaded } = useStorefront()
  return (
    <main data-boot={loaded ? 'ok' : 'loading'} data-products={storefront.products.length}>
      Corino
    </main>
  )
}
