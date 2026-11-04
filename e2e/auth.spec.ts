import { expect, test } from '@playwright/test'

test('/account while signed out shows the gate and opens the login modal', async ({ page }) => {
  await page.goto('/account')
  await expect(page.locator('main.account-page')).toBeVisible()
  await expect(page.locator('.account-signed-out')).toContainText('You need to be signed in')
  await page.locator('.account-signed-out').getByRole('button', { name: 'Sign in' }).click()
  await expect(page.locator('form.modal')).toBeVisible()
})

test('/account/products and /account/redeem are gated the same way', async ({ page }) => {
  await page.goto('/account/products')
  await expect(page.locator('.account-signed-out')).toBeVisible()
  await page.goto('/account/redeem')
  await expect(page.locator('.account-signed-out')).toBeVisible()
})

test('/account/products/halo is gated when signed out', async ({ page }) => {
  await page.goto('/account/products/halo')
  await expect(page.locator('.account-signed-out')).toBeVisible()
})
