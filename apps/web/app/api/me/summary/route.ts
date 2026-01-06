import { NextResponse } from 'next/server';
import { computeSummary } from '@safetospend/core';
import { prisma, type IncomeSource } from '@safetospend/db';
import { ensureUser } from '@/lib/ensure-user';
import { requireUserId, unauthorized } from '@/lib/auth';
import { formatDateKey, getPayWindow } from '@/lib/dates';

export const GET = async () => {
  try {
    const userId = await requireUserId();
    const user = await ensureUser(userId);

    const settings = await prisma.settings.findUnique({ where: { userId } });
    const timezone = settings?.timezone ?? 'UTC';

    const [balanceSnapshot, incomeSources, bills] = await Promise.all([
      prisma.balanceSnapshot.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.incomeSource.findMany({
        where: { userId, active: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.bill.findMany({
        where: { userId, active: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const primaryIncome = incomeSources.find((source: IncomeSource) => source.active);
    const now = new Date();
    const expenses = primaryIncome
      ? await prisma.expense.findMany({
          where: {
            userId,
            date: {
              gte: getPayWindow(now, primaryIncome.nextPayDate, timezone).start,
              lte: getPayWindow(now, primaryIncome.nextPayDate, timezone).end,
            },
          },
          orderBy: { date: 'desc' },
        })
      : [];

    const summary = computeSummary({
      nowISO: now.toISOString(),
      timezone,
      balanceCents: balanceSnapshot?.balanceCents ?? 0,
      incomeSources: incomeSources.map((source) => ({
        id: source.id,
        name: source.name,
        amountCents: source.amountCents,
        cadence: source.cadence,
        nextPayDate: formatDateKey(source.nextPayDate, timezone),
        active: source.active,
      })),
      bills: bills.map((bill) => ({
        id: bill.id,
        name: bill.name,
        amountCents: bill.amountCents,
        cadence: bill.cadence,
        dueDayOfMonth: bill.dueDayOfMonth ?? null,
        nextDueDate: bill.nextDueDate ? formatDateKey(bill.nextDueDate, timezone) : null,
        active: bill.active,
      })),
      expenses: expenses.map((expense) => ({
        id: expense.id,
        amountCents: expense.amountCents,
        date: formatDateKey(expense.date, timezone),
        category: expense.category ?? null,
        note: expense.note ?? null,
      })),
      plannedSavingsCentsPerPaycheck: settings?.plannedSavingsCentsPerPaycheck ?? 0,
    });

    return NextResponse.json({
      summary,
      balanceCents: balanceSnapshot?.balanceCents ?? 0,
      incomeSources,
      bills,
      expenses,
      settings,
      subscription: user.subscription,
    });
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      return unauthorized();
    }
    return NextResponse.json({ error: 'Failed to load summary' }, { status: 500 });
  }
};
