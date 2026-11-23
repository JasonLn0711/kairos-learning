import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/browser',
  testMatch: 'interactive.spec.ts',
  fullyParallel: false,
  workers: 2,
  timeout: 60_000,
  outputDir: '.local/interactive-browser',
  use: { baseURL: 'http://127.0.0.1:46106', trace: 'retain-on-failure' },
  webServer: {
    command: 'python3 -m http.server 46106 --bind 127.0.0.1 --directory build',
    url: 'http://127.0.0.1:46106/interactive/',
    reuseExistingServer: false
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }]
});
