import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { verifyAdminToken } from '@/lib/adminAuth';
import { sanitizeInput } from '@/lib/sanitizer';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await verifyAdminToken(req);
  if (!auth.valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!auth.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

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
    const message = err instanceof Error ? err.message : 'Failed to load bookings';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = await verifyAdminToken(req);
  if (!auth.valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!auth.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const rawBody = await req.json();
    const { id, adminRemark, status } = sanitizeInput(rawBody) as {
      id: string;
      adminRemark?: string;
      status?: 'pending' | 'completed';
    };

    if (!id) {
      return NextResponse.json({ error: 'Booking id is required' }, { status: 400 });
    }

    const update: { adminRemark?: string; status?: 'pending' | 'completed' } = {};
    if (typeof adminRemark === 'string') update.adminRemark = adminRemark;
    if (status && ['pending', 'completed'].includes(status)) update.status = status;

    await dbConnect();
    const booking = await Booking.findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean();
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    const response = NextResponse.json({ booking });
    if (auth.newToken) {
      response.headers.set('X-New-Token', auth.newToken);
    }
    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update booking';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await verifyAdminToken(req);
  if (!auth.valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!auth.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const rawBody = await req.json();
    const { id } = sanitizeInput(rawBody) as { id: string };
    if (!id) return NextResponse.json({ error: 'Booking id is required' }, { status: 400 });

    await dbConnect();
    const booking = await Booking.findByIdAndDelete(id).lean();
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    return NextResponse.json({ message: 'Booking deleted' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete booking';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
