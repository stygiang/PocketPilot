import bcrypt from 'bcryptjs';
import { prisma } from '../src/index';

const seed = async () => {
  const email = process.env.SEED_USER_EMAIL;
  const password = process.env.SEED_USER_PASSWORD ?? 'Password123!';
  if (!email) {
    console.log('SEED_USER_EMAIL not set. Skipping seed.');
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      settings: {
        create: {
          timezone: 'America/New_York',
          plannedSavingsCentsPerPaycheck: 25000,
        },
      },
      incomeSources: {
        create: {
          name: 'Main Job',
          amountCents: 250000,
          cadence: 'BIWEEKLY',
          nextPayDate: new Date(),
          active: true,
        },
      },
      bills: {
        createMany: {
          data: [
            {
              name: 'Rent',
              amountCents: 120000,
              cadence: 'MONTHLY',
              dueDayOfMonth: 1,
              active: true,
            },
            {
              name: 'Streaming',
              amountCents: 1500,
              cadence: 'CUSTOM',
              nextDueDate: new Date(),
              active: true,
            },
          ],
        },
      },
      balanceSnapshots: {
        create: {
          balanceCents: 200000,
        },
      },
    },
  });

  console.log('Seed complete.');
};

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
