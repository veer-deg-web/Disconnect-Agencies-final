import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Feedback from '@/models/Feedback';
import { verifyAdminToken } from '@/lib/adminAuth';
import { sanitizeInput } from '@/lib/sanitizer';

export async function GET(req: NextRequest) {
  const auth = await verifyAdminToken(req);
  if (!auth.valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!auth.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    await dbConnect();
    const feedbacks = await Feedback.find()
      .populate('user', 'name email avatar isVerified')
      .sort({ createdAt: -1 });

    return NextResponse.json({ feedbacks }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = await verifyAdminToken(req);
  if (!auth.valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!auth.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const rawBody = await req.json();
    const { id, isTestimonial, isFeatured, category } = sanitizeInput(rawBody);

    if (!id) {
      return NextResponse.json({ error: 'Feedback ID is required' }, { status: 400 });
    }

    await dbConnect();

    const updateData: Record<string, unknown> = {};
    if (typeof isTestimonial === 'boolean') updateData.isTestimonial = isTestimonial;
    if (typeof isFeatured === 'boolean') updateData.isFeatured = isFeatured;
    if (category !== undefined) updateData.category = category;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const feedback = await Feedback.findByIdAndUpdate(id, updateData, { new: true })
      .populate('user', 'name email avatar isVerified');

    if (!feedback) {
      return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
    }

    return NextResponse.json({ feedback }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await verifyAdminToken(req);
  if (!auth.valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!auth.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Feedback ID is required' }, { status: 400 });
    }

    await dbConnect();

    const deleted = await Feedback.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Feedback deleted successfully' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
