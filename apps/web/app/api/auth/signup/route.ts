import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@safetospend/db';
import { ensureUser } from '@/lib/ensure-user';
import { setSessionCookie, signToken } from '@/lib/auth';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const passwordRequirements = [
  {
    message: 'At least 8 characters',
    test: (value: string) => value.length >= 8,
  },
  {
    message: 'One uppercase letter',
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    message: 'One lowercase letter',
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    message: 'One number',
    test: (value: string) => /[0-9]/.test(value),
  },
];

export const POST = async (request: Request) => {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const passwordIssues = passwordRequirements
    .filter((rule) => !rule.test(parsed.data.password))
    .map((rule) => rule.message);
  if (passwordIssues.length > 0) {
    return NextResponse.json(
      {
        error: 'Weak password',
        code: 'WEAK_PASSWORD',
        requirements: passwordIssues,
      },
      { status: 400 }
    );
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
    },
  });

  await ensureUser(user.id);

  const token = await signToken(user.id);
  const response = NextResponse.json({ ok: true, token });
  setSessionCookie(response, token);
  return response;
};
