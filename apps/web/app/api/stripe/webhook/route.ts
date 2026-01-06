import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@safetospend/db';

const toStatus = (status: string) => {
  if (status === 'active' || status === 'trialing') return 'PRO';
  if (status === 'past_due') return 'PAST_DUE';
  if (status === 'canceled' || status === 'unpaid') return 'CANCELED';
  return 'FREE';
};

export const POST = async (request: Request) => {
  const signature = headers().get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !secret) {
    return NextResponse.json({ error: 'Missing webhook secret' }, { status: 400 });
  }

  let event;
  try {
    const payload = await request.text();
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as {
      id: string;
      customer: string;
      status: string;
      current_period_end: number;
      metadata?: { userId?: string };
    };

    const userId = subscription.metadata?.userId;
    if (userId) {
      await prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          stripeCustomerId: subscription.customer as string,
          stripeSubscriptionId: subscription.id,
          status: toStatus(subscription.status),
          currentPeriodEnd: subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000)
            : null,
        },
        update: {
          stripeCustomerId: subscription.customer as string,
          stripeSubscriptionId: subscription.id,
          status: toStatus(subscription.status),
          currentPeriodEnd: subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000)
            : null,
        },
      });
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as {
      customer: string;
      status: string;
      metadata?: { userId?: string };
    };
    const userId = subscription.metadata?.userId;
    if (userId) {
      await prisma.subscription.update({
        where: { userId },
        data: { status: toStatus(subscription.status) },
      });
    }
  }

  return NextResponse.json({ received: true });
};
