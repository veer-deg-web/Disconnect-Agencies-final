"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import ShinyText from "@/components/Shared/ShinyText/ShinyText";
import SpotlightCard from "@/components/Shared/SpotlightCard/SpotlightCard";
import { EASE_SMOOTH, WILL_CHANGE_TRANSFORM } from "@/lib/animations";
import styles from "./ServicesSection.module.css";

import { 
  TbAutomation, 
  TbSeo, 
  TbWorld 
} from "react-icons/tb";
import { MdAppSettingsAlt } from "react-icons/md";
import { CiCloudOn } from "react-icons/ci";
import { VscPaintcan } from "react-icons/vsc";

/* =======================
   DATA
======================= */

type Service = {
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
};

const services: Service[] = [
  {
    title: "AI Models & Automation",
    description:
      "Our Web3 fintech simplifies complex finance for all to access.",
    icon: <TbAutomation size={22} />,
    route: "/AIModels",
  },
  {
    title: "App Development",
    description:
      "High-performance mobile and web apps built for speed and scalability.",
    icon: <MdAppSettingsAlt size={22} />,
    route: "/AppDevelopment",
  },
  {
    title: "Web Development",
    description:
      "Modern, responsive websites engineered for reliability and conversions.",
    icon: <TbWorld size={22} />,
    route: "/WebDevelopment",
  },
  {
    title: "UI/UX Design",
    description:
      "Intuitive, visually polished interfaces crafted to elevate engagement.",
    icon: <VscPaintcan size={22} />,
    route: "/Uiux",
  },
  {
    title: "SEO & Growth Optimization",
    description:
      "Data-driven strategies that boost visibility and organic traffic.",
    icon: <TbSeo size={22} />,
    route: "/SEO",
  },
  {
    title: "Cloud Services",
    description:
      "End-to-end cloud engineering for secure, scalable digital systems.",
    icon: <CiCloudOn size={22} />,
    route: "/Cloud",
  },
];

/* =======================
   SERVICE CARD (extracted to fix hooks-in-map violation)
======================= */

function ServiceCard({
  service,
  inView,
}: {
  service: Service;
  inView: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [glow, setGlow] = useState({ x: 50, y: 50 });
  const router = useRouter();

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

      setGlow({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
      });
    },
    []
  );

  const resetTilt = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform =
      "perspective(1200px) rotateX(0deg) rotateY(0deg)";
  }, []);

  useEffect(() => {
    const restore = () => resetTilt();
    window.addEventListener("pageshow", restore);
    return () => window.removeEventListener("pageshow", restore);
  }, [resetTilt]);

  const handleCardClick = () => {
    resetTilt();
    router.push(service.route);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE_SMOOTH }}
      style={WILL_CHANGE_TRANSFORM}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
        onClick={handleCardClick}
        className={styles.serviceCardWrapper}
      >
        {/* Glow Layer */}
        <div
          className={styles.cardGlow}
          style={{
            background: `radial-gradient(circle at ${glow.x}% ${glow.y}%,
              rgba(255,90,0,0.35),
              transparent 60%)`,
          }}
        />

        <SpotlightCard
          spotlightColor="rgba(255, 90, 0, 0.25)"
          className={styles.serviceCard}
        >
          <div className={styles.serviceIcon}>{service.icon}</div>
          <h3>{service.title}</h3>
          <p>{service.description}</p>
        </SpotlightCard>
      </div>
    </motion.div>
  );
}

/* =======================
   COMPONENT
======================= */

export default function ServicesSection() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <section ref={ref} className={styles.servicesSection}>
      {/* HEADING */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: EASE_SMOOTH }}
        className={styles.servicesHeadingContainer}
        style={WILL_CHANGE_TRANSFORM}
      >
        <h2 className={styles.servicesHeading}>
          <ShinyText
            text="Smarter Development."
            speed={2}
            color="#b5b5b5"
            shineColor="#ffffff"
          />
          <br />
          <ShinyText
            text="Stronger Outcomes."
            speed={2}
            color="#b5b5b5"
            shineColor="#ffffff"
          />
        </h2>
      </motion.div>

      {/* GRID */}
      <div className={styles.servicesGrid}>
        {services.map((service) => (
          <ServiceCard
            key={service.title}
            service={service}
            inView={inView}
          />
        ))}
      </div>
    </section>
  );
}
