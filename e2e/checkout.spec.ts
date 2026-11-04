import { expect, test } from '@playwright/test'

test('checkout opens the embedded Moonbase overlay', async ({ page }) => {
  await page.goto('/?add_product=halo')
  const drawer = page.locator('aside.drawer')
  await expect(drawer).toBeVisible()
  await drawer.getByRole('button', { name: 'Checkout' }).click()
  const frame = page.locator('iframe[src^="https://corino-demo.moonbase.sh"]')
  await expect(frame).toBeAttached({ timeout: 15_000 })
  await expect(frame).toBeVisible()
})
