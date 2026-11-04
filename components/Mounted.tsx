'use client'

import { useEffect, useState } from 'react'

/** React equivalent of Nuxt's <ClientOnly>: false during SSR and hydration, true after mount. */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  return mounted
}
