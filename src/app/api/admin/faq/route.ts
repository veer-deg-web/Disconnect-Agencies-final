import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET;

/** Verify admin token — must have role: 'admin' in JWT payload */
async function verifyToken(req: NextRequest): Promise<{ valid: boolean; isAdmin: boolean }> {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return { valid: false, isAdmin: false };
  try {
    const { default: jwt } = await import('jsonwebtoken');
    const decoded = jwt.verify(token, JWT_SECRET as string) as { role?: string };
    return { valid: true, isAdmin: decoded.role === 'admin' };
  } catch {
    return { valid: false, isAdmin: false };
  }
}

async function getDb() {
  const [{ default: dbConnect }, { default: Faq }] = await Promise.all([
    import('@/lib/mongodb'),
    import('@/models/Faq'),
  ]);
  await dbConnect();
  return Faq;
}

/** Seed all 7 categories from static data on first run */
async function seedIfEmpty(Faq: Awaited<ReturnType<typeof getDb>>) {
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
  const auth = await verifyToken(req);
  if (!auth.valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!auth.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const Faq = await getDb();
    await seedIfEmpty(Faq);
    const faqs = await Faq.find().sort({ category: 1, order: 1 }).lean();
    return NextResponse.json({ faqs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* ── POST /api/admin/faq ── */
export async function POST(req: NextRequest) {
  const auth = await verifyToken(req);
  if (!auth.valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!auth.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const Faq = await getDb();
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

/* ── PUT /api/admin/faq ── */
export async function PUT(req: NextRequest) {
  const auth = await verifyToken(req);
  if (!auth.valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!auth.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const Faq = await getDb();
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

/* ── DELETE /api/admin/faq ── */
export async function DELETE(req: NextRequest) {
  const auth = await verifyToken(req);
  if (!auth.valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!auth.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const Faq = await getDb();
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    const faq = await Faq.findByIdAndDelete(id);
    if (!faq) return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    return NextResponse.json({ message: 'Deleted' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
