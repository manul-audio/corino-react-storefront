import { expect, test } from '@playwright/test'

test('server renders the hydrated catalog without a client fetch', async ({ request }) => {
  const res = await request.get('/')
  expect(res.ok()).toBeTruthy()
  const html = await res.text()
  expect(html).toMatch(/data-boot="ok"/)
  expect(html).toMatch(/data-products="[1-9]\d*"/)
})
