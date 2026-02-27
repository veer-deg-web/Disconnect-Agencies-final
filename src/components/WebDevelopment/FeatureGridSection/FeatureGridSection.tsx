"use client";

import { motion, type Variants } from "framer-motion";
import React, { useRef, useCallback } from "react";
import ShinyText from "@/components/Shared/ShinyText/ShinyText";
import SpotlightCard from "@/components/Shared/SpotlightCard/SpotlightCard";
import "./FeatureGridSection.css";

/* ============================
   TYPES
============================ */

export interface FeatureItem {
  title: string;
  description: string;
  logo: React.ReactNode;
}

interface FeaturesSectionProps {
  headingLine1: string;
  headingLine2: string;
  subheading?: string;
  items: FeatureItem[];
}

/* ============================
   ANIMATIONS
============================ */

const easeSmooth: [number, number, number, number] = [0.22, 1, 0.36, 1];

const headingVariant: Variants = {
  hidden: { opacity: 0, y: 56 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: easeSmooth },
  },
};

const gridVariant: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.25,
    },
  },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeSmooth },
  },
};

/* ============================
   COMPONENT
============================ */

export default function FeatureGridSection({
  headingLine1,
  headingLine2,
  subheading,
  items,
}: FeaturesSectionProps) {
  return (
    <section className="feature-section">
      <motion.div
        className="feature-heading-wrap"
        variants={headingVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
      >
        <div className="feature-heading-line">
          <ShinyText text={headingLine1} speed={2} color="#eaeaea" />
        </div>

        <div className="feature-heading-line second">
          <ShinyText text={headingLine2} speed={2} color="#eaeaea" />
        </div>

        {subheading && (
          <p className="feature-subheading">{subheading}</p>
        )}
      </motion.div>

      <motion.div
        className="feature-grid"
        variants={gridVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
      >
        {items.map((item, index) => (
          <FeatureCard key={index} item={item} />
        ))}
      </motion.div>
    </section>
  );
}

/* ============================
   FEATURE CARD
============================ */

function FeatureCard({ item }: { item: FeatureItem }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (window.innerWidth < 768) return;

      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `
        perspective(1200px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-8px)
      `;
    },
    []
  );

  const resetTilt = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform =
      "perspective(1200px) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <motion.div
      className="feature-card-wrap"
      variants={cardVariant}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
    >
      <SpotlightCard
        spotlightColor="rgba(217,255,63,0.25)"
        className="feature-card"
      >
        <div className="feature-logo">{item.logo}</div>
        <h3 className="feature-card-title">{item.title}</h3>
        <p className="feature-card-text">{item.description}</p>
      </SpotlightCard>
    </motion.div>
  );
}