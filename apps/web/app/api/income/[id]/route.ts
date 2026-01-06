import { NextResponse } from 'next/server';
import { prisma } from '@safetospend/db';
import { incomeSourceUpdateSchema } from '@safetospend/validators';
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
    const parsed = incomeSourceUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid income source' }, { status: 400 });
    }

    await prisma.incomeSource.updateMany({
      where: { id: params.id, userId },
      data: {
        ...parsed.data,
        nextPayDate: parsed.data.nextPayDate ? new Date(parsed.data.nextPayDate) : undefined,
      },
    });

    const income = await prisma.incomeSource.findFirst({
      where: { id: params.id, userId },
    });

    return NextResponse.json(income);
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      return unauthorized();
    }
    return NextResponse.json({ error: 'Failed to update income source' }, { status: 500 });
  }
};

export const DELETE = async (
  _request: Request,
  { params }: { params: { id: string } },
) => {
  try {
    const userId = await requireUserId();
    await ensureUser(userId);

    await prisma.incomeSource.deleteMany({
      where: { id: params.id, userId },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      return unauthorized();
    }
    return NextResponse.json({ error: 'Failed to delete income source' }, { status: 500 });
  }
};
