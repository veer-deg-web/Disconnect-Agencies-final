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
  // Duplicate logos for seamless marquee
  const marqueeLogos = [...logos, ...logos];

  return (
    <div
      style={{
        marginTop: "64px",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* TITLE */}
      <p
        style={{
          color: "#9ca3af",
          fontSize: "14px",
          marginBottom: "32px",
          textAlign: "center",
        }}
      >
        {title}
      </p>

      {/* MARQUEE */}
      <div style={{ width: "100%", overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            gap: "64px",
            width: "max-content",
            animation: "logo-marquee 24s linear infinite",
          }}
        >
          {marqueeLogos.map((logo, index) => (
            <img
              key={index}
              src={logo.src}
              alt={logo.alt}
              style={{
                height: "48px",
                objectFit: "contain",
                opacity: 0.85,
                filter: "grayscale(100%)",
              }}
            />
          ))}
        </div>
      </div>

      {/* KEYFRAMES */}
      <style jsx>{`
        @keyframes logo-marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}