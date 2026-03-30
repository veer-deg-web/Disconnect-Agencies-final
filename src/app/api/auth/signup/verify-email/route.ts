import { NextRequest, NextResponse } from 'next/server';
import { sanitizeInput } from '@/lib/sanitizer';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const rawBody = await req.json();
    const { email, emailOtp } = sanitizeInput(rawBody);

    if (!email || !emailOtp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: 'Email already verified' }, { status: 400 });
    }

    if (!user.emailOtp || user.emailOtp !== emailOtp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    if (!user.emailOtpExpiry || new Date() > user.emailOtpExpiry) {
      return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 });
    }

    user.emailVerified = true;
    user.emailOtp = undefined;
    user.emailOtpExpiry = undefined;
    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

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
    const msg: string = (error as Error)?.message || 'Internal server error';
    const isDb = msg.toLowerCase().includes('whitelist') || msg.toLowerCase().includes('connect') || msg.toLowerCase().includes('atlas');
    return NextResponse.json({ error: isDb ? 'Database connection failed. Please try again shortly.' : msg }, { status: 500 });
  }
}
