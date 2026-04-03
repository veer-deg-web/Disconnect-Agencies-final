export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { sanitizeInput } from '@/lib/sanitizer';
import { sendOtpEmail } from '@/lib/email';
import { safeParseJson } from '@/lib/utils';
import { signupInitiateSchema } from '@/lib/validations';
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

    const parsed = signupInitiateSchema.safeParse(rawBody);
    if (!parsed.success) {
      return apiError(ErrorCode.VALIDATION_ERROR, parsed.error.issues[0].message, 400);
    }

    const { name, email, phone, password } = sanitizeInput(parsed.data, ['password']);

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser && existingUser.emailVerified) {
      return apiError(ErrorCode.CONFLICT, 'Email is already registered', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const emailOtp = generateOtp(4);
    const emailOtpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (existingUser) {
      existingUser.name = name;
      existingUser.phone = phone;
      existingUser.password = hashedPassword;
      existingUser.emailOtp = emailOtp;
      existingUser.emailOtpExpiry = emailOtpExpiry;
      existingUser.emailVerified = false;
      await existingUser.save();
    } else {
      await User.create({
        name,
        email: email.toLowerCase(),
        phone,
        password: hashedPassword,
        emailVerified: false,
        phoneVerified: false,
        emailOtp,
        emailOtpExpiry,
      });
    }

    await sendOtpEmail(email, emailOtp, 'Verify Your Email – Disconnect Agencies');

    return NextResponse.json({ message: 'OTP sent to your email. Please verify.' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Signup initiate error:', error);
    return dbSafeError(error);
  }
}
