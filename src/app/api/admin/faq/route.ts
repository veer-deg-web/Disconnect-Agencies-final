import { NextRequest, NextResponse } from 'next/server';
import { sanitizeInput } from '@/lib/sanitizer';
import { verifyAdminToken } from '@/lib/adminAuth';
import dbConnect from '@/lib/mongodb';
import Faq from '@/models/Faq';
import { safeParseJson } from '@/lib/utils';
import { adminFaqCreateSchema, adminFaqUpdateSchema, adminFaqDeleteSchema } from '@/lib/validations';
import { apiError, dbSafeError, ErrorCode } from '@/lib/apiErrors';

export const dynamic = 'force-dynamic';

/** Seed all 7 categories from static data on first run */
async function seedIfEmpty() {
  const count = await Faq.countDocuments();
  if (count > 0) return;
  const { STATIC_FAQS } = await import('@/Data/allFaqs');
  const docs = (Object.keys(STATIC_FAQS) as (keyof typeof STATIC_FAQS)[]).flatMap((cat) =>
    STATIC_FAQS[cat].map((f, i) => ({
      question: f.question, answer: f.answer, category: cat, order: i,
    }))
  );
  await Faq.insertMany(docs);
}

/* ── GET /api/admin/faq ── */
export async function GET(req: NextRequest) {
  const auth = await verifyAdminToken(req);
  if (!auth.valid) return apiError(ErrorCode.UNAUTHORIZED, 'Unauthorized', 401);
  if (!auth.isAdmin) return apiError(ErrorCode.FORBIDDEN, 'Forbidden', 403);
  try {
    await dbConnect();
    await seedIfEmpty();
    const faqs = await Faq.find().sort({ category: 1, order: 1 }).lean();
    const response = NextResponse.json({ faqs });
    if (auth.newToken) response.headers.set('X-New-Token', auth.newToken);
    return response;
  } catch (err: unknown) {
    console.error('Admin FAQ list error:', err);
    return dbSafeError(err);
  }
}

/* ── POST /api/admin/faq ── */
export async function POST(req: NextRequest) {
  const auth = await verifyAdminToken(req);
  if (!auth.valid) return apiError(ErrorCode.UNAUTHORIZED, 'Unauthorized', 401);
  if (!auth.isAdmin) return apiError(ErrorCode.FORBIDDEN, 'Forbidden', 403);
  try {
    await dbConnect();
    const rawBody = await safeParseJson<unknown>(req);
    if (!rawBody) {
      return apiError(ErrorCode.INVALID_JSON, 'Invalid or empty request body', 400);
    }

    const parsed = adminFaqCreateSchema.safeParse(rawBody);
    if (!parsed.success) {
      return apiError(ErrorCode.VALIDATION_ERROR, parsed.error.issues[0].message, 400);
    }

    const { question, answer, category } = sanitizeInput(parsed.data);
    const count = await Faq.countDocuments({ category });
    const faq = await Faq.create({ question, answer, category, order: count });
    const response = NextResponse.json({ faq }, { status: 201 });
    if (auth.newToken) response.headers.set('X-New-Token', auth.newToken);
    return response;
  } catch (err: unknown) {
    console.error('Admin FAQ create error:', err);
    return dbSafeError(err);
  }
}

/* ── PUT /api/admin/faq ── */
export async function PUT(req: NextRequest) {
  const auth = await verifyAdminToken(req);
  if (!auth.valid) return apiError(ErrorCode.UNAUTHORIZED, 'Unauthorized', 401);
  if (!auth.isAdmin) return apiError(ErrorCode.FORBIDDEN, 'Forbidden', 403);
  try {
    await dbConnect();
    const rawBody = await safeParseJson<unknown>(req);
    if (!rawBody) {
      return apiError(ErrorCode.INVALID_JSON, 'Invalid or empty request body', 400);
    }

    const parsed = adminFaqUpdateSchema.safeParse(rawBody);
    if (!parsed.success) {
      return apiError(ErrorCode.VALIDATION_ERROR, parsed.error.issues[0].message, 400);
    }

    const { id, question, answer, category } = sanitizeInput(parsed.data);
    const faq = await Faq.findByIdAndUpdate(
      id,
      { question, answer, category },
      { new: true, runValidators: true },
    );
    if (!faq) return apiError(ErrorCode.NOT_FOUND, 'FAQ not found', 404);
    const response = NextResponse.json({ faq });
    if (auth.newToken) response.headers.set('X-New-Token', auth.newToken);
    return response;
  } catch (err: unknown) {
    console.error('Admin FAQ update error:', err);
    return dbSafeError(err);
  }
}

/* ── DELETE /api/admin/faq ── */
export async function DELETE(req: NextRequest) {
  const auth = await verifyAdminToken(req);
  if (!auth.valid) return apiError(ErrorCode.UNAUTHORIZED, 'Unauthorized', 401);
  if (!auth.isAdmin) return apiError(ErrorCode.FORBIDDEN, 'Forbidden', 403);
  try {
    await dbConnect();
    const rawBody = await safeParseJson<unknown>(req);
    if (!rawBody) {
      return apiError(ErrorCode.INVALID_JSON, 'Invalid or empty request body', 400);
    }

    const parsed = adminFaqDeleteSchema.safeParse(rawBody);
    if (!parsed.success) {
      return apiError(ErrorCode.VALIDATION_ERROR, parsed.error.issues[0].message, 400);
    }

    const { id } = parsed.data;
    const faq = await Faq.findByIdAndDelete(id);
    if (!faq) return apiError(ErrorCode.NOT_FOUND, 'FAQ not found', 404);
    const response = NextResponse.json({ message: 'Deleted' });
    if (auth.newToken) response.headers.set('X-New-Token', auth.newToken);
    return response;
  } catch (err: unknown) {
    console.error('Admin FAQ delete error:', err);
    return dbSafeError(err);
  }
}
