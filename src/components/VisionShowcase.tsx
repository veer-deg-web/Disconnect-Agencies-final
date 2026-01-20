"use client";

import { motion } from "framer-motion";
import AnimatedToggle from "./AnimatedToggle";
import BookCallButton from "./BookCallButton";

const brands = ["Vaultic", "Altoris", "Quantora", "Fundara", "Wealthro"];

export default function VisionShowcase() {
  return (
    <section className="vision">
      {/* DOT GRID */}
      <div className="dot-bg" />

      {/* TRUSTED BY */}
      <div className="trusted">
        <p>Trusted by top innovative teams</p>

        <div className="marquee">
          <motion.div
            className="track"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            {[...brands, ...brands].map((b, i) => (
              <span style={{
                padding:"50px",
                fontSize:"30px"
              }} key={i}>{b}</span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="grid">
      <AnimatedToggle/>

        {/* TEXT */}
        <div className="text">
          <h2>Bring us your vision</h2>
          <p>
            We're the full-service development agency that handles design,
            engineering, and launch end to end.
          </p>
          <BookCallButton/>
        </div>
      </div>

      <style jsx>{`
        .vision {
          position: relative;
          background: black;
          color: white;
          overflow: hidden;
        }

        /* DOT GRID */
        .dot-bg {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(
            rgba(255, 122, 24, 0.18) 1px,
            transparent 1px
          );
          background-size: 24px 24px;
        }

        /* TRUSTED */
        .trusted {
          position: relative;
          z-index: 2;
          text-align: center;
          padding-top: 80px;
        }

        .trusted p {
          opacity: 0.7;
          margin-bottom: 32px;
        }

        .marquee {
          overflow: hidden;
          mask-image: linear-gradient(
            to right,
            transparent,
            black 10%,
            black 90%,
            transparent
          );
        }

        .track {
          display: flex;
          gap: 48px;
          width: max-content;
        }

        .track span {
          font-size: 18px;
          font-weight: 600;
          opacity: 0.85;
        }

        /* GRID */
        .grid {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 100px auto 0;
          padding: 0 24px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        /* TOGGLE */
        .toggle-wrap {
          position: relative;
          display: flex;
          justify-content: center;
        }

        .glow-bg {
          position: absolute;
          width: 420px;
          height: 200px;
          background: radial-gradient(
            circle,
            rgba(255, 122, 24, 0.35),
            transparent 70%
          );
          filter: blur(40px);
        }

        .capsule {
          position: relative;
          width: 340px;
          height: 64px;
          border-radius: 999px;
          background: linear-gradient(
            to right,
            rgba(255, 122, 24, 0.35),
            rgba(255, 122, 24, 0.12)
          );
          border: 1px solid rgba(255, 122, 24, 0.8);
        }

        .cap-icon {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: #ff7a18;
          border: 1px solid rgba(255, 122, 24, 0.7);
          background: rgba(0, 0, 0, 0.5);
        }

        .cap-icon.left {
          left: 10px;
        }

        .cap-icon.right {
          right: 10px;
        }

        .knob {
          position: absolute;
          top: 50%;
          left: 10px;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: white;
          box-shadow:
            0 0 25px rgba(255, 122, 24, 0.9),
            0 0 60px rgba(255, 122, 24, 0.6);
        }

        /* TEXT */
        .text h2 {
          font-size: 48px;
          line-height: 1.1;
        }

        .text p {
          margin-top: 24px;
          max-width: 520px;
          opacity: 0.7;
          line-height: 1.6;
        }

        .text button {
          margin-top: 40px;
          padding: 12px 24px;
          border-radius: 999px;
          background: white;
          color: black;
          border: none;
          cursor: pointer;
          font-weight: 500;
        }

        @media (max-width: 900px) {
          .grid {
            grid-template-columns: 1fr;
            gap: 64px;
          }

          .text h2 {
            font-size: 36px;
          }
        }
      `}</style>
    </section>
  );
}
