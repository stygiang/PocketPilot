/**
 * Complete user journey tests for PocketPilot.
 * Tests: End-to-end scenarios from signup to financial management.
 */

import { test, expect } from '@playwright/test';
import { signUp, logout } from '../helpers/auth';
import { expectVisualMatch, prepareForVisualTest, maskDynamicContent } from '../helpers/visual';
import { SAMPLE_INCOME, SAMPLE_BILLS, SAMPLE_EXPENSES } from '../helpers/test-data';

test.describe('Complete User Journey', () => {
  test('should complete onboarding and setup journey', async ({ page }) => {
    // Generate unique test user
    const testUser = {
      email: `test-${Date.now()}@pocketpilot.com`,
      password: 'TestPassword123!',
    };

    // Step 1: Sign up
    await signUp(page, testUser);

    // Should be on welcome or dashboard page
    await expect(page).not.toHaveURL(/\/auth\/signup/);

    // Visual test: post-signup landing
    await prepareForVisualTest(page);
    await expectVisualMatch(page, {
      name: 'journey-post-signup',
      fullPage: true,
      mask: maskDynamicContent(page),
    });

    // Step 2: Add first income source
    await page.goto('/income');
    const addIncomeButton = page.locator('button:has-text("Add"), button:has-text("New")').first();
    await addIncomeButton.click();

    const income = SAMPLE_INCOME[0];
    await page.fill('input[name="name"]', income.name);
    await page.fill('input[name="amount"]', income.amount);
    await page.selectOption('select[name="cadence"]', income.cadence);
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Verify income added
    await expect(page.locator(`text=${income.name}`)).toBeVisible({ timeout: 5000 });

    // Step 3: Add first bill
    await page.goto('/bills');
    const addBillButton = page.locator('button:has-text("Add"), button:has-text("New")').first();
    await addBillButton.click();

    const bill = SAMPLE_BILLS[0];
    await page.fill('input[name="name"]', bill.name);
    await page.fill('input[name="amount"]', bill.amount);
    await page.fill('input[name="dueDay"]', bill.dueDay);
    if (bill.cadence) {
      await page.selectOption('select[name="cadence"]', bill.cadence);
    }
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Verify bill added
    await expect(page.locator(`text=${bill.name}`)).toBeVisible({ timeout: 5000 });

    // Step 4: Add expense
    await page.goto('/expenses');
    const addExpenseButton = page.locator('button:has-text("Add"), button:has-text("New")').first();

    if (await addExpenseButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addExpenseButton.click();

      const expense = SAMPLE_EXPENSES[0];
      await page.fill('input[name="amount"]', expense.amount);
      await page.fill('input[name="category"]', expense.category);
      if (expense.note) {
        const noteInput = page.locator('input[name="note"], textarea[name="note"]');
        if (await noteInput.isVisible({ timeout: 1000 }).catch(() => false)) {
          await noteInput.fill(expense.note);
        }
      }
      await page.click('button[type="submit"]');
      await page.waitForLoadState('networkidle');
    }

    // Step 5: View dashboard with complete data
    await page.goto('/');
    await prepareForVisualTest(page);

    // Visual test: dashboard with complete setup
    await expectVisualMatch(page, {
      name: 'journey-dashboard-complete-setup',
      fullPage: true,
      mask: maskDynamicContent(page),
    });

    // Verify safe-to-spend is calculated
    await expect(page.locator('text=/safe to spend/i')).toBeVisible();
    await expect(page.locator('text=/\\$\\d+/').first()).toBeVisible();

    // Step 6: Logout
    await logout(page);
    await expect(page).toHaveURL(/\/auth\//);
  });

  test('should handle typical daily usage flow', async ({ page }) => {
    // Start with demo account (has existing data)
    await page.goto('/auth/demo');
    await page.waitForURL(/(?!.*\/auth\/)/);

    // Daily flow: Check dashboard
    await page.goto('/');
    await prepareForVisualTest(page);
    await expectVisualMatch(page, {
      name: 'journey-daily-dashboard-check',
      fullPage: true,
      mask: maskDynamicContent(page),
    });

    // Check safe-to-spend
    const safeToSpend = page.locator('text=/safe to spend/i').first();
    await expect(safeToSpend).toBeVisible();

    // Add today's expense
    await page.goto('/expenses');
    const addExpenseButton = page.locator('button:has-text("Add"), button:has-text("New")').first();

    if (await addExpenseButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addExpenseButton.click();
      await page.fill('input[name="amount"]', '15.50');
      await page.fill('input[name="category"]', 'Lunch');

      const noteInput = page.locator('input[name="note"], textarea[name="note"]');
      if (await noteInput.isVisible({ timeout: 1000 }).catch(() => false)) {
        await noteInput.fill('Quick lunch');
      }

      await page.click('button[type="submit"]');
      await page.waitForLoadState('networkidle');

      // Visual test: after adding expense
      await prepareForVisualTest(page);
      await expectVisualMatch(page, {
        name: 'journey-after-adding-expense',
        fullPage: true,
        mask: maskDynamicContent(page),
      });
    }

    // Return to dashboard to see updated safe-to-spend
    await page.goto('/');
    await prepareForVisualTest(page);
    await expectVisualMatch(page, {
      name: 'journey-dashboard-after-expense',
      fullPage: true,
      mask: maskDynamicContent(page),
    });
  });

  test('should handle monthly financial review flow', async ({ page }) => {
    // Use demo account
    await page.goto('/auth/demo');
    await page.waitForURL(/(?!.*\/auth\/)/);

    // Review income sources
    await page.goto('/income');
    await prepareForVisualTest(page);
    await expectVisualMatch(page, {
      name: 'journey-income-review',
      fullPage: true,
    });

    // Review bills
    await page.goto('/bills');
    await prepareForVisualTest(page);
    await expectVisualMatch(page, {
      name: 'journey-bills-review',
      fullPage: true,
      mask: maskDynamicContent(page),
    });

    // Review expenses
    await page.goto('/expenses');
    await prepareForVisualTest(page);
    await expectVisualMatch(page, {
      name: 'journey-expenses-review',
      fullPage: true,
      mask: maskDynamicContent(page),
    });

    // Check balance history
    await page.goto('/balance');
    await prepareForVisualTest(page);
    await expectVisualMatch(page, {
      name: 'journey-balance-history',
      fullPage: true,
      mask: maskDynamicContent(page),
    });

    // Return to dashboard for overall view
    await page.goto('/');
    await prepareForVisualTest(page);
    await expectVisualMatch(page, {
      name: 'journey-monthly-review-complete',
      fullPage: true,
      mask: maskDynamicContent(page),
    });
  });

  test('should handle error recovery flow', async ({ page }) => {
    // Use demo account
    await page.goto('/auth/demo');
    await page.waitForURL(/(?!.*\/auth\/)/);

    // Try to add invalid income (negative amount)
    await page.goto('/income');
    const addButton = page.locator('button:has-text("Add"), button:has-text("New")').first();
    await addButton.click();

    await page.fill('input[name="name"]', 'Test Income');
    await page.fill('input[name="amount"]', '-100');
    await page.selectOption('select[name="cadence"]', 'MONTHLY');
    await page.click('button[type="submit"]');

    // Should show validation error
    await expect(page.locator('text=/invalid|positive|greater/i')).toBeVisible({ timeout: 3000 });

    // Visual test: error state
    await prepareForVisualTest(page);
    await expectVisualMatch(page, {
      name: 'journey-error-recovery-validation',
    });

    // Correct the error
    await page.fill('input[name="amount"]', '100');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Should succeed
    await expect(page.locator('text=Test Income')).toBeVisible({ timeout: 5000 });
  });

  test('should navigate through all main sections', async ({ page }) => {
    // Use demo account
    await page.goto('/auth/demo');
    await page.waitForURL(/(?!.*\/auth\/)/);

    const sections = [
      { path: '/', name: 'dashboard' },
      { path: '/income', name: 'income' },
      { path: '/bills', name: 'bills' },
      { path: '/expenses', name: 'expenses' },
      { path: '/balance', name: 'balance' },
    ];

    for (const section of sections) {
      await page.goto(section.path);
      await prepareForVisualTest(page);

      // Visual test for each section
      await expectVisualMatch(page, {
        name: `journey-navigation-${section.name}`,
        fullPage: true,
        mask: maskDynamicContent(page),
      });

      // Verify we're on the right page
      await expect(page).toHaveURL(section.path);
    }
  });
});
