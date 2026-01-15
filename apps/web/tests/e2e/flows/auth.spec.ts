/**
 * Authentication flow tests for PocketPilot.
 * Tests: signup, login, logout, demo account flows.
 */

import { test, expect } from '@playwright/test';
import { login, logout, signUp, useDemoAccount, TEST_USER } from '../helpers/auth';
import { expectVisualMatch, prepareForVisualTest } from '../helpers/visual';

test.describe('Authentication Flow', () => {
  test('should display the sign-in page correctly', async ({ page }) => {
    await page.goto('/auth/signin');
    await prepareForVisualTest(page);

    // Visual test: sign-in page
    await expectVisualMatch(page, {
      name: 'auth-signin-page',
      fullPage: true,
    });

    // Verify key elements exist
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should display the sign-up page correctly', async ({ page }) => {
    await page.goto('/auth/signup');
    await prepareForVisualTest(page);

    // Visual test: sign-up page
    await expectVisualMatch(page, {
      name: 'auth-signup-page',
      fullPage: true,
    });

    // Verify key elements exist
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should handle invalid login credentials', async ({ page }) => {
    await page.goto('/auth/signin');

    // Try to log in with invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('text=/invalid|incorrect|error/i')).toBeVisible({ timeout: 5000 });

    // Visual test: error state
    await prepareForVisualTest(page);
    await expectVisualMatch(page, {
      name: 'auth-signin-error',
      fullPage: true,
    });
  });

  test('should complete demo account login flow', async ({ page }) => {
    await useDemoAccount(page);

    // Should redirect to main app after demo login
    await expect(page).not.toHaveURL(/\/auth\//);

    // Visual test: post-demo-login dashboard
    await prepareForVisualTest(page);
    await expectVisualMatch(page, {
      name: 'dashboard-after-demo-login',
      fullPage: true,
    });
  });

  test('should complete full login and logout flow', async ({ page }) => {
    // Login
    await login(page, TEST_USER);

    // Verify we're logged in (not on auth pages)
    await expect(page).not.toHaveURL(/\/auth\//);

    // Verify user-specific UI elements
    await expect(page.locator('text=/safe to spend|balance|dashboard/i')).toBeVisible({ timeout: 5000 });

    // Logout
    await logout(page);

    // Should redirect back to auth
    await expect(page).toHaveURL(/\/auth\//);
  });

  test('should show validation errors for empty form submission', async ({ page }) => {
    await page.goto('/auth/signin');

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Should show validation errors
    await expect(page.locator('text=/required|enter/i')).toBeVisible({ timeout: 2000 });

    // Visual test: validation errors
    await prepareForVisualTest(page);
    await expectVisualMatch(page, {
      name: 'auth-signin-validation-errors',
      fullPage: true,
    });
  });
});
