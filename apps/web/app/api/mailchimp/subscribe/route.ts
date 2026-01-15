import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
});

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;

export const POST = async (request: Request) => {
  const body = await request.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  if (!MAILCHIMP_API_KEY || !MAILCHIMP_AUDIENCE_ID || !MAILCHIMP_SERVER_PREFIX) {
    return NextResponse.json({ error: 'Mailchimp not configured' }, { status: 500 });
  }

  const endpoint = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`any:${MAILCHIMP_API_KEY}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email_address: parsed.data.email,
      status: 'subscribed',
    }),
  });

  if (response.status === 400) {
    const error = await response.json().catch(() => ({}));
    const title = error?.title ?? '';
    if (title === 'Member Exists') {
      return NextResponse.json({ ok: true, status: 'exists' });
    }
    return NextResponse.json({ error: 'Unable to subscribe' }, { status: 400 });
  }

  if (!response.ok) {
    return NextResponse.json({ error: 'Mailchimp error' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, status: 'subscribed' });
};
