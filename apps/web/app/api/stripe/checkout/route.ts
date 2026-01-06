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
    const priceId = process.env.STRIPE_PRICE_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!priceId || !appUrl) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    let stripeCustomerId = subscription?.stripeCustomerId ?? null;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({ metadata: { userId } });
      stripeCustomerId = customer.id;
      await prisma.subscription.upsert({
        where: { userId },
        create: { userId, stripeCustomerId, status: 'FREE' },
        update: { stripeCustomerId },
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        metadata: { userId },
      },
    success_url: `${appUrl}/coming-soon?status=success`,
    cancel_url: `${appUrl}/coming-soon?status=cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      return unauthorized();
    }
    return NextResponse.json({ error: 'Failed to start checkout' }, { status: 500 });
  }
};
