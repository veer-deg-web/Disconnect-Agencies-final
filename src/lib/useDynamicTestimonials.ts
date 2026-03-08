import { useGetFeedbackQuery } from '@/store/publicApi';

export interface DynamicTestimonial {
    _id: string;
    user: {
        name: string;
        avatar?: string;
        isVerified?: boolean;
    };
    content: string;
    category?: string;
    rating?: number;
    position?: string;
    company?: string;
    createdAt: string;
}

export function useDynamicTestimonials(category?: string, isFeatured?: boolean) {
    const { data, isLoading } = useGetFeedbackQuery({ category, isFeatured });

    return {
        testimonials: data?.testimonials || [],
        loading: isLoading
    };
}
