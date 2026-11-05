'use client'

import { useEffect } from 'react'

let locks = 0
let saved: { overflow: string; paddingRight: string } | null = null

/**
 * Locks page scrolling while a drawer or modal is open, so scrolling only works
 * inside the panel. Reference-counted so stacked layers release it together, and it
 * compensates for the vanishing scrollbar so the page does not shift sideways.
 */
export function useBodyScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return
    const body = document.body
    if (locks === 0) {
      saved = { overflow: body.style.overflow, paddingRight: body.style.paddingRight }
      const scrollbar = window.innerWidth - document.documentElement.clientWidth
      body.style.overflow = 'hidden'
      if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`
    }
    locks += 1
    return () => {
      locks -= 1
      if (locks === 0 && saved) {
        body.style.overflow = saved.overflow
        body.style.paddingRight = saved.paddingRight
        saved = null
      }
    }
  }, [active])
}
