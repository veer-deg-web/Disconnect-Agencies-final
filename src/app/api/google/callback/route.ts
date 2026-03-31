import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import dbConnect from '@/lib/mongodb';
import GoogleToken from '@/models/GoogleToken';

/**
 * GET /api/google/callback
 *
 * Google redirects here after the user grants (or denies) access.
 * We exchange the authorization code for tokens, persist them, then
 * redirect the admin back to /admin?google=connected.
 *
 * Email is extracted from the id_token JWT payload — no extra API call needed.
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error || !code) {
        return NextResponse.redirect(new URL('/admin?google=denied', req.url));
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
            // Happens when consent was previously granted without revoking.
            // The connect route forces prompt:'consent' to prevent this mostly,
            // but handle it defensively.
            return NextResponse.redirect(
                new URL('/admin?google=no_refresh_token', req.url)
            );
        }

        // ── Extract email from id_token (no extra API call needed) ────────────
        let email = '';
        if (tokens.id_token) {
            try {
                // id_token is a JWT — decode the payload (middle segment)
                const payloadB64 = tokens.id_token.split('.')[1];
                const decoded = JSON.parse(
                    Buffer.from(payloadB64, 'base64').toString('utf-8')
                );
                email = decoded.email ?? '';
            } catch {
                // non-fatal — email display is cosmetic only
            }
        }

        await dbConnect();

        // Upsert — there is always only one document in this collection
        await GoogleToken.findOneAndUpdate(
            {},
            {
                accessToken: tokens.access_token!,
                refreshToken: tokens.refresh_token,
                expiresAt: tokens.expiry_date ?? Date.now() + 3600 * 1000,
                email,
            },
            { upsert: true, new: true }
        );

        return NextResponse.redirect(new URL('/admin?google=connected', req.url));
    } catch (err) {
        console.error('Google OAuth callback error:', err);
        return NextResponse.redirect(new URL('/admin?google=error', req.url));
    }
}
