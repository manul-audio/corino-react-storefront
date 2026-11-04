import { expect, test } from '@playwright/test'

test('log in button opens the modal and a wrong password shows an inline error', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Log in' }).click()
  const modal = page.locator('form.modal')
  await expect(modal).toBeVisible()
  await modal.getByLabel('Email').fill('corino-react-e2e@example.com')
  await modal.getByLabel('Password').fill('definitely-not-the-password')
  await modal.getByRole('button', { name: 'Sign in' }).click()
  await expect(modal.locator('.error')).toBeVisible()
  await expect(modal.locator('.error')).not.toBeEmpty()
})

test('order-completed page renders', async ({ page }) => {
  await page.goto('/order-completed')
  await expect(page.getByRole('heading', { name: 'Thanks for your order.' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible()
})
