import { expect, test } from '@playwright/test'

test('global stylesheet and fonts are applied', async ({ page }) => {
  await page.goto('/')
  const body = page.locator('body')
  await expect(body).toHaveCSS('background-color', 'rgb(12, 11, 10)')
  const fontFamily = await body.evaluate((el) => getComputedStyle(el).fontFamily)
  expect(fontFamily.toLowerCase()).toContain('inter')
  const monoVar = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--font-mono').trim(),
  )
  expect(monoVar.length).toBeGreaterThan(0)
})
