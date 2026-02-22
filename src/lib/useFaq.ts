'use client';

import { useState, useEffect } from 'react';

export type FaqCategory =
  | 'general'
  | 'cloud'
  | 'uiux'
  | 'webdev'
  | 'appdev'
  | 'aimodels'
  | 'seo'
  | 'all';

export interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  category: Exclude<FaqCategory, 'all'>;
  order: number;
}

interface UseFaqResult {
  faqs: FaqItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFaq(category: FaqCategory = 'all'): UseFaqResult {
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
