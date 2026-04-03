import { NextResponse } from 'next/server';
import { getAuthToken, verifyAndRotateToken } from '@/lib/auth';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { uploadToCloudinary } from '../../../../lib/cloudinary';
import { sanitizeInput } from '@/lib/sanitizer';
import { safeParseJson } from '@/lib/utils';
import { profileUpdateSchema } from '@/lib/validations';
import { apiError, dbSafeError, ErrorCode } from '@/lib/apiErrors';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const token = getAuthToken(req);
    if (!token) {
      return apiError(ErrorCode.UNAUTHORIZED, 'Unauthorized', 401);
    }

    const { payload: decoded, newToken, error: authError } = verifyAndRotateToken(token);
    if (!decoded) {
      return apiError(ErrorCode.UNAUTHORIZED, authError || 'Unauthorized', 401);
    }

    await dbConnect();
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return apiError(ErrorCode.NOT_FOUND, 'User not found', 404);
    }

    const response = NextResponse.json({ user }, { status: 200 });
    if (newToken) {
      response.headers.set('X-New-Token', newToken);
    }
    return response;
  } catch (error: unknown) {
    console.error('Get Profile Error:', error);
    return dbSafeError(error);
  }
}

export async function PUT(req: Request) {
  try {
    const token = getAuthToken(req);
    if (!token) {
      return apiError(ErrorCode.UNAUTHORIZED, 'Unauthorized', 401);
    }

    const { payload: decoded, newToken, error: authError } = verifyAndRotateToken(token);
    if (!decoded) {
      return apiError(ErrorCode.UNAUTHORIZED, authError || 'Unauthorized', 401);
    }

    const rawBody = await safeParseJson<unknown>(req);
    if (!rawBody) {
      return apiError(ErrorCode.INVALID_JSON, 'Invalid or empty request body', 400);
    }

    const parsed = profileUpdateSchema.safeParse(rawBody);
    if (!parsed.success) {
      return apiError(ErrorCode.VALIDATION_ERROR, parsed.error.issues[0].message, 400);
    }

    const body = sanitizeInput(parsed.data);
    const { name, avatar } = body;

    await dbConnect();

    const user = await User.findById(decoded.userId);
    if (!user) {
      return apiError(ErrorCode.NOT_FOUND, 'User not found', 404);
    }

    if (name) user.name = name;

    if (avatar !== undefined) {
      if (avatar && avatar.startsWith('data:image/')) {
        const uploadResult = await uploadToCloudinary(avatar, 'avatars');
        user.avatar = uploadResult.secure_url;
      } else {
        user.avatar = avatar;
      }
    }

    await user.save();

    const response = NextResponse.json(
      { message: 'Profile updated successfully', user: { name: user.name, avatar: user.avatar, email: user.email, isVerified: user.isVerified } },
      { status: 200 },
    );
    if (newToken) {
      response.headers.set('X-New-Token', newToken);
    }
    return response;
  } catch (error: unknown) {
    console.error('Update Profile Error:', error);
    return dbSafeError(error);
  }
}
