/**
 * Example test demonstrating Playwright MCP integration.
 * This test is disabled by default - it's here as a reference.
 *
 * To enable, rename to: mcp-demo.spec.ts.example
 */

import { test, expect } from '@playwright/test';

// This test is skipped by default
test.skip('MCP Playwright integration example', async ({ page }) => {
  /**
   * This test demonstrates how Claude can use Playwright MCP tools
   * to interact with your application during test execution.
   *
   * The available MCP tools include:
   * - mcp__playwright__browser_navigate
   * - mcp__playwright__browser_click
   * - mcp__playwright__browser_take_screenshot
   * - mcp__playwright__browser_evaluate
   * - mcp__playwright__browser_type
   * - mcp__playwright__browser_wait_for
   * - And many more...
   *
   * When you ask Claude to "test the login flow" or "take a screenshot
   * of the dashboard", Claude can use these MCP tools to interact with
   * the browser programmatically.
   */

  // Example: Navigate to login page
  await page.goto('http://localhost:3000/auth/signin');

  // Example: Take a screenshot
  await page.screenshot({ path: 'example-screenshot.png' });

  // Example: Interact with form
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Example: Wait and verify
  await page.waitForURL(/(?!.*\/auth\/)/);
  await expect(page).not.toHaveURL(/\/auth\//);
});

test.skip('Ask Claude to use MCP tools', async ({ page }) => {
  /**
   * Example prompts you can give Claude:
   *
   * 1. "Use the Playwright MCP to navigate to the dashboard and take a screenshot"
   * 2. "Use MCP tools to test the signup flow visually"
   * 3. "Use Playwright MCP to click through the income management flow"
   * 4. "Take screenshots of all main pages using MCP tools"
   *
   * Claude will use the mcp__playwright__* tools to execute these actions
   * and report back with results.
   */

  // Your test code here, or ask Claude to write it using MCP tools
  await page.goto('http://localhost:3000');
});

/**
 * How to use MCP with Claude:
 *
 * 1. Make sure your dev server is running (pnpm dev)
 *
 * 2. Ask Claude something like:
 *    "Use the Playwright MCP server to navigate to http://localhost:3000,
 *     click the signup button, and take a screenshot"
 *
 * 3. Claude will use the MCP tools to:
 *    - Open the browser
 *    - Navigate to the URL
 *    - Find and click the button
 *    - Capture a screenshot
 *    - Return the results
 *
 * 4. Benefits:
 *    - Quick visual testing without writing code
 *    - Exploratory testing of new features
 *    - Generating test code from interactions
 *    - Debugging UI issues visually
 */
