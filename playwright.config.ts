import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: { trace: 'retain-on-failure', ...devices['Desktop Chrome'] },
  projects: [
    {
      name: 'main',
      testIgnore: /unavailable\.spec\.ts/,
      use: { baseURL: 'http://localhost:3000' },
    },
  ],
  webServer: [
    {
      command: 'pnpm start',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
  ],
})
