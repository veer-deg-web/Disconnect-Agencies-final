"use client";

import { useEffect, useRef } from "react";
import "./OurWorkStack.css";

const cards = [
  { src: "/Stack1.png", alt: "Work 1" },
  { src: "/Stack2.png", alt: "Work 2" },
  { src: "/Stack3.png", alt: "Work 3" },
];

const N = cards.length; // 3

export default function OurWorkStack() {
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const slidersRef  = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    /**
     * Scroll logic
     * ─────────────────────────────────────────────────────
     * wrapper height = N × 100vh  →  (N-1) × 100vh of scroll travel
     * rect.top goes from 0 to -(N-1)×vh as we scroll through.
     *
     * Card 0 (base): stays at translateY = 0 always
     * Card i (i > 0): slides in from +100vh → 0 over its own 100vh segment
     */
    const onScroll = () => {
      const rect    = wrapper.getBoundingClientRect();
      const vh      = window.innerHeight;
      const scrolled = -rect.top; // 0 → (N-1)*vh

      slidersRef.current.forEach((slider, i) => {
        if (!slider) return;

        if (i === 0) {
          slider.style.transform = "translateY(0)";
          return;
        }

        // segment for card i: scrolled in [  (i-1)*vh , i*vh  ]
        const raw = scrolled - (i - 1) * vh;
        const t   = Math.max(0, Math.min(1, raw / vh)); // 0 → 1
        const ty  = vh * (1 - t);                       // vh → 0

        slider.style.transform = `translateY(${ty}px)`;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    /* wrapper: 300vh → creates 200vh of scroll travel */
    <div ref={wrapperRef} className="work-stack-wrapper">
      <div className="work-stack-sticky">
        {cards.map((c, i) => (
          /*
           * Two-element structure:
           *   .work-stack-outer  — absolute inset 0, handles z-index
           *   .work-stack-slider — JS sets translateY on this
           *   .work-stack-card   — the visible card, centered inside slider
           */
          <div key={i} className="work-stack-outer" style={{ zIndex: i + 1 }}>
            <div
              ref={(el) => { slidersRef.current[i] = el; }}
              className="work-stack-slider"
            >
              <div className="work-stack-card">
                <img src={c.src} alt={c.alt} loading="lazy" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}