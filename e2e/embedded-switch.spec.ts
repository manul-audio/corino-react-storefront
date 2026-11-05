import { expect, test } from '@playwright/test'

test('the footer switch changes the mode and remembers it across reloads', async ({ page }) => {
  await page.goto('/')
  const group = page.getByRole('group', { name: 'Storefront interface' })
  await expect(group.getByRole('button', { name: 'Default' })).toHaveAttribute('aria-pressed', 'true')
  await group.getByRole('button', { name: 'Embedded' }).click()
  await expect(group.getByRole('button', { name: 'Embedded' })).toHaveAttribute('aria-pressed', 'true')
  expect(await page.evaluate(() => localStorage.getItem('corino:ui-mode'))).toBe('embedded')

  await page.reload()
  await expect(
    page.getByRole('group', { name: 'Storefront interface' }).getByRole('button', { name: 'Embedded' }),
  ).toHaveAttribute('aria-pressed', 'true')
})

test('in embedded mode our actions call Moonbase instead of opening our own panels', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('corino:ui-mode', 'embedded'))
  await page.goto('/')
  // The real script loads from Moonbase's CDN; replace its intents with recorders so the
  // test checks routing without depending on the embed's own markup.
  // Wait for setup to finish: it installs the real intents, which would overwrite ours.
  await page.waitForFunction(() => document.documentElement.dataset.embed === 'ready', null, { timeout: 20_000 })
  await page.evaluate(() => {
    const calls: Array<[string, unknown]> = []
    ;(window as any).__calls = calls
    const m = (window as any).Moonbase
    m.add_to_cart = (p: unknown) => { calls.push(['add_to_cart', p]); return Promise.resolve() }
    m.view_cart = () => { calls.push(['view_cart', null]) }
    m.sign_in = () => { calls.push(['sign_in', null]) }
    m.view_product = (p: unknown) => { calls.push(['view_product', p]) }
  })

  await page.locator('section.plugin').nth(0).getByRole('button', { name: /add to cart/i }).click()
  await page.getByRole('button', { name: 'Cart', exact: true }).click()
  await page.getByRole('button', { name: 'Log in' }).click()
  await page.locator('section.plugin').nth(0).getByRole('button', { name: /try halo/i }).click()

  // The calls wait for the embed's setup to finish, so poll for them.
  await expect
    .poll(() => page.evaluate(() => (window as any).__calls), { timeout: 15_000 })
    .toEqual([
      ['add_to_cart', { product_id: 'halo', show_cart: true }],
      ['view_cart', null],
      ['sign_in', null],
      ['view_product', { product_id: 'halo' }],
    ])
  await expect(page.locator('aside.drawer')).toHaveCount(0)
})

test('the cart is shared: our basket picks up changes the embed makes in storage', async ({ page }) => {
  await page.goto('/?add_product=halo')
  const group = page.getByRole('group', { name: 'Storefront interface' })
  await expect(page.locator('aside.drawer .cart-line')).toHaveCount(1)
  await page.keyboard.press('Escape')
  await expect(page.locator('.cart-count')).toHaveText('1')

  // Embedded mode must not lose the cart.
  await group.getByRole('button', { name: 'Embedded' }).click()
  await expect(page.locator('.cart-count')).toHaveText('1')

  // The embed empties the cart: it writes the shared order to storage, which our own
  // page is never told about by the browser. Switching back replays it.
  await page.evaluate(() => {
    const order = JSON.parse(localStorage.getItem('moonbase_session') ?? '{}')
    localStorage.setItem('moonbase_session', JSON.stringify({ ...order, items: [] }))
  })
  await group.getByRole('button', { name: 'Default' }).click()
  await expect(page.locator('.cart-count')).toHaveCount(0)
})
