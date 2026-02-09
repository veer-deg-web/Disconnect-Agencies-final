"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useAnimationFrame,
  useMotionValue,
} from "framer-motion";
import { useRef, useState } from "react";
import "./TestimonialsSection.css";

const testimonials = [
  {
    type: "wide",
    tag: "Impressive Showcase!",
    text:
      "A rebrand is not typically done in a chaotic, archaic industry like ours, so their work has really transformed how we present ourselves.",
    name: "Conor Bradley",
    role: "Senior Marketing, Spotify",
  },
  { type: "square", name: "Adrian Lee", role: "President, Cezs Jsc" },
  {
    type: "wide",
    tag: "Love to work on the next project",
    text:
      "The Agenz team truly amplified our messaging through their expert use of visuals.",
    name: "Zlatan Amberland",
    role: "PM at Dumar Inc",
  },
  { type: "square", name: "Maria Gonzales", role: "Founder, Nova Labs" },
  {
    type: "wide",
    tag: "Amazing Team!",
    text:
      "Clear communication, strong execution, and an eye for detail that really sets them apart.",
    name: "Oliver Smith",
    role: "Product Lead, Stripe",
  },
  { type: "square", name: "James Carter", role: "CTO, Cloudify" },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

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
          {[...testimonials, ...testimonials].map((item, i) => (
            <div key={i} className="testimonial-item">
              {item.type === "wide" ? (
                <div className="testimonial-card wide">
                  <span className="tag">{item.tag}</span>
                  <p className="quote">“{item.text}”</p>
                  <div className="author">
                    <img src="/Section.png" alt="" />
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.role}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="testimonial-card square">
                  <img src="/Section.png" alt="" />
                  <strong>{item.name}</strong>
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