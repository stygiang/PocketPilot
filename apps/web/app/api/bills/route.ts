import { NextResponse } from 'next/server';
import { prisma } from '@safetospend/db';
import { billCreateSchema } from '@safetospend/validators';
import { ensureUser } from '@/lib/ensure-user';
import { enforceFreeLimits } from '@/lib/limits';
import { requireUserId, unauthorized } from '@/lib/auth';

export const GET = async () => {
  try {
    const userId = await requireUserId();
    await ensureUser(userId);

    const bills = await prisma.bill.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(bills);
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      return unauthorized();
    }
    return NextResponse.json({ error: 'Failed to fetch bills' }, { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    const userId = await requireUserId();
    await ensureUser(userId);

    const limits = await enforceFreeLimits(userId);
    if (!limits.isPro && limits.billCount && limits.billCount >= 10) {
      return NextResponse.json({ error: 'Upgrade to Pro for more than 10 bills.' }, { status: 403 });
    }

    const body = await request.json();
    const parsed = billCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid bill' }, { status: 400 });
    }

    const bill = await prisma.bill.create({
      data: {
        userId,
        name: parsed.data.name,
        amountCents: parsed.data.amountCents,
        cadence: parsed.data.cadence,
        dueDayOfMonth: parsed.data.dueDayOfMonth ?? null,
        nextDueDate: parsed.data.nextDueDate ? new Date(parsed.data.nextDueDate) : null,
        active: parsed.data.active,
      },
    });

    return NextResponse.json(bill);
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      return unauthorized();
    }
    return NextResponse.json({ error: 'Failed to create bill' }, { status: 500 });
  }
};
