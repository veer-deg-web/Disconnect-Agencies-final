import { NextResponse } from 'next/server';
import { getAuthToken, verifyAndRotateToken } from '@/lib/auth';
import dbConnect from '../../../lib/mongodb';
import Feedback from '../../../models/Feedback';
import User from '../../../models/User';
import { sanitizeInput } from '@/lib/sanitizer';
import { safeParseJson } from '@/lib/utils';
import { feedbackCreateSchema } from '@/lib/validations';
import { apiError, dbSafeError, ErrorCode } from '@/lib/apiErrors';

export async function POST(req: Request) {
  try {
    const token = getAuthToken(req);
    if (!token) {
      return apiError(ErrorCode.UNAUTHORIZED, 'Unauthorized', 401);
    }

    const { payload: decoded, newToken, error: authError } = verifyAndRotateToken(token);
    if (!decoded) {
      return apiError(ErrorCode.UNAUTHORIZED, authError || 'Unauthorized', 401);
    }

    const rawBody = await safeParseJson<unknown>(req);
    if (!rawBody) {
      return apiError(ErrorCode.INVALID_JSON, 'Invalid or empty request body', 400);
    }

    const parsed = feedbackCreateSchema.safeParse(rawBody);
    if (!parsed.success) {
      return apiError(ErrorCode.VALIDATION_ERROR, parsed.error.issues[0].message, 400);
    }

    const body = sanitizeInput(parsed.data);

    await dbConnect();

    // Verify user exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return apiError(ErrorCode.NOT_FOUND, 'User not found', 404);
    }

    const newFeedback = new Feedback({
      user: decoded.userId,
      content: body.content,
      category: body.category,
      rating: body.rating,
      position: body.position,
      company: body.company,
    });

    await newFeedback.save();

    const response = NextResponse.json(
      { message: 'Feedback submitted successfully', feedback: newFeedback },
      { status: 201 },
    );
    if (newToken) {
      response.headers.set('X-New-Token', newToken);
    }
    return response;
  } catch (error: unknown) {
    console.error('Submit Feedback Error:', error);
    return dbSafeError(error);
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

    const testimonials = await Feedback.find(query)
      .populate('user', 'name avatar isVerified')
      .sort({ createdAt: -1 });

    return NextResponse.json({ testimonials }, { status: 200 });
  } catch (error: unknown) {
    console.error('Fetch Testimonials Error:', error);
    return dbSafeError(error);
  }
}
