import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';

const cookieName = 'sst_session';

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET not configured');
  }
  return new TextEncoder().encode(secret);
};

export const signToken = async (userId: string) =>
  new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret());

export const verifyToken = async (token: string) => {
  const { payload } = await jwtVerify(token, getSecret());
  return payload.sub as string | undefined;
};

const getToken = (request?: Request) => {
  if (request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }
    const cookie = request.headers.get('cookie') ?? '';
    const match = cookie.split('; ').find((part) => part.startsWith(`${cookieName}=`));
    return match?.split('=')[1];
  }

  return cookies().get(cookieName)?.value;
};

export const requireUserId = async (request?: Request) => {
  const token = getToken(request);
  if (!token) {
    throw new Error('UNAUTHORIZED');
  }
  const userId = await verifyToken(token);
  if (!userId) {
    throw new Error('UNAUTHORIZED');
  }
  return userId;
};

export const setSessionCookie = (response: NextResponse, token: string) => {
  response.cookies.set(cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
};

export const clearSessionCookie = (response: NextResponse) => {
  response.cookies.set(cookieName, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
};

export const unauthorized = () => NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
