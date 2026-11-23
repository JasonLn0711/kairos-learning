import { defineConfig } from '@playwright/test';

const port = 46142;
const baseURL = 'http://127.0.0.1:' + port;

export default defineConfig({
  testDir: 'tests/browser',
  testMatch: 'aase-m02-immersive.spec.ts',
  fullyParallel: true,
  workers: 4,
  timeout: 90_000,
  outputDir: '.local/aase-m02-browser',
  use: { baseURL, trace: 'retain-on-failure' },
  webServer: {
    command: 'python3 -m http.server ' + port + ' --bind 127.0.0.1 --directory build',
    url: baseURL + '/interactive/aase/m02/',
    reuseExistingServer: false
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }]
});
