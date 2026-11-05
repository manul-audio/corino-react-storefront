import { StoreClosedError, type StorefrontHydrationState } from '@moonbase.sh/react'
import { createServerStorefront } from '@moonbase.sh/react/ssr'
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import { cookies } from 'next/headers'
import { Unavailable, type UnavailableKind } from '@/components/Unavailable'
import { resolveDefaultUiMode, resolveMoonbaseEndpoint } from '@/lib/env'
import { Providers } from './providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-inter', display: 'swap' })
const grotesk = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-display', display: 'swap' })
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-mono', display: 'swap' })

export const metadata: Metadata = {
  title: 'Corino — Sound, sculpted.',
  robots: { index: false, follow: false },
}

type Boot =
  | { kind: 'ok'; endpoint: string; initialState: StorefrontHydrationState }
  | { kind: UnavailableKind }

async function boot(): Promise<Boot> {
  const endpoint = resolveMoonbaseEndpoint()
  const cookieStore = await cookies()
  try {
    const { initialState } = await createServerStorefront(endpoint, {
      cookieHeader: cookieStore.toString(),
    })
    if (initialState.closed) return { kind: 'closed' }
    return { kind: 'ok', endpoint, initialState }
  } catch (err) {
    console.error('[corino] storefront boot failed', err)
    // Moonbase's API client reads `window` on its error path in Node, so a 404 or 5xx
    // can arrive as a ReferenceError rather than a typed error. Degrade, never crash.
    return { kind: err instanceof StoreClosedError ? 'closed' : 'unavailable' }
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const result = await boot()
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable} ${mono.variable}`}>
      <body>
        {result.kind === 'ok' ? (
          <Providers endpoint={result.endpoint} initialState={result.initialState} defaultMode={resolveDefaultUiMode()}>
            {children}
          </Providers>
        ) : (
          <Unavailable kind={result.kind} />
        )}
      </body>
    </html>
  )
}
