import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Faq from '@/models/Faq';
import { faqs as generalFaqs } from '@/Data/faq';
import { Cloudfaq as cloudFaqs } from '@/Data/Cloudfaq';

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

/**
 * GET /api/faq?category=general|cloud|all
 * Public endpoint — no auth needed.
 * Used by FAQSection components on any page.
 */
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    await seedIfEmpty();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || 'all';
    const query = category === 'all' ? {} : { category };
    const faqs = await Faq.find(query).sort({ category: 1, order: 1 }).lean();
    return NextResponse.json({ faqs }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
