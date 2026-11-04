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
      use: { baseURL: 'http://localhost:5173' },
    },
    { name: 'unavailable', testMatch: /unavailable\.spec\.ts/, use: { baseURL: 'http://localhost:3100' } },
  ],
  webServer: [
    {
      command: 'pnpm start',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    {
      command: 'pnpm exec next start -p 3100',
      url: 'http://localhost:3100',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      env: { MOONBASE_ENDPOINT: 'https://corino-demo.moonbase.sh/does-not-exist' },
    },
  ],
})
