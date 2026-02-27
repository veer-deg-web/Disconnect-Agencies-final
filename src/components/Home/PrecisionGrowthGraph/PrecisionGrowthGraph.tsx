"use client";

import { useEffect, useRef, useState } from "react";

/* ======================
   GRAPH CONFIG
====================== */
const GRAPH_PATH =
  "M0 320 L80 300 L100 290 L125 300 L160 280 L240 260 L320 260 L400 220 L480 180 L560 180 L640 180 L720 180 L800 140 L880 110 L1000 90";

const PATH_LENGTH = 2000;

/* ======================
   COMPONENT
====================== */
export default function PrecisionGrowthGraph() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let target = 0;
    let rafId: number;

    const animate = () => {
      progressRef.current += (target - progressRef.current) * 0.08;
      setProgress(progressRef.current);

      if (Math.abs(target - progressRef.current) > 0.001) {
        rafId = requestAnimationFrame(animate);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        target = entry.isIntersecting ? 0.5 : 0;
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(animate);
      },
      { threshold: 0.4 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  /* ======================
     DOT POSITION
  ====================== */
  const dotX = 1000 * progress;
  const dotY = 180;

  return (
    <div ref={containerRef} className="graph">
      <svg viewBox="0 0 1000 400" width="100%" height="100%">
        <defs>
          {/* FULL GRADIENT — ALWAYS VISIBLE */}
          <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff5a00" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#ff5a00" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ff5a00" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ======================
            AREA (STATIC)
        ====================== */}
        <path
          d={`${GRAPH_PATH} L1000 400 L0 400 Z`}
          fill="url(#area)"
        />

        {/* ======================
            LINE (ANIMATED)
        ====================== */}
        <path
          d={GRAPH_PATH}
          fill="none"
          stroke="#ff5a00"
          strokeWidth={6}
          strokeLinecap="round"
          style={{
            strokeDasharray: PATH_LENGTH,
            strokeDashoffset: PATH_LENGTH - PATH_LENGTH * progress,
          }}
        />

        {/* ======================
            GUIDE LINE
        ====================== */}
        <line
          x1={dotX}
          y1={dotY}
          x2={dotX}
          y2={400}
          stroke="white"
          opacity={0.35}
        />

        {/* ======================
            GLOW DOT
        ====================== */}
        <circle cx={dotX} cy={dotY} r={26} fill="#ff5a00" opacity={0.15} />
        <circle cx={dotX} cy={dotY} r={14} fill="#ff5a00" opacity={0.35} />
        <circle cx={dotX} cy={dotY} r={6} fill="#ffffff" />
      </svg>

      <style jsx>{`
        .graph {
          width: 100%;
          height: 260px;
        }
      `}</style>
    </div>
  );
}
