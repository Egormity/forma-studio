import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  workers: 1,
  reporter: 'list',
  outputDir: '.playwright/results',
  use: {
    baseURL: 'http://127.0.0.1:4400',
    viewport: { width: 1600, height: 1060 },
    screenshot: 'only-on-failure',
    launchOptions: {
      executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome',
      args: ['--enable-unsafe-swiftshader'],
    },
  },
  webServer: {
    command: 'python3 scripts/serve.py --port 4400',
    url: 'http://127.0.0.1:4400/__forma_health__',
    reuseExistingServer: false,
  },
});
