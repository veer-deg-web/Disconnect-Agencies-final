import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../../lib/mongodb';
import Feedback from '../../../../models/Feedback';
import { sanitizeInput } from '@/lib/sanitizer';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-here';

function verifyUser(req: Request) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Unauthorized');
    }

    const token = authHeader.split(' ')[1];
    return jwt.verify(token, JWT_SECRET) as { userId: string };
}

export async function GET(req: Request) {
    try {
        const decoded = verifyUser(req);
        await dbConnect();

        const feedbacks = await Feedback.find({ user: decoded.userId }).sort({ createdAt: -1 });

        return NextResponse.json({ feedbacks }, { status: 200 });
    } catch (error: unknown) {
        const err = error as Error;
        if (err.message === 'Unauthorized') {
            return NextResponse.json({ error: err.message }, { status: 401 });
        }
        console.error('Fetch User Feedback Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const decoded = verifyUser(req);
        const rawBody = await req.json();
        const body = sanitizeInput(rawBody);
        const { id, content, rating } = body;

        if (!id || !content) {
            return NextResponse.json({ error: 'ID and content are required' }, { status: 400 });
        }

        await dbConnect();

        // Ensure the feedback belongs to the user requesting the change
        const feedback = await Feedback.findOne({ _id: id, user: decoded.userId });

        if (!feedback) {
            return NextResponse.json({ error: 'Feedback not found or unauthorized' }, { status: 404 });
        }

        feedback.content = content;
        if (rating !== undefined) {
            feedback.rating = rating;
        }

        await feedback.save();

        return NextResponse.json({ feedback, message: 'Feedback updated successfully' }, { status: 200 });
    } catch (error: unknown) {
        const err = error as Error;
        if (err.message === 'Unauthorized') {
            return NextResponse.json({ error: err.message }, { status: 401 });
        }
        console.error('Update User Feedback Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const decoded = verifyUser(req);
        const rawBody = await req.json();
        const { id } = sanitizeInput(rawBody);

        if (!id) {
            return NextResponse.json({ error: 'Feedback ID is required' }, { status: 400 });
        }

        await dbConnect();

        // Find and delete only if the feedback belongs to the user
        const deleted = await Feedback.findOneAndDelete({ _id: id, user: decoded.userId });

        if (!deleted) {
            return NextResponse.json({ error: 'Feedback not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Feedback deleted successfully' }, { status: 200 });
    } catch (error: unknown) {
        const err = error as Error;
        if (err.message === 'Unauthorized') {
            return NextResponse.json({ error: err.message }, { status: 401 });
        }
        console.error('Delete User Feedback Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
