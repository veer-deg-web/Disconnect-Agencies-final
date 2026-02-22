import { NextRequest, NextResponse } from 'next/server';

// SMS OTP verification is not currently configured.
// This stub returns a 501 so the frontend receives a clear error.
export async function POST(_req: NextRequest) {
  return NextResponse.json(
    { error: 'SMS verification is not configured on this server.' },
    { status: 501 }
  );
}
