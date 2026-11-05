import { expect, test } from '@playwright/test'

test('log in opens the auth panel and a wrong password shows an inline error', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Log in' }).click()
  const panel = page.getByRole('dialog', { name: 'Sign in' })
  await expect(panel).toBeVisible()
  await panel.getByLabel('Email', { exact: true }).fill('corino-react-e2e@example.com')
  await panel.getByLabel('Password', { exact: true }).fill('definitely-not-the-password')
  await panel.getByRole('button', { name: 'Sign in' }).click()
  await expect(panel.locator('.error')).toBeVisible()
  await expect(panel.locator('.error')).not.toBeEmpty()
})

test('the auth panel switches to create-account and forgot-password views and back', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Log in' }).click()
  const signIn = page.getByRole('dialog', { name: 'Sign in' })
  await expect(signIn).toBeVisible()

  await signIn.getByRole('button', { name: 'Create account' }).click()
  const create = page.getByRole('dialog', { name: 'Create account' })
  await expect(create).toBeVisible()
  await expect(create.getByLabel('Name', { exact: true })).toBeVisible()
  await expect(create.getByLabel('Email', { exact: true })).toBeVisible()
  await expect(create.getByLabel('Password', { exact: true })).toBeVisible()
  await expect(create.getByRole('checkbox', { name: /privacy policy/i })).toBeVisible()
  await expect(create.getByRole('checkbox', { name: /terms/i })).toBeVisible()
  await expect(create.getByRole('button', { name: 'Create account' })).toBeVisible()

  await create.getByRole('button', { name: 'Back' }).click()
  await expect(page.getByRole('dialog', { name: 'Sign in' })).toBeVisible()

  await page.getByRole('dialog', { name: 'Sign in' }).getByRole('button', { name: 'Forgot password' }).click()
  const forgot = page.getByRole('dialog', { name: 'Forgot password' })
  await expect(forgot).toBeVisible()
  await expect(forgot.getByLabel('Email', { exact: true })).toBeVisible()
  await expect(forgot.getByRole('button', { name: 'Send reset link' })).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog', { name: 'Forgot password' })).toHaveCount(0)
})

test('order-completed page renders', async ({ page }) => {
  await page.goto('/order-completed')
  await expect(page.getByRole('heading', { name: 'Thanks for your order.' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible()
})
