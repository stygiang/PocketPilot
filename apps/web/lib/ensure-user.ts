import { prisma } from '@safetospend/db';

export const ensureUser = async (userId: string) => {
  const existing = await prisma.user.findUnique({
    where: { id: userId },
    include: { settings: true, subscription: true },
  });

  if (!existing) {
    throw new Error('USER_NOT_FOUND');
  }

  if (!existing.settings) {
    await prisma.settings.create({
      data: {
        userId,
        timezone: 'UTC',
        plannedSavingsCentsPerPaycheck: 0,
      },
    });
  }

  if (!existing.subscription) {
    await prisma.subscription.create({
      data: {
        userId,
        status: 'FREE',
      },
    });
  }

  return existing;
};
