/**
 * GET /api/google/callback
 *
 * Step 2 of the one-time OAuth flow.
 * Google redirects here with an authorization code.
 * We exchange the code for tokens, persist them, then redirect the admin.
 *
 * Critical requirements:
 *   - This URL must be EXACTLY listed in Google Cloud Console as an
 *     "Authorized redirect URI" for the OAuth2 client.
 *   - The GOOGLE_REDIRECT_URI env var must match this URL exactly.
 */
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import GoogleToken from '@/models/GoogleToken';
import { buildOAuth2Client, googleRedirectUri } from '@/lib/googleClient';

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);

  const code  = searchParams.get('code');
  const error = searchParams.get('error');

  // ── 1. Handle Google auth denial ──────────────────────────────────────────
  if (error || !code) {
    console.warn('[google/callback] Access denied or missing code:', error);
    return NextResponse.redirect(`${origin}/admin?google=denied`);
  }

  const redirectUri = googleRedirectUri();

  try {
    const oauth2Client = buildOAuth2Client();

    // ── 2. Exchange authorization code for tokens ────────────────────────────
    // IMPORTANT: redirect_uri passed here must EXACTLY match what was used to
    // generate the auth URL. buildOAuth2Client sets it in the constructor, but
    // we pass it explicitly to be safe.
    const { tokens } = await oauth2Client.getToken({
      code,
      redirect_uri: redirectUri,
    });

    console.log('[google/callback] Tokens received:', {
      has_access_token:  !!tokens.access_token,
      has_refresh_token: !!tokens.refresh_token,
      expiry_date:       tokens.expiry_date,
    });

    // ── 3. Guard: refresh_token and scope validation ─────────────────────────────
    // Check if the user actually granted the required scopes (e.g. Calendar)
    const grantedScopes = tokens.scope || '';
    const hasCalendarScope = grantedScopes.includes('https://www.googleapis.com/auth/calendar');

    if (!hasCalendarScope) {
      console.error('[google/callback] Missing required scope: calendar');
      return NextResponse.redirect(`${origin}/admin?google=insufficient_scopes`);
    }

    // Refresh token check
    // If it's missing: the app was already authorized without revoking first.
    // Prompt:consent in the auth URL should prevent this, but guard defensively.
    if (!tokens.refresh_token) {
      console.error(
        '[google/callback] No refresh_token returned. ' +
        'The user must revoke app access at https://myaccount.google.com/permissions ' +
        'and then reconnect.'
      );
      return NextResponse.json(
        { error: 'No refresh_token returned. Please revoke app access at your Google Account settings and try again.' },
        { status: 400 }
      );
    }

    // ── 4. Extract Google account email from id_token ─────────────────────
    let email = '';
    if (tokens.id_token) {
      try {
        const payloadB64 = tokens.id_token.split('.')[1];
        const decoded = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'));
        email = decoded.email ?? '';
      } catch {
        // non-fatal — email is cosmetic only
      }
    }

    // ── 5. Persist tokens (upsert singleton) ─────────────────────────────────
    await dbConnect();
    await GoogleToken.findOneAndUpdate(
      {},
      {
        accessToken:  tokens.access_token!,
        refreshToken: tokens.refresh_token,
        expiresAt:    tokens.expiry_date ?? Date.now() + 3_600_000,
        email,
        scopes:       grantedScopes.split(' '),
      },
      { upsert: true, new: true }
    );

    console.log(`[google/callback] Token stored for account: ${email}`);
    return NextResponse.redirect(`${origin}/admin?google=connected`);

  } catch (err: unknown) {
    const msg = (err as Error)?.message ?? String(err);
    console.error('[google/callback] Error exchanging code:', msg);

    // Provide specific guidance on common errors
    if (msg.includes('redirect_uri_mismatch')) {
      console.error(
        '[google/callback] REDIRECT URI MISMATCH. ' +
        `Current: ${redirectUri} — ` +
        'Add this EXACT URL to Google Cloud Console under Authorized redirect URIs.'
      );
      return NextResponse.redirect(`${origin}/admin?google=redirect_uri_mismatch`);
    }

    if (msg.includes('invalid_grant')) {
      return NextResponse.redirect(`${origin}/admin?google=invalid_grant`);
    }

    return NextResponse.redirect(`${origin}/admin?google=error`);
  }
}
