const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testAddPanel() {
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
    await page.goto('http://localhost:3000/transactions', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Take initial screenshot
    await page.screenshot({
      path: path.join(screenshotsDir, 'transactions-initial.png'),
      fullPage: true
    });
    console.log('Initial screenshot taken');

    // Click Add Transaction button
    console.log('Looking for Add Transaction button...');
    const addButton = await page.locator('button:has-text("Add Transaction")');
    const count = await addButton.count();
    console.log('Found', count, 'Add Transaction buttons');

    if (count > 0) {
      await addButton.first().click();
      await page.waitForTimeout(500);

      // Take full page screenshot with panel open
      await page.screenshot({
        path: path.join(screenshotsDir, 'add-panel-open.png'),
        fullPage: true
      });
      console.log('Add panel screenshot taken');

      // Fill in some test data
      const nameInput = await page.locator('input[placeholder*="Coffee"]');
      if (await nameInput.count() > 0) {
        await nameInput.fill('Test Transaction');
        await page.waitForTimeout(300);
      }

      // Fill amount
      const amountInput = await page.locator('input[placeholder*="$0.00"]');
      if (await amountInput.count() > 0) {
        await amountInput.fill('$25.00');
        await page.waitForTimeout(300);
      }

      // Scroll the panel to see the footer
      const panelContent = await page.locator('[class*="panelContent"]');
      if (await panelContent.count() > 0) {
        await panelContent.evaluate(el => el.scrollTop = el.scrollHeight);
        await page.waitForTimeout(300);
      }

      // Take screenshot showing footer
      await page.screenshot({
        path: path.join(screenshotsDir, 'add-panel-footer.png'),
        fullPage: true
      });
      console.log('Footer screenshot taken');

      // Click on category to expand
      const categoryTag = await page.locator('[class*="categoryTag"]').first();
      if (await categoryTag.count() > 0) {
        await categoryTag.click();
        await page.waitForTimeout(500);
        await page.screenshot({
          path: path.join(screenshotsDir, 'add-panel-category-expanded.png'),
          fullPage: true
        });
        console.log('Category expanded screenshot taken');
      }

      // Close panel
      const closeButton = await page.locator('[class*="closeButton"]');
      if (await closeButton.count() > 0) {
        await closeButton.first().click();
        await page.waitForTimeout(500);
      }
    }

    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Error:', error.message);
    await page.screenshot({
      path: path.join(screenshotsDir, 'error-state.png'),
      fullPage: true
    });
  } finally {
    await browser.close();
  }
}

testAddPanel();
