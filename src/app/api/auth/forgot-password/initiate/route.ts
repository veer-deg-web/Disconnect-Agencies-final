import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { sendOtpEmail, sendPasswordResetEmail } from '@/lib/email';

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
      return NextResponse.json({ error: 'Email or phone number is required' }, { status: 400 });
    }

    const isEmail = identifier.includes('@');
    const user = isEmail
      ? await User.findOne({ email: identifier.toLowerCase().trim() })
      : await User.findOne({ phone: identifier.trim() });

    if (!user) {
      return NextResponse.json({ error: 'No account found with this identifier' }, { status: 404 });
    }

    const otpLength = isEmail ? 6 : 4;
    const otp = generateOtp(otpLength);
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.forgotPasswordOtp = otp;
    user.forgotPasswordOtpExpiry = expiry;
    user.forgotPasswordIdentifier = identifier.trim();
    await user.save();

    if (isEmail) {
      await sendPasswordResetEmail(user.email, otp);
    }
    // Phone OTP (SMS) would go here if SMS provider is configured

    return NextResponse.json({ message: `OTP sent to your ${isEmail ? 'email' : 'phone'}` });
  } catch (error: any) {
    console.error('Forgot password initiate error:', error);
    const msg: string = error?.message || 'Internal server error';
    const isDb = msg.toLowerCase().includes('whitelist') || msg.toLowerCase().includes('connect') || msg.toLowerCase().includes('atlas');
    return NextResponse.json({ error: isDb ? 'Database connection failed. Please try again shortly.' : msg }, { status: 500 });
  }
}
