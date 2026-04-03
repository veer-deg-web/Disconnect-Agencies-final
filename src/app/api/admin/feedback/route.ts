export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Feedback from '@/models/Feedback';
import { verifyAdminToken } from '@/lib/adminAuth';
import { sanitizeInput } from '@/lib/sanitizer';
import { safeParseJson } from '@/lib/utils';
import { adminFeedbackUpdateSchema, adminFeedbackDeleteSchema } from '@/lib/validations';
import { apiError, dbSafeError, ErrorCode } from '@/lib/apiErrors';

export async function GET(req: NextRequest) {
  const auth = await verifyAdminToken(req);
  if (!auth.valid) return apiError(ErrorCode.UNAUTHORIZED, 'Unauthorized', 401);
  if (!auth.isAdmin) return apiError(ErrorCode.FORBIDDEN, 'Forbidden', 403);

  try {
    await dbConnect();
    const feedbacks = await Feedback.find()
      .populate('user', 'name email avatar isVerified')
      .sort({ createdAt: -1 });

    return NextResponse.json({ feedbacks }, { status: 200 });
  } catch (err: unknown) {
    console.error('Admin feedback list error:', err);
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

    const parsed = adminFeedbackUpdateSchema.safeParse(rawBody);
    if (!parsed.success) {
      return apiError(ErrorCode.VALIDATION_ERROR, parsed.error.issues[0].message, 400);
    }

    const body = sanitizeInput(parsed.data);

    await dbConnect();

    const updateData: Record<string, unknown> = {};
    if (typeof body.isTestimonial === 'boolean') updateData.isTestimonial = body.isTestimonial;
    if (typeof body.isFeatured === 'boolean') updateData.isFeatured = body.isFeatured;
    if (body.category !== undefined) updateData.category = body.category;

    if (Object.keys(updateData).length === 0) {
      return apiError(ErrorCode.VALIDATION_ERROR, 'No fields to update', 400);
    }

    const feedback = await Feedback.findByIdAndUpdate(body.id, updateData, { new: true })
      .populate('user', 'name email avatar isVerified');

    if (!feedback) {
      return apiError(ErrorCode.NOT_FOUND, 'Feedback not found', 404);
    }

    return NextResponse.json({ feedback }, { status: 200 });
  } catch (err: unknown) {
    console.error('Admin feedback update error:', err);
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

    const parsed = adminFeedbackDeleteSchema.safeParse(rawBody);
    if (!parsed.success) {
      return apiError(ErrorCode.VALIDATION_ERROR, parsed.error.issues[0].message, 400);
    }

    const { id } = parsed.data;

    await dbConnect();

    const deleted = await Feedback.findByIdAndDelete(id);
    if (!deleted) {
      return apiError(ErrorCode.NOT_FOUND, 'Feedback not found', 404);
    }

    return NextResponse.json({ message: 'Feedback deleted successfully' }, { status: 200 });
  } catch (err: unknown) {
    console.error('Admin feedback delete error:', err);
    return dbSafeError(err);
  }
}
