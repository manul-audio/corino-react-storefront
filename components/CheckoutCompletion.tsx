'use client'

import { useStorefront } from '@moonbase.sh/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useUi } from '@/lib/ui-context'

/** After the embedded checkout completes: close the drawer and overlay, land on the confirmation page. */
export function CheckoutCompletion() {
  const { context } = useStorefront()
  const { hideCart } = useUi()
  const router = useRouter()

  useEffect(
    () =>
      context.onCheckoutCompleted(() => {
        hideCart()
        context.closeCheckout()
        router.push('/order-completed')
      }),
    [context, hideCart, router],
  )

  return null
}
