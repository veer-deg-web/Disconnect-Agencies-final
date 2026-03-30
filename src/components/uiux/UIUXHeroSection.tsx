import UIUXHeroAnimatedContent from "./UIUXHeroAnimatedContent";
import styles from "./UIUXHeroSection.module.css";

export default function UIUXHeroSection() {
  return (
    <div className={styles.outer}>
      {/* ── TEXT — pinned at viewport top, never moves ── */}
      <div className={styles.stickyText}>
        <div className={styles.textContainer}>
          <UIUXHeroAnimatedContent />
        </div>
      </div>

      {/* ── VIDEO — starts at 100vh, scrolls up into view behind the text ── */}
      <div className={styles.videoSection}>
        <video
          autoPlay
          loop
          muted
          playsInline
          className={styles.video}
        >
          <source src="/assets/Uiux/UIUXHeroSection/video/uiux-hero.mp4" type="video/mp4" />
        </video>

        {/* edge vignette so text stays readable over the video */}
        <div className={styles.vignette} />
      </div>
    </div>
  );
}
