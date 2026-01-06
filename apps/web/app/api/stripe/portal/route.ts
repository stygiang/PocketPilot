import { NextResponse } from 'next/server';
import { prisma } from '@safetospend/db';
import { ensureUser } from '@/lib/ensure-user';
import { requireUserId, unauthorized } from '@/lib/auth';
import { stripe } from '@/lib/stripe';

export const POST = async () => {
  try {
    const userId = await requireUserId();
    await ensureUser(userId);

    const subscription = await prisma.subscription.findUnique({ where: { userId } });
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!subscription?.stripeCustomerId || !appUrl) {
      return NextResponse.json({ error: 'Stripe customer missing' }, { status: 400 });
    }

  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${appUrl}/coming-soon`,
  });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      return unauthorized();
    }
    return NextResponse.json({ error: 'Failed to create portal session' }, { status: 500 });
  }
};
