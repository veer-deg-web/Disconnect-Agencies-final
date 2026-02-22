import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { sendPasswordResetEmail } from '@/lib/email';

function generateOtp(length = 6): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { identifier } = await req.json();

    if (!identifier) {
      return NextResponse.json({ error: 'Identifier is required' }, { status: 400 });
    }

    const isEmail = identifier.includes('@');
    const user = isEmail
      ? await User.findOne({ email: identifier.toLowerCase().trim() })
      : await User.findOne({ phone: identifier.trim() });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
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
  } catch (error: any) {
    console.error('Resend forgot password OTP error:', error);
    const msg: string = error?.message || 'Internal server error';
    const isDb = msg.toLowerCase().includes('whitelist') || msg.toLowerCase().includes('connect') || msg.toLowerCase().includes('atlas');
    return NextResponse.json({ error: isDb ? 'Database connection failed. Please try again shortly.' : msg }, { status: 500 });
  }
}
