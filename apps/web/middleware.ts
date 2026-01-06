import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const isPublicApi = (pathname: string) =>
  pathname.startsWith('/api/auth') ||
  pathname.startsWith('/api/stripe/webhook') ||
  pathname.startsWith('/api/cron');

export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('sst_session')?.value;

  if (pathname.startsWith('/api')) {
    if (isPublicApi(pathname)) {
      return NextResponse.next();
    }
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/api/:path*'],
};
