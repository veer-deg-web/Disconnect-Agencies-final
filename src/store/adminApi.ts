import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

// Extract the auth token for headers
const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

/* =======================
   INTERFACES
======================= */

export interface AdminFaq {
    _id: string;
    question: string;
    answer: string;
    category: string;
    order: number;
    createdAt: string;
    updatedAt: string;
}

export interface AdminBooking {
    _id: string;
    name: string;
    email: string;
    phone: string;
    category: string;
    serviceTitle: string;
    dateIso: string;
    dateLabel: string;
    time: string;
    notes: string;
    meetingLink: string;
    adminRemark: string;
    status: 'pending' | 'completed';
    createdAt: string;
}

export interface AdminUser {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: 'user' | 'admin';
    isVerified: boolean;
    isSuspended: boolean;
    createdAt: string;
}

export interface AdminFeedback {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
    } | string;
    content: string;
    isTestimonial: boolean;
    isFeatured: boolean;
    category: string;
    rating: number;
    position: string;
    company: string;
    createdAt: string;
}

export interface AdminCareerApplication {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    message: string;
    resumeUrl: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
}

export interface AdminBlog {
    _id: string;
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    author: string;
    status: 'published' | 'draft';
    tags: string[];
    source?: string;
    readingTime?: string;
    createdAt: string;
}


export const adminApi = createApi({
    reducerPath: 'adminApi',
    baseQuery: ((): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
        const rawBaseQuery = fetchBaseQuery({
            baseUrl: '/api/admin',
            prepareHeaders: (headers) => {
                const token = getAuthToken();
                if (token) {
                    headers.set('authorization', `Bearer ${token}`);
                }
                return headers;
            },
        });

        return async (args, api, extraOptions) => {
            const result = await rawBaseQuery(args, api, extraOptions);

            if (typeof window !== 'undefined' && result.error) {
                const status = result.error.status;
                const payload = result.error.data as { error?: string } | undefined;
                const message = String(payload?.error || '').toLowerCase();
                const looksExpired =
                    status === 401 ||
                    (status === 403 && (message.includes('jwt') || message.includes('token') || message.includes('unauthorized')));

                if (looksExpired) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    localStorage.removeItem('userName');
                    localStorage.removeItem('userRole');
                    if (!window.location.pathname.startsWith('/auth')) {
                        window.location.replace('/?session=expired');
                    }
                }
            }

            return result;
        };
    })(),
    tagTypes: ['Faq', 'Booking', 'BookingSettings', 'User', 'Feedback', 'CareerApplication', 'Blog'],
    endpoints: (builder) => ({
        /* =======================
           FAQS
        ======================= */
        getFaqs: builder.query<{ faqs: AdminFaq[] }, void>({
            query: () => 'faq',
            providesTags: ['Faq'],
        }),
        addFaq: builder.mutation<AdminFaq, { question: string; answer: string; category: string }>({
            query: (body) => ({
                url: 'faq',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Faq'],
        }),
        updateFaq: builder.mutation<AdminFaq, { id: string; question: string; answer: string; category: string }>({
            query: (body) => ({
                url: 'faq',
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Faq'],
        }),
        deleteFaq: builder.mutation<{ success: boolean }, string>({
            query: (id) => ({
                url: 'faq',
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: ['Faq'],
        }),

        /* =======================
           BOOKINGS & SETTINGS
        ======================= */
        getBookingSettings: builder.query<{ settings: { meetingLink: string; adminEmails: string[] } }, void>({
            query: () => 'booking-settings',
            providesTags: ['BookingSettings'],
        }),
        updateBookingSettings: builder.mutation<{ success: boolean }, { meetingLink: string; adminEmails: string[] }>({
            query: (body) => ({
                url: 'booking-settings',
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['BookingSettings'],
        }),
        getBookings: builder.query<{ bookings: AdminBooking[] }, void>({
            query: () => 'bookings',
            providesTags: ['Booking'],
        }),
        updateBooking: builder.mutation<AdminBooking, { id: string; adminRemark?: string; status?: string }>({
            query: (body) => ({
                url: 'bookings',
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Booking'],
        }),
        deleteBooking: builder.mutation<{ success: boolean }, string>({
            query: (id) => ({
                url: 'bookings',
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: ['Booking'],
        }),

        /* =======================
           USERS
        ======================= */
        getUsers: builder.query<{ users: AdminUser[] }, void>({
            query: () => 'users',
            providesTags: ['User'],
        }),
        updateUser: builder.mutation<AdminUser, Partial<AdminUser> & { id: string }>({
            query: (body) => ({
                url: 'users',
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['User'],
        }),
        deleteUser: builder.mutation<{ success: boolean }, string>({
            query: (id) => ({
                url: 'users',
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: ['User'],
        }),

        /* =======================
           FEEDBACKS
        ======================= */
        getFeedbacks: builder.query<{ feedbacks: AdminFeedback[] }, void>({
            query: () => 'feedback',
            providesTags: ['Feedback'],
        }),
        updateFeedback: builder.mutation<AdminFeedback, Partial<AdminFeedback> & { id: string }>({
            query: (body) => ({
                url: 'feedback',
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Feedback'],
        }),
        deleteFeedback: builder.mutation<{ success: boolean }, string>({
            query: (id) => ({
                url: 'feedback',
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: ['Feedback'],
        }),

        /* =======================
           CAREER APPLICATIONS
        ======================= */
        getCareerApplications: builder.query<{ applications: AdminCareerApplication[] }, void>({
            query: () => 'career-applications',
            providesTags: ['CareerApplication'],
        }),
        updateCareerApplication: builder.mutation<AdminCareerApplication, Partial<AdminCareerApplication> & { id: string }>({
            query: (body) => ({
                url: 'career-applications',
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['CareerApplication'],
        }),
        deleteCareerApplication: builder.mutation<{ success: boolean }, string>({
            query: (id) => ({
                url: `/career-applications?id=${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['CareerApplication'],
        }),

        /* =======================
           BLOGS
        ======================= */
        getBlogs: builder.query<{ blogs: AdminBlog[]; pagination: { total: number; pages: number } }, { page?: number; limit?: number; status?: string; category?: string; search?: string } | void>({
            query: (params) => {
                const p = params || {};
                const sp = new URLSearchParams();
                if (p.page) sp.append('page', String(p.page));
                if (p.limit) sp.append('limit', String(p.limit));
                if (p.status) sp.append('status', p.status);
                if (p.category) sp.append('category', p.category);
                if (p.search) sp.append('search', p.search);
                const qs = sp.toString() ? `?${sp.toString()}` : '';
                return `blogs${qs}`;
            },
            providesTags: ['Blog'],
        }),
        createBlog: builder.mutation<AdminBlog, Partial<AdminBlog>>({
            query: (body) => ({
                url: 'blogs',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Blog'],
        }),
        updateBlog: builder.mutation<AdminBlog, Partial<AdminBlog> & { id: string }>({
            query: (body) => ({
                url: 'blogs',
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Blog'],
        }),
        deleteBlog: builder.mutation<{ success: boolean }, string>({
            query: (id) => ({
                url: 'blogs',
                method: 'DELETE',
                body: { id },
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
} = adminApi;
