"use client";

import { useEffect, useState, useMemo } from "react";
import "./HeroSection.css";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
} from "react-icons/si";

import BookCallButton from "@/components/BookCallButton";
import UIUXShowcaseLogos from "@/components/uiux/UIUXShowcaseLogos";
import ShinyText from "@/components/ShinyText";
import Hyperspeed from "@/components/Hyperspeed";

const heroLogos = [
  { node: <SiReact />, title: "React" },
  { node: <SiNextdotjs />, title: "Next.js" },
  { node: <SiTypescript />, title: "TypeScript" },
  { node: <SiTailwindcss />, title: "Tailwind CSS" },
];

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  // 🔥 Memoized Hyperspeed config (prevents WebGL recreation)
  const hyperspeedOptions = useMemo(() => ({
    distortion: "turbulentDistortion",
    length: 400,
    roadWidth: 10,
    islandWidth: 2,
    lanesPerRoad: 3,
    fov: 90,
    fovSpeedUp: 150,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 20,
    lightPairsPerRoadWay: 40,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,

    lightStickWidth: [0.12, 0.5] as [number, number],
    lightStickHeight: [1.3, 1.7] as [number, number],
    movingAwaySpeed: [60, 80] as [number, number],
    movingCloserSpeed: [-120, -160] as [number, number],
    carLightsLength: [12, 80] as [number, number],
    carLightsRadius: [0.05, 0.14] as [number, number],
    carWidthPercentage: [0.3, 0.5] as [number, number],
    carShiftX: [-0.8, 0.8] as [number, number],
    carFloorSeparation: [0, 5] as [number, number],

    colors: {
      roadColor: 526344,
      islandColor: 657930,
      background: 0,
      shoulderLines: 1250072,
      brokenLines: 1250072,
      leftCars: [14177983, 6770850, 12732332],
      rightCars: [242627, 941733, 3294549],
      sticks: 242627,
    },
  }), []);
  return (<>
    <section className={`hero ${loaded ? "hero--loaded" : ""}`}>
      {/* 🔥 Hyperspeed Background */}
      <div className="hero__background">
        <Hyperspeed effectOptions={hyperspeedOptions} />
      </div>


      {/* ================= TEXT ================= */}
      <div className="hero__content">
        <p className="hero__tag">NOVA SECURES PRE-SERIES A FUNDING →</p>

        <div className="hero__title">
          <ShinyText
            text="Concepts To Launch"
            speed={2}
            delay={0}
            color="#b5b5b5"
            shineColor="#ffffff"
            spread={120}
            direction="left"
            yoyo={false}
            pauseOnHover={false}
            disabled={false}
          />

          <ShinyText
            text="We Deliver"
            speed={2}
            delay={0}
            color="#b5b5b5"
            shineColor="#ffffff"
            spread={120}
            direction="left"
            yoyo={false}
            pauseOnHover={false}
            disabled={false}
          />
        </div>

        <p className="hero__subtitle">
          We help you design, build, and scale modern mobile and web applications.
        </p>

        <div className="hero__cta">
          <BookCallButton />
        </div>
      </div>

      {/* ================= LOGOS ================= */}

    </section><div className="logos-below-phone">
      <UIUXShowcaseLogos logos={heroLogos} iconGap={200} />
    </div></>
  );
}