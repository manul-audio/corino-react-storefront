import { expect, test } from '@playwright/test'

test.use({ locale: 'nb-NO' })

test('a Norwegian-locale browser hydrates without errors and sees the same prices as the server', async ({ page, request }) => {
  const errors: string[] = []
  page.on('pageerror', (err) => errors.push(err.message))
  // Hydration mismatches are logged via console.error (React #418 / #423 in production
  // builds, a descriptive message in development), not thrown.
  page.on('console', (msg) => {
    if (msg.type() === 'error' && /hydrat|#418|#423|#425/i.test(msg.text())) errors.push(msg.text())
  })
  const html = await (await request.get('/')).text()
  const serverPrice = html.match(/price-now"><span>([^<]+)<\/span>/)?.[1]
  expect(serverPrice).toBeTruthy()
  await page.goto('/')
  await expect(page.locator('section.plugin').nth(0).locator('.price-now')).toHaveText(serverPrice!)
  await page.waitForTimeout(500)
  expect(errors).toEqual([])
})
