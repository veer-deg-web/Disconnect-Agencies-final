"use client";

import React, { useEffect, useRef, useState } from "react";
import "./AntigravitySection.css";

/* ─────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────── */
type AntigravityProps = {
  label?: string;
  title: string; // supports \n
  buttonText?: string;
};

type Particle = {
  /* current rendered position */
  x: number;
  y: number;
  /* shape target (a pixel in the { } glyph) */
  homeX: number;
  homeY: number;
  /* free-float drift target (regenerated when reached) */
  driftX: number;
  driftY: number;
  /* size */
  size: number;
  /* 0 = free-floating, 1 = locked to shape */
  activation: number;
};

/* ─────────────────────────────────────────────────────────────
   TUNABLES — tweak here to match feel
───────────────────────────────────────────────────────────── */
const SHAPE_SAMPLE   = 5;     // px — sample every N px of glyph pixels
const SPRING_IN      = 0.075; // lerp speed toward shape on hover
const SPRING_OUT     = 0.035; // lerp speed back to drift off hover
const DRIFT_LERP     = 0.012; // how lazily particles drift
const ACT_IN         = 0.10;  // activation gain per frame on hover
const ACT_OUT        = 0.04;  // activation loss per frame off hover

/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────── */
const AntigravitySection = ({
  label = "Available at no charge",
  title,
  buttonText = "Download",
}: AntigravityProps) => {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const sectionRef  = useRef<HTMLElement>(null);
  const contentRef  = useRef<HTMLDivElement>(null);
  /* is mouse hovering the text content area? */
  const hoverRef    = useRef(false);
  const [hasHover, setHasHover] = useState(false);

  /* ── detect pointer-capable device ── */
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover)");
    setHasHover(mq.matches);
    const h = (e: MediaQueryListEvent) => setHasHover(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  /* ── for touch devices: activate on scroll into view ── */
  useEffect(() => {
    if (hasHover || !sectionRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { hoverRef.current = e.isIntersecting; },
      { threshold: 0.35 }
    );
    obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, [hasHover]);

  /* ── main canvas engine ── */
  useEffect(() => {
    const canvas  = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let particles: Particle[] = [];
    let W = 0, H = 0;

    /* ────────────────────────────────────────
       BUILD PARTICLE LIST
    ──────────────────────────────────────── */
    const init = () => {
      const rect = section.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width  = W;
      canvas.height = H;

      /* render { } into temp canvas to get pixel positions */
      const off  = document.createElement("canvas");
      off.width  = W;
      off.height = H;
      const oCtx = off.getContext("2d")!;

      /* scale font so the shape fills ~50-60% of the section */
      const fontSize =
        W <= 480  ? Math.min(W * 0.58, H * 0.50, 120)
        : W <= 900 ? Math.min(W * 0.48, H * 0.52, 185)
        :            Math.min(W * 0.40, H * 0.56, 240);

      oCtx.clearRect(0, 0, W, H);
      oCtx.fillStyle    = "#fff";
      oCtx.font         = `bold ${fontSize}px monospace`;
      oCtx.textAlign    = "center";
      oCtx.textBaseline = "middle";
      oCtx.fillText("{ }", W / 2, H / 2);

      const px = oCtx.getImageData(0, 0, W, H).data;
      const shapePts: { x: number; y: number }[] = [];
      for (let y = 0; y < H; y += SHAPE_SAMPLE) {
        for (let x = 0; x < W; x += SHAPE_SAMPLE) {
          if (px[(y * W + x) * 4 + 3] > 128) shapePts.push({ x, y });
        }
      }

      /* one particle per shape point — starts at random position */
      particles = shapePts.map(sp => ({
        x:          Math.random() * W,
        y:          Math.random() * H,
        homeX:      sp.x,
        homeY:      sp.y,
        driftX:     Math.random() * W,
        driftY:     Math.random() * H,
        size:       Math.random() * 1.3 + 0.6,
        activation: 0,
      }));
    };

    /* ────────────────────────────────────────
       ANIMATION LOOP
    ──────────────────────────────────────── */
    const animate = () => {
      ctx.clearRect(0, 0, W, H);

      const active = hoverRef.current;

      particles.forEach(p => {
        /* ── update activation ── */
        if (active) {
          p.activation = Math.min(1, p.activation + ACT_IN);
        } else {
          p.activation = Math.max(0, p.activation - ACT_OUT);
        }

        /* ── move ── */
        if (p.activation > 0.01) {
          /* spring toward shape home */
          const s = SPRING_IN * (0.4 + p.activation * 0.6);
          p.x += (p.homeX - p.x) * s;
          p.y += (p.homeY - p.y) * s;
        } else {
          /* lazy drift to random target; pick new one when close */
          p.x += (p.driftX - p.x) * DRIFT_LERP;
          p.y += (p.driftY - p.y) * DRIFT_LERP;

          if (
            Math.abs(p.x - p.driftX) < 1.5 &&
            Math.abs(p.y - p.driftY) < 1.5
          ) {
            p.driftX = Math.random() * W;
            p.driftY = Math.random() * H;
          }

          /* drift back toward home when deactivating */
          if (p.activation > 0) {
            p.x += (p.homeX - p.x) * SPRING_OUT * p.activation;
            p.y += (p.homeY - p.y) * SPRING_OUT * p.activation;
          }
        }

        /* ── colour ── */
        /* idle: soft blue glow  |  active: vivid Google blue */
        const idleAlpha  = 0.20 + Math.random() * 0.08; // subtle twinkle
        const shapeAlpha = 0.6  + p.activation * 0.4;

        const r = Math.round(66 );
        const g = Math.round(133);
        const b = Math.round(244);

        const alpha =
          p.activation > 0.01
            ? idleAlpha + (shapeAlpha - idleAlpha) * p.activation
            : idleAlpha;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── hover handlers on the content block ── */
  const onEnter = () => { hoverRef.current = true; };
  const onLeave = () => { hoverRef.current = false; };

  return (
    <section ref={sectionRef} className="antigravity">
      <canvas ref={canvasRef} className="antigravity-canvas" />

      <div
        ref={contentRef}
        className="antigravity-content"
        onMouseEnter={hasHover ? onEnter : undefined}
        onMouseLeave={hasHover ? onLeave : undefined}
      >
        {label && <p className="antigravity-label">{label}</p>}

        <h2 className="antigravity-title">
          {title.split("\n").map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </h2>

        {buttonText && (
          <button className="antigravity-btn">{buttonText}</button>
        )}
      </div>
    </section>
  );
};

export default AntigravitySection;