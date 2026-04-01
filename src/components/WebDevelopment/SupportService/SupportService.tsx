"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import SpotlightCard from "@/components/Shared/SpotlightCard/SpotlightCard";
import "./SupportService.css";

/* ================= ANIMATIONS ================= */

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const textUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const cardUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

const textLeft: Variants = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ================= SCRIBBLE COUNTER ================= */

function useScribbleNumber(finalValue: number, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const progress = Math.min((Date.now() - start) / duration, 1);

      if (progress < 1) {
        setValue(Math.floor(Math.random() * 99));
      } else {
        setValue(finalValue);
        clearInterval(interval);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [finalValue, duration]);

  return value;
}

/* ================= COMPONENT ================= */

export default function SupportSection() {
  const years = useScribbleNumber(15);
  const satisfaction = useScribbleNumber(98);

  return (
    <section className="support-section">
      {/* TITLE */}
      <motion.h2
        className="support-title"
        variants={textUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        Supported by many <br />
        companies around the world
      </motion.h2>

      {/* GRID */}
      <motion.div
        className="support-grid"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {/* BIG CARD */}
        <motion.div variants={cardUp} className="support-item large">
          <SpotlightCard
            className="support-card refined-layout"
            spotlightColor="rgba(199, 255, 26, 0.15)"
          >
            <span className="pill">CEO’s Words</span>

            <div className="partner-images-grid">
              <a
                href="https://doctar.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="partner-link"
              >
                <Image
                  src="/assets/Partners/doctar.webp"
                  alt="Doctar"
                  width={200}
                  height={120}
                  className="partner-img"
                />
              </a>
              <a
                href="https://sixfinance.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="partner-link"
              >
                <Image
                  src="/assets/Partners/sixfinance.webp"
                  alt="Six Finance"
                  width={200}
                  height={120}
                  className="partner-img"
                />
              </a>
              <a
                href="https://www.six.ind.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="partner-link"
              >
                <Image
                  src="/assets/Partners/six.webp"
                  alt="Six"
                  width={200}
                  height={120}
                  className="partner-img"
                />
              </a>
            </div>

            <motion.p className="quote" variants={textLeft}>
              “At Disconnect, we don’t just build products; we bridge the gap
              between complex technology and intuitive human experiences. Our
              commitment is to deliver excellence that fuels your vision.”
            </motion.p>

            <div className="card-footer">
              <motion.div className="bio-left" variants={textLeft}>
                <strong>Aditya Singh Rajput</strong>
                <span>
                  Founder of Doctar, Six Finance, and Six Buy and Sell
                </span>
              </motion.div>

              <div className="logo-pill">
                <Image
                  src="/assets/logos SVG/finance logo.svg"
                  alt="Six Finance"
                  width={100}
                  height={30}
                  className="brand-logo-img"
                />
                <Image
                  src="/assets/logos SVG/six logo.svg"
                  alt="Six"
                  width={100}
                  height={30}
                  className="brand-logo-img"
                />
                <Image
                  src="/assets/logo.png"
                  alt="Disconnect"
                  width={120}
                  height={40}
                  className="brand-logo-img main"
                />
              </div>
            </div>
          </SpotlightCard>
        </motion.div>

        {/* SMALL CARD — YEARS */}
        <motion.div variants={cardUp} className="support-item small">
          <SpotlightCard
            className="support-card"
            spotlightColor="rgba(0, 229, 255, 0.18)"
          >
            <span className="pill light">Years of experiences</span>
            <h3>{years}+</h3>
            <p>
              Delivering functional, timeless spaces with innovation,
              precision, and great design.
            </p>
          </SpotlightCard>
        </motion.div>

        {/* SMALL CARD — SATISFACTION */}
        <motion.div variants={cardUp} className="support-item small">
          <SpotlightCard
            className="support-card"
            spotlightColor="rgba(255, 255, 255, 0.12)"
          >
            <span className="pill light">Client satisfaction rate</span>
            <h3>{satisfaction}%</h3>
            <p>
              We pride ourselves on delivering excellence, reflected in the
              high satisfaction of every client.
            </p>
          </SpotlightCard>
        </motion.div>
      </motion.div>
    </section>
  );
}