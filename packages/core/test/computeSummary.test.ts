import { describe, expect, it } from 'vitest';
import { computeSummary, type Bill, type Expense, type IncomeSource } from '../src/index';

const baseInput = {
  nowISO: '2025-01-15T12:00:00.000Z',
  timezone: 'America/New_York',
  balanceCents: 200000,
  incomeSources: [] as IncomeSource[],
  bills: [] as Bill[],
  expenses: [] as Expense[],
  plannedSavingsCentsPerPaycheck: 0,
};

describe('computeSummary', () => {
  it('returns zeros when no income source exists', () => {
    const summary = computeSummary({ ...baseInput });
    expect(summary.safeTodayCents).toBe(0);
    expect(summary.warnings.some((warning) => warning.code === 'NO_INCOME')).toBe(true);
  });

  it('reserves monthly bills in the pay window', () => {
    const summary = computeSummary({
      ...baseInput,
      incomeSources: [
        {
          id: 'income-1',
          name: 'Paycheck',
          amountCents: 300000,
          cadence: 'MONTHLY',
          nextPayDate: '2025-01-31',
          active: true,
        },
      ],
      bills: [
        {
          id: 'bill-1',
          name: 'Rent',
          amountCents: 120000,
          cadence: 'MONTHLY',
          dueDayOfMonth: 20,
          nextDueDate: null,
          active: true,
        },
      ],
    });

    expect(summary.billsReservedCents).toBe(120000);
  });

  it('flags overcommitted balance when available is negative', () => {
    const summary = computeSummary({
      ...baseInput,
      balanceCents: 50000,
      plannedSavingsCentsPerPaycheck: 100000,
      incomeSources: [
        {
          id: 'income-2',
          name: 'Paycheck',
          amountCents: 200000,
          cadence: 'MONTHLY',
          nextPayDate: '2025-01-20',
          active: true,
        },
      ],
      bills: [
        {
          id: 'bill-2',
          name: 'Subscription',
          amountCents: 100000,
          cadence: 'CUSTOM',
          dueDayOfMonth: null,
          nextDueDate: '2025-01-18',
          active: true,
        },
      ],
    });

    expect(summary.warnings.some((warning) => warning.code === 'OVERCOMMITTED')).toBe(true);
  });

  it('calculates safe per day from available funds and days left', () => {
    const summary = computeSummary({
      ...baseInput,
      balanceCents: 100000,
      incomeSources: [
        {
          id: 'income-3',
          name: 'Paycheck',
          amountCents: 200000,
          cadence: 'BIWEEKLY',
          nextPayDate: '2025-01-20',
          active: true,
        },
      ],
    });

    expect(summary.safePerDayCents).toBeGreaterThan(0);
    expect(summary.daysLeftInclusive).toBeGreaterThan(0);
  });

  it('includes custom cadence bills with next due date', () => {
    const summary = computeSummary({
      ...baseInput,
      incomeSources: [
        {
          id: 'income-4',
          name: 'Paycheck',
          amountCents: 200000,
          cadence: 'CUSTOM',
          nextPayDate: '2025-01-25',
          active: true,
        },
      ],
      bills: [
        {
          id: 'bill-3',
          name: 'Loan',
          amountCents: 45000,
          cadence: 'WEEKLY',
          dueDayOfMonth: null,
          nextDueDate: '2025-01-22',
          active: true,
        },
      ],
    });

    expect(summary.billsReservedCents).toBe(45000);
  });
});