import BookCallButton from "@/components/BookCallButton";

export default function UIUXFinalCTA() {
  return (
    <section style={{ padding: "160px 24px", textAlign: "center" }}>
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "80px",
          borderRadius: "32px",
        }}
      >
        <h2>Start Investing Smarter Today</h2>
        <p>
          Harness the power of AI to grow your portfolio with confidence and clarity.
        </p>

        <BookCallButton />
      </div>

      <footer style={{ marginTop: "120px" }}>
        <nav style={{ display: "flex", justifyContent: "center", gap: "24px" }}>
          <span>Home</span>
          <span>Feature</span>
          <span>Benefits</span>
          <span>Pricing</span>
          <span>Testimonials</span>
          <span>FAQ</span>
        </nav>

        <p style={{ marginTop: "24px" }}>
          2026 Copyright © Aset. All rights reserved.
        </p>
      </footer>
    </section>
  );
}
