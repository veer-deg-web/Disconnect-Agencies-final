import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const publicApi = createApi({
    reducerPath: 'publicApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    endpoints: (builder) => ({
        getFaqs: builder.query<any, { category?: string }>({
            query: (params) => {
                const searchParams = new URLSearchParams();
                if (params.category && params.category !== 'all') {
                    searchParams.append('category', params.category);
                }
                const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';
                return `faq${qs}`;
            },
        }),
        getFeedback: builder.query<any, { category?: string; isFeatured?: boolean }>({
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
