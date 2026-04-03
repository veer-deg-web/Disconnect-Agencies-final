import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { verifyAdminToken } from '@/lib/adminAuth';
import { sanitizeInput } from '@/lib/sanitizer';
import { safeParseJson } from '@/lib/utils';
import { adminBookingUpdateSchema, adminBookingDeleteSchema } from '@/lib/validations';
import { apiError, dbSafeError, ErrorCode } from '@/lib/apiErrors';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await verifyAdminToken(req);
  if (!auth.valid) return apiError(ErrorCode.UNAUTHORIZED, 'Unauthorized', 401);
  if (!auth.isAdmin) return apiError(ErrorCode.FORBIDDEN, 'Forbidden', 403);

  try {
    await dbConnect();
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    const response = NextResponse.json({ bookings });
    if (auth.newToken) {
      response.headers.set('X-New-Token', auth.newToken);
    }
    return response;
  } catch (err: unknown) {
    console.error('Admin bookings list error:', err);
    return dbSafeError(err);
  }
}

export async function PUT(req: NextRequest) {
  const auth = await verifyAdminToken(req);
  if (!auth.valid) return apiError(ErrorCode.UNAUTHORIZED, 'Unauthorized', 401);
  if (!auth.isAdmin) return apiError(ErrorCode.FORBIDDEN, 'Forbidden', 403);

  try {
    const rawBody = await safeParseJson<unknown>(req);
    if (!rawBody) {
      return apiError(ErrorCode.INVALID_JSON, 'Invalid or empty request body', 400);
    }

    const parsed = adminBookingUpdateSchema.safeParse(rawBody);
    if (!parsed.success) {
      return apiError(ErrorCode.VALIDATION_ERROR, parsed.error.issues[0].message, 400);
    }

    const { id, adminRemark, status } = sanitizeInput(parsed.data);

    const update: { adminRemark?: string; status?: 'pending' | 'completed' } = {};
    if (typeof adminRemark === 'string') update.adminRemark = adminRemark;
    if (status && ['pending', 'completed'].includes(status)) update.status = status;

    await dbConnect();
    const booking = await Booking.findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean();
    if (!booking) return apiError(ErrorCode.NOT_FOUND, 'Booking not found', 404);

    const response = NextResponse.json({ booking });
    if (auth.newToken) {
      response.headers.set('X-New-Token', auth.newToken);
    }
    return response;
  } catch (err: unknown) {
    console.error('Admin booking update error:', err);
    return dbSafeError(err);
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await verifyAdminToken(req);
  if (!auth.valid) return apiError(ErrorCode.UNAUTHORIZED, 'Unauthorized', 401);
  if (!auth.isAdmin) return apiError(ErrorCode.FORBIDDEN, 'Forbidden', 403);

  try {
    const rawBody = await safeParseJson<unknown>(req);
    if (!rawBody) {
      return apiError(ErrorCode.INVALID_JSON, 'Invalid or empty request body', 400);
    }

    const parsed = adminBookingDeleteSchema.safeParse(rawBody);
    if (!parsed.success) {
      return apiError(ErrorCode.VALIDATION_ERROR, parsed.error.issues[0].message, 400);
    }

    const { id } = parsed.data;

    await dbConnect();
    const booking = await Booking.findByIdAndDelete(id).lean();
    if (!booking) return apiError(ErrorCode.NOT_FOUND, 'Booking not found', 404);

    return NextResponse.json({ message: 'Booking deleted' });
  } catch (err: unknown) {
    console.error('Admin booking delete error:', err);
    return dbSafeError(err);
  }
}
