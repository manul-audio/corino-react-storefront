import { expect, test } from '@playwright/test'

test('a failing tenant renders the unavailable page instead of crashing', async ({ page }) => {
  const res = await page.goto('/')
  expect(res?.status()).toBe(200)
  await expect(page.getByRole('heading', { name: /store is unavailable/i })).toBeVisible()
  await expect(page.locator('[data-boot="ok"]')).toHaveCount(0)
})
