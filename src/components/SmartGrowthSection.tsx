"use client";

import { motion, easeInOut, easeOut } from "framer-motion";

import ShinyText from "./ShinyText";

/* ======================
   ANIMATION VARIANTS
====================== */
const ease = easeInOut;

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
        ease: easeOut,
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
      image: "/file.png",
    },
    {
      title: "Seamless Digital Transformation",
      desc: "Craft a balanced digital ecosystem across websites, applications, UI/UX, and SEO.",
      image: "/bar.png",
      reverse: true,
    },
    {
      title: "Smart Project Risk Management",
      desc: "Predict challenges early with data-driven insights, ensuring smoother development and minimized risks.",
      image: "/dot2.png",
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
              >
                <img src={item.image} alt="" />
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
          padding: 160px 24px;
          color: white;
          position: relative;
        }

        .heading {
          text-align: center;
          font-size: 56px;
          font-weight: 700;
          margin-bottom: 120px;
          line-height: 1.1;
        }

        .features {
          display: flex;
          flex-direction: column;
          gap: 120px;
        }

        .feature-row {
          display: flex;
          align-items: center;
          gap: 240px;
        }

        .feature-row.reverse {
          flex-direction: row-reverse;
        }

        .image-box {
          width: 420px;
          height: 300px;
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
          max-width: 460px;
        }

        .text-box h3 {
          font-size: 32px;
          margin-bottom: 16px;
        }

        .text-box p {
          font-size: 16px;
          opacity: 0.7;
          margin-bottom: 24px;
          line-height: 1.6;
        }

        /* =========================
           MOBILE ONLY CHANGES
        ========================= */
        @media (max-width: 768px) {
          .heading {
            font-size: 34px;
            margin-bottom: 80px;
          }

          .feature-row,
          .feature-row.reverse {
            flex-direction: column;
            text-align: center;
            gap: 48px;
          }

          .image-box {
            width: 100%;
            height: 260px;
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