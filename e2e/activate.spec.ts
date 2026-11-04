import { expect, test } from '@playwright/test'

test('/activate without a token shows the offline flow', async ({ page }) => {
  await page.goto('/activate')
  await expect(page.getByRole('heading', { name: 'Activate offline device' })).toBeVisible()
  await expect(page.locator('.manual-activation')).toContainText('Upload your machine file')
  await expect(page.locator('.device-token-input')).toBeVisible()
})

test('/activate with a bogus token shows the online flow error state', async ({ page }) => {
  await page.goto('/activate?token=not-a-real-token')
  await expect(page.getByRole('heading', { name: 'Activate product' })).toBeVisible()
  await expect(page.locator('.activation-loader')).toContainText(/Uh oh|Could not find/, { timeout: 15_000 })
})
