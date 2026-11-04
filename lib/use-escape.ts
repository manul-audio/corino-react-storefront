'use client'

import { useEffect } from 'react'

/** Calls onClose when Escape is pressed while `active` is true. */
export function useEscapeKey(active: boolean, onClose: () => void): void {
  useEffect(() => {
    if (!active) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [active, onClose])
}
