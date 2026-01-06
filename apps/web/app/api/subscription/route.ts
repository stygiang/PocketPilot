import { NextResponse } from 'next/server';
import { prisma } from '@safetospend/db';
import { ensureUser } from '@/lib/ensure-user';
import { requireUserId, unauthorized } from '@/lib/auth';

export const GET = async () => {
  try {
    const userId = await requireUserId();
    await ensureUser(userId);

    const subscription = await prisma.subscription.findUnique({ where: { userId } });
    return NextResponse.json(subscription);
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      return unauthorized();
    }
    return NextResponse.json({ error: 'Failed to load subscription' }, { status: 500 });
  }
};
