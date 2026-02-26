"use client"

import { motion } from "framer-motion"
import PremiumWindow from "@/components/SVG/PremiumWindow"
import OrbitalWindow from "@/components/SVG/OrbitalWindow"
import Support247Window from "@/components/SVG/Support247"
import "./FeatureSection.css"

const easeSmooth: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function FeaturesSection() {
  return (
    <section className="features">

      {/* ================= HEADER OUTSIDE WRAPPER ================= */}

      <motion.h2
        className="features__title"
        initial={{ y: 80, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: easeSmooth }}
        viewport={{ once: true }}
      >
        Create with ease like <br /> never before.
      </motion.h2>

      <motion.p
        className="features__subtitle"
        initial={{ y: 60, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease: easeSmooth }}
        viewport={{ once: true }}
      >
        Keep everyone aligned with one shared workspace built for intelligent teamwork.
        All your design files, feedback, and AI insights in one unified space.
      </motion.p>

      {/* ================= BLACK GLASS WRAPPER ================= */}

      <div className="features__wrapper">

        {/* ROW 1 */}
        <div className="features__row">

          {/* TEXT */}
          <motion.div
            className="features__textBlock"
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.1, ease: easeSmooth }}
            viewport={{ once: true }}
          >
            <span className="features__label">
              Overview of Interface
            </span>

            <h3 className="features__heading">
              Designed with an intuitive experience that users love.
            </h3>

            <p className="features__desc">
              An intuitive interface means users can quickly understand how to
              perform tasks without extensive training or guidance.
            </p>
          </motion.div>

          {/* PREMIUM WINDOW */}
          <div className="features__svg">
            <PremiumWindow themeColor="#D9FF3F" />
          </div>

        </div>

        {/* ROW 2 */}
        <div className="features__row">

          {/* ORBIT */}
          <div className="features__column">
            <div className="features__svg">
              <OrbitalWindow themeColor="#D9FF3F" />
            </div>

            <h4 className="features__cardTitle">Easy Integration</h4>
            <p className="features__cardDesc">
              Integrates with other tools and systems streamlining workflow.
            </p>
          </div>

          {/* SUPPORT */}
          <div className="features__column">
            <div className="features__svg">
              <Support247Window themeColor="#D9FF3F" />
            </div>

            <h4 className="features__cardTitle">Trusted Support Team</h4>
            <p className="features__cardDesc">
              Recognized for responses and knowledge for quick solutions.
            </p>
          </div>

        </div>

      </div>
    </section>
  )
}