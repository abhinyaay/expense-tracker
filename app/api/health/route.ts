import { NextResponse } from 'next/server';

export async function GET() {
  const envCheck = {
    MONGODB_URI: !!process.env.MONGODB_URI,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
    GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
  };

  return NextResponse.json({
    status: 'ok',
    environment: process.env.NODE_ENV,
    envVariables: envCheck,
    timestamp: new Date().toISOString(),
  });
}
