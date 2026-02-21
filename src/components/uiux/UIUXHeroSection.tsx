import UIUXHeroAnimatedContent from "./UIUXHeroAnimatedContent";

export default function UIUXHeroSection() {
  return (
    <section
      style={{
        minHeight: "100vh",
        backgroundColor: "#000000",
        position: "sticky",
        top: 0,
      }}
    >
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: "1320px",
            width: "100%",
            padding: "0 3rem",
            textAlign: "center",
            color: "#ffffff",
          }}
        >
          <UIUXHeroAnimatedContent />
        </div>
      </div>
    </section>
  );
}
