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
        </motion.div>
      </div>

      <div className="wrapper">
        {/* LEFT */}
        <div className="leftCol">
          {/* LARGE */}
          <div className="card largeCard">
            <div className="cardTextWrap">
              <h3>Precision-Driven Digital Growth</h3>
              <p>
                Every project crafted with data-backed decisions and user
                insights to accelerate your digital success.
              </p>
            </div>

            <div className="graphBox">
              <div className="imageMotion">
                <PrecisionGrowthGraph />
              </div>
            </div>
          </div>

          {/* BOTTOM LEFT */}
          <div className="card wideCard">
            <div className="cardTextWrap">
              <h3>Maximize Returns, Minimize Effort</h3>
              <p>
                A fully managed development ecosystem that handles design,
                build, optimization, and deployment.
              </p>
            </div>

            <div className="imageBottom imageRight">
              <div className="imageMotion">
                <Image src="/visual.png" alt="" fill priority />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="rightCol">
          {/* RIGHT TOP */}
          <div className="card smallCard">
            <div className="cardTextWrap center">
              <h3>Diversified Digital Solutions</h3>
              <p>
                Build your digital presence with a tailored mix of websites,
                apps, UI/UX design, and SEO.
              </p>
            </div>

            <div className="imageBottomSmall imageBottomCenter">
              <div className="imageMotion">
                <Image src="/dot.png" alt="" fill />
              </div>
            </div>
          </div>

          {/* RIGHT BOTTOM */}
          <div className="card tallCard">
            <div className="cardTextWrap center">
              <h3>Your Portfolio, Optimized in Real-Time</h3>
              <p>
                Adjusted instantly with market changes to enhance investment
                efficiency.
              </p>
            </div>

            <div className="imageBottomOrbit imageBottomCenter">
              <div className="imageMotion">
                <Image src="/image@2x.png" alt="" fill priority />
              </div>
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

        /* DESKTOP CARD SIZES */
        .largeCard {
          height: 420px;
          padding-bottom: 280px;
        }

        .wideCard {
          height: 160px;
          padding-right: 300px;
        }

        .smallCard {
          height: 200px;
          padding-bottom: 140px;
        }

        .tallCard {
          height: 380px;
          padding-bottom: 300px;
        }

        .cardTextWrap {
          position: relative;
          z-index: 2;
          max-width: 80%;
        }

        .cardTextWrap.center {
          max-width: 100%;
          text-align: center;
          margin: 0 auto;
        }

        /* IMAGES */
        .imageMotion {
          position: relative;
          width: 100%;
          height: 100%;
        }

        :global(img) {
          object-fit: contain;
        }

        .graphBox {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 260px;
        }

        .imageRight {
          position: absolute;
          right: 24px;
          bottom: 0;
          width: 240px;
          height: 200px;
        }

        .imageBottomSmall {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 180px;
          height: 90px;
        }

        .imageBottomOrbit {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 280px;
          height: 200px;
        }

        /* ================= MOBILE FIX (ONLY CHANGE) ================= */

        @media (max-width: 900px) {
          .wrapper {
            flex-direction: column;
          }

          .heading {
            font-size: 38px;
          }

          /* RESET DESKTOP PADDING */
          .largeCard,
          .wideCard,
          .smallCard,
          .tallCard {
            height: auto;
            padding-bottom: 24px !important;
            padding-right: 24px !important;
          }

          /* TEXT FIX */
          .cardTextWrap {
            max-width: 100%;
          }

          .cardTextWrap.center {
            text-align: left;
          }

          /* STACK IMAGES BELOW TEXT */
          .graphBox,
          .imageRight,
          .imageBottomSmall,
          .imageBottomOrbit {
            position: relative !important;
            width: 100% !important;
            height: 200px !important;
            inset: auto !important;
            transform: none !important;
            margin-top: 16px;
          }
        }

        @media (max-width: 360px) {
          .heading {
            font-size: 32px;
          }
        }
      `}</style>
    </section>
  );
}