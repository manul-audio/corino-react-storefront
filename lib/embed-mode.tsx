'use client'

import { useStorefront } from '@moonbase.sh/react'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

export type UiMode = 'default' | 'embedded'

const MODE_KEY = 'corino:ui-mode'
const EMBED_SCRIPT = 'https://assets.moonbase.sh/storefront/moonbase.js'

/** The slice of Moonbase's embedded-storefront API this site uses. */
export interface MoonbaseInstance {
  setup: (url: string, options?: Record<string, unknown>) => Promise<void>
  on: (event: string, callback: (event: unknown) => void) => void
  sign_in: (parameters?: { email?: string }) => void
  view_cart: () => void
  view_product: (parameters: { product_id: string; version?: string }) => void
  add_to_cart: (parameters: {
    product_id?: string
    bundle_id?: string
    quantity?: number
    show_cart?: boolean
  }) => Promise<void>
}

declare global {
  interface Window {
    Moonbase?: MoonbaseInstance
  }
}

let embedPromise: Promise<MoonbaseInstance> | null = null

/** Loads Moonbase's script once and runs setup once; later calls share the same promise. */
function loadEmbed(endpoint: string): Promise<MoonbaseInstance> {
  if (embedPromise) return embedPromise
  embedPromise = new Promise<MoonbaseInstance>((resolve, reject) => {
    const ready = () => {
      const moonbase = window.Moonbase
      if (!moonbase) {
        reject(new Error('Moonbase embedded storefront script did not expose window.Moonbase'))
        return
      }
      // Our own nav owns the cart and account buttons, so the embed's toolbar stays off.
      moonbase
        .setup(endpoint, {
          toolbar: { enabled: false },
          theme: { dark: true, colors: { primary: '#eca45d' }, corners: 'sharp' },
        })
        .then(() => {
          // Lets tests and tooling know the embedded storefront is ready to take calls.
          document.documentElement.dataset.embed = 'ready'
          // Setup can swap in the real instance, so hand out whatever window.Moonbase is now.
          resolve(window.Moonbase ?? moonbase)
        }, reject)
    }
    if (window.Moonbase) {
      ready()
      return
    }
    const script = document.createElement('script')
    script.src = EMBED_SCRIPT
    script.async = true
    script.onload = ready
    script.onerror = () => reject(new Error('Could not load the Moonbase embedded storefront script'))
    document.head.appendChild(script)
  }).catch((err) => {
    embedPromise = null
    throw err
  })
  return embedPromise
}

// The embedded storefront and our SDK share one cart: both keep it in localStorage under
// `moonbase_session` and both reload it on `storage` events. Browsers fire those only in
// OTHER tabs, so inside one page neither side hears the other's writes. Replaying the event
// ourselves keeps the two views of the cart together.
const CART_KEY = 'moonbase_session'
let lastSyncedCart: string | null | undefined

function syncCart() {
  const value = window.localStorage.getItem(CART_KEY)
  // Skip when nothing changed since the last replay, so the two sides cannot echo forever.
  if (lastSyncedCart !== undefined && value === lastSyncedCart) return
  lastSyncedCart = value
  window.dispatchEvent(
    new StorageEvent('storage', { key: CART_KEY, newValue: value, storageArea: window.localStorage }),
  )
}

let embedListenersAttached = false

interface EmbedModeApi {
  mode: UiMode
  setMode: (mode: UiMode) => void
  /** Runs a call against the embedded storefront once its script is loaded and set up. */
  withEmbed: (run: (moonbase: MoonbaseInstance) => unknown) => void
}

const EmbedModeContext = createContext<EmbedModeApi | null>(null)

/**
 * Chooses between this site's own UI (default) and Moonbase's hosted embedded storefront.
 * The mode starts from the server default, then follows the visitor's remembered choice.
 * The embed script is loaded only when embedded mode is first used.
 */
export function EmbedModeProvider({
  endpoint,
  defaultMode,
  children,
}: {
  endpoint: string
  defaultMode: UiMode
  children: ReactNode
}) {
  const { context } = useStorefront()
  const [mode, setModeState] = useState<UiMode>(defaultMode)

  // Read the stored choice after mount so server and first client render agree.
  useEffect(() => {
    const stored = window.localStorage.getItem(MODE_KEY)
    if (stored === 'default' || stored === 'embedded') setModeState(stored)
  }, [])

  // Warm up the embed as soon as embedded mode is on, and keep our session in step
  // with sign-ins made inside it.
  useEffect(() => {
    if (mode !== 'embedded') return
    let cancelled = false
    loadEmbed(endpoint)
      .then((moonbase) => {
        // Handlers cannot be removed from the embed, so attach them once.
        if (cancelled || embedListenersAttached) return
        embedListenersAttached = true
        const refreshUser = () => void context.updateUser().catch(() => {})
        moonbase.on('signed-in', refreshUser)
        moonbase.on('signed-out', refreshUser)
        // Cart changes made inside the embed show up in our basket count.
        moonbase.on('storefront-updated', syncCart)
      })
      .catch((err) => console.error('[corino] embedded storefront failed to load', err))
    return () => {
      cancelled = true
    }
  }, [mode, endpoint, context])

  // Whichever side was used last may have changed the cart; bring the other side up to date.
  const previousMode = useRef<UiMode | null>(null)
  useEffect(() => {
    if (previousMode.current !== null && previousMode.current !== mode) syncCart()
    previousMode.current = mode
  }, [mode])

  const setMode = useCallback((next: UiMode) => {
    window.localStorage.setItem(MODE_KEY, next)
    setModeState(next)
  }, [])

  const withEmbed = useCallback(
    (run: (moonbase: MoonbaseInstance) => unknown) => {
      loadEmbed(endpoint)
        // Resolve the instance at call time rather than using the one captured at setup.
        .then((loaded) => run(window.Moonbase ?? loaded))
        .catch((err) => console.error('[corino] embedded storefront call failed', err))
    },
    [endpoint],
  )

  const api = useMemo<EmbedModeApi>(() => ({ mode, setMode, withEmbed }), [mode, setMode, withEmbed])
  return <EmbedModeContext.Provider value={api}>{children}</EmbedModeContext.Provider>
}

export function useEmbedMode(): EmbedModeApi {
  const ctx = useContext(EmbedModeContext)
  if (!ctx) throw new Error('useEmbedMode must be used inside <EmbedModeProvider>')
  return ctx
}
