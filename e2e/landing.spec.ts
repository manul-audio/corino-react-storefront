import { expect, test } from '@playwright/test'

const PRICE = /[$€£]\s?\d+|\d+\s?(kr|€)/

test('initial HTML already contains products and prices (SSR hydration)', async ({ request }) => {
  const html = await (await request.get('/')).text()
  expect(html).toContain('HALO')
  expect(html).toContain('DRIFT')
  expect(html).toMatch(/price-now[^<]*<span>[^<]*<\/span>/)
  expect(html).toMatch(PRICE)
})

test('landing page shows two plugin cards and the bundle', async ({ page }) => {
  await page.goto('/')
  const cards = page.locator('section.plugin')
  await expect(cards).toHaveCount(2)
  await expect(cards.nth(0)).toContainText('HALO')
  await expect(cards.nth(1)).toContainText('DRIFT')
  await expect(cards.nth(0).locator('.price-now')).toHaveText(PRICE)
  await expect(page.locator('section.bundle')).toContainText('Studio Bundle')
  await expect(page.getByRole('button', { name: /add to cart/i })).toHaveCount(2)
})
