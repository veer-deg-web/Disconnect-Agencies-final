import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { sanitizeInput } from '@/lib/sanitizer';
import { safeParseJson } from '@/lib/utils';
import { loginSchema } from '@/lib/validations';
import { apiError, dbSafeError, ErrorCode } from '@/lib/apiErrors';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const rawBody = await safeParseJson<unknown>(req);

    if (!rawBody) {
      return apiError(ErrorCode.INVALID_JSON, 'Invalid or empty request body', 400);
    }

    const parsed = loginSchema.safeParse(rawBody);
    if (!parsed.success) {
      return apiError(ErrorCode.VALIDATION_ERROR, parsed.error.issues[0].message, 400);
    }

    const { emailOrPhone, password } = sanitizeInput(parsed.data, ['password']);

    const isEmail = emailOrPhone.includes('@');
    const user = await User.findOne(
      isEmail ? { email: emailOrPhone.toLowerCase() } : { phone: emailOrPhone }
    );

    if (!user) {
      return apiError(ErrorCode.INVALID_CREDENTIALS, 'Invalid credentials', 401);
    }

    if (!user.emailVerified) {
      return apiError(ErrorCode.EMAIL_NOT_VERIFIED, 'Please verify your email before logging in', 401);
    }

    if (user.isSuspended) {
      return apiError(ErrorCode.ACCOUNT_SUSPENDED, 'Your account has been suspended. Please contact support.', 403);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return apiError(ErrorCode.INVALID_CREDENTIALS, 'Invalid credentials', 401);
    }

    const token = signToken({ userId: user._id.toString(), email: user.email, role: user.role ?? 'user' });

    return NextResponse.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role ?? 'user',
      },
    });
  } catch (error: unknown) {
    console.error('Login error:', error);
    return dbSafeError(error);
  }
}
