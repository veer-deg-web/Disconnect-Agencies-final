export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { verifyAdminToken } from '@/lib/adminAuth';
import { safeParseJson } from '@/lib/utils';
import { adminUserPatchSchema, adminUserDeleteSchema } from '@/lib/validations';
import { apiError, dbSafeError, ErrorCode } from '@/lib/apiErrors';

export async function GET(req: NextRequest) {
  const auth = await verifyAdminToken(req);
  if (!auth.valid) return apiError(ErrorCode.UNAUTHORIZED, 'Unauthorized', 401);
  if (!auth.isAdmin) return apiError(ErrorCode.FORBIDDEN, 'Forbidden', 403);

  try {
    await dbConnect();
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    const adminCount = await User.countDocuments({ role: 'admin' });
    const userCount = await User.countDocuments({ role: 'user' });
    const totalCount = await User.countDocuments({});

    const response = NextResponse.json({ users, debug: { totalCount, adminCount, userCount } });
    if (auth.newToken) {
      response.headers.set('X-New-Token', auth.newToken);
    }
    return response;
  } catch (err: unknown) {
    console.error('Admin users list error:', err);
    return dbSafeError(err);
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await verifyAdminToken(req);
  if (!auth.valid) return apiError(ErrorCode.UNAUTHORIZED, 'Unauthorized', 401);
  if (!auth.isAdmin) return apiError(ErrorCode.FORBIDDEN, 'Forbidden', 403);

  try {
    await dbConnect();
    const rawBody = await safeParseJson<unknown>(req);
    if (!rawBody) {
      return apiError(ErrorCode.INVALID_JSON, 'Invalid or empty request body', 400);
    }

    const parsed = adminUserPatchSchema.safeParse(rawBody);
    if (!parsed.success) {
      return apiError(ErrorCode.VALIDATION_ERROR, parsed.error.issues[0].message, 400);
    }

    const { id, isVerified, isSuspended } = parsed.data;

    if (id === auth.userId && isSuspended === true) {
      return apiError(ErrorCode.VALIDATION_ERROR, 'You cannot suspend yourself', 400);
    }

    const update: { isVerified?: boolean; isSuspended?: boolean } = {};
    if (typeof isVerified === 'boolean') update.isVerified = isVerified;
    if (typeof isSuspended === 'boolean') update.isSuspended = isSuspended;

    const user = await User.findByIdAndUpdate(id, update, { new: true });
    if (!user) return apiError(ErrorCode.NOT_FOUND, 'User not found', 404);

    const response = NextResponse.json({ user });
    if (auth.newToken) {
      response.headers.set('X-New-Token', auth.newToken);
    }
    return response;
  } catch (err: unknown) {
    console.error('Admin user patch error:', err);
    return dbSafeError(err);
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await verifyAdminToken(req);
  if (!auth.valid) return apiError(ErrorCode.UNAUTHORIZED, 'Unauthorized', 401);
  if (!auth.isAdmin) return apiError(ErrorCode.FORBIDDEN, 'Forbidden', 403);

  try {
    await dbConnect();
    const rawBody = await safeParseJson<unknown>(req);
    if (!rawBody) {
      return apiError(ErrorCode.INVALID_JSON, 'Invalid or empty request body', 400);
    }

    const parsed = adminUserDeleteSchema.safeParse(rawBody);
    if (!parsed.success) {
      return apiError(ErrorCode.VALIDATION_ERROR, parsed.error.issues[0].message, 400);
    }

    const { id } = parsed.data;

    if (id === auth.userId) {
      return apiError(ErrorCode.VALIDATION_ERROR, 'You cannot delete yourself', 400);
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) return apiError(ErrorCode.NOT_FOUND, 'User not found', 404);

    const response = NextResponse.json({ message: 'User deleted' });
    if (auth.newToken) {
      response.headers.set('X-New-Token', auth.newToken);
    }
    return response;
  } catch (err: unknown) {
    console.error('Admin user delete error:', err);
    return dbSafeError(err);
  }
}
