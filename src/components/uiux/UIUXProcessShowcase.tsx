"use client";

export default function UIUXProcessShowcase() {
  const rows = [
    { src: "/slide1.png", direction: "ltr" },
    { src: "/slide2.png", direction: "rtl" },
    { src: "/slide3.png", direction: "ltr" },
  ];

  return (
    <div
      style={{
        marginTop: "48px", // closer to button
        display: "flex",
        flexDirection: "column",
        gap: "16px", // tighter vertical spacing
      }}
    >
      {rows.map((row, index) => (
        <div
          key={index}
          style={{
            position: "relative",
            width: "100%",
            height: "210px",
            overflow: "hidden",
            borderRadius: "20px",
            backgroundColor: "#000",
            transform: "skewX(-12deg)", // stronger tilt
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* SLIDING TRACK - instantly visible and moving */}
          <div
            className={
              row.direction === "ltr"
                ? "process-slide-ltr"
                : "process-slide-rtl"
            }
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              width: "200%",
              // No initial opacity or transform - instantly visible
            }}
          >
            <img
              src={row.src}
              alt=""
              style={{
                width: "50%",
                height: "100%",
                objectFit: "cover",
                transform: "skewX(-16deg)", // straighten image
              }}
            />

            <img
              src={row.src}
              alt=""
              style={{
                width: "50%",
                height: "100%",
                objectFit: "cover",
                transform: "skewX(-16deg)", // straighten image
              }}
            />
          </div>
        </div>
      ))}

      {/* KEYFRAMES */}
      <style jsx>{`
        .process-slide-ltr {
          animation: slide-ltr 26s linear infinite;
        }

        .process-slide-rtl {
          animation: slide-rtl 26s linear infinite;
        }

        @keyframes slide-ltr {
          from {
            transform: translateX(0%);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @keyframes slide-rtl {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(0%);
          }
        }
      `}</style>
    </div>
  );
}