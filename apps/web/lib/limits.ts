import { prisma } from '@safetospend/db';

export const isProUser = async (userId: string) => {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });
  return subscription?.status === 'PRO';
};

export const enforceFreeLimits = async (userId: string) => {
  const isPro = await isProUser(userId);
  if (isPro) {
    return { isPro };
  }

  const [billCount, incomeCount] = await Promise.all([
    prisma.bill.count({ where: { userId, active: true } }),
    prisma.incomeSource.count({ where: { userId, active: true } }),
  ]);

  return { isPro, billCount, incomeCount };
};