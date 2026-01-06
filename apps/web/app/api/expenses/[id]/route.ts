import { NextResponse } from 'next/server';
import { prisma } from '@safetospend/db';
import { expenseUpdateSchema } from '@safetospend/validators';
import { ensureUser } from '@/lib/ensure-user';
import { requireUserId, unauthorized } from '@/lib/auth';

export const PATCH = async (
  request: Request,
  { params }: { params: { id: string } },
) => {
  try {
    const userId = await requireUserId();
    await ensureUser(userId);

    const body = await request.json();
    const parsed = expenseUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid expense' }, { status: 400 });
    }

    await prisma.expense.updateMany({
      where: { id: params.id, userId },
      data: {
        ...parsed.data,
        date: parsed.data.date ? new Date(parsed.data.date) : undefined,
      },
    });

    const expense = await prisma.expense.findFirst({ where: { id: params.id, userId } });
    return NextResponse.json(expense);
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      return unauthorized();
    }
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
  }
};

export const DELETE = async (
  _request: Request,
  { params }: { params: { id: string } },
) => {
  try {
    const userId = await requireUserId();
    await ensureUser(userId);

    await prisma.expense.deleteMany({
      where: { id: params.id, userId },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      return unauthorized();
    }
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
};
