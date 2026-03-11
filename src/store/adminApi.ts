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
    tagTypes: ['Faq', 'Booking', 'BookingSettings', 'User', 'Feedback', 'CareerApplication'],
    endpoints: (builder) => ({
        /* =======================
           FAQS
        ======================= */
        getFaqs: builder.query<any, void>({
            query: () => '/faq',
            providesTags: ['Faq'],
        }),
        addFaq: builder.mutation<any, any>({
            query: (body) => ({
                url: '/faq',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Faq'],
        }),
        updateFaq: builder.mutation<any, any>({
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
        getBookingSettings: builder.query<any, void>({
            query: () => '/booking-settings',
            providesTags: ['BookingSettings'],
        }),
        updateBookingSettings: builder.mutation<any, any>({
            query: (body) => ({
                url: '/booking-settings',
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['BookingSettings'],
        }),
        getBookings: builder.query<any, void>({
            query: () => '/bookings',
            providesTags: ['Booking'],
        }),
        updateBooking: builder.mutation<any, any>({
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
} = adminApi;
