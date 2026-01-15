/**
 * Test data generators for PocketPilot tests.
 * Provides consistent test data for transactions, bills, debts, and goals.
 */

import type { Page } from '@playwright/test';

export interface TransactionData {
  amount: string;
  category: string;
  date?: string;
  note?: string;
}

export interface BillData {
  name: string;
  amount: string;
  dueDay: string;
  cadence?: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
}

export interface IncomeData {
  name: string;
  amount: string;
  cadence: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
  nextPayDate?: string;
}

/**
 * Sample income sources
 */
export const SAMPLE_INCOME: IncomeData[] = [
  {
    name: 'Salary',
    amount: '3500.00',
    cadence: 'BIWEEKLY',
  },
  {
    name: 'Freelance',
    amount: '500.00',
    cadence: 'MONTHLY',
  },
];

/**
 * Sample bills
 */
export const SAMPLE_BILLS: BillData[] = [
  {
    name: 'Rent',
    amount: '1200.00',
    dueDay: '1',
    cadence: 'MONTHLY',
  },
  {
    name: 'Electric',
    amount: '85.00',
    dueDay: '15',
    cadence: 'MONTHLY',
  },
  {
    name: 'Internet',
    amount: '60.00',
    dueDay: '10',
    cadence: 'MONTHLY',
  },
];

/**
 * Sample expenses
 */
export const SAMPLE_EXPENSES: TransactionData[] = [
  {
    amount: '45.50',
    category: 'Groceries',
    note: 'Weekly grocery shopping',
  },
  {
    amount: '12.00',
    category: 'Transportation',
    note: 'Gas',
  },
  {
    amount: '25.00',
    category: 'Entertainment',
    note: 'Movie night',
  },
];

/**
 * Add income source via API or UI
 */
export async function addIncome(page: Page, income: IncomeData) {
  await page.goto('/income');
  await page.click('button:has-text("Add Income")');

  await page.fill('input[name="name"]', income.name);
  await page.fill('input[name="amount"]', income.amount);
  await page.selectOption('select[name="cadence"]', income.cadence);

  if (income.nextPayDate) {
    await page.fill('input[name="nextPayDate"]', income.nextPayDate);
  }

  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
}

/**
 * Add bill via API or UI
 */
export async function addBill(page: Page, bill: BillData) {
  await page.goto('/bills');
  await page.click('button:has-text("Add Bill")');

  await page.fill('input[name="name"]', bill.name);
  await page.fill('input[name="amount"]', bill.amount);
  await page.fill('input[name="dueDay"]', bill.dueDay);

  if (bill.cadence) {
    await page.selectOption('select[name="cadence"]', bill.cadence);
  }

  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
}

/**
 * Add expense via API or UI
 */
export async function addExpense(page: Page, expense: TransactionData) {
  await page.goto('/expenses');
  await page.click('button:has-text("Add Expense")');

  await page.fill('input[name="amount"]', expense.amount);
  await page.fill('input[name="category"]', expense.category);

  if (expense.date) {
    await page.fill('input[name="date"]', expense.date);
  }

  if (expense.note) {
    await page.fill('input[name="note"]', expense.note);
  }

  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
}

/**
 * Set up a complete test scenario with income, bills, and expenses
 */
export async function setupCompleteScenario(page: Page) {
  // Add income sources
  for (const income of SAMPLE_INCOME) {
    await addIncome(page, income);
  }

  // Add bills
  for (const bill of SAMPLE_BILLS) {
    await addBill(page, bill);
  }

  // Add some expenses
  for (const expense of SAMPLE_EXPENSES) {
    await addExpense(page, expense);
  }

  // Return to home
  await page.goto('/');
}
