"use client";

import { motion } from "framer-motion";
import Cubes from "./Cubes";
import ShinyText from './ShinyText';
import UIUXShowcaseLogos from "./uiux/UIUXShowcaseLogos";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
} from "react-icons/si";
const heroLogos = [
  { node: <SiReact />, title: "React" },
  { node: <SiNextdotjs />, title: "Next.js" },
  { node: <SiTypescript />, title: "TypeScript" },
  { node: <SiTailwindcss />, title: "Tailwind CSS" },
];


const brands = ["Vaultic", "Altoris", "Quantora", "Fundara", "Wealthro"];

export default function VisionShowcase() {
  return (
    <section className="vision">
      {/* DOT GRID */}
      <div className="dot-bg" />

      {/* TRUSTED BY */}
      <div className="trusted">


        <UIUXShowcaseLogos
          logos={heroLogos}
          title="Trusted By Top Innovative Teams"
          logoSize={60}
          iconGap={200}
        />
      </div>

      {/* CONTENT */}
      <div className="grid">
        {/* TEXT */}
        <div className="text">
          <h2> <ShinyText
            text="Bring us your vision"
            speed={2}
            delay={0}
            color="#b5b5b5"
            shineColor="#FF5C00"
            spread={120}
            direction="left"
            yoyo={false}
            pauseOnHover={false}
            disabled={false}
          /></h2>
          <p>
            We're the full-service development agency that handles design,
            engineering, and launch end to end.
          </p>
        </div>

        {/* TOGGLE */}
        <div className="toggle-wrap">
          <Cubes
            gridSize={6}
            maxAngle={30}
            radius={3}
            borderStyle="2px dashed #FF8C32"
            faceColor="#141414"
            rippleColor="#FF6B00"
            rippleSpeed={1.5}
            autoAnimate
            rippleOnClick
          />
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

        /* MARQUEE */
        .marquee {
          overflow: hidden;
          display: flex;
          justify-content: center;
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
          align-items: center;
          gap: 48px;
          width: max-content;
        }

        .brand {
          padding: 50px;
          font-size: 30px;
          font-weight: 600;
          opacity: 0.85;
          white-space: nowrap;
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

        .toggle-wrap {
          display: flex;
          justify-content: center;
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
        }

        /* ================= MOBILE ONLY ================= */
        @media (max-width: 900px) {
          .grid {
            grid-template-columns: 1fr;
            gap: 56px;
          }

          .text {
            order: 1;
            text-align: center;
          }

          .toggle-wrap {
            order: 2;
          }

          /* Smaller text */
          .text h2 {
            font-size: 34px;
          }

          .text p {
            font-size: 15px;
            margin: 16px auto 0;
          }

          .text button {
            margin: 32px auto 0;
          }

          /* Smaller marquee items */
          .brand {
            padding: 24px;
            font-size: 18px;
          }

          .track {
            gap: 24px;
          }
        }
      `}</style>
    </section>
  );
}
