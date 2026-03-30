import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../lib/mongodb';
import Feedback from '../../../models/Feedback';
import User from '../../../models/User';
import { sanitizeInput } from '@/lib/sanitizer';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-here';

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };

        const rawBody = await req.json();
        const body = sanitizeInput(rawBody);
        const { content, category, rating, position, company } = body;

        if (!content || !content.trim()) {
            return NextResponse.json({ error: 'Feedback content is required' }, { status: 400 });
        }

        await dbConnect();

        // Verify user exists
        const user = await User.findById(decoded.userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const newFeedback = new Feedback({
            user: decoded.userId,
            content,
            category,
            rating: rating ? Number(rating) : undefined,
            position,
            company
        });

        await newFeedback.save();

        return NextResponse.json(
            { message: 'Feedback submitted successfully', feedback: newFeedback },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error('Submit Feedback Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const isFeatured = searchParams.get('isFeatured');

        const query: Record<string, unknown> = { isTestimonial: true };

        if (category && category !== 'All') {
            query.category = category;
        }

        if (isFeatured === 'true') {
            query.isFeatured = true;
        }

        // Fetch only feedbacks that are approved as testimonials
        const testimonials = await Feedback.find(query)
            .populate('user', 'name avatar isVerified') // Populate user details
            .sort({ createdAt: -1 });

        return NextResponse.json({ testimonials }, { status: 200 });
    } catch (error: unknown) {
        console.error('Fetch Testimonials Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
