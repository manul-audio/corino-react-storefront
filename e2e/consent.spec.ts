import { expect, test } from '@playwright/test'

test('a first-time visitor is asked, and the answer is remembered across reloads', async ({ page }) => {
  await page.goto('/')
  const banner = page.locator('.cookie-banner')
  await expect(banner).toBeVisible()
  await banner.getByRole('button', { name: 'Decline' }).click()
  await expect(banner).toHaveCount(0)
  expect(await page.evaluate(() => localStorage.getItem('corino:cookie-consent'))).toBe('false')

  await page.reload()
  await page.waitForLoadState('networkidle')
  await expect(page.locator('.cookie-banner')).toHaveCount(0)
})

test('Cookie settings in the footer reopens the banner showing the earlier answer', async ({ page }) => {
  await page.goto('/')
  await page.locator('.cookie-banner').getByRole('button', { name: 'Accept' }).click()
  await expect(page.locator('.cookie-banner')).toHaveCount(0)
  expect(await page.evaluate(() => localStorage.getItem('corino:cookie-consent'))).toBe('true')

  await page.locator('footer').getByRole('button', { name: /cookie settings/i }).click()
  await expect(page.locator('.cookie-banner .current')).toContainText("You've accepted")
  await page.locator('.cookie-banner').getByRole('button', { name: 'Decline' }).click()
  await expect(page.locator('.cookie-banner')).toHaveCount(0)
})
