import { NextRequest, NextResponse } from 'next/server';
import { STATIC_FAQS, StaticFaqCategory } from '@/Data/allFaqs';

type Category = StaticFaqCategory | 'all';

/** Return static data for a given category */
function getStaticFaqs(category: Category) {
  if (category === 'all') {
    return (Object.keys(STATIC_FAQS) as StaticFaqCategory[]).flatMap((cat, ci) =>
      STATIC_FAQS[cat].map((f, i) => ({
        _id: `${cat}-${i}`, question: f.question, answer: f.answer, category: cat, order: i,
      }))
    );
  }
  return (STATIC_FAQS[category as StaticFaqCategory] ?? []).map((f, i) => ({
    _id: `${category}-${i}`, question: f.question, answer: f.answer, category, order: i,
  }));
}

/**
 * GET /api/faq?category=general|cloud|uiux|webdev|appdev|aimodels|seo|all
 * Falls back to static data if MongoDB is not configured.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = (searchParams.get('category') || 'all') as Category;

  // No MongoDB configured → return static data instantly
  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      { faqs: getStaticFaqs(category) },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } }
    );
  }

  try {
    const [{ default: dbConnect }, { default: Faq }] = await Promise.all([
      import('@/lib/mongodb'),
      import('@/models/Faq'),
    ]);

    await dbConnect();

    // Seed any category that has no FAQs yet (allows adding new categories to existing DBs)
    const cats = Object.keys(STATIC_FAQS) as StaticFaqCategory[];
    for (const cat of cats) {
      const catCount = await Faq.countDocuments({ category: cat });
      if (catCount === 0) {
        const docs = STATIC_FAQS[cat].map((f, i) => ({
          question: f.question, answer: f.answer, category: cat, order: i,
        }));
        await Faq.insertMany(docs);
      }
    }

    const query = category === 'all' ? {} : { category };
    const faqs = await Faq.find(query).sort({ category: 1, order: 1 }).lean();
    return NextResponse.json({ faqs }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
    });
  } catch {
    // DB failed — fall back to static data
    return NextResponse.json(
      { faqs: getStaticFaqs(category) },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
