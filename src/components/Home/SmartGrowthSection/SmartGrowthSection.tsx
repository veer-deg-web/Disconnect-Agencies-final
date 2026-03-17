"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import ShinyText from "@/components/Shared/ShinyText/ShinyText";
import { EASE_SMOOTH } from "@/lib/animations";

/* ======================
   ANIMATION VARIANTS
====================== */
const ease = EASE_SMOOTH;

const headingVariant = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease },
  },
};

const imageVariant = {
  hidden: { opacity: 0, y: 70 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      y: {
        duration: 0.9,
        ease,
        delay: i * 0.4,
      },
      opacity: {
        duration: 1.3,
        ease: EASE_SMOOTH,
        delay: i * 0.4,
      },
    },
  }),
};

const textVariant = {
  hidden: { opacity: 0, x: -50 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease,
      delay: i * 0.2 + 0.15,
    },
  }),
};

const buttonVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease,
      delay: i * 0.2 + 0.3,
    },
  }),
};

export default function SmartGrowthSection() {
  const features = [
    {
      title: "Transparent Project Performance Tracking",
      desc: "Monitor your product's progress with real-time updates, clear milestones, and easy-to-read development insights.",
      image: "/assets/Home/SmartGrowthSection/photo/file.webp",
    },
    {
      title: "Seamless Digital Transformation",
      desc: "Craft a balanced digital ecosystem across websites, applications, UI/UX, and SEO.",
      image: "/assets/Home/SmartGrowthSection/photo/bar.webp",
      reverse: true,
    },
    {
      title: "Smart Project Risk Management",
      desc: "Predict challenges early with data-driven insights, ensuring smoother development and minimized risks.",
      image: "/assets/Home/SmartGrowthSection/photo/dot2.webp",
    },
  ];

  return (
    <section className="section">
      {/* MAIN HEADING */}
      <h2 className="heading">
        <motion.span
          variants={headingVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ display: "inline-block" }}
        >
          <   ShinyText
  text="Smarter Digital Growth Starts Here "
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
          
        </motion.span>
      </h2>

      {/* FEATURES */}
      <div className="features">
        {features.map((item, index) => (
          <div
            className={`feature-row ${item.reverse ? "reverse" : ""}`}
            key={index}
          >
            {/* IMAGE */}
            <div className="image-box">
              <span className="orange-glow" />

              <motion.div
                variants={imageVariant}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                style={{ position: 'relative', width: '100%', height: '100%' }}
              >
                <Image src={item.image} alt="" fill style={{ objectFit: 'contain' }} />
              </motion.div>
            </div>

            {/* TEXT */}
            <div className="text-box">
              <motion.div
                variants={textVariant}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <h3>{item.title}</h3>
                <p>{item.desc}</p>

                <motion.div
                  variants={buttonVariant}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="cta-wrap"
                >
                  
                </motion.div>
              </motion.div>
            </div>
          </div>
        ))}
      </div>

      {/* STYLES */}
      <style jsx>{`
        .section {
          max-width: 1200px;
          margin: 0 auto;
          padding: clamp(60px, 10vw, 110px) clamp(16px, 4vw, 24px);
          color: white;
          position: relative;
        }

        .heading {
          text-align: center;
          font-size: clamp(34px, 6vw, 56px);
          font-weight: 700;
          margin-bottom: clamp(40px, 7vw, 80px);
          line-height: 1.1;
        }

        .features {
          display: flex;
          flex-direction: column;
          gap: clamp(40px, 7vw, 80px);
        }

        .feature-row {
          display: flex;
          align-items: center;
          gap: clamp(24px, 6vw, 90px);
        }

        .feature-row.reverse {
          flex-direction: row-reverse;
        }

        .image-box {
          width: clamp(300px, 36vw, 420px);
          aspect-ratio: 7 / 5;
          height: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
        }

        .orange-glow {
          position: absolute;
          inset: -60px;
          background:
            radial-gradient(
              circle at 30% 70%,
              rgba(255, 115, 0, 0.45),
              transparent 60%
            ),
            radial-gradient(
              circle at 70% 30%,
              rgba(255, 170, 60, 0.35),
              transparent 65%
            );
          filter: blur(60px);
          z-index: 0;
        }

        .image-box img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          position: relative;
          z-index: 1;
        }

        .text-box {
          max-width: clamp(320px, 42vw, 460px);
        }

        .text-box h3 {
          font-size: clamp(24px, 3.2vw, 32px);
          margin-bottom: 16px;
        }

        .text-box p {
          font-size: 16px;
          opacity: 0.7;
          margin-bottom: 24px;
          line-height: 1.6;
        }

        @media (max-width: 1100px) {
          .feature-row {
            gap: 40px;
          }

          .image-box {
            width: clamp(280px, 40vw, 380px);
          }
        }

        @media (max-width: 900px) {
          .section {
            padding-top: 60px;
            padding-bottom: 60px;
          }

          .feature-row,
          .feature-row.reverse {
            flex-direction: column;
            text-align: center;
            gap: 24px;
          }

          .image-box {
            width: min(100%, 440px);
            aspect-ratio: 16 / 10;
          }

          .text-box {
            max-width: 100%;
          }
        }

        /* =========================
           MOBILE ONLY CHANGES
        ========================= */
        @media (max-width: 768px) {
          .heading {
            font-size: 34px;
            margin-bottom: 50px;
          }

          .feature-row,
          .feature-row.reverse {
            flex-direction: column;
            text-align: center;
            gap: 24px;
          }

          .image-box {
            width: min(100%, 420px);
            aspect-ratio: 16 / 10;
            height: auto;
          }

          .orange-glow {
            inset: -40px;
          }

          .text-box {
            max-width: 100%;
          }

          /* Center BookCallButton */
          
        }

        @media (max-width: 360px) {
          .heading {
            font-size: 30px;
          }
        }
      `}</style>
    </section>
  );
}
