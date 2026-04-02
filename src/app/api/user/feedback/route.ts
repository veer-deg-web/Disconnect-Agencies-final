import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Feedback from '../../../../models/Feedback';
import { sanitizeInput } from '@/lib/sanitizer';
import { getAuthToken, verifyAndRotateToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const token = getAuthToken(req);
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { payload: decoded, newToken } = verifyAndRotateToken(token);
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await dbConnect();

        const feedbacks = await Feedback.find({ user: decoded.userId }).sort({ createdAt: -1 });

        const response = NextResponse.json({ feedbacks }, { status: 200 });
        if (newToken) {
            response.headers.set('X-New-Token', newToken);
        }
        return response;
    } catch (error: unknown) {
        console.error('Fetch User Feedback Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const token = getAuthToken(req);
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { payload: decoded, newToken } = verifyAndRotateToken(token);
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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

        const response = NextResponse.json({ feedback, message: 'Feedback updated successfully' }, { status: 200 });
        if (newToken) {
            response.headers.set('X-New-Token', newToken);
        }
        return response;
    } catch (error: unknown) {
        console.error('Update User Feedback Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const token = getAuthToken(req);
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { payload: decoded, newToken } = verifyAndRotateToken(token);
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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

        const response = NextResponse.json({ message: 'Feedback deleted successfully' }, { status: 200 });
        if (newToken) {
            response.headers.set('X-New-Token', newToken);
        }
        return response;
    } catch (error: unknown) {
        console.error('Delete User Feedback Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
