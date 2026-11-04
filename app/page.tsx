'use client'

import { useStorefront } from '@moonbase.sh/react'
import { FeaturesSection } from '@/components/FeaturesSection'
import { HeroSection } from '@/components/HeroSection'
import { TrustSection } from '@/components/TrustSection'

export default function Home() {
  const { storefront, loaded } = useStorefront()
  return (
    <div>
      <HeroSection />
      <main data-boot={loaded ? 'ok' : 'loading'} data-products={storefront.products.length} />
      <FeaturesSection />
      <TrustSection />
    </div>
  )
}
