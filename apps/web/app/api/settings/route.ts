import { NextResponse } from 'next/server';
import { prisma } from '@safetospend/db';
import { settingsUpdateSchema } from '@safetospend/validators';
import { ensureUser } from '@/lib/ensure-user';
import { requireUserId, unauthorized } from '@/lib/auth';

export const GET = async () => {
  try {
    const userId = await requireUserId();
    await ensureUser(userId);

    const settings = await prisma.settings.findUnique({ where: { userId } });
    return NextResponse.json(settings);
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      return unauthorized();
    }
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 });
  }
};

export const PATCH = async (request: Request) => {
  try {
    const userId = await requireUserId();
    await ensureUser(userId);

    const body = await request.json();
    const parsed = settingsUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid settings' }, { status: 400 });
    }

    const settings = await prisma.settings.update({
      where: { userId },
      data: parsed.data,
    });

    return NextResponse.json(settings);
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      return unauthorized();
    }
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
};
