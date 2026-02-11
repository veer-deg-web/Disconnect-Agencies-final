"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import PrecisionGrowthGraph from "@/components/PrecisionGrowthGraph";
import ShinyText from "../../ShinyText";
import "./GrowthShowcaseSection.css";

export default function GrowthShowcaseSection() {
  return (
    <section className="growth-section">
      {/* HEADING (NO ANIMATION) */}
      <div className="growth-headingWrap">
        <h2 className="growth-heading">
          <ShinyText
            text="Show Up Your Idea "
            speed={2}
            color="#b5b5b5"
            shineColor="#ffffff"
            spread={120}
          />
          <br />
          <ShinyText
            text="We Will Handle The Rest "
            speed={2}
            color="#b5b5b5"
            shineColor="#ffffff"
            spread={120}
          />
        </h2>
      </div>

      <div className="growth-wrapper">
        {/* LEFT COLUMN */}
        <div className="growth-leftCol">
          {/* LARGE CARD */}
          <div className="growth-card growth-largeCard">
            <div className="growth-cardTextWrap">
              <h3>Precision-Driven Digital Growth</h3>
              <p>
                Every project crafted with data-backed decisions and user
                insights to accelerate your digital success.
              </p>
            </div>

            <div className="growth-graphBox">
              <motion.div
                className="growth-imageMotion"
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.4, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <PrecisionGrowthGraph />
              </motion.div>
            </div>
          </div>

          {/* WIDE CARD */}
          <div className="growth-card growth-wideCard">
            <div className="growth-cardTextWrap">
              <h3>Maximize Returns, Minimize Effort</h3>
              <p>
                A fully managed development ecosystem that handles design,
                build, optimization, and deployment.
              </p>
            </div>

            <div className="growth-imageRight">
              <motion.div
                className="growth-imageMotion"
                initial={{ y: 80, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <Image
                  src="/Visual.png"
                  alt="Visual representation"
                  fill
                  sizes="(max-width: 900px) 100vw, 240px"
                  style={{ objectFit: "contain" }}
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="growth-rightCol">
          {/* SMALL CARD */}
          <div className="growth-card growth-smallCard">
            <div className="growth-cardTextWrap center">
              <h3>Diversified Digital Solutions</h3>
              <p>
                Build your digital presence with a tailored mix of websites,
                apps, UI/UX design, and SEO.
              </p>
            </div>

            <div className="growth-imageBottomSmall">
              <motion.div
                className="growth-imageMotion"
                initial={{ y: 60, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.1, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <Image
                  src="/dot.png"
                  alt="Decorative dots"
                  width={180}
                  height={90}
                  style={{ width: "100%", height: "auto" }}
                />
              </motion.div>
            </div>
          </div>

          {/* TALL CARD */}
          <div className="growth-card growth-tallCard">
            <div className="growth-cardTextWrap center">
              <h3>Your Portfolio, Optimized in Real-Time</h3>
              <p>
                Adjusted instantly with market changes to enhance investment
                efficiency.
              </p>
            </div>

            <div className="growth-imageBottomOrbit">
              <motion.div
                className="growth-imageMotion"
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <Image
                  src="/Image@2x.png"
                  alt="Orbit visual"
                  fill
                  sizes="(max-width: 900px) 100vw, 280px"
                  style={{ objectFit: "contain" }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}