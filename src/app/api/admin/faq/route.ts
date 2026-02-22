import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Faq from '@/models/Faq';
import { faqs as generalFaqs } from '@/Data/faq';
import { Cloudfaq as cloudFaqs } from '@/Data/Cloudfaq';

const JWT_SECRET = process.env.JWT_SECRET ;

/** Verify admin token — must have role: 'admin' in JWT */
function verifyToken(req: NextRequest): { valid: boolean; isAdmin: boolean; userId?: string } {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return { valid: false, isAdmin: false };
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as unknown as { userId: string; role?: string };
    const isAdmin = decoded.role === 'admin';
    return { valid: true, isAdmin, userId: decoded.userId };
  } catch {
    return { valid: false, isAdmin: false };
  }
}

/** Seed FAQs from static files if the collection is empty */
async function seedIfEmpty() {
  const count = await Faq.countDocuments();
  if (count > 0) return;
  const general = generalFaqs.map((f, i) => ({
    question: f.question, answer: f.answer, category: 'general' as const, order: i,
  }));
  const cloud = cloudFaqs.map((f, i) => ({
    question: f.question, answer: f.answer, category: 'cloud' as const, order: i,
  }));
  await Faq.insertMany([...general, ...cloud]);
}

/* ── GET /api/admin/faq  — list all ── */
export async function GET(req: NextRequest) {
  const auth = verifyToken(req);
  if (!auth.valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!auth.isAdmin) return NextResponse.json({ error: 'Forbidden: admin only' }, { status: 403 });
  try {
    await dbConnect();
    await seedIfEmpty();
    const faqs = await Faq.find().sort({ category: 1, order: 1 }).lean();
    return NextResponse.json({ faqs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* ── POST /api/admin/faq  — create ── */
export async function POST(req: NextRequest) {
  const auth = verifyToken(req);
  if (!auth.valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!auth.isAdmin) return NextResponse.json({ error: 'Forbidden: admin only' }, { status: 403 });
  try {
    await dbConnect();
    const { question, answer, category } = await req.json();
    if (!question?.trim() || !answer?.trim() || !category)
      return NextResponse.json({ error: 'question, answer and category are required' }, { status: 400 });
    const count = await Faq.countDocuments({ category });
    const faq = await Faq.create({ question: question.trim(), answer: answer.trim(), category, order: count });
    return NextResponse.json({ faq }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* ── PUT /api/admin/faq  — update ── */
export async function PUT(req: NextRequest) {
  const auth = verifyToken(req);
  if (!auth.valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!auth.isAdmin) return NextResponse.json({ error: 'Forbidden: admin only' }, { status: 403 });
  try {
    await dbConnect();
    const { id, question, answer, category } = await req.json();
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    const faq = await Faq.findByIdAndUpdate(
      id,
      { question: question?.trim(), answer: answer?.trim(), category },
      { new: true, runValidators: true }
    );
    if (!faq) return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    return NextResponse.json({ faq });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* ── DELETE /api/admin/faq  — delete ── */
export async function DELETE(req: NextRequest) {
  const auth = verifyToken(req);
  if (!auth.valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!auth.isAdmin) return NextResponse.json({ error: 'Forbidden: admin only' }, { status: 403 });
  try {
    await dbConnect();
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    const faq = await Faq.findByIdAndDelete(id);
    if (!faq) return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    return NextResponse.json({ message: 'Deleted' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
