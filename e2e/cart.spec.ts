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

test('quantity steppers change the line quantity and the total', async ({ page }) => {
  await page.goto('/?add_product=halo')
  const drawer = page.locator('aside.drawer')
  const line = drawer.locator('.cart-line').first()
  await expect(line).toBeVisible()
  await expect(line.locator('.qty-value')).toHaveText('1')
  const before = await drawer.locator('.total-amount').textContent()
  await line.getByRole('button', { name: 'Increase quantity' }).click()
  await expect(line.locator('.qty-value')).toHaveText('2')
  await expect(drawer.locator('.total-amount')).not.toHaveText(before ?? '')
  await line.getByRole('button', { name: 'Decrease quantity' }).click()
  await expect(line.locator('.qty-value')).toHaveText('1')
  await line.getByRole('button', { name: 'Decrease quantity' }).click()
  await expect(drawer.locator('.cart-line')).toHaveCount(0)
})

test('the basket explains the cart offer and the price breakdown', async ({ page }) => {
  await page.goto('/?add_product=halo')
  const drawer = page.locator('aside.drawer')
  await expect(drawer).toBeVisible()
  // The demo tenant runs a cart-total offer; with one plugin it is either still locked
  // ("Spend … more") or already applied, depending on the tenant's threshold.
  const offer = drawer.locator('.offer-card')
  await expect(offer).toBeVisible()
  await expect(offer).toContainText(/spend .* more|applied/i)
  await expect(drawer.locator('.breakdown-row.subtotal .breakdown-value')).toHaveText(/[1-9]/)

  // The bundle alone clears the tenant's cart-total threshold, so the tier is applied.
  await page.goto('/?add_bundle=duo-bundle')
  await expect(drawer.locator('.cart-line')).not.toHaveCount(0)
  await expect(drawer.locator('.offer-card')).toContainText(/applied/i)
  await expect(drawer.locator('.offer-card')).toContainText('25% off')
  await expect(drawer.locator('.breakdown-row.saving')).toBeVisible()
  await expect(drawer.locator('.breakdown-row.saving .breakdown-value')).toHaveText(/[1-9]/)
})

test('page scrolling is locked while the drawer is open and restored on close', async ({ page }) => {
  await page.goto('/')
  const overflow = () => page.evaluate(() => document.body.style.overflow)
  expect(await overflow()).toBe('')
  await page.locator('section.plugin').nth(0).getByRole('button', { name: /add to cart/i }).click()
  await expect(page.locator('aside.drawer')).toBeVisible()
  expect(await overflow()).toBe('hidden')
  await page.keyboard.press('Escape')
  await expect(page.locator('aside.drawer')).toHaveCount(0)
  expect(await overflow()).toBe('')
})

test('the drawer is a dialog and closes on Escape', async ({ page }) => {
  await page.goto('/?add_product=halo')
  const drawer = page.getByRole('dialog', { name: 'Basket' })
  await expect(drawer).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(drawer).toHaveCount(0)
})

test('a bundle line lists its products behind a Show/Hide toggle', async ({ page }) => {
  await page.goto('/?add_bundle=duo-bundle')
  const drawer = page.locator('aside.drawer')
  const toggle = drawer.getByRole('button', { name: /2 products/ })
  await expect(toggle).toBeVisible()
  await expect(drawer.locator('.bundle-product-list')).toHaveCount(0)
  await toggle.click()
  await expect(drawer.locator('.bundle-product-list li')).toHaveCount(2)
  await expect(drawer.locator('.bundle-product-list')).toContainText('HALO')
  await expect(drawer.locator('.bundle-product-list')).toContainText('DRIFT')
  await toggle.click()
  await expect(drawer.locator('.bundle-product-list')).toHaveCount(0)
})
