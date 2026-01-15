const playwright = require('playwright');
const path = require('path');
const fs = require('fs');

async function testTransactionsPage() {
  console.log('Starting Playwright test for transactions page...');

  const browser = await playwright.chromium.launch({ headless: false });

  // Create screenshots directory if it doesn't exist
  const screenshotsDir = path.join(__dirname, 'screenshots', 'transactions');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const viewports = [
    { name: 'desktop', width: 1280, height: 720 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 375, height: 667 },
  ];

  for (const viewport of viewports) {
    console.log(`\nTesting ${viewport.name} view (${viewport.width}x${viewport.height})...`);

    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
    });

    const page = await context.newPage();

    try {
      // Navigate to transactions page
      console.log('Navigating to http://localhost:3000/transactions...');
      await page.goto('http://localhost:3000/transactions', {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      // Wait for page to fully load
      await page.waitForTimeout(2000);

      // Take initial screenshot
      console.log(`Taking ${viewport.name} screenshot...`);
      await page.screenshot({
        path: path.join(screenshotsDir, `${viewport.name}-full.png`),
        fullPage: true
      });

      // Test search functionality (use the specific transactions search input)
      console.log('Testing search input...');
      const searchInput = await page.locator('input[placeholder*="Search transactions"]');
      await searchInput.fill('Apple');
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: path.join(screenshotsDir, `${viewport.name}-search.png`),
        fullPage: true
      });
      await searchInput.fill('');

      // Test time range filters
      console.log('Testing time range filters...');
      const timeRangeButtons = await page.locator('button').filter({ hasText: 'This Week' });
      if (await timeRangeButtons.count() > 0) {
        await timeRangeButtons.first().click();
        await page.waitForTimeout(1000);
        await page.screenshot({
          path: path.join(screenshotsDir, `${viewport.name}-filter-time.png`),
          fullPage: true
        });
      }

      // Test category filters
      console.log('Testing category filters...');
      const categoryButtons = await page.locator('button').filter({ hasText: 'Groceries' });
      if (await categoryButtons.count() > 0) {
        await categoryButtons.first().click();
        await page.waitForTimeout(1000);
        await page.screenshot({
          path: path.join(screenshotsDir, `${viewport.name}-filter-category.png`),
          fullPage: true
        });
      }

      // Test transaction click
      console.log('Testing transaction interaction...');
      const transactions = await page.locator('[class*="transaction"]').filter({ hasText: 'Apple Music' });
      if (await transactions.count() > 0) {
        await transactions.first().hover();
        await page.waitForTimeout(500);
        await page.screenshot({
          path: path.join(screenshotsDir, `${viewport.name}-transaction-hover.png`),
          fullPage: true
        });
      }

      // Test add transaction button
      console.log('Testing add transaction button...');
      const addButton = await page.locator('button').filter({ hasText: 'Add Transaction' });
      if (await addButton.count() > 0) {
        await addButton.hover();
        await page.waitForTimeout(500);
        await page.screenshot({
          path: path.join(screenshotsDir, `${viewport.name}-add-button-hover.png`),
          fullPage: true
        });
      }

      // Scroll to verify all content
      if (viewport.name === 'mobile') {
        console.log('Testing scroll behavior on mobile...');
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
        await page.waitForTimeout(500);
        await page.screenshot({
          path: path.join(screenshotsDir, `${viewport.name}-scrolled.png`),
          fullPage: false
        });
      }

      console.log(`✓ ${viewport.name} test completed successfully`);

    } catch (error) {
      console.error(`✗ Error testing ${viewport.name}:`, error.message);
    } finally {
      await context.close();
    }
  }

  await browser.close();
  console.log('\n✓ All transactions page tests completed!');
  console.log(`Screenshots saved to: ${screenshotsDir}`);
}

testTransactionsPage().catch(console.error);
