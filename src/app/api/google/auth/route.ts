/**
 * GET /api/google/auth?token=<admin_jwt>
 *
 * Step 1 of the one-time OAuth flow.
 * Verifies the caller is an admin, then redirects to Google's consent screen.
 *
 * Required query param:
 *   token — a valid admin JWT (obtained from the login endpoint)
 *
 * Google will redirect to GOOGLE_REDIRECT_URI (/api/google/callback) with
 * an authorization code and the state value we embed here.
 */
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { buildOAuth2Client, googleRedirectUri } from '@/lib/googleClient';

export async function GET(req: NextRequest) {
  // ── 1. Verify admin token ──────────────────────────────────────────────────
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized — admin token required as ?token= query param' },
      { status: 401 }
    );
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { role?: string };
    if (payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden — admin role required' }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  // ── 2. Build OAuth2 auth URL ───────────────────────────────────────────────
  try {
    const oauth2Client = buildOAuth2Client();
    const redirectUri  = googleRedirectUri();

    const url = oauth2Client.generateAuthUrl({
      access_type:   'offline',  // ensures refresh_token is returned
      prompt:        'consent',  // forces re-consent so refresh_token is ALWAYS returned
      response_type: 'code',
      redirect_uri:  redirectUri, // explicit — matches Google Cloud Console setting
      scope: [
        'https://www.googleapis.com/auth/calendar',
        'openid',
        'email',
      ],
      // Include admin token in state so callback can verify the originator
      state: Buffer.from(JSON.stringify({ token })).toString('base64'),
    });

    console.log(`[google/auth] Redirecting to consent screen. redirect_uri=${redirectUri}`);
    return NextResponse.redirect(url);

  } catch (err: unknown) {
    console.error('[google/auth] Error building auth URL:', err);
    return NextResponse.json(
      { error: (err as Error).message ?? 'Failed to build Google auth URL' },
      { status: 500 }
    );
  }
}
