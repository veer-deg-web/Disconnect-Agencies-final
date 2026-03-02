import { useState, useEffect } from 'react';

export interface DynamicTestimonial {
    _id: string;
    user: {
        name: string;
        avatar?: string;
    };
    content: string;
    category?: string;
    rating?: number;
    position?: string;
    company?: string;
}

export function useDynamicTestimonials() {
    const [testimonials, setTestimonials] = useState<DynamicTestimonial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const res = await fetch('/api/feedback');
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
    }, []);

    return { testimonials, loading };
}
