"use client";

import LogoLoop from "@/components/Shared/LogoLoop/LogoLoop";
import type { LogoItem } from "@/components/Shared/LogoLoop/LogoLoop";
import React, { useEffect, useMemo, useState } from "react";

type UIUXShowcaseLogosProps = {
  title?: string;
  logos: LogoItem[];
  iconGap?: number;
  logoSize?: number;   // ✅ NEW PROP
};

export default function UIUXShowcaseLogos({
  title = "Our designs are featured on",
  logos,
  iconGap = 64,
  logoSize = 44, // default size
}: UIUXShowcaseLogosProps) {
  const [viewportWidth, setViewportWidth] = useState(1440);

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const responsiveScale = useMemo(() => {
    if (viewportWidth <= 420) return 0.58;
    if (viewportWidth <= 600) return 0.68;
    if (viewportWidth <= 900) return 0.78;
    if (viewportWidth <= 1100) return 0.88;
    if (viewportWidth <= 1280) return 0.94;
    return 1; // desktop unchanged
  }, [viewportWidth]);

  const computedLogoSize = Math.max(30, Math.round(logoSize * responsiveScale));
  const computedIconGap = Math.max(44, Math.round(iconGap * responsiveScale));

  return (
    <section
      style={{
        width: "100%",
        overflow: "hidden",
        background: "#000",
      }}
    >
      {/* HARD OVERRIDE */}
      <style>{`
        .logo-loop-fix,
        .logo-loop-fix * {
          mask-image: none !important;
          -webkit-mask-image: none !important;
        }
        .logo-loop-fix::before,
        .logo-loop-fix::after {
          display: none !important;
          content: none !important;
        }
      `}</style>

      {title && (
        <h3
          style={{
            textAlign: "center",
            marginBottom: 24,
            opacity: 0.7,
            fontWeight: 500,
            color: "#fff",
            fontSize: "18px",
          }}
        >
          {title}
        </h3>
      )}

      <div className="logo-loop-fix">
        <LogoLoop
          logos={[...logos, ...logos, ...logos]}
          speed={80}
          direction="left"
          logoHeight={computedLogoSize}
          gap={computedIconGap}
          hoverSpeed={0}
          scaleOnHover
          fadeOut={false}
          ariaLabel="Technology partners"
        />
      </div>
    </section>
  );
}
