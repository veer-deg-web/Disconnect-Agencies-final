"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import SpotlightCard from "@/components/Shared/SpotlightCard/SpotlightCard";
import { useDynamicTestimonials, DynamicTestimonial } from "@/lib/useDynamicTestimonials";
import { CheckCircle2 } from "lucide-react";
import "./TestimonialsSection.css";

interface TestimonialData {
  text: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  isVerified?: boolean;
}

const testimonials: TestimonialData[] = [
  {
    text:
      "AI automation transformed our operations by eliminating repetitive tasks and improving efficiency. Scaling our workflow has never been easier!",
    name: "James Carter",
    role: "CEO at TechFlow Solutions",
    avatar: "/assets/AIModels/Testimoninals/photo/Section.webp",
    rating: 5,
  },
  {
    text:
      "With AI, we cut manual work and improved accuracy. Our team now focuses on high-impact tasks while automation handles the rest.",
    name: "Sophia Martinez",
    role: "Operations Manager at NexaCorp",
    avatar: "/assets/AIModels/Testimoninals/photo/Section.webp",
    rating: 5,
  },
  {
    text:
      "AI-driven insights doubled our sales efficiency. We now engage leads at the right time with smarter, data-backed decisions.",
    name: "David Reynolds",
    role: "Head of Sales at GrowthPeak",
    avatar: "/assets/AIModels/Testimoninals/photo/Section.webp",
    rating: 5,
  },
  {
    text:
      "Customer support is now seamless. Our response times dropped drastically and satisfaction levels reached an all-time high.",
    name: "Emily Wong",
    role: "Customer Success Lead at SupportHive",
    avatar: "/assets/AIModels/Testimoninals/photo/Section.webp",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const { testimonials: dynTestimonials } = useDynamicTestimonials("AI", true);

  const finalTestimonials = useMemo(() => {
    const formatted: TestimonialData[] = (dynTestimonials as DynamicTestimonial[])
      .map((t: DynamicTestimonial) => ({
        text: t.content,
        name: t.user.name,
        role: t.position && t.company ? `${t.position} @ ${t.company}` : 'Verified User',
        avatar: t.user.avatar || "/assets/AIModels/Testimoninals/photo/Section.webp",
        rating: t.rating || 5,
        isVerified: t.user.isVerified
      }))
      .slice(0, 4);
    return formatted.length > 0 ? formatted : testimonials; // Dummy fallback if empty
  }, [dynTestimonials]);

  return (
    <section className="testimonials-section">
      {/* LABEL */}
      <motion.span
        className="testimonials-label"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Testimonials
      </motion.span>

      {/* HEADING */}
      <motion.h2
        className="testimonials-heading"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Why Businesses Love <br /> Our AI Solutions
      </motion.h2>

      {/* SUBTEXT */}
      <motion.p
        className="testimonials-subtext"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Real businesses, real results with AI automation.
      </motion.p>

      {/* GRID */}
      <div className="testimonials-grid">
        {finalTestimonials.map((item: TestimonialData, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 + i * 0.1 }}
          >
            <SpotlightCard
              className="testimonial-card"
              spotlightColor="rgba(124, 58, 237, 0.25)"
            >
              <div className="testimonial-content">
                {/* STARS */}
                <div className="testimonial-stars">
                  {'★'.repeat(item.rating || 5)}{'☆'.repeat(10 - (item.rating || 5))}
                </div>

                {/* TEXT */}
                <p className="testimonial-text">
                  “{item.text}”
                </p>

                {/* AUTHOR */}
                <div className="testimonial-author">
                  <img
                    src={item.avatar}
                    alt={item.name}
                  />
                  <div>
                    <strong style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {item.name}
                      {item.isVerified && <CheckCircle2 size={12} fill="#3b82f6" color="#fff" />}
                    </strong>
                    <span>{item.role}</span>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}