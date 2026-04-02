/**
 * DELETE /api/google/disconnect
 *
 * Revokes the Google OAuth token and removes the stored record from MongoDB.
 * Requires a valid admin JWT as Authorization: Bearer <token>.
 *
 * After calling this, admins must visit /api/google/auth to reconnect.
 */
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/adminAuth';
import dbConnect from '@/lib/mongodb';
import GoogleToken from '@/models/GoogleToken';
import { buildOAuth2Client } from '@/lib/googleClient';

export async function DELETE(req: NextRequest) {
  const auth = await verifyAdminToken(req);
  if (!auth.valid)   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!auth.isAdmin) return NextResponse.json({ error: 'Forbidden'    }, { status: 403 });

  try {
    await dbConnect();
    const stored = await GoogleToken.findOne().lean();

    if (!stored) {
      return NextResponse.json({ message: 'No Google account was connected.' });
    }

    // Attempt to revoke the token at Google (best-effort — don't fail if it errors)
    try {
      const client = buildOAuth2Client();
      await client.revokeToken(stored.refreshToken);
      console.log('[google/disconnect] Token revoked at Google.');
    } catch (revokeErr) {
      console.warn('[google/disconnect] Token revocation failed (already expired?):', revokeErr);
    }

    // Remove from DB regardless
    await GoogleToken.deleteMany({});
    console.log('[google/disconnect] Token removed from database.');

    return NextResponse.json({
      message: 'Google account disconnected successfully. Reconnect via /api/google/auth.',
    });

  } catch (err: unknown) {
    console.error('[google/disconnect] Error:', err);
    return NextResponse.json(
      { error: (err as Error).message ?? 'Failed to disconnect Google account' },
      { status: 500 }
    );
  }
}
