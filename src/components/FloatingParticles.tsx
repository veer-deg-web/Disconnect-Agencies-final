"use client";

import { useEffect, useRef } from "react";

interface FloatingParticlesProps {
  /** Particle colour (default: Google blue rgba) */
  color?: string;
  /** Number of particles (default: 120) */
  count?: number;
  /** Max particle radius in px (default: 1.6) */
  maxSize?: number;
  /** Base idle drift speed (default: 0.35) */
  speed?: number;
  /** Optional extra className on the canvas element */
  className?: string;
}

export default function FloatingParticles({
  color   = "66,133,244",   // Google-blue RGB string
  count   = 120,
  maxSize = 1.6,
  speed   = 0.35,
  className = "",
}: FloatingParticlesProps) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;

    /* ── particle type ── */
    type P = {
      x: number; y: number;
      vx: number; vy: number;
      size: number;
      alpha: number;       // current rendered alpha
      targetAlpha: number; // breathe target
      breatheTimer: number;
      breatheSpeed: number;
    };

    let particles: P[] = [];
    let W = 0, H = 0;

    /* ── initialise ── */
    const init = () => {
      const rect = container.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width  = W;
      canvas.height = H;

      particles = Array.from({ length: count }, () => ({
        x:            Math.random() * W,
        y:            Math.random() * H,
        vx:           (Math.random() - 0.5) * speed * 2,
        vy:           (Math.random() - 0.5) * speed * 2,
        size:         Math.random() * (maxSize - 0.5) + 0.5,
        alpha:        Math.random() * 0.25 + 0.08,
        targetAlpha:  Math.random() * 0.3  + 0.08,
        breatheTimer: Math.random() * 300,
        breatheSpeed: Math.random() * 0.005 + 0.002,
      }));
    };

    /* ── loop ── */
    const animate = () => {
      ctx.clearRect(0, 0, W, H);

      particles.forEach(p => {
        /* drift */
        p.x += p.vx;
        p.y += p.vy;

        /* wrap around edges */
        if (p.x < -p.size)  p.x = W + p.size;
        if (p.x > W + p.size) p.x = -p.size;
        if (p.y < -p.size)  p.y = H + p.size;
        if (p.y > H + p.size) p.y = -p.size;

        /* breathe alpha slowly */
        p.breatheTimer += p.breatheSpeed;
        p.alpha = p.targetAlpha + Math.sin(p.breatheTimer) * 0.08;

        /* draw */
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${Math.max(0, Math.min(1, p.alpha))})`;
        ctx.fill();
      });

      rafId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const onResize = () => init();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, [color, count, maxSize, speed]);

  return (
    <div
      ref={containerRef}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}
    >
      <canvas
        ref={canvasRef}
        className={className}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}
