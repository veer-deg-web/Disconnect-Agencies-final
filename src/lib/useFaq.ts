/**
 * useFaq — shared hook for fetching FAQs from the DB.
 *
 * Usage on any page or component:
 *
 *   import { useFaq } from '@/lib/useFaq';
 *
 *   // All FAQs
 *   const { faqs, loading, error } = useFaq();
 *
 *   // Only general FAQs (shown on home / AI pages)
 *   const { faqs } = useFaq('general');
 *
 *   // Only cloud FAQs (shown on cloud page)
 *   const { faqs } = useFaq('cloud');
 *
 * The hook hits GET /api/faq?category=... which is public (no auth needed).
 * Data comes live from MongoDB, so any changes made in the admin panel are
 * reflected immediately on all pages.
 */

'use client';

import { useState, useEffect } from 'react';

export interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  category: 'general' | 'cloud';
  order: number;
}

type Category = 'general' | 'cloud' | 'all';

interface UseFaqResult {
  faqs: FaqItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFaq(category: Category = 'all'): UseFaqResult {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = () => setTick(t => t + 1);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/faq?category=${category}`)
      .then(res => res.json())
      .then(data => {
        if (cancelled) return;
        if (data.error) throw new Error(data.error);
        setFaqs(data.faqs ?? []);
      })
      .catch(err => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [category, tick]);

  return { faqs, loading, error, refetch };
}
