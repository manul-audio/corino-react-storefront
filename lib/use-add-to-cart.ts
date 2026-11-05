'use client'

import { useCart, type StorefrontBundle, type StorefrontProduct } from '@moonbase.sh/react'
import { useCallback } from 'react'
import { useEmbedMode } from '@/lib/embed-mode'
import { useUi } from '@/lib/ui-context'

/**
 * Adds a product or bundle and shows the basket: our own cart drawer in default mode,
 * Moonbase's embedded cart in embedded mode.
 */
export function useAddToCart() {
  const { addToCart } = useCart()
  const { showCart } = useUi()
  const { mode, withEmbed } = useEmbedMode()

  return useCallback(
    (item: StorefrontProduct | StorefrontBundle) => {
      if (mode === 'embedded') {
        withEmbed((moonbase) =>
          moonbase.add_to_cart(
            item.type === 'Bundle'
              ? { bundle_id: item.id, show_cart: true }
              : { product_id: item.id, show_cart: true },
          ),
        )
        return
      }
      addToCart(item)
      showCart()
    },
    [mode, withEmbed, addToCart, showCart],
  )
}
