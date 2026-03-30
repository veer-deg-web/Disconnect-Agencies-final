"use client";

import LogoLoop from "@/components/Shared/LogoLoop/LogoLoop";
import type { LogoItem } from "@/components/Shared/LogoLoop/LogoLoop";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./UIUXShowcaseLogos.module.css";

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
    <section className={styles.section}>
      {title && <h3 className={styles.title}>{title}</h3>}

      <div className={styles.logoLoopFix}>
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
