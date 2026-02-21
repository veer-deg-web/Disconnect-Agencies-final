import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { sendOtpEmail } from '@/lib/email';

function generateOtp(length = 4): string {
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
    const { email, type } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const otpType = type || 'email';

    if (otpType === 'email') {
      if (user.emailVerified) {
        return NextResponse.json({ error: 'Email already verified' }, { status: 400 });
      }
      const emailOtp = generateOtp(4);
      user.emailOtp = emailOtp;
      user.emailOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();
      await sendOtpEmail(email.trim(), emailOtp, 'New OTP – Disconnect Agencies');
      return NextResponse.json({ message: 'OTP resent to email' });
    }

    return NextResponse.json({ error: 'Invalid OTP type' }, { status: 400 });
  } catch (error: any) {
    console.error('Resend OTP error:', error);
    const msg: string = error?.message || 'Internal server error';
    const isDb = msg.toLowerCase().includes('whitelist') || msg.toLowerCase().includes('connect') || msg.toLowerCase().includes('atlas');
    return NextResponse.json({ error: isDb ? 'Database connection failed. Please try again shortly.' : msg }, { status: 500 });
  }
}
