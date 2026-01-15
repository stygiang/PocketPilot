import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

/**
 * Demo Mode Authentication
 * Creates a temporary demo account with pre-populated data
 */

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export async function POST() {
  try {
    // Create demo user token (no database entry needed)
    const demoUser = {
      id: 'demo-user',
      email: 'demo@safetospend.app',
      name: 'Demo User',
      isDemo: true,
    };

    // Generate JWT token using jose library
    const token = await new SignJWT(demoUser)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h') // Demo session expires after 24 hours
      .sign(JWT_SECRET);

    return NextResponse.json({
      success: true,
      token,
      user: demoUser,
      message: 'Demo mode activated. Your session will expire in 24 hours.',
    });
  } catch (error) {
    console.error('Demo mode error:', error);
    return NextResponse.json(
      { error: 'Failed to create demo session' },
      { status: 500 }
    );
  }
}
