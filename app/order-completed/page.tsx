'use client'

import { useAuth } from '@moonbase.sh/react'
import Link from 'next/link'
import { AuthPage } from '@/components/AuthPage'

export default function OrderCompletedPage() {
  const { user } = useAuth()
  return (
    <AuthPage eyebrow="ORDER COMPLETE" title="Thanks for your order.">
      <div className="order-complete">
        <div className="order-complete-icon" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="1.5" />
            <path d="M13 20.5 L18 25.5 L27.5 15.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="hint">
          Your purchase is confirmed. Check your email for a receipt, then sign in to your account to download your products.
        </p>
        <div className="auth-actions">
          {user ? (
            <Link href="/account/products" className="submit">Go to my products</Link>
          ) : (
            <Link href="/login" className="submit">Sign in</Link>
          )}
          <Link href="/" className="submit secondary">Back to home</Link>
        </div>
      </div>
    </AuthPage>
  )
}
