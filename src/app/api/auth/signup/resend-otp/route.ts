export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { sanitizeInput } from '@/lib/sanitizer';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { sendOtpEmail } from '@/lib/email';
import { safeParseJson } from '@/lib/utils';
import { resendOtpSchema } from '@/lib/validations';
import { apiError, dbSafeError, ErrorCode } from '@/lib/apiErrors';

import crypto from 'crypto';

function generateOtp(length = 4): string {
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

    const parsed = resendOtpSchema.safeParse(rawBody);
    if (!parsed.success) {
      return apiError(ErrorCode.VALIDATION_ERROR, parsed.error.issues[0].message, 400);
    }

    const { email, type } = sanitizeInput(parsed.data);

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return apiError(ErrorCode.NOT_FOUND, 'User not found', 404);
    }

    const otpType = type || 'email';

    if (otpType === 'email') {
      if (user.emailVerified) {
        return apiError(ErrorCode.ALREADY_VERIFIED, 'Email already verified', 400);
      }
      const emailOtp = generateOtp(4);
      user.emailOtp = emailOtp;
      user.emailOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();
      await sendOtpEmail(email, emailOtp, 'New OTP – Disconnect Agencies');
      return NextResponse.json({ message: 'OTP resent to email' });
    }

    return apiError(ErrorCode.VALIDATION_ERROR, 'Invalid OTP type', 400);
  } catch (error: unknown) {
    console.error('Resend OTP error:', error);
    return dbSafeError(error);
  }
}
