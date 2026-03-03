import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../../lib/mongodb';
import Feedback from '../../../../models/Feedback';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-here';

function verifyAdmin(req: Request) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Unauthorized');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };

    if (decoded.role !== 'admin') {
        throw new Error('Forbidden');
    }
    return decoded;
}

export async function GET(req: Request) {
    try {
        verifyAdmin(req);
        await dbConnect();

        const feedbacks = await Feedback.find()
            .populate('user', 'name email avatar isVerified')
            .sort({ createdAt: -1 });

        return NextResponse.json({ feedbacks }, { status: 200 });
    } catch (error: any) {
        if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
            return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 });
        }
        console.error('Admin Fetch Feedback Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        verifyAdmin(req);
        const body = await req.json();
        const { id, isTestimonial, isFeatured, category } = body;

        if (!id || typeof isTestimonial !== 'boolean') {
            return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
        }

        await dbConnect();

        const updateData: any = { isTestimonial };
        if (category !== undefined) {
            updateData.category = category;
        }
        if (isFeatured !== undefined) {
            updateData.isFeatured = isFeatured;
        }

        const feedback = await Feedback.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).populate('user', 'name email avatar isVerified');

        if (!feedback) {
            return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
        }

        return NextResponse.json({ feedback }, { status: 200 });
    } catch (error: any) {
        if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
            return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 });
        }
        console.error('Admin Update Feedback Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        verifyAdmin(req);
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ error: 'Feedback ID is required' }, { status: 400 });
        }

        await dbConnect();

        const deleted = await Feedback.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Feedback deleted successfully' }, { status: 200 });
    } catch (error: any) {
        if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
            return NextResponse.json({ error: error.message }, { status: error.message === 'Unauthorized' ? 401 : 403 });
        }
        console.error('Admin Delete Feedback Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
