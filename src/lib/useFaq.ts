'use client';

import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
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
  const queryError = error as FetchBaseQueryError | undefined;
  const message =
    queryError && 'data' in queryError && typeof queryError.data === 'object' && queryError.data
      ? (queryError.data as { error?: string }).error
      : undefined;

  return {
    faqs: data?.faqs || [],
    loading: isLoading,
    error: error ? message || 'Failed to fetch' : null,
    refetch
  };
}
