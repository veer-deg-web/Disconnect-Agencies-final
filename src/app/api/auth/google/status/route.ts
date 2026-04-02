/**
 * GET /api/auth/google/status
 *
 * Returns the Google OAuth connection status.
 * Used by the admin UI to show:
 *   - connected / not-connected
 *   - which account is connected
 *   - whether the access token is still fresh
 */
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import GoogleToken from '@/models/GoogleToken';

export async function GET() {
  try {
    await dbConnect();
    const token = await GoogleToken.findOne().lean();

    if (!token) {
      return NextResponse.json({ connected: false });
    }

    const isExpired = token.expiresAt ? token.expiresAt < Date.now() : true;
    const hasCalendar = token.scopes?.includes('https://www.googleapis.com/auth/calendar');

    return NextResponse.json({
      connected:   true,
      email:       token.email || '(unknown)',
      tokenFresh:  !isExpired,
      hasCalendar: !!hasCalendar,
      expiresAt:   token.expiresAt,
      // Instructions in case token is stale or scopes are missing
      reconnectUrl: (isExpired || !hasCalendar) ? '/api/google/auth' : null,
    });

  } catch (err) {
    console.error('[google/status] Error:', err);
    return NextResponse.json({ connected: false, error: 'Database error' }, { status: 500 });
  }
}
