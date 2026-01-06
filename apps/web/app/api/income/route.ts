import { NextResponse } from 'next/server';
import { prisma } from '@safetospend/db';
import { incomeSourceCreateSchema } from '@safetospend/validators';
import { ensureUser } from '@/lib/ensure-user';
import { enforceFreeLimits } from '@/lib/limits';
import { requireUserId, unauthorized } from '@/lib/auth';

export const GET = async () => {
  try {
    const userId = await requireUserId();
    await ensureUser(userId);

    const incomeSources = await prisma.incomeSource.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(incomeSources);
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      return unauthorized();
    }
    return NextResponse.json({ error: 'Failed to fetch income sources' }, { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    const userId = await requireUserId();
    await ensureUser(userId);

    const limits = await enforceFreeLimits(userId);
    if (!limits.isPro && limits.incomeCount && limits.incomeCount >= 1) {
      return NextResponse.json({ error: 'Upgrade to Pro for multiple income sources.' }, { status: 403 });
    }

    const body = await request.json();
    const parsed = incomeSourceCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid income source' }, { status: 400 });
    }

    const income = await prisma.incomeSource.create({
      data: {
        userId,
        name: parsed.data.name,
        amountCents: parsed.data.amountCents,
        cadence: parsed.data.cadence,
        nextPayDate: new Date(parsed.data.nextPayDate),
        active: parsed.data.active,
      },
    });

    return NextResponse.json(income);
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      return unauthorized();
    }
    return NextResponse.json({ error: 'Failed to create income source' }, { status: 500 });
  }
};
