import { NextResponse } from 'next/server';
import { prisma } from '@safetospend/db';
import { expenseCreateSchema } from '@safetospend/validators';
import { ensureUser } from '@/lib/ensure-user';
import { requireUserId, unauthorized } from '@/lib/auth';

export const GET = async () => {
  try {
    const userId = await requireUserId();
    await ensureUser(userId);

    const expenses = await prisma.expense.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(expenses);
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      return unauthorized();
    }
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    const userId = await requireUserId();
    await ensureUser(userId);

    const body = await request.json();
    const parsed = expenseCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid expense' }, { status: 400 });
    }

    const expense = await prisma.expense.create({
      data: {
        userId,
        amountCents: parsed.data.amountCents,
        date: new Date(parsed.data.date),
        category: parsed.data.category ?? null,
        note: parsed.data.note ?? null,
      },
    });

    return NextResponse.json(expense);
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      return unauthorized();
    }
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
};
