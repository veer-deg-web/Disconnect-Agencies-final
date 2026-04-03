export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { sanitizeInput } from '@/lib/sanitizer';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { sendPasswordResetEmail } from '@/lib/email';
import { safeParseJson } from '@/lib/utils';
import { forgotPasswordResendOtpSchema } from '@/lib/validations';
import { apiError, dbSafeError, ErrorCode } from '@/lib/apiErrors';

import crypto from 'crypto';

function generateOtp(length = 6): string {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += crypto.randomInt(0, 10).toString();
  }
  return otp;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const rawBody = await safeParseJson<unknown>(req);

    if (!rawBody) {
      return apiError(ErrorCode.INVALID_JSON, 'Invalid or empty request body', 400);
    }

    const parsed = forgotPasswordResendOtpSchema.safeParse(rawBody);
    if (!parsed.success) {
      return apiError(ErrorCode.VALIDATION_ERROR, parsed.error.issues[0].message, 400);
    }

    const { identifier } = sanitizeInput(parsed.data);

    const isEmail = identifier.includes('@');
    const user = isEmail
      ? await User.findOne({ email: identifier.toLowerCase() })
      : await User.findOne({ phone: identifier });

    if (!user) {
      return apiError(ErrorCode.NOT_FOUND, 'User not found', 404);
    }

    const otpLength = isEmail ? 6 : 4;
    const otp = generateOtp(otpLength);
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    user.forgotPasswordOtp = otp;
    user.forgotPasswordOtpExpiry = expiry;
    await user.save();

    if (isEmail) {
      await sendPasswordResetEmail(user.email, otp);
    }

    return NextResponse.json({ message: `OTP resent to your ${isEmail ? 'email' : 'phone'}` });
  } catch (error: unknown) {
    console.error('Resend forgot password OTP error:', error);
    return dbSafeError(error);
  }
}
