import { NextResponse } from 'next/server';
import { prisma } from '@safetospend/db';
import { billUpdateSchema } from '@safetospend/validators';
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
    const parsed = billUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid bill' }, { status: 400 });
    }

    await prisma.bill.updateMany({
      where: { id: params.id, userId },
      data: {
        ...parsed.data,
        nextDueDate: parsed.data.nextDueDate ? new Date(parsed.data.nextDueDate) : undefined,
      },
    });

    const bill = await prisma.bill.findFirst({ where: { id: params.id, userId } });
    return NextResponse.json(bill);
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      return unauthorized();
    }
    return NextResponse.json({ error: 'Failed to update bill' }, { status: 500 });
  }
};

export const DELETE = async (
  _request: Request,
  { params }: { params: { id: string } },
) => {
  try {
    const userId = await requireUserId();
    await ensureUser(userId);

    await prisma.bill.deleteMany({
      where: { id: params.id, userId },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      return unauthorized();
    }
    return NextResponse.json({ error: 'Failed to delete bill' }, { status: 500 });
  }
};
