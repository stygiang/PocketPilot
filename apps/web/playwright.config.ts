import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for PocketPilot visual and user flow testing.
 *
 * Features:
 * - Visual regression testing with screenshot comparison
 * - User flow testing across key journeys
 * - Multiple viewport sizes for responsive testing
 * - Automatic retries for flaky tests
 */
export default defineConfig({
  // Test directory
  testDir: './tests/e2e',

  // Timeout for each test
  timeout: 30 * 1000,

  // Expect timeout
  expect: {
    // Visual comparison timeout
    timeout: 5000,
    // Enable visual comparisons with threshold
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.2,
    },
  },

  // Run tests in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    ...(process.env.CI ? [['github'] as const] : []),
  ],

  // Shared settings for all projects
  use: {
    // Base URL for the app
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',

    // Take screenshot on failure
    screenshot: 'only-on-failure',

    // Record video on failure
    video: 'retain-on-failure',

    // Collect trace on failure
    trace: 'on-first-retry',

    // Ignore HTTPS errors in development
    ignoreHTTPSErrors: true,
  },

  // Configure projects for different browsers and viewports
  projects: [
    // Desktop Chrome
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },

    // Tablet
    {
      name: 'tablet',
      use: {
        ...devices['iPad Pro'],
        viewport: { width: 1024, height: 768 },
      },
    },

    // Mobile
    {
      name: 'mobile',
      use: {
        ...devices['iPhone 13 Pro'],
        viewport: { width: 390, height: 844 },
      },
    },

    // Desktop Firefox (optional - uncomment if needed)
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // Desktop Safari (optional - uncomment if needed)
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Run local dev server before starting tests
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
