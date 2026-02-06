"use client";

import { motion, useInView, cubicBezier } from "framer-motion";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import ShinyText from "./ShinyText";
import SpotlightCard from "./SpotlightCard";

import {
  SiOpenai,
  SiReact,
  SiGooglecloud,
  SiFigma,
  SiAmazon,
  SiStripe,
  SiGoogleanalytics,
} from "react-icons/si";

/* =======================
   DATA (UNCHANGED INTENT)
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

const ease = cubicBezier(0.22, 1, 0.36, 1);

/* =======================
   COMPONENT
======================= */

export default function ServicesSection() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const router = useRouter();

  return (
    <section ref={ref} style={{ padding: "120px 20px" }}>
      {/* HEADING */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease }}
        style={{ textAlign: "center", marginBottom: 80 }}
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
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.6, ease }}
            whileHover={{ scale: 1.04 }}
          >
            {/* ✅ SINGLE SpotlightCard */}
            <motion.div
  whileHover={{ scale: 1.04 }}
  transition={{ type: "spring", stiffness: 260, damping: 18 }}
  onClick={() => router.push(service.route)}
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === "Enter") router.push(service.route);
  }}
>
  {/* ✅ SINGLE SpotlightCard (NO onClick here) */}
  <SpotlightCard
    spotlightColor="rgba(255, 90, 0, 0.25)"
    className="service-card"
  >
    <div className="service-icon">{service.icon}</div>
    <h3>{service.title}</h3>
    <p>{service.description}</p>
  </SpotlightCard>
</motion.div>
          </motion.div>
        ))}
      </div>

      {/* MOBILE TYPE SCALE */}
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
          .services-grid {
  grid-template-columns: repeat(3, 1fr); /* Desktop: 3 columns */
}

/* Tablet */
@media (max-width: 1024px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Mobile */
@media (max-width: 640px) {
  .services-grid {
    grid-template-columns: 1fr;
  }
}
      `}</style>
    </section>
  );
}