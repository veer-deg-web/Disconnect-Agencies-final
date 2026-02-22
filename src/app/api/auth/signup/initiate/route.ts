import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
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
    const { name, email, phone, password } = await req.json();

    if (!name || !email || !phone || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser && existingUser.emailVerified) {
      return NextResponse.json({ error: 'Email is already registered' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const emailOtp = generateOtp(4);
    const emailOtpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (existingUser) {
      // Update existing unverified user
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
        email: email.toLowerCase().trim(),
        phone,
        password: hashedPassword,
        emailVerified: false,
        phoneVerified: false,
        emailOtp,
        emailOtpExpiry,
      });
    }

    await sendOtpEmail(email.trim(), emailOtp, 'Verify Your Email – Disconnect Agencies');

    return NextResponse.json({ message: 'OTP sent to your email. Please verify.' }, { status: 200 });
  } catch (error: any) {
    console.error('Signup initiate error:', error);
    const msg: string = error?.message || 'Internal server error';
    const isDbError = msg.toLowerCase().includes('whitelist') ||
      msg.toLowerCase().includes('ip') ||
      msg.toLowerCase().includes('atlas') ||
      msg.toLowerCase().includes('connect');
    return NextResponse.json(
      { error: isDbError ? 'Database connection failed. Please try again shortly.' : msg },
      { status: 500 }
    );
  }
}
