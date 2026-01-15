/**
 * Authentication helpers for Playwright tests.
 * Provides utilities for logging in, creating test users, and managing sessions.
 */

import { Page } from '@playwright/test';

export interface TestUser {
  email: string;
  password: string;
}

/**
 * Default test user credentials
 */
export const TEST_USER: TestUser = {
  email: 'test@pocketpilot.com',
  password: 'TestPassword123!',
};

/**
 * Logs in a user via the UI
 */
export async function login(page: Page, user: TestUser = TEST_USER) {
  await page.goto('/auth/signin');
  await page.fill('input[name="email"], input[type="email"]', user.email);
  await page.fill('input[name="password"], input[type="password"]', user.password);
  await page.click('button[type="submit"]');

  // Wait for navigation after login
  await page.waitForURL(/(?!.*\/auth\/)/, { timeout: 5000 });
}

/**
 * Logs out the current user
 */
export async function logout(page: Page) {
  // Navigate to logout or click logout button
  await page.goto('/api/auth/signout');
  await page.waitForURL('**/auth/**', { timeout: 5000 });
}

/**
 * Creates a new test user via signup flow
 */
export async function signUp(page: Page, user: TestUser) {
  await page.goto('/auth/signup');
  await page.fill('input[name="email"], input[type="email"]', user.email);
  await page.fill('input[name="password"], input[type="password"]', user.password);

  // Handle confirm password if present
  const confirmPasswordInput = page.locator('input[name="confirmPassword"]');
  if (await confirmPasswordInput.isVisible({ timeout: 1000 }).catch(() => false)) {
    await confirmPasswordInput.fill(user.password);
  }

  await page.click('button[type="submit"]');
  await page.waitForURL(/(?!.*\/auth\/)/, { timeout: 5000 });
}

/**
 * Uses demo account login
 */
export async function useDemoAccount(page: Page) {
  await page.goto('/auth/demo');
  await page.waitForURL(/(?!.*\/auth\/)/, { timeout: 5000 });
}
