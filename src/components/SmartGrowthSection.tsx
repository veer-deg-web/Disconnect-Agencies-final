"use client";

import { motion } from "framer-motion";
import ShinyText from "./ShinyText";
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
      y: { duration: 0.9, ease, delay: i * 0.2 },
      opacity: { duration: 1.3, ease, delay: i * 0.2 },
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
          <ShinyText
            text="Smarter Digital Growth Starts Here"
            speed={2}
            color="#b5b5b5"
            shineColor="#FFffff"
            spread={120}
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
                viewport={{ once: true, margin: "-100px" }}
              >
                <img src={item.image} alt={item.title} />
              </motion.div>
            </div>

            {/* TEXT */}
            <div className="text-box">
              <motion.div
                variants={textVariant}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 24px;
          color: white;
          overflow: hidden; /* Prevents horizontal scroll from animations */
        }

        .heading {
          text-align: center;
          font-size: clamp(32px, 5vw, 56px); /* Responsive font sizing */
          font-weight: 700;
          margin-bottom: 60px;
          line-height: 1.1;
        }

        .features {
          display: flex;
          flex-direction: column;
          gap: 100px;
        }

        .feature-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
        }

        .feature-row.reverse {
          flex-direction: row-reverse;
        }

        .image-box {
          flex: 1;
          display: flex;
          justify-content: center;
          position: relative;
          max-width: 500px;
        }

        .orange-glow {
          position: absolute;
          inset: -40px;
          background: radial-gradient(
              circle at 30% 70%,
              rgba(255, 115, 0, 0.3),
              transparent 60%
            ),
            radial-gradient(
              circle at 70% 30%,
              rgba(255, 170, 60, 0.2),
              transparent 65%
            );
          filter: blur(50px);
          z-index: 0;
        }

        .image-box img {
          width: 100%;
          height: auto;
          max-height: 400px;
          object-fit: contain;
          position: relative;
          z-index: 1;
        }

        .text-box {
          flex: 1;
          max-width: 500px;
        }

        .text-box h3 {
          font-size: clamp(24px, 3vw, 32px);
          margin-bottom: 16px;
        }

        .text-box p {
          font-size: 16px;
          opacity: 0.7;
          line-height: 1.6;
        }

        /* Tablet Adjustments */
        @media (max-width: 1024px) {
          .feature-row {
            gap: 60px;
          }
          .section {
            padding: 100px 24px;
          }
        }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
          .section {
            padding: 60px 20px;
          }

          .heading {
            margin-bottom: 40px;
          }

          .features {
            gap: 80px;
          }

          .feature-row,
          .feature-row.reverse {
            flex-direction: column; /* Stack vertically */
            text-align: center;
            gap: 32px;
          }

          .image-box {
            width: 100%;
            max-width: 100%;
          }

          .text-box {
            max-width: 100%;
          }
        }
      `}</style>
    </section>
  );
}