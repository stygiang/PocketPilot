import { test, expect } from '@playwright/test';

test.describe('Before State - Accounts Page', () => {
  test('should display accounts page', async ({ page }) => {
    await page.goto('http://localhost:3001/accounts');
    
    // Take screenshot of current accounts page
    await page.screenshot({ 
      path: 'tests/before-accounts.png',
      fullPage: true
    });

    // Verify main elements exist
    const title = await page.locator('h1').first();
    expect(title).toBeVisible();
  });
});
