'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

export type DownloadModalMode = 'trial' | 'owned'

interface UiState {
  cartOpen: boolean
  loginOpen: boolean
  downloadModal: { productId: string; mode: DownloadModalMode } | null
}

interface UiApi extends UiState {
  showCart: () => void
  hideCart: () => void
  showLogin: () => void
  hideLogin: () => void
  showTrial: (productId: string) => void
  showDownloads: (productId: string) => void
  hideDownloadModal: () => void
}

const UiContext = createContext<UiApi | null>(null)

const initialState: UiState = { cartOpen: false, loginOpen: false, downloadModal: null }

export function UiProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UiState>(initialState)

  const showCart = useCallback(() => setState((s) => ({ ...s, cartOpen: true })), [])
  const hideCart = useCallback(() => setState((s) => ({ ...s, cartOpen: false })), [])
  const showLogin = useCallback(() => setState((s) => ({ ...s, loginOpen: true })), [])
  const hideLogin = useCallback(() => setState((s) => ({ ...s, loginOpen: false })), [])
  const showTrial = useCallback(
    (productId: string) => setState((s) => ({ ...s, downloadModal: { productId, mode: 'trial' } })),
    [],
  )
  const showDownloads = useCallback(
    (productId: string) => setState((s) => ({ ...s, downloadModal: { productId, mode: 'owned' } })),
    [],
  )
  const hideDownloadModal = useCallback(() => setState((s) => ({ ...s, downloadModal: null })), [])

  const api = useMemo<UiApi>(
    () => ({ ...state, showCart, hideCart, showLogin, hideLogin, showTrial, showDownloads, hideDownloadModal }),
    [state, showCart, hideCart, showLogin, hideLogin, showTrial, showDownloads, hideDownloadModal],
  )

  return <UiContext.Provider value={api}>{children}</UiContext.Provider>
}

export function useUi(): UiApi {
  const ctx = useContext(UiContext)
  if (!ctx) throw new Error('useUi must be used inside <UiProvider>')
  return ctx
}
