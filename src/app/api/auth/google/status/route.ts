import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import GoogleToken from '@/models/GoogleToken';

/**
 * GET /api/auth/google/status
 *
 * Public-ish: returns whether a Google token is stored in the DB.
 * Used by the admin UI to show connected / not-connected state.
 */
export async function GET() {
    try {
        await dbConnect();
        const token = await GoogleToken.findOne().lean();

        if (!token) {
            return NextResponse.json({ connected: false });
        }

        return NextResponse.json({
            connected: true,
            email: token.email || '(unknown)',
        });
    } catch (err) {
        console.error('Google status check error:', err);
        return NextResponse.json({ connected: false });
    }
}
