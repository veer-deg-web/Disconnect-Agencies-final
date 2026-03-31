export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import dbConnect from '@/lib/mongodb';
import GoogleToken from '@/models/GoogleToken';

/**
 * GET /api/auth/google/callback
 *
 * Google redirects here after the user grants (or denies) access.
 * We exchange the authorization code for tokens, persist them, then
 * redirect the admin back to /admin?google=connected.
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error || !code) {
        return NextResponse.redirect(
            new URL('/admin?google=denied', req.url)
        );
    }

    const clientId = process.env.GOOGLE_CLIENT_ID!;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI!;

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

    try {
        // Exchange code → tokens
        const { tokens } = await oauth2Client.getToken(code);
        console.log("TOKENS:", tokens);

        if (!tokens.refresh_token) {
            // This happens when consent was granted before without revoking.
            // The connect route forces prompt:'consent' to avoid this, but handle it anyway.
            return NextResponse.redirect(
                new URL('/admin?google=no_refresh_token', req.url)
            );
        }

        // Get the Google account email for display purposes
        oauth2Client.setCredentials(tokens);
        const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
        const { data: userInfo } = await oauth2.userinfo.get();

        await dbConnect();

        // Upsert — there is always only one document in this collection
        await GoogleToken.findOneAndUpdate(
            {},
            {
                accessToken: tokens.access_token!,
                refreshToken: tokens.refresh_token,
                expiresAt: tokens.expiry_date ?? Date.now() + 3600 * 1000,
                email: userInfo.email ?? '',
            },
            { upsert: true, new: true }
        );

        return NextResponse.redirect(new URL('/admin?google=connected', req.url));
    } catch (err) {
        console.error('Google OAuth callback error:', err);
        return NextResponse.redirect(new URL('/admin?google=error', req.url));
    }
}
