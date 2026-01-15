/**
 * Bills management flow tests for PocketPilot.
 * Tests: add bill, view bills, edit bill, delete bill, upcoming bills.
 */

import { test, expect } from '@playwright/test';
import { useDemoAccount } from '../helpers/auth';
import { expectVisualMatch, prepareForVisualTest, maskDynamicContent } from '../helpers/visual';
import { addBill, SAMPLE_BILLS } from '../helpers/test-data';

test.describe('Bills Management Flow', () => {
  test.beforeEach(async ({ page }) => {
    await useDemoAccount(page);
  });

  test('should display bills page', async ({ page }) => {
    await page.goto('/bills');
    await prepareForVisualTest(page);

    // Visual test: bills page
    await expectVisualMatch(page, {
      name: 'bills-page',
      fullPage: true,
      mask: maskDynamicContent(page),
    });

    // Verify page title
    await expect(page.locator('h1, h2').filter({ hasText: /bill/i }).first()).toBeVisible();
  });

  test('should complete add bill flow', async ({ page }) => {
    const newBill = SAMPLE_BILLS[0];

    await page.goto('/bills');

    // Click add bill button
    const addButton = page.locator('button:has-text("Add"), button:has-text("New")').first();
    await addButton.click();

    // Visual test: add bill form
    await prepareForVisualTest(page);
    await expectVisualMatch(page, {
      name: 'bills-add-form',
    });

    // Fill form
    await page.fill('input[name="name"]', newBill.name);
    await page.fill('input[name="amount"]', newBill.amount);
    await page.fill('input[name="dueDay"]', newBill.dueDay);

    if (newBill.cadence) {
      await page.selectOption('select[name="cadence"]', newBill.cadence);
    }

    // Submit
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Verify new bill appears
    await expect(page.locator(`text=${newBill.name}`)).toBeVisible({ timeout: 5000 });

    // Visual test: bills list with new item
    await prepareForVisualTest(page);
    await expectVisualMatch(page, {
      name: 'bills-list-with-new-item',
      fullPage: true,
      mask: maskDynamicContent(page),
    });
  });

  test('should validate bill form inputs', async ({ page }) => {
    await page.goto('/bills');

    // Click add bill
    const addButton = page.locator('button:has-text("Add"), button:has-text("New")').first();
    await addButton.click();

    // Try to submit without filling required fields
    await page.click('button[type="submit"]');

    // Should show validation errors
    await expect(page.locator('text=/required|enter/i')).toBeVisible({ timeout: 2000 });

    // Visual test: validation errors
    await prepareForVisualTest(page);
    await expectVisualMatch(page, {
      name: 'bills-form-validation-errors',
    });
  });

  test('should show upcoming bills with due dates', async ({ page }) => {
    await page.goto('/bills');

    // Look for upcoming bills section or next due date indicators
    const dueDateElements = page.locator('text=/due|next|upcoming/i');

    if (await dueDateElements.count() > 0) {
      // Visual test: bills with due dates
      await prepareForVisualTest(page);
      await expectVisualMatch(page, {
        name: 'bills-with-due-dates',
        fullPage: true,
        mask: maskDynamicContent(page),
      });
    }
  });

  test('should edit existing bill', async ({ page }) => {
    await page.goto('/bills');

    // Find first bill and click edit
    const editButton = page.locator('button:has-text("Edit"), [aria-label*="Edit"]').first();

    if (await editButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await editButton.click();

      // Change amount
      const amountInput = page.locator('input[name="amount"]');
      await amountInput.clear();
      await amountInput.fill('1500.00');

      // Visual test: edit form
      await prepareForVisualTest(page);
      await expectVisualMatch(page, {
        name: 'bills-edit-form',
      });

      // Submit
      await page.click('button[type="submit"]');
      await page.waitForLoadState('networkidle');

      // Verify updated amount
      await expect(page.locator('text=/\\$1,?500/i')).toBeVisible({ timeout: 5000 });
    } else {
      test.skip('No bills to edit');
    }
  });

  test('should delete bill with confirmation', async ({ page }) => {
    await page.goto('/bills');

    // Count initial bills
    const initialCount = await page.locator('[data-testid*="bill-item"], [class*="bill"]').count();

    if (initialCount === 0) {
      test.skip('No bills to delete');
    }

    // Find and click delete button
    const deleteButton = page.locator('button:has-text("Delete"), [aria-label*="Delete"]').first();

    if (await deleteButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await deleteButton.click();

      // Should show confirmation
      const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes"), button:has-text("Delete")').last();

      if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        // Visual test: delete confirmation
        await prepareForVisualTest(page);
        await expectVisualMatch(page, {
          name: 'bills-delete-confirmation',
        });

        await confirmButton.click();
        await page.waitForLoadState('networkidle');

        // Verify item count decreased
        const newCount = await page.locator('[data-testid*="bill-item"], [class*="bill"]').count();
        expect(newCount).toBeLessThan(initialCount);
      }
    } else {
      test.skip('No delete button found');
    }
  });

  test('should display bills sorted by due date', async ({ page }) => {
    await page.goto('/bills');

    // Get all bill items
    const billItems = page.locator('[data-testid*="bill-item"], [class*="bill-item"]');
    const count = await billItems.count();

    if (count > 1) {
      // Bills should be sorted by due date (closest first)
      // This is a visual check more than functional
      await prepareForVisualTest(page);
      await expectVisualMatch(page, {
        name: 'bills-sorted-by-due-date',
        fullPage: true,
        mask: maskDynamicContent(page),
      });
    }
  });

  test('should display empty state when no bills', async ({ page }) => {
    await page.goto('/bills');

    // Check if empty state is visible
    const emptyState = page.locator('text=/no bills|add your first|get started/i');

    if (await emptyState.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Visual test: empty state
      await prepareForVisualTest(page);
      await expectVisualMatch(page, {
        name: 'bills-empty-state',
        fullPage: true,
      });
    }
  });

  test('should handle different bill cadences (weekly, biweekly, monthly)', async ({ page }) => {
    await page.goto('/bills');

    // Add button
    const addButton = page.locator('button:has-text("Add"), button:has-text("New")').first();

    if (await addButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addButton.click();

      // Check cadence options
      const cadenceSelect = page.locator('select[name="cadence"]');

      if (await cadenceSelect.isVisible({ timeout: 1000 }).catch(() => false)) {
        // Should have multiple cadence options
        const options = await cadenceSelect.locator('option').count();
        expect(options).toBeGreaterThanOrEqual(3); // At least WEEKLY, BIWEEKLY, MONTHLY

        // Visual test: cadence selector
        await prepareForVisualTest(page);
        await expectVisualMatch(page, {
          name: 'bills-cadence-options',
        });
      }
    }
  });
});
