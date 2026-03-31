import { NextRequest, NextResponse } from 'next/server';
import { sanitizeInput } from '@/lib/sanitizer';
import { verifyAdminToken } from '@/lib/adminAuth';
import dbConnect from '@/lib/mongodb';
import Faq from '@/models/Faq';

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
  if (!auth.valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!auth.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  try {
    await dbConnect();
    await seedIfEmpty();
    const faqs = await Faq.find().sort({ category: 1, order: 1 }).lean();
    const response = NextResponse.json({ faqs });
    if (auth.newToken) response.headers.set('X-New-Token', auth.newToken);
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* ── POST /api/admin/faq ── */
export async function POST(req: NextRequest) {
  const auth = await verifyAdminToken(req);
  if (!auth.valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!auth.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  try {
    await dbConnect();
    const rawBody = await req.json();
    const { question, answer, category } = sanitizeInput(rawBody);
    if (!question || !answer || !category)
      return NextResponse.json({ error: 'question, answer and category are required' }, { status: 400 });
    const count = await Faq.countDocuments({ category });
    const faq = await Faq.create({ question, answer, category, order: count });
    const response = NextResponse.json({ faq }, { status: 201 });
    if (auth.newToken) response.headers.set('X-New-Token', auth.newToken);
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* ── PUT /api/admin/faq ── */
export async function PUT(req: NextRequest) {
  const auth = await verifyAdminToken(req);
  if (!auth.valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!auth.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  try {
    await dbConnect();
    const rawBody = await req.json();
    const { id, question, answer, category } = sanitizeInput(rawBody);
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    const faq = await Faq.findByIdAndUpdate(
      id,
      { question, answer, category },
      { new: true, runValidators: true }
    );
    if (!faq) return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    const response = NextResponse.json({ faq });
    if (auth.newToken) response.headers.set('X-New-Token', auth.newToken);
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* ── DELETE /api/admin/faq ── */
export async function DELETE(req: NextRequest) {
  const auth = await verifyAdminToken(req);
  if (!auth.valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!auth.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  try {
    await dbConnect();
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    const faq = await Faq.findByIdAndDelete(id);
    if (!faq) return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    const response = NextResponse.json({ message: 'Deleted' });
    if (auth.newToken) response.headers.set('X-New-Token', auth.newToken);
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
