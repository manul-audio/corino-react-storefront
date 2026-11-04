'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { AutoActivation } from '@/components/activation/AutoActivation'
import { ManualActivation } from '@/components/activation/ManualActivation'
import { useMounted } from '@/components/Mounted'

function ActivatePageInner() {
  const token = useSearchParams().get('token') || null
  const mounted = useMounted()
  return (
    <main className="activation-page">
      <div className="activation-head">
        <div className="section-num">[ ACTIVATION ]</div>
        <h1>Activate {token ? 'product' : 'offline device'}</h1>
        <p className="hint">
          {token ? 'Finish setting up the device that opened this page.' : "Activate a device that isn't connected to the internet."}
        </p>
      </div>
      {mounted ? (
        <div className="activation-panel">
          {token ? <AutoActivation token={token} /> : <ManualActivation />}
        </div>
      ) : null}
    </main>
  )
}

export default function ActivatePage() {
  return (
    <Suspense fallback={null}>
      <ActivatePageInner />
    </Suspense>
  )
}
