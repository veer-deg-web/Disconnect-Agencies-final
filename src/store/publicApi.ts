import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { StaticFaqCategory } from '@/Data/allFaqs';

export interface FAQ {
    _id: string;
    question: string;
    answer: string;
    category: StaticFaqCategory;
    order: number;
}

export interface Testimonial {
    _id: string;
    user: {
        name: string;
        avatar?: string;
        isVerified?: boolean;
    };
    content: string;
    category?: string;
    isFeatured?: boolean;
    createdAt: string;
}

export const publicApi = createApi({
    reducerPath: 'publicApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    endpoints: (builder) => ({
        getFaqs: builder.query<{ faqs: FAQ[] }, { category?: StaticFaqCategory | 'all' }>({
            query: (params) => {
                const searchParams = new URLSearchParams();
                if (params.category && params.category !== 'all') {
                    searchParams.append('category', params.category);
                }
                const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';
                return `faq${qs}`;
            },
        }),
        getFeedback: builder.query<{ testimonials: Testimonial[] }, { category?: string; isFeatured?: boolean }>({
            query: (params) => {
                const searchParams = new URLSearchParams();
                if (params.category) searchParams.append('category', params.category);
                if (params.isFeatured !== undefined) {
                    searchParams.append('isFeatured', params.isFeatured.toString());
                }
                const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';
                return `feedback${qs}`;
            },
        }),
    }),
});

export const { useGetFaqsQuery, useGetFeedbackQuery } = publicApi;
