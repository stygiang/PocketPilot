# PocketPilot E2E Testing Guide

Comprehensive visual testing and user flow testing for PocketPilot using Playwright.

## Overview

This test suite provides:

- **Visual Regression Testing**: Screenshot comparison to catch UI regressions
- **User Flow Testing**: End-to-end testing of critical user journeys
- **Multi-Device Testing**: Tests across desktop, tablet, and mobile viewports
- **Responsive Design Validation**: Ensures UI works across all screen sizes

## Test Structure

```
tests/
├── e2e/
│   ├── flows/                          # User flow test suites
│   │   ├── auth.spec.ts                # Authentication flows
│   │   ├── dashboard.spec.ts           # Dashboard and safe-to-spend
│   │   ├── income-management.spec.ts   # Income CRUD operations
│   │   ├── bills-management.spec.ts    # Bills CRUD operations
│   │   └── complete-user-journey.spec.ts # Full user scenarios
│   └── helpers/                        # Test utilities
│       ├── auth.ts                     # Authentication helpers
│       ├── visual.ts                   # Visual testing utilities
│       └── test-data.ts                # Test data generators
└── README.md                           # This file
```

## Running Tests

### Prerequisites

1. **Start the development server** (in another terminal):
   ```bash
   pnpm dev
   ```

2. **Ensure database is running** with test data

### Test Commands

```bash
# Run all tests (headless)
pnpm test:e2e

# Run tests with UI mode (interactive, recommended for development)
pnpm test:e2e:ui

# Run tests in headed mode (see browser)
pnpm test:e2e:headed

# Debug a specific test
pnpm test:e2e:debug

# Generate new tests with Playwright codegen
pnpm test:e2e:codegen

# View last test report
pnpm test:e2e:report

# Update visual snapshots (after intentional UI changes)
pnpm test:e2e:update-snapshots
```

### Running Specific Tests

```bash
# Run a specific test file
pnpm test:e2e tests/e2e/flows/auth.spec.ts

# Run tests matching a pattern
pnpm test:e2e --grep "authentication"

# Run a specific project (viewport)
pnpm test:e2e --project=mobile
pnpm test:e2e --project=tablet
pnpm test:e2e --project=chromium-desktop
```

## Test Suites

### 1. Authentication Flow (`auth.spec.ts`)

Tests user authentication journeys:

- Sign-in page display
- Sign-up page display
- Invalid login handling
- Demo account login
- Full login/logout cycle
- Form validation

**Key Visual Tests:**
- Sign-in page
- Sign-up page
- Error states
- Validation errors

### 2. Dashboard Flow (`dashboard.spec.ts`)

Tests the main dashboard experience:

- Dashboard layout and components
- Safe-to-spend display
- Current balance display
- Upcoming bills section
- Navigation to features
- Responsive layouts (mobile, tablet, desktop)

**Key Visual Tests:**
- Full dashboard
- Safe-to-spend component
- Upcoming bills section
- Mobile layout
- Tablet layout

### 3. Income Management (`income-management.spec.ts`)

Tests income source management:

- View income sources
- Add new income
- Edit existing income
- Delete income
- Form validation
- Empty state

**Key Visual Tests:**
- Income list page
- Add income form
- Edit income form
- Validation errors
- Empty state

### 4. Bills Management (`bills-management.spec.ts`)

Tests bill management:

- View bills
- Add new bill
- Edit existing bill
- Delete bill
- Due date display
- Cadence options (weekly, biweekly, monthly)
- Form validation
- Empty state

**Key Visual Tests:**
- Bills list page
- Add bill form
- Edit bill form
- Bills with due dates
- Validation errors
- Empty state

### 5. Complete User Journey (`complete-user-journey.spec.ts`)

Tests comprehensive end-to-end scenarios:

- **Onboarding Journey**: Signup → Add income → Add bill → Add expense → View dashboard
- **Daily Usage Flow**: Check dashboard → Add expense → View updated safe-to-spend
- **Monthly Review Flow**: Review income → Review bills → Review expenses → Check balance history
- **Error Recovery**: Handle validation errors and corrections
- **Navigation**: Test all main sections

**Key Visual Tests:**
- Post-signup state
- Dashboard with complete setup
- Daily dashboard check
- After adding expense
- Monthly review screens
- Error states

## Visual Testing

### How Visual Tests Work

1. **First Run**: Playwright captures baseline screenshots
2. **Subsequent Runs**: Compares new screenshots against baselines
3. **Differences**: Test fails if screenshots differ beyond threshold
4. **Update**: Run `pnpm test:e2e:update-snapshots` to accept changes

### Visual Test Configuration

- **Max Diff Pixels**: 100 pixels can differ
- **Threshold**: 20% pixel difference allowed
- **Animations**: Disabled for consistency
- **Dynamic Content**: Masked (dates, timestamps, live balances)

### Updating Visual Baselines

After intentional UI changes:

```bash
# Update all snapshots
pnpm test:e2e:update-snapshots

# Update snapshots for specific test
pnpm test:e2e:update-snapshots tests/e2e/flows/dashboard.spec.ts
```

### Masking Dynamic Content

The test suite automatically masks:
- Timestamps
- Dates that change
- Live balance updates
- Animated elements

