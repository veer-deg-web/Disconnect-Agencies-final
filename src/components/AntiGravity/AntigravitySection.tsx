"use client";

import React, { useEffect, useRef, useState } from "react";
import "./AntigravitySection.css";

type AntigravityProps = {
  label?: string;
  title: string; // supports \n
  buttonText?: string;
};

type Particle = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  size: number;
};

const AntigravitySection = ({
  label = "For Developers",
  title,
  buttonText = "Download",
}: AntigravityProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const [isActive, setIsActive] = useState(false);
  const [hasHover, setHasHover] = useState(false);

  /* =========================
     HOVER CAPABILITY DETECTION
  ========================= */
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover)");
    setHasHover(mq.matches);

    const handler = (e: MediaQueryListEvent) =>
      setHasHover(e.matches);

    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* =========================
     SCROLL (DEVICES WITHOUT HOVER)
  ========================= */
  useEffect(() => {
    if (hasHover || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsActive(true);
          observer.disconnect(); // once
        }
      },
      {
        threshold: 0.45,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasHover]);

  /* =========================
     PARTICLE SYSTEM
  ========================= */
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let particles: Particle[] = [];

    const init = () => {
      const rect = section.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      const width = rect.width;
      const height = rect.height;

      const tCanvas = document.createElement("canvas");
      const tCtx = tCanvas.getContext("2d");
      if (!tCtx) return;

      tCanvas.width = width;
      tCanvas.height = height;

      /* =========================
         RESPONSIVE BRACKET SIZE
      ========================= */
      let fontSize: number;

      if (width <= 480) {
        // 📱 Mobile (344px safe)
        fontSize = Math.min(width * 0.6, height * 0.45, 110);
      } else if (width <= 1024) {
        // 📱 Tablet
        fontSize = Math.min(width * 0.55, height * 0.5, 160);
      } else {
        // 🖥 Desktop (large, premium)
        fontSize = Math.min(width * 0.5, height * 0.55, 220);
      }

      tCtx.clearRect(0, 0, width, height);
      tCtx.fillStyle = "#fff";
      tCtx.font = `bold ${fontSize}px monospace`;
      tCtx.textAlign = "center";
      tCtx.textBaseline = "middle";

      /* 🔒 SINGLE BRACKET */
      tCtx.fillText("{    }", width / 2, height / 2);

      const data = tCtx.getImageData(0, 0, width, height).data;
      const points: { x: number; y: number }[] = [];

      for (let y = 0; y < height; y += 6) {
        for (let x = 0; x < width; x += 6) {
          const i = (y * width + x) * 4;
          if (data[i + 3] > 150) points.push({ x, y });
        }
      }

      particles = points.map((p) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        targetX: p.x,
        targetY: p.y,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.4 + 0.4,
      }));
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        if (isActive) {
          // 🧲 FORMATION
          p.x += (p.targetX - p.x) * 0.08;
          p.y += (p.targetY - p.y) * 0.08;
          ctx.fillStyle = "#4285f4";
        } else {
          // 🌊 FREE FLOAT
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;

          ctx.fillStyle = "rgba(255,255,255,0.35)";
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      rafId = requestAnimationFrame(animate);
    };

    init();
    animate();
    window.addEventListener("resize", init);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", init);
    };
  }, [isActive]);

  return (
    <section
      ref={sectionRef}
      className="antigravity"
      onPointerEnter={
        hasHover ? () => setIsActive(true) : undefined
      }
      onPointerLeave={
        hasHover ? () => setIsActive(false) : undefined
      }
    >
      <canvas ref={canvasRef} className="antigravity-canvas" />

      <div className="antigravity-content">
        <p className="antigravity-label">{label}</p>

        <h2 className="antigravity-title">
          {title.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </h2>

        {buttonText && (
          <button className="antigravity-btn">
            {buttonText}
          </button>
        )}
      </div>
    </section>
  );
};

export default AntigravitySection;