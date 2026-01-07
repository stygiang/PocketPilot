import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const isPublicApi = (pathname: string) =>
  pathname.startsWith('/api/auth') ||
  pathname.startsWith('/api/stripe/webhook') ||
  pathname.startsWith('/api/cron');

export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const comingSoonEnabled = process.env.COMING_SOON_MODE === 'true';

  if (comingSoonEnabled) {
    const isStaticAsset = pathname.includes('.') && !pathname.startsWith('/api');
    const isAllowed =
      pathname.startsWith('/api') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/coming-soon') ||
      pathname.startsWith('/privacy') ||
      pathname.startsWith('/terms') ||
      pathname === '/favicon.ico' ||
      isStaticAsset;
    if (!isAllowed) {
      const url = request.nextUrl.clone();
      url.pathname = '/coming-soon';
      return NextResponse.redirect(url);
    }
  }

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
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
