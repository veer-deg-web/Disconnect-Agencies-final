import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../../lib/mongodb';
import Booking from '../../../../models/Booking';
import User from '../../../../models/User';
export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-here';

function verifyUser(req: Request) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Unauthorized');
    }

    const token = authHeader.split(' ')[1];
    return jwt.verify(token, JWT_SECRET) as { userId: string; email?: string };
}

export async function GET(req: Request) {
    try {
        const decoded = verifyUser(req);
        await dbConnect();

        // Need the user object to get their email accurately
        const user = await User.findById(decoded.userId).select('email');
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const bookings = await Booking.find({ email: user.email }).sort({ createdAt: -1 });

        return NextResponse.json({ bookings }, { status: 200 });
    } catch (error: unknown) {
        const err = error as Error;
        if (err.message === 'Unauthorized') {
            return NextResponse.json({ error: err.message }, { status: 401 });
        }
        console.error('Fetch User Bookings Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
