import UIUXShowcaseAnimated from "./UIUXShowcaseAnimated";
import UIUXShowcaseLogos from "./UIUXShowcaseLogos";

export default function UIUXShowcase() {
  return (
    <section
      style={{
        position: "relative",

        /* PULL SECTION UP OVER HERO (RESPONSIVE) */
        marginTop: "clamp(-120px, -20vw, -160px)",

        padding: "clamp(24px, 6vw, 40px) 16px clamp(100px, 20vw, 140px)",
        backgroundColor: "#000",
        zIndex: 20,
      }}
    >
      {/* VIDEO CONTAINER */}
      <div
        style={{
          position: "relative",
          maxWidth: "1200px",
          margin: "0 auto",
          borderRadius: "clamp(18px, 4vw, 28px)",
          overflow: "hidden",
        }}
      >
        {/* VIDEO */}
        <video
          src="/bg-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            width: "100%",
            height: "clamp(260px, 60vw, 460px)",
            objectFit: "cover",
            display: "block",
          }}
        />

        {/* ANIMATED TRANSPARENT OVERLAY */}
        <UIUXShowcaseAnimated />
      </div>

      {/* LOGOS */}
      <div
        style={{
          marginTop: "clamp(40px, 10vw, 72px)",
          textAlign: "center",
          color: "#9ca3af",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "clamp(20px, 6vw, 40px)",
            opacity: 0.7,
          }}
        >
          <UIUXShowcaseLogos />
        </div>
      </div>
    </section>
  );
}
