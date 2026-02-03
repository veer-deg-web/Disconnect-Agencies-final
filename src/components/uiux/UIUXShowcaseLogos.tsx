"use client";

import * as SimpleIcons from "simple-icons";

type LogoItem = {
  /** simple-icons export name, e.g. "siReact", "siNextdotjs" */
  src: keyof typeof SimpleIcons;
  alt: string;
};

type UIUXShowcaseLogosProps = {
  title?: string;
  logos: LogoItem[];
};

export default function UIUXShowcaseLogos({
  title = "Our designs are featured on:",
  logos,
}: UIUXShowcaseLogosProps) {
  // duplicate once for seamless loop
  const marqueeLogos = [...logos, ...logos];

  return (
    <div style={container}>
      <p style={titleStyle}>{title}</p>

      <div style={marqueeWrap}>
        <div style={track}>
          {marqueeLogos.map((logo, index) => {
            const icon = SimpleIcons[logo.src];
            if (!icon) return null;

            return (
              <svg
                key={index}
                viewBox="0 0 24 24"
                width={44}
                height={44}
                aria-label={logo.alt}
                style={logoStyle}
              >
                <path d={icon.path} />
              </svg>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

/* =======================
   STYLES (FINAL)
======================= */

const container: React.CSSProperties = {
  marginTop: 64,
  width: "100%",
  overflow: "hidden",
};

const titleStyle: React.CSSProperties = {
  color: "#9ca3af",
  fontSize: 14,
  marginBottom: 32,
  textAlign: "center",
};

const marqueeWrap: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  whiteSpace: "nowrap", // 🔥 critical for continuity
  maskImage:
    "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
  WebkitMaskImage:
    "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
};

const track: React.CSSProperties = {
  display: "flex",
  gap: 96,                         // 🔥 spacing
  width: "fit-content",
  minWidth: "200%",                // 🔥 EXACTLY double width
  animation: "marquee 14s linear infinite", // 🔥 speed
};

const logoStyle: React.CSSProperties = {
  fill: "#ffffff",
  opacity: 0.9,
  transition: "opacity 0.3s ease",
};