import UIUXShowcaseAnimated from "./UIUXShowcaseAnimated";
import UIUXShowcaseLogos from "./UIUXShowcaseLogos";
import React from "react";
import { showcaseLogos } from "@/Data/showcaseLogos";
import styles from "./UIUXShowcase.module.css";

export default function UIUXShowcase() {
  return (
    <section className={styles.section}>
      {/* VIDEO CONTAINER */}
      <div className={styles.videoWrapper}>
        {/* VIDEO */}
        <video
          src="/assets/Uiux/UIUXShowcase/video/bg-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={styles.video}
        />

        {/* ANIMATED TRANSPARENT OVERLAY */}
        <UIUXShowcaseAnimated />
      </div>

      {/* LOGOS */}
      <div className={styles.logosSection}>
        <div className={styles.logosGrid}>
          <UIUXShowcaseLogos logos={showcaseLogos} />
        </div>
      </div>
    </section>
  );
}
