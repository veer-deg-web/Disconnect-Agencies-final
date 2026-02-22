"use client";

import UIUXHeroAnimatedContent from "./UIUXHeroAnimatedContent";

/**
 * Effect:
 *  1. Page load   → text visible on #000 background (no video yet)
 *  2. Scroll ↓    → video section scrolls up from below, appearing BEHIND the sticky text
 *  3. At 100vh    → video fully behind text, looks like text is floating over the video
 *  4. Scroll cont → section exits normally
 *
 * Layout trick:
 *  - Outer div: 200vh tall (creates scroll travel)
 *  - Text div: position:sticky top:0, height:100vh, z-index:10 — NEVER MOVES
 *  - Video div: position:absolute top:100vh, z-index:5 — in normal flow, scrolls up behind text
 */
export default function UIUXHeroSection() {
  return (
    <div
      style={{
        height: "200vh",
        position: "relative",
        background: "#000",
      }}
    >
      {/* ── TEXT — pinned at viewport top, never moves ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent", // black container shows through initially
          pointerEvents: "none",     // allow scroll events through when on video
        }}
      >
        <div
          style={{
            maxWidth: "1320px",
            width: "100%",
            padding: "0 clamp(16px, 5vw, 48px)",
            textAlign: "center",
            pointerEvents: "auto",
          }}
        >
          <UIUXHeroAnimatedContent />
        </div>
      </div>

      {/* ── VIDEO — starts at 100vh, scrolls up into view behind the text ── */}
      <div
        style={{
          position: "absolute",
          top: "100vh",   // starts exactly below the initial viewport
          left: 0,
          width: "100%",
          height: "100vh",
          zIndex: 5,      // behind text (z-index 10)
          overflow: "hidden",
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.7,
          }}
        >
          <source src="/uiux-hero.mp4" type="video/mp4" />
        </video>

        {/* edge vignette so text stays readable over the video */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 100%)",
          }}
        />
      </div>
    </div>
  );
}
