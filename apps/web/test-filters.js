const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testFilters() {
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  try {
    console.log('Navigating to transactions page...');
    await page.goto('http://localhost:3002/transactions', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Take initial screenshot - filters collapsed
    await page.screenshot({
      path: path.join(screenshotsDir, 'filters-collapsed.png'),
      fullPage: false
    });
    console.log('Collapsed filters screenshot taken');

    // Click on Filters button to expand
    console.log('Clicking Filters button...');
    const filtersButton = await page.locator('button:has-text("Filters")');
    if (await filtersButton.count() > 0) {
      await filtersButton.click();
      await page.waitForTimeout(500);

      // Take screenshot with filters expanded
      await page.screenshot({
        path: path.join(screenshotsDir, 'filters-expanded.png'),
        fullPage: false
      });
      console.log('Expanded filters screenshot taken');

      // Select some filters using custom dropdowns
      console.log('Selecting filters...');

      // Click Type dropdown trigger
      const typeDropdown = await page.locator('[class*="dropdownTrigger"]').nth(0);
      await typeDropdown.click();
      await page.waitForTimeout(300);

      // Take screenshot with dropdown open
      await page.screenshot({
        path: path.join(screenshotsDir, 'filters-dropdown-open.png'),
        fullPage: false
      });
      console.log('Dropdown open screenshot taken');

      // Select "Expenses" option
      const expensesOption = await page.locator('button:has-text("Expenses")');
      if (await expensesOption.count() > 0) {
        await expensesOption.click();
        await page.waitForTimeout(300);
      }

      // Click Category dropdown trigger
      const categoryDropdown = await page.locator('[class*="dropdownTrigger"]').nth(1);
      await categoryDropdown.click();
      await page.waitForTimeout(300);

      // Select "Groceries" option
      const groceriesOption = await page.locator('button:has-text("Groceries")');
      if (await groceriesOption.count() > 0) {
        await groceriesOption.click();
        await page.waitForTimeout(300);
      }

      // Click Account dropdown trigger
      const accountDropdown = await page.locator('[class*="dropdownTrigger"]').nth(2);
      await accountDropdown.click();
      await page.waitForTimeout(300);

      // Select "Chase" option
      const chaseOption = await page.locator('button:has-text("Chase")');
      if (await chaseOption.count() > 0) {
        await chaseOption.click();
        await page.waitForTimeout(300);
      }

      // Take screenshot with active filters
      await page.screenshot({
        path: path.join(screenshotsDir, 'filters-active.png'),
        fullPage: false
      });
      console.log('Active filters screenshot taken');

      // Collapse the filter panel to see collapsed filter tags
      console.log('Collapsing filters to see collapsed tags...');
      await filtersButton.click();
      await page.waitForTimeout(500);

      await page.screenshot({
        path: path.join(screenshotsDir, 'filters-collapsed-with-tags.png'),
        fullPage: false
      });
      console.log('Collapsed with tags screenshot taken');

      // Test removing a tag while collapsed
      console.log('Testing tag removal while collapsed...');
      // Find the Expenses tag and click its X button
      const expensesTag = await page.locator('span:has-text("Expenses")').filter({ has: page.locator('button') });
      if (await expensesTag.count() > 0) {
        await expensesTag.first().locator('button').first().click();
        await page.waitForTimeout(300);

        await page.screenshot({
          path: path.join(screenshotsDir, 'filters-tag-removed.png'),
          fullPage: false
        });
        console.log('Tag removed screenshot taken');
      }

      // Expand filters again for remaining tests
      await filtersButton.click();
      await page.waitForTimeout(300);

      // Test search functionality
      console.log('Testing search...');
      const searchInput = await page.locator('input[placeholder="Search transactions..."]');
      await searchInput.fill('Apple');
      await page.waitForTimeout(300);

      await page.screenshot({
        path: path.join(screenshotsDir, 'filters-search.png'),
        fullPage: false
      });
      console.log('Search screenshot taken');

      // Clear search
      const clearSearchButton = await page.locator('[class*="clearSearchButton"]');
      if (await clearSearchButton.count() > 0) {
        await clearSearchButton.click();
        await page.waitForTimeout(300);
      }

      // Click Clear All button
      console.log('Testing Clear All...');
      const clearAllButton = await page.locator('button:has-text("Clear All")');
      if (await clearAllButton.count() > 0) {
        await clearAllButton.click();
        await page.waitForTimeout(300);

        await page.screenshot({
          path: path.join(screenshotsDir, 'filters-cleared.png'),
          fullPage: false
        });
        console.log('Cleared filters screenshot taken');
      }
    }

    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Error:', error.message);
    await page.screenshot({
      path: path.join(screenshotsDir, 'filters-error.png'),
      fullPage: true
    });
  } finally {
    await browser.close();
  }
}

testFilters();
