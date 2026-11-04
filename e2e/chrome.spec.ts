import { expect, test } from '@playwright/test'

test('demo banner, nav, hero, and footer render on the home page', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('note')).toContainText('Demo site')
  await expect(page.getByRole('navigation')).toContainText('CORINO')
  await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Cart' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('two plugins')
  await expect(page.locator('footer')).toContainText('Newsletter')
})
