"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import styles from "./FeaturedServices.module.css";
import type { IconType } from "react-icons";

type Props = {
  icon: IconType;
  title: string;
  role: string;
  type: string;
  date: string;
  featured?: boolean;
};

export default function FeaturedServiceCard({
  icon: Icon,
  title,
  role,
  type,
  date,
  featured,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = ((y / rect.height) - 0.5) * 16;
    const rotateY = ((x / rect.width) - 0.5) * -16;

    card.style.transform = `
      perspective(1400px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-10px)
      scale(1.02)
    `;
  };

  const resetTilt = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform =
      "perspective(1400px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
    >
      <div
        ref={cardRef}
        className={styles.card}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
      >
        <div className={styles.cardHeader}>
          <div className={styles.icon}>
            <Icon size={18} />
          </div>

          <span className={styles.cardTitle}>{title}</span>

          {featured && <span className={styles.badge}>FEATURED</span>}
        </div>

        <div className={styles.divider} />

        <p className={styles.role}>{role}</p>
        <p className={styles.type}>{type}</p>

        <button className={styles.button}>View details</button>

        <p className={styles.date}>Posted on {date}</p>
      </div>
    </motion.div>
  );
}