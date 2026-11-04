import { expect, test } from '@playwright/test'

const email = process.env.E2E_ACCOUNT_EMAIL
const password = process.env.E2E_ACCOUNT_PASSWORD

test.skip(!email || !password, 'Set E2E_ACCOUNT_EMAIL and E2E_ACCOUNT_PASSWORD to run the signed-in account test')

test('signing in shows the account area and the products tab loads', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Log in' }).click()
  const modal = page.locator('form.modal')
  await modal.getByLabel('Email').fill(email!)
  await modal.getByLabel('Password').fill(password!)
  await modal.getByRole('button', { name: 'Sign in' }).click()
  await expect(modal).toBeHidden()
  await page.goto('/account')
  await expect(page.locator('.account-tabs')).toBeVisible()
  await expect(page.locator('.account-email')).toContainText('@')
  await page.locator('.account-tabs').getByRole('tab', { name: 'Products' }).click()
  await expect(page).toHaveURL(/\/account\/products$/)
  await expect(page.locator('.account-panel')).toContainText(/product|don't own/i)
})
