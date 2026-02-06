"use client";

import { motion } from "framer-motion";
import SpotlightCard from "@/components/SpotlightCard";
import "./TestimonialsSection.css";

const testimonials = [
  {
    text:
      "AI automation transformed our operations by eliminating repetitive tasks and improving efficiency. Scaling our workflow has never been easier!",
    name: "James Carter",
    role: "CEO at TechFlow Solutions",
    avatar: "/Section.png",
  },
  {
    text:
      "With AI, we cut manual work and improved accuracy. Our team now focuses on high-impact tasks while automation handles the rest.",
    name: "Sophia Martinez",
    role: "Operations Manager at NexaCorp",
    avatar: "/Section.png",
  },
  {
    text:
      "AI-driven insights doubled our sales efficiency. We now engage leads at the right time with smarter, data-backed decisions.",
    name: "David Reynolds",
    role: "Head of Sales at GrowthPeak",
    avatar: "/Section.png",
  },
  {
    text:
      "Customer support is now seamless. Our response times dropped drastically and satisfaction levels reached an all-time high.",
    name: "Emily Wong",
    role: "Customer Success Lead at SupportHive",
    avatar: "/Section.png",
  },
];

export default function TestimonialsSection() {
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
        {testimonials.map((item, i) => (
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
                  ★★★★★
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
                    <strong>{item.name}</strong>
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