See [helpers/visual.ts](e2e/helpers/visual.ts) for details.

## Test Data

### Demo Account

Most tests use the **demo account** for consistent test data:

```typescript
await useDemoAccount(page);
```

This provides pre-populated:
- Income sources
- Bills
- Expenses
- Balance history

### Custom Test Data

Use helpers from [test-data.ts](e2e/helpers/test-data.ts):

```typescript
import { addIncome, addBill, addExpense, SAMPLE_INCOME } from '../helpers/test-data';

await addIncome(page, SAMPLE_INCOME[0]);
await addBill(page, { name: 'Rent', amount: '1200', dueDay: '1' });
```

## Writing New Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { useDemoAccount } from '../helpers/auth';
import { expectVisualMatch, prepareForVisualTest } from '../helpers/visual';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await useDemoAccount(page);
  });

  test('should do something', async ({ page }) => {
    // Navigate
    await page.goto('/feature');

    // Interact
    await page.click('button');

    // Assert
    await expect(page.locator('text=Success')).toBeVisible();

    // Visual test
    await prepareForVisualTest(page);
    await expectVisualMatch(page, {
      name: 'feature-success-state',
      fullPage: true,
    });
  });
});
```

### Best Practices

1. **Use Demo Account**: Provides consistent data
2. **Mask Dynamic Content**: Dates, timestamps, live values
3. **Prepare for Visual Tests**: Disable animations, wait for assets
4. **Descriptive Names**: Use clear test and snapshot names
5. **Wait for Stability**: Use `waitForLoadState('networkidle')`
6. **Test Responsiveness**: Utilize device projects
7. **Handle Optional Elements**: Use conditional checks for optional UI

### Example: Testing a New Feature

```typescript
test('should add a new savings goal', async ({ page }) => {
  await page.goto('/goals');

  // Click add button
  await page.click('button:has-text("Add Goal")');

  // Fill form
  await page.fill('input[name="name"]', 'Vacation Fund');
  await page.fill('input[name="targetAmount"]', '5000');
  await page.fill('input[name="targetDate"]', '2026-12-31');

  // Visual test: form filled
  await prepareForVisualTest(page);
  await expectVisualMatch(page, {
    name: 'goals-add-form-filled',
  });

  // Submit
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');

  // Verify
  await expect(page.locator('text=Vacation Fund')).toBeVisible();
  await expect(page.locator('text=/\\$5,?000/')).toBeVisible();

  // Visual test: goal added
  await prepareForVisualTest(page);
  await expectVisualMatch(page, {
    name: 'goals-list-with-vacation-fund',
    fullPage: true,
  });
});
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Install Playwright browsers
        run: pnpm --filter web exec playwright install --with-deps chromium

      - name: Run E2E tests
        run: pnpm --filter web test:e2e
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          JWT_SECRET: ${{ secrets.JWT_SECRET }}

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: apps/web/playwright-report/
          retention-days: 30
```

## Debugging Tests

### Interactive UI Mode (Recommended)

```bash
pnpm test:e2e:ui
```

Features:
- Watch mode
- Time travel debugging
- Step through tests
- View screenshots/videos
- Filter tests

### Debug Mode

```bash
pnpm test:e2e:debug
```

Opens Playwright Inspector for step-by-step debugging.

### View Test Results

```bash
pnpm test:e2e:report
```

Opens HTML report with:
- Test results
- Screenshots
- Videos (on failure)
- Traces

### Troubleshooting

**Tests failing on CI but passing locally?**
- Check environment variables
- Verify database state
- Review CI logs for setup issues
- Check screenshot differences in report

**Visual tests failing after UI changes?**
- Review differences in test report
- If changes are intentional: `pnpm test:e2e:update-snapshots`
- If unintentional: Fix the UI regression

**Tests timing out?**
- Increase timeout in `playwright.config.ts`
- Check if dev server is running
- Verify network requests aren't hanging

**Flaky tests?**
- Add proper waits (`waitForLoadState`, `waitFor`)
- Mask dynamic content
- Increase retries in config
- Check for race conditions

## Performance

- **Parallel Execution**: Tests run in parallel by default
- **Retries**: Configured for CI (2 retries)
- **Selective Testing**: Run specific tests during development
- **Fast Feedback**: Use `--headed` mode to see progress

## Coverage

Current test coverage includes:

- ✅ Authentication (signup, login, logout, demo)
- ✅ Dashboard (safe-to-spend, balance, bills)
- ✅ Income management (CRUD operations)
- ✅ Bills management (CRUD operations)
- ✅ Complete user journeys (onboarding, daily usage, monthly review)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Form validation
- ✅ Error handling

**Future Coverage** (to be added):
- Expenses management (detailed CRUD)
- Settings page
- Debt management (when implemented)
- Savings goals (when implemented)
- Planned purchases (when implemented)
- Overspend recovery flows (when implemented)

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Visual Testing Best Practices](https://playwright.dev/docs/test-snapshots)
- [Playwright Test Generator](https://playwright.dev/docs/codegen)
- [PocketPilot Agent Guide](../../.claude/AGENT_GUIDE.md)
- [PocketPilot Project Guide](../../claude.md)

## Questions?

Check the [Playwright docs](https://playwright.dev) or ask in the project discussions.
