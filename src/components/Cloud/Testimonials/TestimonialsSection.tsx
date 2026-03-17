"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useAnimationFrame,
  useMotionValue,
} from "framer-motion";
import { useRef, useState, useMemo } from "react";
import Image from "next/image";
import { useDynamicTestimonials, DynamicTestimonial } from "@/lib/useDynamicTestimonials";
import { CheckCircle2 } from "lucide-react";
import "./TestimonialsSection.css";

interface TestimonialData {
  type: string;
  tag: string;
  text: string;
  name: string;
  role: string;
  avatar?: string;
  isVerified?: boolean;
}

// Feedback entirely fetched via API.

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const { testimonials: dynTestimonials } = useDynamicTestimonials("Cloud", true);

  const finalTestimonials = useMemo(() => {
    const formatted: TestimonialData[] = (dynTestimonials as DynamicTestimonial[])
      .map((t: DynamicTestimonial) => ({
        type: "wide",
        tag: "Customer Feedback",
        text: t.content,
        name: t.user.name,
        role: t.position && t.company ? `${t.position} @ ${t.company}` : 'Verified User',
        avatar: t.user.avatar,
        isVerified: t.user.isVerified
      }))
      .slice(0, 6);
    return formatted; // Entirely dynamic
  }, [dynTestimonials]);

  /* ---------------- SCROLL-BASED REVEAL ---------------- */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Physical spacing reveal (VISIBLE)
  const spacerRaw = useTransform(scrollYProgress, [0, 0.45], [0, 48]);
  const spacer = useSpring(spacerRaw, {
    stiffness: 120,
    damping: 22,
    mass: 0.8,
  });

  /* ---------------- MARQUEE ---------------- */
  const x = useMotionValue(0);
  const speed = useRef(0.09);

  useAnimationFrame((_, delta) => {
    const targetSpeed = hovered ? 0.028 : 0.09;
    speed.current += (targetSpeed - speed.current) * 0.06;
    x.set(x.get() - speed.current * delta);
  });

  return (
    <section ref={sectionRef} className="testimonials-section">
      {/* LABEL */}
      <div className="testimonials-label">
        <span className="dot" />
        TESTIMONIALS
      </div>

      {/* MARQUEE */}
      <div
        className="testimonials-viewport"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <motion.div className="testimonials-track" style={{ x }}>
          {[...finalTestimonials, ...finalTestimonials].map((item: TestimonialData, i: number) => (
            <div key={i} className="testimonial-item">
              {item.type === "wide" ? (
                <div className="testimonial-card wide">
                  <span className="tag">{item.tag}</span>
                  <p className="quote">“{item.text}”</p>
                  <div className="author">
                    <Image src={item.avatar || "/assets/Cloud/Testimonials/photo/Section.webp"} alt="" width={40} height={40} />
                    <div>
                      <strong style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {item.name}
                        {item.isVerified && <CheckCircle2 size={12} fill="#3b82f6" color="#fff" />}
                      </strong>
                      <span>{item.role}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="testimonial-card square">
                  <Image src={item.avatar || "/assets/Cloud/Testimonials/photo/Section.webp"} alt="" width={40} height={40} />
                  <strong style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                    {item.name}
                    {item.isVerified && <CheckCircle2 size={12} fill="#3b82f6" color="#fff" />}
                  </strong>
                  <span>{item.role}</span>
                </div>
              )}

              {/* 🔥 REVEAL SPACER (THE KEY EFFECT) */}
              <motion.div
                className="testimonial-spacer"
                style={{ width: spacer }}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}