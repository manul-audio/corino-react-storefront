import { expect, test } from '@playwright/test'

const MISSING = 'This confirmation link is missing required information.'

test('/login renders the sign-in form', async ({ page }) => {
  await page.goto('/login')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByLabel('Email', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()
})

test('/sign-up, /confirm-email and /account/confirm-email-change explain a missing link', async ({ page }) => {
  for (const path of ['/sign-up', '/confirm-email', '/account/confirm-email-change']) {
    await page.goto(path)
    await expect(page.locator('.auth-panel')).toContainText(MISSING)
  }
})

test('/forgot-password shows request mode without params and reset mode with them', async ({ page }) => {
  await page.goto('/forgot-password')
  await expect(page.getByRole('button', { name: /send|request/i })).toBeVisible()
  await page.goto('/forgot-password?email=someone%40example.com&code=abc')
  await expect(page.getByLabel(/new password/i)).toBeVisible()
})

test('/download and /subscriptions ask for sign-in when signed out', async ({ page }) => {
  await page.goto('/download?product_id=halo')
  await expect(page.locator('.auth-panel').getByRole('button', { name: 'Sign in' })).toBeVisible()
  await page.goto('/subscriptions?subscription_id=sub_123')
  await expect(page.locator('.auth-panel').getByRole('button', { name: 'Sign in' })).toBeVisible()
  await page.goto('/subscriptions')
  await expect(page.locator('.auth-panel')).toContainText('missing a subscription reference')
})
