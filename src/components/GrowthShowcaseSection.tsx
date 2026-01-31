"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import PrecisionGrowthGraph from "@/components/PrecisionGrowthGraph";
import ShinyText from "./ShinyText";

const ease = [0.22, 1, 0.36, 1] as const;

export default function GrowthShowcaseSection() {
  return (
    <section className="section">
      {/* HEADING */}
      <div className="headingWrap">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease }}
          viewport={{ once: true }}
        >
          <h2 className="heading">
            < ShinyText
  text="Show Up Your Idea "
  speed={2}
  delay={0}
  color="#b5b5b5"
  shineColor="#FFffff"
  spread={120}
  direction="left"
  yoyo={false}
  pauseOnHover={false}
  disabled={false}
/><br />
< ShinyText
  text="We Will Handle The Rest "
  speed={2}
  delay={0}
  color="#b5b5b5"
  shineColor="#FFffff"
  spread={120}
  direction="left"
  yoyo={false}
  pauseOnHover={false}
  disabled={false}
/>
           
          </h2>
        </motion.div>
      </div>

      <div className="wrapper">
        {/* LEFT */}
        <div className="leftCol">
          {/* LARGE CARD */}
          <div className="card largeCard">
            <div className="cardTextWrap">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease }}
                viewport={{ once: true }}
              >
                <h3>Precision-Driven Digital Growth</h3>
                <p>
                  Every project crafted with data-backed decisions and user
                  insights to accelerate your digital success.
                </p>
              </motion.div>
            </div>

            <div className="graphBox">
              <motion.div
                className="imageMotion"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease }}
                viewport={{ once: true }}
              >
                <PrecisionGrowthGraph />
              </motion.div>
            </div>
          </div>

          {/* WIDE CARD */}
          <div className="card wideCard">
            <div className="cardTextWrap">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease }}
                viewport={{ once: true }}
              >
                <h3>Maximize Returns, Minimize Effort</h3>
                <p>
                  A fully managed development ecosystem that handles design,
                  build, optimization, and deployment.
                </p>
              </motion.div>
            </div>

            <div className="imageBottom">
              <motion.div
                className="imageMotion"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease }}
                viewport={{ once: true }}
              >
                <Image src="/visual.png" alt="" fill priority />
              </motion.div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="rightCol">
          {/* SMALL */}
          <div className="card smallCard">
            <div className="cardTextWrap">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease }}
                viewport={{ once: true }}
              >
                <h3>Diversified Digital Solutions</h3>
                <p>
                  Build your digital presence with a tailored mix of websites,
                  apps, UI/UX design, and SEO.
                </p>
              </motion.div>
            </div>

            <div className="imageBottomSmall">
              <motion.div
                className="imageMotion"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease }}
                viewport={{ once: true }}
              >
                <Image src="/dot.png" alt="" fill />
              </motion.div>
            </div>
          </div>

          {/* TALL */}
          <div className="card tallCard">
            <div className="cardTextWrap">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease }}
                viewport={{ once: true }}
              >
                <h3>Your Portfolio, Optimized in Real-Time</h3>
                <p>
                  Adjusted instantly with market changes to enhance investment
                  efficiency.
                </p>
              </motion.div>
            </div>

            <div className="imageBottomOrbit">
              <motion.div
                className="imageMotion"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease }}
                viewport={{ once: true }}
              >
                <Image src="/image@2x.png" alt="" fill priority />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* STYLES */}
      <style jsx>{`
        .section {
          max-width: 1240px;
          margin: 0 auto;
          padding: 110px 24px;
          color: white;
        }

        .headingWrap {
          margin-bottom: 56px;
        }

        .heading {
          text-align: center;
          font-size: 52px;
          font-weight: 700;
          line-height: 1.15;
        }

        .wrapper {
          display: flex;
          gap: 10px;
        }

        .leftCol,
        .rightCol {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .leftCol {
          flex: 2;
        }

        .rightCol {
          flex: 1;
        }

        .card {
          background: #121212;
          border-radius: 18px;
          padding: 24px;
          border: 1px solid rgba(255, 122, 24, 0.32);
          position: relative;
          overflow: hidden;
        }

        .largeCard {
          height: 420px;
        }
        .wideCard {
          height: 160px;
        }
        .smallCard {
          height: 200px;
        }
        .tallCard {
          height: 380px;
        }

        .cardTextWrap {
          position: relative;
          z-index: 2;
          max-width: 80%;
        }

        .rightCol .cardTextWrap {
          max-width: 100%;
          text-align: center;
          margin: 0 auto;
        }

        .graphBox {
          position: absolute;
          inset: auto 0 0 0;
          height: 260px;
        }

        .imageBottom {
          position: absolute;
          bottom: 12px;
          right: 24px;
          width: 240px;
          height: 200px;
        }

        .imageBottomSmall {
          position: absolute;
          bottom: 14px;
          left: 50%;
          transform: translateX(-50%);
          width: 200px;
          height: 110px;
        }

        .imageBottomOrbit {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          width: 280px;
          height: 280px;
        }

        /* 🔥 THIS IS THE KEY FIX */
        .imageMotion {
          position: relative;
          width: 100%;
          height: 100%;
          will-change: transform, opacity;
        }

        :global(img) {
          object-fit: contain;
        }

        @media (max-width: 900px) {
          .wrapper {
            flex-direction: column;
          }

          .heading {
            font-size: 38px;
          }
        }
      `}</style>
    </section>
  );
}
