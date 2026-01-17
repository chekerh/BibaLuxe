import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health check - can be extended with database checks, etc.
    return NextResponse.json(
      {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
