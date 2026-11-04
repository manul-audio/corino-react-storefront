'use client'

import { useAuth } from '@moonbase.sh/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { useMounted } from '@/components/Mounted'
import { useUi } from '@/lib/ui-context'

const TABS = [
  { path: '/account', title: 'Account', exact: true },
  { path: '/account/products', title: 'Products', exact: false },
  { path: '/account/redeem', title: 'Redeem', exact: true },
]

// Callback pages under /account render standalone, without the shell or the gate.
const STANDALONE_PATHS = ['/account/confirm-email-change']

function isActive(tab: (typeof TABS)[number], pathname: string) {
  if (tab.exact) return pathname === tab.path
  return pathname === tab.path || pathname.startsWith(`${tab.path}/`)
}

export default function AccountLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { user, loaded } = useAuth()
  const { showLogin } = useUi()
  const mounted = useMounted()

  if (STANDALONE_PATHS.includes(pathname)) return <>{children}</>

  return (
    <main className="account-page">
      <div className="account-head">
        <div className="section-num">[ ACCOUNT ]</div>
        <h1>{user?.name || 'Your account'}</h1>
        {user ? <p className="account-email">{user.email}</p> : null}
      </div>

      {!mounted || !loaded ? (
        <div className="account-loading">Loading…</div>
      ) : !user ? (
        <div className="account-signed-out">
          <p>You need to be signed in to view your account.</p>
          <button type="button" className="submit" onClick={showLogin}>Sign in</button>
        </div>
      ) : (
        <div className="account-tabs-wrap">
          <nav className="account-tabs" role="tablist">
            {TABS.map((tab) => {
              const active = isActive(tab, pathname)
              return (
                <Link key={tab.path} href={tab.path} role="tab" className={active ? 'active' : undefined} aria-selected={active}>
                  {tab.title}
                </Link>
              )
            })}
          </nav>
          <div className="account-panel">{children}</div>
        </div>
      )}
    </main>
  )
}
