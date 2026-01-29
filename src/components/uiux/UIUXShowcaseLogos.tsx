"use client";

type UIUXShowcaseLogosProps = {
  title?: string;
  logos: string[];
};

export default function UIUXShowcaseLogos({
  title = "Our designs are featured on:",
  logos,
}: UIUXShowcaseLogosProps) {
  // duplicate logos for seamless loop
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
      <div
        style={{
          width: "100%",
          overflow: "hidden",
        }}
      >
        {/* TRACK */}
        <div
          style={{
            display: "flex",
            gap: "64px",
            width: "max-content",
            animation: "logo-marquee 24s linear infinite",
          }}
        >
          {marqueeLogos.map((logo, index) => (
            <div
              key={index}
              role="img"
              aria-label={logo}
              style={{
                minWidth: "160px",
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: "20px",
                fontWeight: 500,
                whiteSpace: "nowrap",
                opacity: 0.85,
              }}
            >
              {logo}
            </div>
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