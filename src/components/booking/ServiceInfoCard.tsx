"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import { serviceData, CategoryType } from "@/components/data/serviceData";
import "./ServiceInfoCard.css";

interface ServiceInfoCardProps {
  category: CategoryType;
}

export default function ServiceInfoCard({ category }: ServiceInfoCardProps) {
  const data = serviceData[category];
  const cardRef = useRef<HTMLDivElement>(null);

  // 🔥 Motion values for tilt
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const smoothX = useSpring(rotateX, { stiffness: 120, damping: 15 });
  const smoothY = useSpring(rotateY, { stiffness: 120, damping: 15 });

  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const percentX = (x - centerX) / centerX;
    const percentY = (y - centerY) / centerY;

    rotateX.set(percentY * -10);
    rotateY.set(percentX * 10);

    setGlowPosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const resetTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      key={category}
      className="service-card"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        rotateX: smoothX,
        rotateY: smoothY,
        transformPerspective: 1200,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
    >
      {/* 🔥 Glow Layer */}
      <div
        className="card-glow"
        style={{
          background: `radial-gradient(
            600px circle at ${glowPosition.x}% ${glowPosition.y}%,
            rgba(124,58,237,0.35),
            transparent 60%
          )`,
        }}
      />

      <img
        src={data.image}
        className="service-card__image"
        alt={data.title}
      />

      <h2 className="service-card__title">{data.title}</h2>

      <div className="service-card__meta">
        <p>📂 Category – {data.title}</p>
        <p>⏱ Duration – {data.duration}</p>
        <p>💬 Meeting details will be emailed after confirmation</p>
        <p>💲 Starts from {data.price}</p>
      </div>

      <p className="service-card__note">
        Hey looking forward to getting on a call,
        would appreciate it if you can give me some pre-context
        before the event!
      </p>
    </motion.div>
  );
}