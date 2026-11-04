import { expect, test } from '@playwright/test'

test('the banner is hidden by default and opens from the footer, remembering the answer', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await expect(page.locator('.cookie-banner')).toHaveCount(0)
  await page.locator('footer').getByRole('button', { name: /cookie settings/i }).click()
  const banner = page.locator('.cookie-banner')
  await expect(banner).toBeVisible()
  await banner.getByRole('button', { name: 'Decline' }).click()
  await expect(banner).toHaveCount(0)
  const stored = await page.evaluate(() => localStorage.getItem('corino:cookie-consent'))
  expect(stored).toBe('false')
  await page.locator('footer').getByRole('button', { name: /cookie settings/i }).click()
  await expect(page.locator('.cookie-banner .current')).toContainText("You've declined")
})
