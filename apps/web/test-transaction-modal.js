const playwright = require('playwright');
const path = require('path');
const fs = require('fs');

async function testTransactionModal() {
  console.log('Starting Playwright test for transaction modal...');

  const browser = await playwright.chromium.launch({ headless: false });

  // Create screenshots directory if it doesn't exist
  const screenshotsDir = path.join(__dirname, 'screenshots', 'modal');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
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

    // Take screenshot of initial page
    console.log('Taking initial screenshot...');
    await page.screenshot({
      path: path.join(screenshotsDir, 'page-initial.png'),
      fullPage: true
    });

    // Click on a transaction to open modal
    console.log('Clicking on Lyft transaction (no bank attached)...');
    // Find transaction row by looking for the transaction name
    const transactionName = await page.locator('[class*="transactionName"]').filter({ hasText: 'Lyft' });
    console.log('Found transaction names:', await transactionName.count());
    if (await transactionName.count() > 0) {
      // Click on the parent row which has the onClick handler
      await transactionName.first().click();
      console.log('Clicked, waiting for modal...');
      await page.waitForTimeout(2000);

      // Check for modal backdrop
      const backdrop = await page.locator('[class*="backdrop"]');
      console.log('Backdrop count:', await backdrop.count());

      // Check for modal
      const modal = await page.locator('[class*="modal"]');
      console.log('Modal count:', await modal.count());

      // Check console errors
      page.on('console', msg => console.log('PAGE LOG:', msg.text()));

      // Take screenshot with modal open
      console.log('Taking modal screenshot...');
      await page.screenshot({
        path: path.join(screenshotsDir, 'modal-open.png'),
        fullPage: false
      });

      // Test editing transaction name
      console.log('Testing transaction name edit...');
      const nameInput = await page.locator('input').filter({ hasValue: /Apple Music/ });
      if (await nameInput.count() > 0) {
        await nameInput.first().click();
        await nameInput.first().fill('Spotify Premium');
        await page.waitForTimeout(500);
        await page.screenshot({
          path: path.join(screenshotsDir, 'modal-edit-name.png'),
          fullPage: false
        });
      }

      // Test category selection
      console.log('Testing category selection...');
      const categoryButton = await page.locator('button').filter({ hasText: 'ENTERTAINMENT' });
      if (await categoryButton.count() > 0) {
        await categoryButton.first().click();
        await page.waitForTimeout(500);
        await page.screenshot({
          path: path.join(screenshotsDir, 'modal-category-change.png'),
          fullPage: false
        });
      }

      // Test type toggle
      console.log('Testing type toggle...');
      const incomeButton = await page.locator('button').filter({ hasText: /^Income$/ });
      if (await incomeButton.count() > 0) {
        await incomeButton.first().click();
        await page.waitForTimeout(500);
        await page.screenshot({
          path: path.join(screenshotsDir, 'modal-type-toggle.png'),
          fullPage: false
        });
      }

      // Hover over save button
      console.log('Testing save button hover...');
      const saveButton = await page.locator('button').filter({ hasText: 'Save Changes' });
      if (await saveButton.count() > 0) {
        await saveButton.hover();
        await page.waitForTimeout(300);
        await page.screenshot({
          path: path.join(screenshotsDir, 'modal-save-hover.png'),
          fullPage: false
        });
      }

      // Close modal by clicking backdrop
      console.log('Testing modal close...');
      const backdropClose = await page.locator('[class*="backdrop"]');
      if (await backdropClose.count() > 0) {
        await backdropClose.click({ position: { x: 10, y: 10 } });
        await page.waitForTimeout(500);
        await page.screenshot({
          path: path.join(screenshotsDir, 'modal-closed.png'),
          fullPage: true
        });
      }
    }

    console.log('✓ Transaction modal test completed successfully');

  } catch (error) {
    console.error('✗ Error testing transaction modal:', error.message);
  } finally {
    await context.close();
    await browser.close();
  }

  console.log(`Screenshots saved to: ${screenshotsDir}`);
}

testTransactionModal().catch(console.error);
