import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';

export const GET = async (request: Request) => {
  const response = NextResponse.redirect(new URL('/coming-soon', request.url));
  clearSessionCookie(response);
  return response;
};
