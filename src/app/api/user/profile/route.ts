import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';

import { uploadToCloudinary } from '../../../../lib/cloudinary';
import { sanitizeInput } from '@/lib/sanitizer';
export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

        await dbConnect();
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user }, { status: 200 });
    } catch (error: unknown) {
        console.error('Get Profile Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

        const rawBody = await req.json();
        const body = sanitizeInput(rawBody);
        const { name, avatar } = body;

        await dbConnect();

        const user = await User.findById(decoded.userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (name) user.name = name;
        
        if (avatar !== undefined) {
          if (avatar && avatar.startsWith('data:image/')) {
            // It's a base64 image, upload to Cloudinary
            const uploadResult = await uploadToCloudinary(avatar, 'avatars');
            user.avatar = uploadResult.secure_url;
          } else {
            user.avatar = avatar; // Could be a URL or an empty string
          }
        }

        await user.save();

        return NextResponse.json(
            { message: 'Profile updated successfully', user: { name: user.name, avatar: user.avatar, email: user.email, isVerified: user.isVerified } },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error('Update Profile Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
