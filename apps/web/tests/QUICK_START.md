# Playwright Testing Quick Start

Get up and running with PocketPilot E2E tests in 5 minutes.

## 1. Install (Already Done!)

Playwright is already installed with:
```bash
pnpm add -D @playwright/test
```

## 2. Start Dev Server

In one terminal:
```bash
cd c:\Users\shane\Desktop\projects\Safe to spend\safetospend
pnpm dev
```

Wait until you see: `ready - started server on 0.0.0.0:3000`

## 3. Run Tests

In another terminal:

### Option A: UI Mode (Recommended for Development)
```bash
cd apps/web
pnpm test:e2e:ui
```

**Best for:**
- Development and debugging
- Watching tests run
- Time-travel debugging
- Viewing screenshots

### Option B: Headless Mode (CI/Fast Runs)
```bash
cd apps/web
pnpm test:e2e
```

**Best for:**
- Quick validation
- CI/CD pipelines
- Running all tests fast

### Option C: Headed Mode (Watch Browser)
```bash
cd apps/web
pnpm test:e2e:headed
```

**Best for:**
- Seeing what the test is doing
- Debugging UI interactions

## 4. First Time Running?

On first run, Playwright will:
1. Create baseline screenshots in `tests/e2e/**/*.spec.ts-snapshots/`
2. These become your "golden" snapshots
3. Future runs compare against these

## 5. Test Failed?

### Visual Difference

If a visual test fails:

1. **View the difference**:
   ```bash
   pnpm test:e2e:report
   ```
   Opens HTML report showing before/after/diff

2. **If change is intentional** (you updated the UI):
   ```bash
   pnpm test:e2e:update-snapshots
   ```

3. **If change is unintentional**: Fix the UI regression

### Test Timeout

If test times out:
- Make sure dev server is running on port 3000
- Check if database is accessible
- Look at the error in the report

## 6. Common Commands Cheat Sheet

```bash
# Run all tests with UI
pnpm test:e2e:ui

# Run specific test file
pnpm test:e2e tests/e2e/flows/auth.spec.ts

# Run tests matching pattern
pnpm test:e2e --grep "dashboard"

# Debug mode (step through)
pnpm test:e2e:debug

# Generate new test code
pnpm test:e2e:codegen

# View last test report
pnpm test:e2e:report

# Update all visual snapshots
pnpm test:e2e:update-snapshots

# Run only mobile tests
pnpm test:e2e --project=mobile

# Run only desktop tests
pnpm test:e2e --project=chromium-desktop
```

## 7. Test Structure Overview

```
tests/e2e/
├── flows/                    # Test suites
│   ├── auth.spec.ts         # Login, signup, logout (6 tests)
│   ├── dashboard.spec.ts    # Dashboard, safe-to-spend (7 tests)
│   ├── income-management.spec.ts   # Add/edit/delete income (6 tests)
│   ├── bills-management.spec.ts    # Add/edit/delete bills (8 tests)
│   └── complete-user-journey.spec.ts # End-to-end flows (6 tests)
└── helpers/
    ├── auth.ts              # Login/signup helpers
    ├── visual.ts            # Screenshot helpers
    └── test-data.ts         # Sample data generators
```

**Total: 33 comprehensive tests**

## 8. Writing Your First Test

```typescript
import { test, expect } from '@playwright/test';
import { useDemoAccount } from '../helpers/auth';
import { expectVisualMatch, prepareForVisualTest } from '../helpers/visual';

test('my new feature works', async ({ page }) => {
  // Login with demo data
  await useDemoAccount(page);

  // Navigate
  await page.goto('/my-feature');

  // Interact
  await page.click('button:has-text("Do Something")');

  // Assert
  await expect(page.locator('text=Success')).toBeVisible();

  // Visual snapshot
  await prepareForVisualTest(page);
  await expectVisualMatch(page, {
    name: 'my-feature-success',
    fullPage: true,
  });
});
```

## 9. Pro Tips

### Tip 1: Use Demo Account
```typescript
await useDemoAccount(page);
```
Pre-populated with income, bills, and expenses. Perfect for testing.

### Tip 2: Mask Dynamic Content
```typescript
import { maskDynamicContent } from '../helpers/visual';

await expectVisualMatch(page, {
  name: 'dashboard',
  mask: maskDynamicContent(page), // Masks dates, timestamps
});
```

### Tip 3: Wait for Stability
```typescript
await page.waitForLoadState('networkidle');
```
Ensures all requests are done before taking screenshots.

### Tip 4: Use Playwright Codegen
```bash
pnpm test:e2e:codegen
```
Opens browser and generates test code as you interact!

### Tip 5: Check Multiple Viewports
Tests automatically run on:
- Desktop (1280x720)
- Tablet (1024x768)
- Mobile (390x844)

Use viewport-specific tests:
```typescript
test('mobile layout', async ({ page, viewport }) => {
  if (!viewport || viewport.width > 768) {
    test.skip(); // Only run on mobile
  }
  // ... test mobile-specific behavior
});
```

## 10. Troubleshooting

### "Error: No tests found"
- Make sure you're in `apps/web` directory
- Check file naming: `*.spec.ts` in `tests/e2e/flows/`

### "browserType.launch: Executable doesn't exist"
```bash
npx playwright install chromium
```

### "ECONNREFUSED localhost:3000"
- Start dev server: `pnpm dev`
- Wait until it's fully started

### "Test timeout 30000ms exceeded"
- Increase timeout in test:
  ```typescript
  test('slow test', async ({ page }) => {
    test.setTimeout(60000); // 60 seconds
    // ...
  });
  ```

### Visual Test Always Fails
- Check if you're masking dynamic content
- Use `--update-snapshots` if UI change is intentional
- Disable animations with `prepareForVisualTest(page)`

## 11. Next Steps

1. ✅ Run the existing tests to see them pass
2. ✅ Make a small UI change and see visual tests catch it
3. ✅ Update snapshots after confirming the change is good
4. ✅ Write a test for a new feature you're building
5. ✅ Set up CI/CD to run tests automatically

## 12. Get Help

- **Playwright Docs**: https://playwright.dev
- **Test Examples**: See `tests/e2e/flows/*.spec.ts`
- **Helpers**: Check `tests/e2e/helpers/*.ts`
- **Full Guide**: Read `tests/README.md`

---

**Happy Testing! 🎭**

Your PocketPilot app now has comprehensive visual and user flow testing coverage.
