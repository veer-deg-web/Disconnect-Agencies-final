import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CareerApplication from '@/models/CareerApplication';
import { verifyAdminToken } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await verifyAdminToken(req);
  if (!auth.valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!auth.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    await dbConnect();
    const applications = await CareerApplication.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ applications });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to load applications' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = await verifyAdminToken(req);
  if (!auth.valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!auth.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { id, status } = (await req.json()) as {
      id: string;
      status: 'pending' | 'accepted' | 'rejected';
    };

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 });
    }

    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await dbConnect();
    const application = await CareerApplication.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true, runValidators: true }
    ).lean();

    if (!application) return NextResponse.json({ error: 'Application not found' }, { status: 404 });

    return NextResponse.json({ application });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update application' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await verifyAdminToken(req);
  if (!auth.valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!auth.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    console.log('Attempting to delete application with ID (query param):', id);

    if (!id) {
      console.error('Deletion failed: ID is missing in query params');
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }

    await dbConnect();
    const application = await CareerApplication.findByIdAndDelete(id).lean();
    if (!application) {
      console.warn('Deletion failed: Application not found with ID:', id);
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    console.log('Application deleted successfully:', id);
    return NextResponse.json({ message: 'Application deleted successfully' });
  } catch (err: any) {
    console.error('Career application DELETE error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to delete application' }, { status: 500 });
  }
}
