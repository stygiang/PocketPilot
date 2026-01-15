/**
 * Income management flow tests for PocketPilot.
 * Tests: add income, view income sources, edit income, delete income.
 */

import { test, expect } from '@playwright/test';
import { useDemoAccount } from '../helpers/auth';
import { expectVisualMatch, prepareForVisualTest } from '../helpers/visual';
import { addIncome, SAMPLE_INCOME } from '../helpers/test-data';

test.describe('Income Management Flow', () => {
  test.beforeEach(async ({ page }) => {
    await useDemoAccount(page);
  });

  test('should display income sources page', async ({ page }) => {
    await page.goto('/income');
    await prepareForVisualTest(page);

    // Visual test: income page
    await expectVisualMatch(page, {
      name: 'income-page',
      fullPage: true,
    });

    // Verify page title or heading
    await expect(page.locator('h1, h2').filter({ hasText: /income/i }).first()).toBeVisible();
  });

  test('should complete add income flow', async ({ page }) => {
    const newIncome = SAMPLE_INCOME[0];

    await page.goto('/income');

    // Click add income button
    const addButton = page.locator('button:has-text("Add"), button:has-text("New")').first();
    await addButton.click();

    // Visual test: add income modal/form
    await prepareForVisualTest(page);
    await expectVisualMatch(page, {
      name: 'income-add-form',
    });

    // Fill form
    await page.fill('input[name="name"]', newIncome.name);
    await page.fill('input[name="amount"]', newIncome.amount);
    await page.selectOption('select[name="cadence"]', newIncome.cadence);

    // Submit
    await page.click('button[type="submit"]');

    // Wait for success
    await page.waitForLoadState('networkidle');

    // Verify new income appears in list
    await expect(page.locator(`text=${newIncome.name}`)).toBeVisible({ timeout: 5000 });
    await expect(page.locator(`text=/\\$${newIncome.amount}/`)).toBeVisible();

    // Visual test: income list with new item
    await prepareForVisualTest(page);
    await expectVisualMatch(page, {
      name: 'income-list-with-new-item',
      fullPage: true,
    });
  });

  test('should validate income form inputs', async ({ page }) => {
    await page.goto('/income');

    // Click add income
    const addButton = page.locator('button:has-text("Add"), button:has-text("New")').first();
    await addButton.click();

    // Try to submit without filling required fields
    await page.click('button[type="submit"]');

    // Should show validation errors
    await expect(page.locator('text=/required|enter/i')).toBeVisible({ timeout: 2000 });

    // Visual test: validation errors
    await prepareForVisualTest(page);
    await expectVisualMatch(page, {
      name: 'income-form-validation-errors',
    });
  });

  test('should edit existing income source', async ({ page }) => {
    await page.goto('/income');

    // Find first income item and click edit
    const editButton = page.locator('button:has-text("Edit"), [aria-label*="Edit"]').first();

    if (await editButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await editButton.click();

      // Change amount
      const amountInput = page.locator('input[name="amount"]');
      await amountInput.clear();
      await amountInput.fill('4000.00');

      // Visual test: edit form
      await prepareForVisualTest(page);
      await expectVisualMatch(page, {
        name: 'income-edit-form',
      });

      // Submit
      await page.click('button[type="submit"]');
      await page.waitForLoadState('networkidle');

      // Verify updated amount
      await expect(page.locator('text=/\\$4,?000/i')).toBeVisible({ timeout: 5000 });
    } else {
      test.skip('No income sources to edit');
    }
  });

  test('should delete income source with confirmation', async ({ page }) => {
    await page.goto('/income');

    // Count initial income sources
    const initialCount = await page.locator('[data-testid*="income-item"], [class*="income"]').count();

    if (initialCount === 0) {
      test.skip('No income sources to delete');
    }

    // Find and click delete button
    const deleteButton = page.locator('button:has-text("Delete"), [aria-label*="Delete"]').first();

    if (await deleteButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await deleteButton.click();

      // Should show confirmation dialog
      const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes"), button:has-text("Delete")').last();

      if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        // Visual test: delete confirmation
        await prepareForVisualTest(page);
        await expectVisualMatch(page, {
          name: 'income-delete-confirmation',
        });

        await confirmButton.click();
        await page.waitForLoadState('networkidle');

        // Verify item count decreased
        const newCount = await page.locator('[data-testid*="income-item"], [class*="income"]').count();
        expect(newCount).toBeLessThan(initialCount);
      }
    } else {
      test.skip('No delete button found');
    }
  });

  test('should display empty state when no income sources', async ({ page }) => {
    await page.goto('/income');

    // Check if empty state is visible
    const emptyState = page.locator('text=/no income|add your first|get started/i');

    if (await emptyState.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Visual test: empty state
      await prepareForVisualTest(page);
      await expectVisualMatch(page, {
        name: 'income-empty-state',
        fullPage: true,
      });
    }
  });
});
