'use client'

import { useEmbedMode } from '@/lib/embed-mode'

/** Flips between this site's own storefront UI and Moonbase's embedded storefront. */
export function UiSwitch() {
  const { mode, setMode } = useEmbedMode()
  return (
    <div className="ui-switch" role="group" aria-label="Storefront interface">
      <span className="ui-switch-label">Storefront</span>
      <button type="button" aria-pressed={mode === 'default'} onClick={() => setMode('default')}>Default</button>
      <button type="button" aria-pressed={mode === 'embedded'} onClick={() => setMode('embedded')}>Embedded</button>
    </div>
  )
}
