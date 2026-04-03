import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Feedback from '../../../../models/Feedback';
import { sanitizeInput } from '@/lib/sanitizer';
import { getAuthToken, verifyAndRotateToken } from '@/lib/auth';
import { safeParseJson } from '@/lib/utils';
import { feedbackUpdateSchema, feedbackDeleteSchema } from '@/lib/validations';
import { apiError, dbSafeError, ErrorCode } from '@/lib/apiErrors';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const token = getAuthToken(req);
    if (!token) return apiError(ErrorCode.UNAUTHORIZED, 'Unauthorized', 401);

    const { payload: decoded, newToken } = verifyAndRotateToken(token);
    if (!decoded) return apiError(ErrorCode.UNAUTHORIZED, 'Unauthorized', 401);

    await dbConnect();

    const feedbacks = await Feedback.find({ user: decoded.userId }).sort({ createdAt: -1 });

    const response = NextResponse.json({ feedbacks }, { status: 200 });
    if (newToken) {
      response.headers.set('X-New-Token', newToken);
    }
    return response;
  } catch (error: unknown) {
    console.error('Fetch User Feedback Error:', error);
    return dbSafeError(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = getAuthToken(req);
    if (!token) return apiError(ErrorCode.UNAUTHORIZED, 'Unauthorized', 401);

    const { payload: decoded, newToken } = verifyAndRotateToken(token);
    if (!decoded) return apiError(ErrorCode.UNAUTHORIZED, 'Unauthorized', 401);

    const rawBody = await safeParseJson<unknown>(req);
    if (!rawBody) {
      return apiError(ErrorCode.INVALID_JSON, 'Invalid or empty request body', 400);
    }

    const parsed = feedbackUpdateSchema.safeParse(rawBody);
    if (!parsed.success) {
      return apiError(ErrorCode.VALIDATION_ERROR, parsed.error.issues[0].message, 400);
    }

    const body = sanitizeInput(parsed.data);

    await dbConnect();

    const feedback = await Feedback.findOne({ _id: body.id, user: decoded.userId });
    if (!feedback) {
      return apiError(ErrorCode.NOT_FOUND, 'Feedback not found or unauthorized', 404);
    }

    feedback.content = body.content;
    if (body.rating !== undefined) {
      feedback.rating = body.rating;
    }

    await feedback.save();

    const response = NextResponse.json({ feedback, message: 'Feedback updated successfully' }, { status: 200 });
    if (newToken) {
      response.headers.set('X-New-Token', newToken);
    }
    return response;
  } catch (error: unknown) {
    console.error('Update User Feedback Error:', error);
    return dbSafeError(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = getAuthToken(req);
    if (!token) return apiError(ErrorCode.UNAUTHORIZED, 'Unauthorized', 401);

    const { payload: decoded, newToken } = verifyAndRotateToken(token);
    if (!decoded) return apiError(ErrorCode.UNAUTHORIZED, 'Unauthorized', 401);

    const rawBody = await safeParseJson<unknown>(req);
    if (!rawBody) {
      return apiError(ErrorCode.INVALID_JSON, 'Invalid or empty request body', 400);
    }

    const parsed = feedbackDeleteSchema.safeParse(rawBody);
    if (!parsed.success) {
      return apiError(ErrorCode.VALIDATION_ERROR, parsed.error.issues[0].message, 400);
    }

    const { id } = parsed.data;

    await dbConnect();

    const deleted = await Feedback.findOneAndDelete({ _id: id, user: decoded.userId });
    if (!deleted) {
      return apiError(ErrorCode.NOT_FOUND, 'Feedback not found or unauthorized', 404);
    }

    const response = NextResponse.json({ message: 'Feedback deleted successfully' }, { status: 200 });
    if (newToken) {
      response.headers.set('X-New-Token', newToken);
    }
    return response;
  } catch (error: unknown) {
    console.error('Delete User Feedback Error:', error);
    return dbSafeError(error);
  }
}
