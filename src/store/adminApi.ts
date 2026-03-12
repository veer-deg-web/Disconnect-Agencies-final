import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Extract the auth token for headers
const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

export const adminApi = createApi({
    reducerPath: 'adminApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/admin',
        prepareHeaders: (headers) => {
            const token = getAuthToken();
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Faq', 'Booking', 'BookingSettings', 'User', 'Feedback', 'CareerApplication', 'Blog'],
    endpoints: (builder) => ({
        /* =======================
           FAQS
        ======================= */
        getFaqs: builder.query<{ faqs: any[] }, void>({
            query: () => '/faq',
            providesTags: ['Faq'],
        }),
        addFaq: builder.mutation<any, { question: string; answer: string; category: string }>({
            query: (body) => ({
                url: '/faq',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Faq'],
        }),
        updateFaq: builder.mutation<any, { id: string; question: string; answer: string; category: string }>({
            query: (body) => ({
                url: '/faq',
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Faq'],
        }),
        deleteFaq: builder.mutation<any, string>({
            query: (id) => ({
                url: '/faq',
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: ['Faq'],
        }),

        /* =======================
           BOOKINGS & SETTINGS
        ======================= */
        getBookingSettings: builder.query<{ settings: { meetingLink: string; adminEmails: string[] } }, void>({
            query: () => '/booking-settings',
            providesTags: ['BookingSettings'],
        }),
        updateBookingSettings: builder.mutation<any, { meetingLink: string; adminEmails: string[] }>({
            query: (body) => ({
                url: '/booking-settings',
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['BookingSettings'],
        }),
        getBookings: builder.query<{ bookings: any[] }, void>({
            query: () => '/bookings',
            providesTags: ['Booking'],
        }),
        updateBooking: builder.mutation<any, { id: string; adminRemark?: string; status?: string }>({
            query: (body) => ({
                url: '/bookings',
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Booking'],
        }),
        deleteBooking: builder.mutation<any, string>({
            query: (id) => ({
                url: '/bookings',
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: ['Booking'],
        }),

        /* =======================
           USERS
        ======================= */
        getUsers: builder.query<any, void>({
            query: () => '/users',
            providesTags: ['User'],
        }),
        updateUser: builder.mutation<any, any>({
            query: (body) => ({
                url: '/users',
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['User'],
        }),
        deleteUser: builder.mutation<any, string>({
            query: (id) => ({
                url: '/users',
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: ['User'],
        }),

        /* =======================
           FEEDBACKS
        ======================= */
        getFeedbacks: builder.query<any, void>({
            query: () => '/feedback',
            providesTags: ['Feedback'],
        }),
        updateFeedback: builder.mutation<any, any>({
            query: (body) => ({
                url: '/feedback',
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Feedback'],
        }),
        deleteFeedback: builder.mutation<any, string>({
            query: (id) => ({
                url: '/feedback',
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: ['Feedback'],
        }),

        /* =======================
           CAREER APPLICATIONS
        ======================= */
        getCareerApplications: builder.query<any, void>({
            query: () => '/career-applications',
            providesTags: ['CareerApplication'],
        }),
        updateCareerApplication: builder.mutation<any, any>({
            query: (body) => ({
                url: '/career-applications',
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['CareerApplication'],
        }),
        deleteCareerApplication: builder.mutation<any, string>({
            query: (id) => ({
                url: `/career-applications?id=${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['CareerApplication'],
        }),

        /* =======================
           BLOGS
        ======================= */
        getBlogs: builder.query<any, { page?: number; status?: string; category?: string; search?: string } | void>({
            query: (params) => {
                const p = params || {};
                const sp = new URLSearchParams();
                if (p.page) sp.append('page', String(p.page));
                if (p.status) sp.append('status', p.status);
                if (p.category) sp.append('category', p.category);
                if (p.search) sp.append('search', p.search);
                const qs = sp.toString() ? `?${sp.toString()}` : '';
                return `/blogs${qs}`;
            },
            providesTags: ['Blog'],
        }),
        createBlog: builder.mutation<any, any>({
            query: (body) => ({
                url: '/blogs',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Blog'],
        }),
        updateBlog: builder.mutation<any, any>({
            query: (body) => ({
                url: '/blogs',
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Blog'],
        }),
        deleteBlog: builder.mutation<any, string>({
            query: (id) => ({
                url: '/blogs',
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: ['Blog'],
        }),
        scrapeBlog: builder.mutation<any, { maxPages?: number; maxArticles?: number }>({
            query: (body) => ({
                url: '/blogs/scrape',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Blog'],
        }),
        generateBlog: builder.mutation<any, { topic?: string; keyword?: string }>({
            query: (body) => ({
                url: '/blogs/generate',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Blog'],
        }),
    }),
});

export const {
    useGetFaqsQuery,
    useAddFaqMutation,
    useUpdateFaqMutation,
    useDeleteFaqMutation,
    useGetBookingSettingsQuery,
    useUpdateBookingSettingsMutation,
    useGetBookingsQuery,
    useUpdateBookingMutation,
    useDeleteBookingMutation,
    useGetUsersQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useGetFeedbacksQuery,
    useUpdateFeedbackMutation,
    useDeleteFeedbackMutation,
    useGetCareerApplicationsQuery,
    useUpdateCareerApplicationMutation,
    useDeleteCareerApplicationMutation,
    useGetBlogsQuery,
    useCreateBlogMutation,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
    useScrapeBlogMutation,
    useGenerateBlogMutation,
} = adminApi;

