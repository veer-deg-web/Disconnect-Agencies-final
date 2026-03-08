'use client';

import { useGetFaqsQuery } from '@/store/publicApi';

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
  const { data, isLoading, error, refetch } = useGetFaqsQuery({ category });

  return {
    faqs: data?.faqs || [],
    loading: isLoading,
    error: error ? (error as any).data?.error || 'Failed to fetch' : null,
    refetch
  };
}
