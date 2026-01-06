import { prisma } from '@safetospend/db';

export const ensureUser = async (userId: string) => {
  const existing = await prisma.user.findUnique({
    where: { id: userId },
    include: { settings: true, subscription: true },
  });

  if (existing) {
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
  }

  return prisma.user.create({
    data: {
      id: userId,
      settings: {
        create: {
          timezone: 'UTC',
          plannedSavingsCentsPerPaycheck: 0,
        },
      },
      subscription: {
        create: {
          status: 'FREE',
        },
      },
    },
    include: { settings: true, subscription: true },
  });
};