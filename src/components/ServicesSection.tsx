"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import ShinyText from "./ShinyText";
import SpotlightCard from "./SpotlightCard";
import { EASE_SMOOTH, WILL_CHANGE_TRANSFORM } from "@/lib/animations";

import {
  SiOpenai,
  SiReact,
  SiGooglecloud,
  SiFigma,
  SiAmazon,
  SiGoogleanalytics,
} from "react-icons/si";

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
    icon: <SiOpenai size={22} />,
    route: "/AIModels",
  },
  {
    title: "App Development",
    description:
      "High-performance mobile and web apps built for speed and scalability.",
    icon: <SiReact size={22} />,
    route: "/AppDevelopment",
  },
  {
    title: "Web Development",
    description:
      "Modern, responsive websites engineered for reliability and conversions.",
    icon: <SiGooglecloud size={22} />,
    route: "/WebDevelopment",
  },
  {
    title: "UI/UX Design",
    description:
      "Intuitive, visually polished interfaces crafted to elevate engagement.",
    icon: <SiFigma size={22} />,
    route: "/Uiux",
  },
  {
    title: "SEO & Growth Optimization",
    description:
      "Data-driven strategies that boost visibility and organic traffic.",
    icon: <SiGoogleanalytics size={22} />,
    route: "/SEO",
  },
  {
    title: "Cloud Services",
    description:
      "End-to-end cloud engineering for secure, scalable digital systems.",
    icon: <SiAmazon size={22} />,
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
        onClick={() => router.push(service.route)}
        style={{
          position: "relative",
          transformStyle: "preserve-3d",
          transition:
            "transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease",
        }}
      >
        {/* Glow Layer */}
        <div
          className="card-glow"
          style={{
            background: `radial-gradient(circle at ${glow.x}% ${glow.y}%,
              rgba(255,90,0,0.35),
              transparent 60%)`,
          }}
        />

        <SpotlightCard
          spotlightColor="rgba(255, 90, 0, 0.25)"
          className="service-card"
        >
          <div className="service-icon">{service.icon}</div>
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
    <section ref={ref} style={{ padding: "120px 20px" }}>
      {/* HEADING */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: EASE_SMOOTH }}
        style={{ textAlign: "center", marginBottom: 80, ...WILL_CHANGE_TRANSFORM }}
      >
        <h2 className="services-heading">
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
      <div
        className="services-grid"
        style={{
          display: "grid",
          gap: 24,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {services.map((service) => (
          <ServiceCard
            key={service.title}
            service={service}
            inView={inView}
          />
        ))}
      </div>

      {/* STYLES */}
      <style>{`
        .services-heading {
          font-size: clamp(1.8rem, 4vw, 3rem);
          font-weight: 700;
        }

        .service-card {
          padding: 28px;
          cursor: pointer;
        }

        .service-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: rgba(255,90,0,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          color: #ff5a00;
        }

        .service-card h3 {
          font-size: 1.1rem;
          margin-bottom: 8px;
        }

        .service-card p {
          font-size: 0.95rem;
          line-height: 1.6;
          color: rgba(255,255,255,0.75);
        }

        .card-glow {
          position: absolute;
          inset: -2px;
          border-radius: 20px;
          pointer-events: none;
          transition: background 0.2s ease;
          z-index: 0;
          opacity: 0.9;
        }

        .service-card {
          position: relative;
          z-index: 1;
          border-radius: 20px;
          box-shadow:
            0 20px 50px rgba(0,0,0,0.6),
            0 0 0 1px rgba(255,255,255,0.05);
          transition:
            transform 0.4s cubic-bezier(0.22,1,0.36,1),
            box-shadow 0.4s ease;
        }

        .services-grid {
          grid-template-columns: repeat(3, 1fr);
        }

        @media (max-width: 1024px) {
          .services-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .services-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}