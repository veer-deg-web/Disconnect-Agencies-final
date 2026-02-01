"use client";

type LogoItem = {
  src: string;
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
  const marqueeLogos = [...logos, ...logos];

  return (
    <div style={container}>
      <p style={titleStyle}>{title}</p>

      <div style={marqueeWrap}>
        <div style={track}>
          {marqueeLogos.map((logo, index) => (
            <img
              key={index}
              src={logo.src}
              alt={logo.alt}
              draggable={false}
              style={logoStyle}
            />
          ))}
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
   STYLES
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
  maskImage:
    "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
  WebkitMaskImage:
    "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
};

const track: React.CSSProperties = {
  display: "flex",
  gap: 64,
  width: "max-content",
  animation: "marquee 26s linear infinite",
};

const logoStyle: React.CSSProperties = {
  height: 44,
  width: "auto",
  objectFit: "contain",
  opacity: 0.85,
  filter: "grayscale(100%)",
};