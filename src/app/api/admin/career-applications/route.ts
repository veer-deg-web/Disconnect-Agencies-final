import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CareerApplication from '@/models/CareerApplication';
import { verifyAdminToken } from '@/lib/adminAuth';
import { sanitizeInput } from '@/lib/sanitizer';
import { safeParseJson } from '@/lib/utils';
import { adminCareerUpdateSchema } from '@/lib/validations';
import { apiError, dbSafeError, ErrorCode } from '@/lib/apiErrors';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await verifyAdminToken(req);
  if (!auth.valid) return apiError(ErrorCode.UNAUTHORIZED, 'Unauthorized', 401);
  if (!auth.isAdmin) return apiError(ErrorCode.FORBIDDEN, 'Forbidden', 403);

  try {
    await dbConnect();
    const applications = await CareerApplication.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ applications });
  } catch (err: unknown) {
    console.error('Admin career applications list error:', err);
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

    const parsed = adminCareerUpdateSchema.safeParse(rawBody);
    if (!parsed.success) {
      return apiError(ErrorCode.VALIDATION_ERROR, parsed.error.issues[0].message, 400);
    }

    const { id, status } = parsed.data;

    await dbConnect();
    const application = await CareerApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    ).lean();

    if (!application) return apiError(ErrorCode.NOT_FOUND, 'Application not found', 404);

    return NextResponse.json({ application });
  } catch (err: unknown) {
    console.error('Admin career application update error:', err);
    return dbSafeError(err);
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await verifyAdminToken(req);
  if (!auth.valid) return apiError(ErrorCode.UNAUTHORIZED, 'Unauthorized', 401);
  if (!auth.isAdmin) return apiError(ErrorCode.FORBIDDEN, 'Forbidden', 403);

  try {
    const { searchParams } = new URL(req.url);
    const id = sanitizeInput(searchParams.get('id'));

    if (!id) {
      return apiError(ErrorCode.VALIDATION_ERROR, 'Application ID is required', 400);
    }

    await dbConnect();
    const application = await CareerApplication.findByIdAndDelete(id).lean();
    if (!application) {
      return apiError(ErrorCode.NOT_FOUND, 'Application not found', 404);
    }

    return NextResponse.json({ message: 'Application deleted successfully' });
  } catch (err: unknown) {
    console.error('Admin career application delete error:', err);
    return dbSafeError(err);
  }
}
