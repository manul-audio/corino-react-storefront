'use client'

import { useEffect } from 'react'

/** Calls onClose when Escape is pressed while `active` is true. */
export function useEscapeKey(active: boolean, onClose: () => void): void {
  useEffect(() => {
    if (!active) return
    function onKeyDown(event: KeyboardEvent) {
      // Escape belongs to Moonbase's checkout overlay while it is open.
      if (document.getElementById('moonbase-checkout-wrapper')) return
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [active, onClose])
}
