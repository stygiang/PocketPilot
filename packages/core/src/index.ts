import {
  addMonths,
  addDays,
  differenceInCalendarDays,
  isWithinInterval,
  parseISO,
  startOfDay,
} from 'date-fns';
import { formatInTimeZone, fromZonedTime, toZonedTime } from 'date-fns-tz';

export type Cadence = 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'CUSTOM';

export type IncomeSource = {
  id: string;
  name: string;
  amountCents: number;
  cadence: Cadence;
  nextPayDate: string;
  active: boolean;
};

export type Bill = {
  id: string;
  name: string;
  amountCents: number;
  cadence: Cadence;
  dueDayOfMonth?: number | null;
  nextDueDate?: string | null;
  active: boolean;
};

export type Expense = {
  id: string;
  amountCents: number;
  date: string;
  category?: string | null;
  note?: string | null;
};

export type ComputeInput = {
  nowISO: string;
  timezone: string;
  balanceCents: number;
  incomeSources: IncomeSource[];
  bills: Bill[];
  expenses: Expense[];
  plannedSavingsCentsPerPaycheck: number;
};

export type Warning = { code: string; message: string };

export type ComputeOutput = {
  safeTodayCents: number;
  safePerDayCents: number;
  safeUntilPaydayCents: number;
  daysLeftInclusive: number;
  nextPaydayISO: string;
  billsReservedCents: number;
  savingsReservedCents: number;
  todaySpentCents: number;
  weekSpentCents: number;
  warnings: Warning[];
};

const dateKey = (date: Date, timezone: string) =>
  formatInTimeZone(date, timezone, 'yyyy-MM-dd');

const startOfZonedDay = (date: Date, timezone: string) =>
  startOfDay(toZonedTime(date, timezone));

const zonedMidnightFromISODate = (isoDate: string, timezone: string) => {
  const date = parseISO(`${isoDate}T00:00:00`);
  return fromZonedTime(date, timezone);
};

const resolveMonthlyDueDate = (
  dueDayOfMonth: number,
  todayStart: Date,
  timezone: string,
) => {
  const todayKey = dateKey(todayStart, timezone);
  const baseDate = parseISO(`${todayKey}T00:00:00`);
  const year = baseDate.getUTCFullYear();
  const month = baseDate.getUTCMonth();
  const candidate = new Date(Date.UTC(year, month, dueDayOfMonth));
  const candidateStart = fromZonedTime(candidate, timezone);
  if (candidateStart < todayStart) {
    const nextMonth = addMonths(candidateStart, 1);
    return nextMonth;
  }
  return candidateStart;
};

const getNextPayday = (income: IncomeSource, timezone: string) =>
  zonedMidnightFromISODate(income.nextPayDate, timezone);

export const computeSummary = (input: ComputeInput): ComputeOutput => {
  const warnings: Warning[] = [];
  const now = parseISO(input.nowISO);
  const todayStart = startOfZonedDay(now, input.timezone);
  const income = input.incomeSources.find((source) => source.active);

  if (!income) {
    warnings.push({
      code: 'NO_INCOME',
      message: 'Add an active income source to calculate your safe-to-spend.',
    });
    return {
      safeTodayCents: 0,
      safePerDayCents: 0,
      safeUntilPaydayCents: 0,
      daysLeftInclusive: 0,
      nextPaydayISO: '',
      billsReservedCents: 0,
      savingsReservedCents: 0,
      todaySpentCents: 0,
      weekSpentCents: 0,
      warnings,
    };
  }

  const nextPayday = getNextPayday(income, input.timezone);
  const nextPaydayKey = dateKey(nextPayday, input.timezone);
  const daysLeftInclusive = differenceInCalendarDays(
    startOfZonedDay(nextPayday, input.timezone),
    todayStart,
  ) + 1;

  if (daysLeftInclusive <= 0) {
    warnings.push({
      code: 'INVALID_PAYDAY',
      message: 'Your next payday looks invalid. Update your income schedule.',
    });
  }

  const payWindow = {
    start: todayStart,
    end: startOfZonedDay(nextPayday, input.timezone),
  };

  const billsReservedCents = input.bills
    .filter((bill) => bill.active)
    .reduce((total, bill) => {
      let dueDate: Date | null = null;
      if (bill.cadence === 'MONTHLY' && bill.dueDayOfMonth) {
        dueDate = resolveMonthlyDueDate(bill.dueDayOfMonth, todayStart, input.timezone);
      } else if (bill.nextDueDate) {
        dueDate = zonedMidnightFromISODate(bill.nextDueDate, input.timezone);
      }

      if (!dueDate) {
        return total;
      }

      if (isWithinInterval(dueDate, payWindow)) {
        return total + bill.amountCents;
      }

      return total;
    }, 0);

  const savingsReservedCents = Math.max(input.plannedSavingsCentsPerPaycheck || 0, 0);
  const available = input.balanceCents - billsReservedCents - savingsReservedCents;

  if (available < 0) {
    warnings.push({
      code: 'OVERCOMMITTED',
      message: `You are overcommitted by ${Math.abs(available)} cents before payday.`,
    });
  }

  const safePerDayCents = daysLeftInclusive > 0 ? Math.floor(Math.max(available, 0) / daysLeftInclusive) : 0;

  const todayKey = dateKey(todayStart, input.timezone);
  const todaySpentCents = input.expenses
    .filter((expense) => dateKey(parseISO(expense.date), input.timezone) === todayKey)
    .reduce((sum, expense) => sum + expense.amountCents, 0);

  const weekStart = startOfZonedDay(addDays(todayStart, -6), input.timezone);
  const weekSpentCents = input.expenses
    .filter((expense) => {
      const expenseDate = startOfZonedDay(parseISO(expense.date), input.timezone);
      return isWithinInterval(expenseDate, { start: weekStart, end: todayStart });
    })
    .reduce((sum, expense) => sum + expense.amountCents, 0);

  const spendSoFarUntilPayday = input.expenses
    .filter((expense) => {
      const expenseDate = startOfZonedDay(parseISO(expense.date), input.timezone);
      return isWithinInterval(expenseDate, payWindow);
    })
    .reduce((sum, expense) => sum + expense.amountCents, 0);

  const safeTodayCents = safePerDayCents - todaySpentCents;
  const safeUntilPaydayCents = Math.max(available - spendSoFarUntilPayday, 0);

  return {
    safeTodayCents,
    safePerDayCents,
    safeUntilPaydayCents,
    daysLeftInclusive,
    nextPaydayISO: nextPaydayKey,
    billsReservedCents,
    savingsReservedCents,
    todaySpentCents,
    weekSpentCents,
    warnings,
  };
};