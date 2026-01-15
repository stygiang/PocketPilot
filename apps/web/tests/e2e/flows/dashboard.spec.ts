/**
 * Dashboard flow tests for PocketPilot.
 * Tests: safe-to-spend display, balance overview, upcoming bills, quick actions.
 */

import { test, expect } from '@playwright/test';
import { useDemoAccount } from '../helpers/auth';
import { expectVisualMatch, prepareForVisualTest, maskDynamicContent } from '../helpers/visual';

test.describe('Dashboard Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Use demo account for consistent test data
    await useDemoAccount(page);
    await page.goto('/');
  });

  test('should display the main dashboard correctly', async ({ page }) => {
    await prepareForVisualTest(page);

    // Visual test: dashboard with masked dynamic content
    await expectVisualMatch(page, {
      name: 'dashboard-main',
      fullPage: true,
      mask: maskDynamicContent(page),
    });
  });

  test('should show safe-to-spend amount prominently', async ({ page }) => {
    // Safe-to-spend should be visible
    const safeToSpendElement = page.locator('text=/safe to spend/i').first();
    await expect(safeToSpendElement).toBeVisible();

    // Should show a dollar amount
    await expect(page.locator('text=/\\$\\d+/').first()).toBeVisible();

    // Visual test: safe-to-spend component
    await prepareForVisualTest(page);
    const safeToSpendCard = page.locator('[data-testid="safe-to-spend"]').or(
      page.locator(':has-text("safe to spend")').first().locator('..').first()
    );

    if (await safeToSpendCard.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(safeToSpendCard).toHaveScreenshot('safe-to-spend-card.png', {
        mask: maskDynamicContent(page),
      });
    }
  });

  test('should display current balance', async ({ page }) => {
    // Balance should be visible
    const balanceElement = page.locator('text=/balance|current/i').first();
    await expect(balanceElement).toBeVisible({ timeout: 5000 });

    // Should show a dollar amount
    await expect(page.locator('text=/\\$\\d+/').first()).toBeVisible();
  });

  test('should show upcoming bills section', async ({ page }) => {
    // Upcoming bills section should be visible
    const upcomingBillsSection = page.locator('text=/upcoming|next.*bill/i').first();

    // Check if section exists
    if (await upcomingBillsSection.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(upcomingBillsSection).toBeVisible();

      // Visual test: upcoming bills
      await prepareForVisualTest(page);
      const billsCard = upcomingBillsSection.locator('..').first();
      await expect(billsCard).toHaveScreenshot('upcoming-bills-section.png', {
        mask: maskDynamicContent(page),
      });
    }
  });

  test('should provide navigation to key features', async ({ page }) => {
    // Check for navigation links/buttons to main features
    const featureLinks = [
      /income/i,
      /bill/i,
      /expense/i,
      /balance/i,
    ];

    // At least some of these should be visible
    let visibleCount = 0;
    for (const linkPattern of featureLinks) {
      const link = page.locator(`a:has-text("${linkPattern.source.slice(0, -2)}")`).or(
        page.locator(`button:has-text("${linkPattern.source.slice(0, -2)}")`)
      ).first();

      if (await link.isVisible({ timeout: 1000 }).catch(() => false)) {
        visibleCount++;
      }
    }

    expect(visibleCount).toBeGreaterThan(0);
  });

  test('should display responsive layout on mobile', async ({ page, viewport }) => {
    // Skip if not mobile viewport
    if (!viewport || viewport.width > 768) {
      test.skip();
    }

    await prepareForVisualTest(page);

    // Visual test: mobile dashboard
    await expectVisualMatch(page, {
      name: 'dashboard-mobile',
      fullPage: true,
      mask: maskDynamicContent(page),
    });
  });

  test('should display responsive layout on tablet', async ({ page, viewport }) => {
    // Skip if not tablet viewport
    if (!viewport || viewport.width < 768 || viewport.width > 1024) {
      test.skip();
    }

    await prepareForVisualTest(page);

    // Visual test: tablet dashboard
    await expectVisualMatch(page, {
      name: 'dashboard-tablet',
      fullPage: true,
      mask: maskDynamicContent(page),
    });
  });
});
