'use client'

import type { ReactNode } from 'react'
import { useUi } from '@/lib/ui-context'

export function TrialButton({ productId, children }: { productId: string; children: ReactNode }) {
  const { showTrial } = useUi()
  return (
    <button type="button" className="trial-btn" onClick={() => showTrial(productId)}>
      {children}
    </button>
  )
}
