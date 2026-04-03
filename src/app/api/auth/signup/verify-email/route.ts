export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { sanitizeInput } from '@/lib/sanitizer';
import { signToken } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { safeParseJson } from '@/lib/utils';
import { verifyEmailSchema } from '@/lib/validations';
import { apiError, dbSafeError, ErrorCode } from '@/lib/apiErrors';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const rawBody = await safeParseJson<unknown>(req);

    if (!rawBody) {
      return apiError(ErrorCode.INVALID_JSON, 'Invalid or empty request body', 400);
    }

    const parsed = verifyEmailSchema.safeParse(rawBody);
    if (!parsed.success) {
      return apiError(ErrorCode.VALIDATION_ERROR, parsed.error.issues[0].message, 400);
    }

    const { email, emailOtp } = sanitizeInput(parsed.data);

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return apiError(ErrorCode.NOT_FOUND, 'User not found', 404);
    }

    if (user.emailVerified) {
      return apiError(ErrorCode.ALREADY_VERIFIED, 'Email already verified', 400);
    }

    if (!user.emailOtp || user.emailOtp !== emailOtp) {
      return apiError(ErrorCode.INVALID_OTP, 'Invalid OTP', 400);
    }

    if (!user.emailOtpExpiry || new Date() > user.emailOtpExpiry) {
      return apiError(ErrorCode.OTP_EXPIRED, 'OTP has expired. Please request a new one.', 400);
    }

    user.emailVerified = true;
    user.emailOtp = undefined;
    user.emailOtpExpiry = undefined;
    await user.save();

    const token = signToken({ userId: user._id.toString(), email: user.email, role: user.role ?? 'user' });

    return NextResponse.json({
      message: 'Email verified successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error: unknown) {
    console.error('Email verify error:', error);
    return dbSafeError(error);
  }
}
