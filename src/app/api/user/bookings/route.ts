import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import User from '@/models/User';
import { getAuthToken, verifyAndRotateToken } from '@/lib/auth';
import { apiError, dbSafeError, ErrorCode } from '@/lib/apiErrors';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const token = getAuthToken(req);
    if (!token) {
      return apiError(ErrorCode.UNAUTHORIZED, 'Unauthorized', 401);
    }

    const { payload: decoded, newToken } = verifyAndRotateToken(token);
    if (!decoded) {
      return apiError(ErrorCode.UNAUTHORIZED, 'Unauthorized', 401);
    }

    await dbConnect();

    const user = await User.findById(decoded.userId).select('email');
    if (!user) {
      return apiError(ErrorCode.NOT_FOUND, 'User not found', 404);
    }

    const bookings = await Booking.find({ email: user.email }).sort({ createdAt: -1 });

    const response = NextResponse.json({ bookings }, { status: 200 });
    if (newToken) {
      response.headers.set('X-New-Token', newToken);
    }
    return response;
  } catch (error: unknown) {
    console.error('Fetch User Bookings Error:', error);
    return dbSafeError(error);
  }
}
