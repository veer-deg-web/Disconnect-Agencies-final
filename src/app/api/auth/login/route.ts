import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { sanitizeInput } from '@/lib/sanitizer';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const rawBody = await req.json();
    const { emailOrPhone, password } = sanitizeInput(rawBody, ['password']);

    if (!emailOrPhone || !password) {
      return NextResponse.json({ error: 'Email/Phone and password are required' }, { status: 400 });
    }

    const isEmail = emailOrPhone.includes('@');
    const user = await User.findOne(
      isEmail ? { email: emailOrPhone.toLowerCase() } : { phone: emailOrPhone }
    );

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (!user.emailVerified) {
      return NextResponse.json({ error: 'Please verify your email before logging in' }, { status: 401 });
    }

    if (user.isSuspended) {
      return NextResponse.json({ error: 'Your account has been suspended. Please contact support.' }, { status: 403 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signToken({userId: user._id.toString(), email: user.email, role: user.role ?? 'user'});

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
    const msg: string = (error as Error)?.message || 'Internal server error';
    const isDb = msg.toLowerCase().includes('whitelist') || msg.toLowerCase().includes('connect') || msg.toLowerCase().includes('atlas');
    return NextResponse.json({ error: isDb ? 'Database connection failed. Please try again shortly.' : msg }, { status: 500 });
  }
}
