import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-here';

async function verifyAdmin(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Unauthorized');
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== 'admin') {
        throw new Error('Forbidden');
    }
    return decoded;
}

export async function GET(req: NextRequest) {
    try {
        await verifyAdmin(req);
        await dbConnect();
        const users = await User.find({}).sort({ createdAt: -1 });
        const adminCount = await User.countDocuments({ role: 'admin' });
        const userCount = await User.countDocuments({ role: 'user' });
        const totalCount = await User.countDocuments({});

        console.log(`Admin Users API - Total: ${totalCount}, Admins: ${adminCount}, Users: ${userCount}`);
        return NextResponse.json({ users, debug: { totalCount, adminCount, userCount } });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const decoded = await verifyAdmin(req);
        await dbConnect();
        const { id, isVerified, isSuspended } = await req.json();

        if (id === decoded.userId && isSuspended === true) {
            return NextResponse.json({ error: 'You cannot suspend yourself' }, { status: 400 });
        }

        const update: any = {};
        if (typeof isVerified === 'boolean') update.isVerified = isVerified;
        if (typeof isSuspended === 'boolean') update.isSuspended = isSuspended;

        console.log(`Admin Users API - Updating user ${id}:`, update);
        const user = await User.findByIdAndUpdate(id, update, { new: true });
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        return NextResponse.json({ user });
    } catch (error: any) {
        console.error('Admin Users API PATCH Error:', error);
        return NextResponse.json({ error: error.message }, { status: 403 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const decoded = await verifyAdmin(req);
        await dbConnect();
        const { id } = await req.json();

        if (id === decoded.userId) {
            return NextResponse.json({ error: 'You cannot delete yourself' }, { status: 400 });
        }

        console.log(`Admin Users API - Deleting user ${id}`);
        const user = await User.findByIdAndDelete(id);
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        return NextResponse.json({ message: 'User deleted' });
    } catch (error: any) {
        console.error('Admin Users API DELETE Error:', error);
        return NextResponse.json({ error: error.message }, { status: 403 });
    }
}
