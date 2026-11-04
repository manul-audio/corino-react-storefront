import { expect, test } from '@playwright/test'

test('adding HALO opens the drawer with one line and a total; removing empties it', async ({ page }) => {
  await page.goto('/')
  await page.locator('section.plugin').nth(0).getByRole('button', { name: /add to cart/i }).click()
  const drawer = page.locator('aside.drawer')
  await expect(drawer).toBeVisible()
  await expect(drawer.locator('.cart-line')).toHaveCount(1)
  await expect(drawer.locator('.cart-line .name')).toContainText('HALO')
  await expect(drawer.locator('.total-amount')).toHaveText(/[1-9]/)
  await drawer.getByRole('button', { name: 'Remove' }).click()
  await expect(drawer.locator('.cart-line')).toHaveCount(0)
  await expect(drawer.locator('.empty')).toContainText('Your cart is empty')
})

test('?add_product=halo deep link opens the drawer with HALO', async ({ page }) => {
  await page.goto('/?add_product=halo')
  const drawer = page.locator('aside.drawer')
  await expect(drawer).toBeVisible()
  await expect(drawer.locator('.cart-line .name')).toContainText('HALO')
})

test('the drawer is a dialog and closes on Escape', async ({ page }) => {
  await page.goto('/?add_product=halo')
  const drawer = page.getByRole('dialog', { name: 'Basket' })
  await expect(drawer).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(drawer).toHaveCount(0)
})
