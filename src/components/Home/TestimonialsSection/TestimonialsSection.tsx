"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import Image from "next/image";
import { EASE_SMOOTH, WILL_CHANGE_TRANSFORM_ONLY } from "@/lib/animations";
import { useDynamicTestimonials, DynamicTestimonial } from "@/lib/useDynamicTestimonials";
import { CheckCircle2 } from "lucide-react";
import styles from "./TestimonialsSection.module.css";

/* =======================
   DATA
======================= */

type Testimonial = {
  name: string;
  role: string;
  quote: string;
  isVerified?: boolean;
};

/* =======================
   ANIMATION CONFIG
======================= */

const ease = EASE_SMOOTH;

const textVariant = {
  hidden: { opacity: 0, x: -80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1,
      ease,
    },
  },
};

const columnsVariant = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease,
      delay: 0.4,
    },
  },
};

/* =======================
   COMPONENT
======================= */

export default function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const [startScroll, setStartScroll] = useState(false);
  const { testimonials: dynTestimonials } = useDynamicTestimonials("Home", true);

  const { finalLeftColumn, finalRightColumn } = useMemo(() => {
    const formatted: Testimonial[] = (dynTestimonials as DynamicTestimonial[])
      .map((t: DynamicTestimonial) => ({
        name: t.user.name,
        role: t.position && t.company ? `${t.position} @ ${t.company}` : "Verified User",
        quote: t.content,
        isVerified: t.user.isVerified,
        avatar: t.user.avatar,
        position: t.position,
        company: t.company,
        rating: t.rating
      }))
      .slice(0, 6);

    const mid = Math.ceil(formatted.length / 2);
    return {
      finalLeftColumn: formatted.slice(0, mid),
      finalRightColumn: formatted.slice(mid)
    };
  }, [dynTestimonials]);

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.container}>
        {/* LEFT TEXT */}
        <motion.div
          variants={textVariant}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className={styles.leftContent}
        >
          <h2 className={styles.heading}>
            Trusted by
            <br />
            Visionary Investors
          </h2>

          <p className={styles.subtitle}>
            Discover How Users Are Transforming Their Investment Journey With Intelligent, AI-Powered Insights. Make Smarter Decisions With Real-Time Data And Predictive Analytics.Also, Unlock New Opportunities And Stay Ahead In A Rapidly Evolving Market.
          </p>
        </motion.div>

        {/* RIGHT COLUMNS */}
        <motion.div
          variants={columnsVariant}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className={styles.rightContent}
          onAnimationComplete={() => setStartScroll(true)}
        >
          {/* COLUMN 1 (always visible) */}
          <motion.div
            className={styles.column}
            style={WILL_CHANGE_TRANSFORM_ONLY}
            animate={startScroll ? { y: ["0%", "-50%"] } : { y: 0 }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...finalLeftColumn, ...finalLeftColumn].map((item, i) => (
              <TestimonialCard key={`left-${i}`} {...item} />
            ))}
          </motion.div>

          {/* COLUMN 2 (hidden on mobile) */}
          <motion.div
            className={`${styles.column} ${styles.hideMobile}`}
            style={WILL_CHANGE_TRANSFORM_ONLY}
            animate={startScroll ? { y: ["-50%", "0%"] } : { y: 0 }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...finalRightColumn, ...finalRightColumn].map((item, i) => (
              <TestimonialCard key={`right-${i}`} {...item} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* =======================
   CARD
======================= */

function TestimonialCard({ name, role, quote, avatar, isVerified }: Testimonial & { avatar?: string }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        {avatar ? (
          <Image
            src={avatar}
            alt={name}
            width={42}
            height={42}
            className={styles.avatar}
          />
        ) : (
          <Image
            src="/assets/Home/TestimonialsSection/photo/Section.webp"
            alt={name}
            width={42}
            height={42}
            className={styles.avatar}
          />
        )}
        <div>
          <div className={styles.name}>
            {name}
            {isVerified && <CheckCircle2 size={13} fill="#3b82f6" color="#fff" style={{ display: 'inline-block', marginLeft: '6px', verticalAlign: 'middle' }} />}
          </div>
          <div className={styles.role}>{role}</div>
        </div>
      </div>
      <p className={styles.quote}>{quote}</p>
    </div>
  );
}