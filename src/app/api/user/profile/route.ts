import { NextResponse } from 'next/server';
import { getAuthToken, verifyAndRotateToken } from '@/lib/auth';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';

import { uploadToCloudinary } from '../../../../lib/cloudinary';
import { sanitizeInput } from '@/lib/sanitizer';
export const dynamic = 'force-dynamic';



export async function GET(req: Request) {
    try {
        const token = getAuthToken(req);
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { payload: decoded, newToken, error: authError } = verifyAndRotateToken(token);
        if (!decoded) {
            return NextResponse.json({ error: authError || 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const response = NextResponse.json({ user }, { status: 200 });
        if (newToken) {
            response.headers.set('X-New-Token', newToken);
        }
        return response;
    } catch (error: unknown) {
        console.error('Get Profile Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const token = getAuthToken(req);
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { payload: decoded, newToken, error: authError } = verifyAndRotateToken(token);
        if (!decoded) {
            return NextResponse.json({ error: authError || 'Unauthorized' }, { status: 401 });
        }

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

        const response = NextResponse.json(
            { message: 'Profile updated successfully', user: { name: user.name, avatar: user.avatar, email: user.email, isVerified: user.isVerified } },
            { status: 200 }
        );
        if (newToken) {
            response.headers.set('X-New-Token', newToken);
        }
        return response;
    } catch (error: unknown) {
        console.error('Update Profile Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
