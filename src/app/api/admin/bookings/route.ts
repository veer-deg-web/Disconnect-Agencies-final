import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { verifyAdminToken } from '@/lib/adminAuth';

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

    return NextResponse.json({ bookings });
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
    const { id, adminRemark, status } = (await req.json()) as {
      id: string;
      adminRemark?: string;
      status?: 'pending' | 'completed';
    };

    if (!id) {
      return NextResponse.json({ error: 'Booking id is required' }, { status: 400 });
    }

    const update: { adminRemark?: string; status?: 'pending' | 'completed' } = {};
    if (typeof adminRemark === 'string') update.adminRemark = adminRemark.trim();
    if (status && ['pending', 'completed'].includes(status)) update.status = status;

    await dbConnect();
    const booking = await Booking.findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean();
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    return NextResponse.json({ booking });
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
    const { id } = (await req.json()) as { id: string };
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
