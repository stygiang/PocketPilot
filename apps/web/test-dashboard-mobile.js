const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });

  // Test Desktop
  console.log('Testing Desktop View (1280x720)...');
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto('http://localhost:3001/dashboard');
  await desktopPage.waitForTimeout(2000);
  await desktopPage.screenshot({ path: 'desktop-dashboard.png', fullPage: true });
  console.log('✓ Desktop screenshot saved');

  // Test Tablet
  console.log('\nTesting Tablet View (768x1024)...');
  const tabletContext = await browser.newContext({
    viewport: { width: 768, height: 1024 },
  });
  const tabletPage = await tabletContext.newPage();
  await tabletPage.goto('http://localhost:3001/dashboard');
  await tabletPage.waitForTimeout(2000);
  await tabletPage.screenshot({ path: 'tablet-dashboard.png', fullPage: true });
  console.log('✓ Tablet screenshot saved');

  // Test Mobile
  console.log('\nTesting Mobile View (375x667)...');
  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 667 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3001/dashboard');
  await mobilePage.waitForTimeout(2000);
  await mobilePage.screenshot({ path: 'mobile-dashboard.png', fullPage: true });
  console.log('✓ Mobile screenshot saved');

  // Test interactions
  console.log('\nTesting interactions...');

  // Click on a category
  try {
    await mobilePage.click('text=Food & Drink', { timeout: 5000 });
    console.log('✓ Category click works');
  } catch (e) {
    console.log('✗ Category click failed:', e.message);
  }

  // Test navigation
  try {
    const hasNav = await mobilePage.isVisible('text=Transactions', { timeout: 5000 });
    console.log(hasNav ? '✓ Navigation visible' : '✗ Navigation not visible');
  } catch (e) {
    console.log('✗ Navigation check failed:', e.message);
  }

  // Test responsive layout
  console.log('\nTesting responsive features...');
  const mobileNavWidth = await mobilePage.evaluate(() => {
    const nav = document.querySelector('nav');
    return nav ? window.getComputedStyle(nav).width : '0';
  });
  console.log(`Mobile nav width: ${mobileNavWidth}`);

  console.log('\n✓ All tests complete!');
  console.log('Screenshots saved:');
  console.log('  - desktop-dashboard.png');
  console.log('  - tablet-dashboard.png');
  console.log('  - mobile-dashboard.png');

  await browser.close();
})();
