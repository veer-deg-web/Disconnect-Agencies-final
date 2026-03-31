export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import jwt from 'jsonwebtoken';

/**
 * GET /api/auth/google/connect?token=<admin_jwt>
 *
 * Admin-only. Builds the Google OAuth2 consent URL and redirects the browser
 * to it. The admin JWT is passed as a ?token= query param because this
 * endpoint is triggered by a plain browser navigation (window.location.href),
 * which cannot carry custom Authorization headers.
 */
export async function GET(req: NextRequest) {
    // ---- Admin guard -------------------------------------------------------
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
        return NextResponse.json({ error: 'Unauthorised — token missing' }, { status: 401 });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
            role?: string;
        };
        if (payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
    } catch {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    // -----------------------------------------------------------------------

    const clientId = process.env.GOOGLE_CLIENT_ID!;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI!;

    if (!clientId || !clientSecret || !redirectUri) {
        return NextResponse.json(
            { error: 'Google OAuth env vars not configured' },
            { status: 500 }
        );
    }

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent', // 🔥 REQUIRED
        scope: ['https://www.googleapis.com/auth/calendar'],
        redirect_uri: process.env.GOOGLE_REDIRECT_URI, // 🔥 ADD THIS
    });

    return NextResponse.redirect(url);
}
