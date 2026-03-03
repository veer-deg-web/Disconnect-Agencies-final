import { useState, useEffect } from 'react';

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
    const [testimonials, setTestimonials] = useState<DynamicTestimonial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const params = new URLSearchParams();
                if (category) params.append('category', category);
                if (isFeatured !== undefined) params.append('isFeatured', isFeatured.toString());

                const qs = params.toString() ? `?${params.toString()}` : '';
                const res = await fetch(`/api/feedback${qs}`);

                if (res.ok) {
                    const data = await res.json();
                    setTestimonials(data.testimonials || []);
                }
            } catch (err) {
                console.error('Failed to fetch testimonials:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTestimonials();
    }, [category, isFeatured]);

    return { testimonials, loading };
}
