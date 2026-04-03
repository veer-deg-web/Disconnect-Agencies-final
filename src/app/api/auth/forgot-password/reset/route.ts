export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { sanitizeInput } from '@/lib/sanitizer';
import { safeParseJson } from '@/lib/utils';
import { forgotPasswordResetSchema } from '@/lib/validations';
import { apiError, dbSafeError, ErrorCode } from '@/lib/apiErrors';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const rawBody = await safeParseJson<unknown>(req);

    if (!rawBody) {
      return apiError(ErrorCode.INVALID_JSON, 'Invalid or empty request body', 400);
    }

    const parsed = forgotPasswordResetSchema.safeParse(rawBody);
    if (!parsed.success) {
      return apiError(ErrorCode.VALIDATION_ERROR, parsed.error.issues[0].message, 400);
    }

    const { identifier, otp, newPassword } = sanitizeInput(parsed.data, ['newPassword']);

    const isEmail = identifier.includes('@');
    const user = isEmail
      ? await User.findOne({ email: identifier.toLowerCase() })
      : await User.findOne({ phone: identifier });

    if (!user) {
      return apiError(ErrorCode.NOT_FOUND, 'User not found', 404);
    }

    if (!user.forgotPasswordOtp || user.forgotPasswordOtp !== otp) {
      return apiError(ErrorCode.INVALID_OTP, 'Invalid OTP', 400);
    }

    if (!user.forgotPasswordOtpExpiry || new Date() > user.forgotPasswordOtpExpiry) {
      return apiError(ErrorCode.OTP_EXPIRED, 'OTP has expired. Please request a new one.', 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.forgotPasswordOtp = undefined;
    user.forgotPasswordOtpExpiry = undefined;
    user.forgotPasswordIdentifier = undefined;
    await user.save();

    return NextResponse.json({ message: 'Password reset successfully' });
  } catch (error: unknown) {
    console.error('Reset password error:', error);
    return dbSafeError(error);
  }
}
