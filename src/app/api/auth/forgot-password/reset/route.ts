import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { identifier, otp, newPassword } = await req.json();

    if (!identifier || !otp || !newPassword) {
      return NextResponse.json({ error: 'Identifier, OTP and new password are required' }, { status: 400 });
    }

    const isEmail = identifier.includes('@');
    const user = isEmail
      ? await User.findOne({ email: identifier.toLowerCase().trim() })
      : await User.findOne({ phone: identifier.trim() });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.forgotPasswordOtp || user.forgotPasswordOtp !== otp.trim()) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    if (!user.forgotPasswordOtpExpiry || new Date() > user.forgotPasswordOtpExpiry) {
      return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.forgotPasswordOtp = undefined;
    user.forgotPasswordOtpExpiry = undefined;
    user.forgotPasswordIdentifier = undefined;
    await user.save();

    return NextResponse.json({ message: 'Password reset successfully' });
  } catch (error: any) {
    console.error('Reset password error:', error);
    const msg: string = error?.message || 'Internal server error';
    const isDb = msg.toLowerCase().includes('whitelist') || msg.toLowerCase().includes('connect') || msg.toLowerCase().includes('atlas');
    return NextResponse.json({ error: isDb ? 'Database connection failed. Please try again shortly.' : msg }, { status: 500 });
  }
}
