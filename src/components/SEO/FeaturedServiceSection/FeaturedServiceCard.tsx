"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./FeaturedServices.module.css";

type Props = {
  image: string;
  url: string;
};

export default function FeaturedServiceCard({ image, url }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = (y / rect.height - 0.5) * 16;
    const rotateY = (x / rect.width - 0.5) * -16;

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
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.cardAnchor}
      >
        <div
          ref={cardRef}
          className={styles.card}
          onMouseMove={handleMouseMove}
          onMouseLeave={resetTilt}
        >
          <div className={styles.imageWrapper}>
            <Image
              src={image}
              alt="Partner Page"
              width={400}
              height={300}
              className={styles.partnerImage}
            />
          </div>
        </div>
      </a>
    </motion.div>
  );
}