import { NextResponse } from 'next/server';

export const GET = async (request: Request) => {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const header = request.headers.get('x-cron-secret');
    if (header !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.json({ ok: true, message: 'Cron stub: email reminders not configured.' });
};
