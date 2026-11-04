'use client'

import { useAuth } from '@moonbase.sh/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, type FormEvent } from 'react'

export function AccountInfo() {
  const { user, update, setPassword, signOut } = useAuth()
  const router = useRouter()

  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [newsletterOptIn, setNewsletterOptIn] = useState(user?.communicationPreferences?.newsletterOptIn ?? false)
  const [productUpdatesOptIn, setProductUpdatesOptIn] = useState(user?.communicationPreferences?.productUpdatesOptIn ?? false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [emailNeedsConfirmation, setEmailNeedsConfirmation] = useState(false)

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  // Mirror the Vue `watch(user, …)`: resync the form when the user object changes.
  const userId = user?.id ?? null
  const userName = user?.name ?? ''
  const userEmail = user?.email ?? ''
  const userNewsletter = user?.communicationPreferences?.newsletterOptIn ?? false
  const userProductUpdates = user?.communicationPreferences?.productUpdatesOptIn ?? false
  useEffect(() => {
    if (!userId) return
    setName(userName)
    setEmail(userEmail)
    setNewsletterOptIn(userNewsletter)
    setProductUpdatesOptIn(userProductUpdates)
  }, [userId, userName, userEmail, userNewsletter, userProductUpdates])

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setSaveError(null)
    setSaveSuccess(false)
    setEmailNeedsConfirmation(false)
    try {
      const result = await update(name, email, undefined, { newsletterOptIn, productUpdatesOptIn })
      setSaveSuccess(true)
      if (result.needsEmailConfirmationToken) setEmailNeedsConfirmation(true)
    } catch (err) {
      setSaveError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPasswordSaving(true)
    setPasswordError(null)
    setPasswordSuccess(false)
    try {
      await setPassword(oldPassword, newPassword)
      setOldPassword('')
      setNewPassword('')
      setPasswordSuccess(true)
    } catch (err) {
      setPasswordError((err as Error).message)
    } finally {
      setPasswordSaving(false)
    }
  }

  async function logOut() {
    await signOut()
    router.push('/')
  }

  return (
    <div className="account-section">
      <form className="account-form" onSubmit={save}>
        <h3>Profile</h3>

        <label htmlFor="account-name">Full name</label>
        <input id="account-name" value={name} onChange={(e) => setName(e.target.value)} type="text" autoComplete="name" required />

        <label htmlFor="account-email">Email</label>
        <input id="account-email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required />

        <label className="checkbox-row">
          <input type="checkbox" checked={newsletterOptIn} onChange={(e) => setNewsletterOptIn(e.target.checked)} />
          <span>Receive updates and offers by email</span>
        </label>

        <label className="checkbox-row">
          <input type="checkbox" checked={productUpdatesOptIn} onChange={(e) => setProductUpdatesOptIn(e.target.checked)} />
          <span>Receive product updates by email</span>
        </label>

        <button type="submit" className="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>

        {saveError ? (
          <p className="error">{saveError}</p>
        ) : emailNeedsConfirmation ? (
          <p className="notice">Please check your inbox to confirm your new email address.</p>
        ) : saveSuccess ? (
          <p className="success">Saved.</p>
        ) : null}
      </form>

      <form className="account-form" onSubmit={changePassword}>
        <h3>Change password</h3>

        <label htmlFor="account-old-password">Current password</label>
        <input
          id="account-old-password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          type="password"
          autoComplete="current-password"
          required
        />

        <label htmlFor="account-new-password">New password</label>
        <input
          id="account-new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          type="password"
          autoComplete="new-password"
          required
        />

        <button type="submit" className="submit" disabled={passwordSaving}>
          {passwordSaving ? 'Saving…' : 'Change password'}
        </button>

        {passwordError ? (
          <p className="error">{passwordError}</p>
        ) : passwordSuccess ? (
          <p className="success">Password changed.</p>
        ) : null}
      </form>

      <button type="button" className="logout" onClick={logOut}>
        Log out
      </button>
    </div>
  )
}
