/**
 * Visual testing helpers for Playwright.
 * Provides utilities for screenshot comparison and visual regression testing.
 */

import { Page, Locator, expect } from '@playwright/test';

export interface VisualTestOptions {
  /** Name for the screenshot file */
  name: string;
  /** Mask elements before taking screenshot */
  mask?: Locator[];
  /** Full page screenshot */
  fullPage?: boolean;
  /** Maximum allowed pixel difference */
  maxDiffPixels?: number;
  /** Threshold for pixel difference (0-1) */
  threshold?: number;
}

/**
 * Takes a visual snapshot and compares against baseline
 */
export async function expectVisualMatch(
  page: Page,
  options: VisualTestOptions
) {
  const { name, mask = [], fullPage = false, maxDiffPixels, threshold } = options;

  // Wait for page to stabilize
  await page.waitForLoadState('networkidle');

  // Take screenshot and compare
  await expect(page).toHaveScreenshot(`${name}.png`, {
    mask,
    fullPage,
    maxDiffPixels,
    threshold,
    animations: 'disabled', // Disable animations for consistent screenshots
  });
}

/**
 * Takes a visual snapshot of a specific component
 */
export async function expectComponentVisualMatch(
  locator: Locator,
  options: Omit<VisualTestOptions, 'fullPage'>
) {
  const { name, mask = [], maxDiffPixels, threshold } = options;

  // Wait for component to be visible
  await locator.waitFor({ state: 'visible' });

  await expect(locator).toHaveScreenshot(`${name}.png`, {
    mask,
    maxDiffPixels,
    threshold,
    animations: 'disabled',
  });
}

/**
 * Masks dynamic content (dates, amounts that change, etc.)
 */
export function maskDynamicContent(page: Page): Locator[] {
  return [
    // Mask timestamps
    page.locator('[data-testid="timestamp"]'),
    page.locator('.timestamp'),

    // Mask dates that might change
    page.locator('[data-testid="date"]'),
    page.locator('.date'),

    // Mask live balance updates
    page.locator('[data-testid="live-balance"]'),

    // Mask any animated elements
    page.locator('[data-animated="true"]'),
  ];
}

/**
 * Wait for all images and fonts to load
 */
export async function waitForAssetsToLoad(page: Page) {
  await page.waitForLoadState('networkidle');

  // Wait for images to load
  await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img'));
    return Promise.all(
      images.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.addEventListener('load', resolve);
          img.addEventListener('error', resolve);
        });
      })
    );
  });

  // Wait for fonts to load
  await page.evaluate(() => document.fonts.ready);

  // Give a small buffer for any final renders
  await page.waitForTimeout(100);
}

/**
 * Prepare page for visual testing
 */
export async function prepareForVisualTest(page: Page) {
  // Disable animations
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `,
  });

  // Wait for assets
  await waitForAssetsToLoad(page);
}
