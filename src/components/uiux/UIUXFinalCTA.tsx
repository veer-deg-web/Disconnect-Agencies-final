import BookCallButton from "@/components/Shared/BookCallButton/BookCallButton";
import styles from "./UIUXFinalCTA.module.css";

export default function UIUXFinalCTA() {
  return (
    <section className={styles.section}>
      <div className={styles.ctaBox}>
        <h2>Start Investing Smarter Today</h2>
        <p>
          Harness the power of AI to grow your portfolio with confidence and clarity.
        </p>

        <BookCallButton />
      </div>

      <footer className={styles.footer}>
        <nav className={styles.nav}>
          <span>Home</span>
          <span>Feature</span>
          <span>Benefits</span>
          <span>Pricing</span>
          <span>Testimonials</span>
          <span>FAQ</span>
        </nav>

        <p className={styles.copy}>
          2026 Copyright © Aset. All rights reserved.
        </p>
      </footer>
    </section>
  );
}
