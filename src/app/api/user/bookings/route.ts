import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import User from '@/models/User';
import { getAuthToken, verifyAndRotateToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const token = getAuthToken(req);
        if (!token || !token.startsWith('Bearer ')) {
            // getAuthToken in auth.ts handles 'Bearer ' prefixing already
        }
        
        const authToken = token || '';
        const { payload: decoded, newToken } = verifyAndRotateToken(authToken);
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await dbConnect();

        // Need the user object to get their email accurately
        const user = await User.findById(decoded.userId).select('email');
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const bookings = await Booking.find({ email: user.email }).sort({ createdAt: -1 });

        const response = NextResponse.json({ bookings }, { status: 200 });
        if (newToken) {
            response.headers.set('X-New-Token', newToken);
        }
        return response;
    } catch (error: unknown) {
        console.error('Fetch User Bookings Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
