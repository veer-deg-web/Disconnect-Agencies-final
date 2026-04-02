/**
 * GET /api/google/connect
 *
 * Alias route: redirects to /api/google/auth to keep the URL readable.
 * Admins visit this from the Admin panel to kick off the one-time OAuth flow.
 */
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token') ?? '';
  const dest = `${url.origin}/api/google/auth${token ? `?token=${token}` : ''}`;
  return NextResponse.redirect(dest);
}
