import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    databaseUrl: process.env.DATABASE_URL || 'DATABASE_URL not set',
  });
}
