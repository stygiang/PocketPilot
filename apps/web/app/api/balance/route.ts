import { NextResponse } from 'next/server';
import { prisma } from '@safetospend/db';
import { balanceInputSchema } from '@safetospend/validators';
import { ensureUser } from '@/lib/ensure-user';
import { requireUserId, unauthorized } from '@/lib/auth';

export const POST = async (request: Request) => {
  try {
    const userId = await requireUserId();
    await ensureUser(userId);

    const body = await request.json();
    const parsed = balanceInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid balance input' }, { status: 400 });
    }

    const snapshot = await prisma.balanceSnapshot.create({
      data: {
        userId,
        balanceCents: parsed.data.balanceCents,
      },
    });

    return NextResponse.json(snapshot);
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      return unauthorized();
    }
    return NextResponse.json({ error: 'Failed to update balance' }, { status: 500 });
  }
};
