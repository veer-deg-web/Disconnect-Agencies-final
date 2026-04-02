/**
 * googleClient.ts
 *
 * Single source of truth for building a fully-authenticated Google OAuth2
 * client.  All Google API callers (Meet, Calendar, etc.) import from here.
 *
 * Token resolution order:
 *   1. MongoDB GoogleToken collection  ← preferred (written by /api/google/callback)
 *   2. GOOGLE_REFRESH_TOKEN env var    ← seed / CI / Vercel fallback
 *
 * The client proactively refreshes the access_token when it is expired, and
 * persists the new token back to MongoDB so subsequent cold-starts are fast.
 */

import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import dbConnect from '@/lib/mongodb';
import GoogleToken from '@/models/GoogleToken';

// ─── helpers ─────────────────────────────────────────────────────────────────

/**
 * Returns the correct OAuth2 redirect URI.
 * Local dev  → http://localhost:3000/api/google/callback
 * Production → https://your-domain.com/api/google/callback
 *
 * Set GOOGLE_REDIRECT_URI explicitly in Vercel environment settings to lock it.
 */
export function googleRedirectUri(): string {
  if (process.env.GOOGLE_REDIRECT_URI) return process.env.GOOGLE_REDIRECT_URI;
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  return `${base.replace(/\/$/, '')}/api/google/callback`;
}

/** Builds a bare (no-credentials) OAuth2 client. */
export function buildOAuth2Client(): OAuth2Client {
  const id  = process.env.GOOGLE_CLIENT_ID;
  const sec = process.env.GOOGLE_CLIENT_SECRET;
  if (!id || !sec) {
    throw new Error('GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing from env.');
  }
  return new google.auth.OAuth2(id, sec, googleRedirectUri());
}

// ─── main export ─────────────────────────────────────────────────────────────

/**
 * Returns a fully-credentialed OAuth2Client ready for any Google API.
 *
 * - Loads refresh_token from DB (or env fallback).
 * - Proactively refreshes access_token if expired.
 * - Persists rotated tokens back to DB.
 * - Throws a human-readable error on invalid_grant with re-auth instructions.
 */
export async function getGoogleAuthClient(): Promise<OAuth2Client> {
  const client = buildOAuth2Client();

  // 1. Load stored tokens ────────────────────────────────────────────────────
  let refreshToken: string | null = null;
  let accessToken:  string | null = null;
  let expiresAt:    number | null = null;

  try {
    await dbConnect();
    const stored = await GoogleToken.findOne().lean();
    if (stored?.refreshToken) {
      refreshToken = stored.refreshToken;
      accessToken  = stored.accessToken ?? null;
      expiresAt    = stored.expiresAt   ?? null;
    }
  } catch (e) {
    console.error('[googleClient] DB lookup failed, trying env fallback:', e);
  }

  // 2. Env-var fallback ──────────────────────────────────────────────────────
  if (!refreshToken) {
    const envToken = process.env.GOOGLE_REFRESH_TOKEN;
    if (!envToken) {
      throw new Error(
        'Google account is not connected. ' +
        'An admin must visit /api/google/connect to complete the one-time OAuth flow.'
      );
    }
    refreshToken = envToken;
    console.warn('[googleClient] Using GOOGLE_REFRESH_TOKEN from env (no DB record).');
  }

  // 3. Set credentials ───────────────────────────────────────────────────────
  const stillValid = !!accessToken && !!expiresAt && expiresAt > Date.now() + 60_000;

  client.setCredentials({
    refresh_token: refreshToken,
    ...(stillValid ? { access_token: accessToken!, expiry_date: expiresAt! } : {}),
  });

  // 4. Wire up token-rotation persistence ───────────────────────────────────
  client.on('tokens', (fresh) => {
    _persistTokens(fresh, refreshToken!).catch((e) =>
      console.error('[googleClient] Token persist failed:', e)
    );
  });

  // 5. Proactively refresh when needed ──────────────────────────────────────
  if (!stillValid) {
    try {
      const { credentials } = await client.refreshAccessToken();
      client.setCredentials(credentials);
    } catch (err: unknown) {
      const msg = (err as Error)?.message ?? String(err);
      if (msg.includes('invalid_grant')) {
        // Wipe the stale token from DB so next status check shows disconnected
        _clearStoredToken().catch(() => {});
        throw new Error(
          'invalid_grant: The Google refresh token has expired or been revoked. ' +
          'The admin must reconnect: visit /api/google/connect to re-authorize.'
        );
      }
      throw new Error(`Google token refresh failed: ${msg}`);
    }
  }

  return client;
}

// ─── internals ────────────────────────────────────────────────────────────────

async function _persistTokens(
  fresh: { access_token?: string | null; refresh_token?: string | null; expiry_date?: number | null },
  fallbackRefresh: string
): Promise<void> {
  try {
    await dbConnect();
    await GoogleToken.findOneAndUpdate(
      {},
      {
        ...(fresh.access_token  ? { accessToken:  fresh.access_token  } : {}),
        ...(fresh.refresh_token ? { refreshToken: fresh.refresh_token } : { refreshToken: fallbackRefresh }),
        ...(fresh.expiry_date   ? { expiresAt:    fresh.expiry_date   } : {}),
      },
      { upsert: true }
    );
  } catch (e) {
    console.error('[googleClient] _persistTokens error:', e);
  }
}

async function _clearStoredToken(): Promise<void> {
  try {
    await dbConnect();
    await GoogleToken.deleteMany({});
  } catch (_) { /* non-fatal */ }
}
