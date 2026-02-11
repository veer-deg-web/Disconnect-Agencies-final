"use client";

import { motion } from "framer-motion";
import "./BuildPocket.css";
import TargetCursor from "@/components/TargetCursor";
import ShinyText from "@/components/ShinyText";

import {
  SiReact,
  SiNextdotjs,
  SiFirebase,
  SiStripe,
  SiGooglecloud,
  SiApple,
  SiAmazon,
  SiVisa,
  SiTypescript,
  SiTailwindcss,
} from "react-icons/si";

const features = [
  {
    title: "App Development",
    description:
      "We design and develop powerful mobile apps tailored to your goals.",
  },
  {
    title: "Clean & Scalable Code",
    description:
      "Your app is built for speed, performance, and future growth.",
  },
  {
    title: "Smart Support & Upgrades",
    description:
      "Get expert guidance, feature improvements, and regular updates.",
  },
];

const logos = [
  { icon: <SiReact />, name: "React" },
  { icon: <SiNextdotjs />, name: "Next.js" },
  { icon: <SiFirebase />, name: "Firebase" },
  { icon: <SiStripe />, name: "Stripe" },
  { icon: <SiGooglecloud />, name: "Google Cloud" },
  { icon: <SiApple />, name: "Apple" },
  { icon: <SiAmazon />, name: "Amazon" },
  { icon: <SiVisa />, name: "Visa" },
  { icon: <SiTypescript />, name: "TypeScript" },
  { icon: <SiTailwindcss />, name: "Tailwind CSS" },
];

export default function BuildPocket() {
  return (
    <section className="build-pocket">

      {/* Scoped Cursor */}
      <TargetCursor
        spinDuration={2}
        hideDefaultCursor
        parallaxOn
        hoverDuration={0.2}
      />

      <div className="build-pocket__top">

        {/* Heading */}
        <div className="build">
          <ShinyText
            text="Everything you need,"
            speed={2}
            color="#b5b5b5"
            shineColor="#ffffff"
            spread={120}
          />
          <ShinyText
            text="Right in your pocket"
            speed={2}
            color="#b5b5b5"
            shineColor="#ffffff"
            spread={120}
          />
        </div>

        {/* Features */}
        <div className="features">
          {features.map((item, index) => (
            <motion.div
              key={index}
              className="feature-card cursor-target"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Partners */}
      <div className="partners">
        <p className="partners__title">
          Built with modern scalable technologies
        </p>

        <div className="partners__grid">
          {logos.map((item, index) => (
            <motion.div
              key={index}
              className="logo-box cursor-target"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
             <div className="logo-icon">{item.icon}</div>

<div className="logo-text">
  <div className="logo-title">{item.name}</div>
  <div className="logo-sub">Trusted Tech</div>
</div>
            </motion.div>
          ))}
        </div>

        <p className="partners__note">
          Reach out if your technology stack isn’t listed
        </p>
      </div>
    </section>
  );
  
}