"use client";
import styles from "./UIUXProcessShowcase.module.css";
import Image from "next/image";

export default function UIUXProcessShowcase() {
  const rows = [
    { src: "/assets/Uiux/UIUXProcessShowcase/photo/slide1.webp", direction: "ltr" },
    { src: "/assets/Uiux/UIUXProcessShowcase/photo/slide2.webp", direction: "rtl" },
    { src: "/assets/Uiux/UIUXProcessShowcase/photo/slide3.webp", direction: "ltr" },
  ];

  return (
    <div className={styles.container}>
      {rows.map((row, index) => (
        <div key={index} className={styles.row}>
          {/* SLIDING TRACK - instantly visible and moving */}
          <div
            className={`${styles.track} ${
              row.direction === "ltr" ? styles.trackLtr : styles.trackRtl
            }`}
          >
            <div className={styles.slide}>
              <Image src={row.src} alt="" fill className={styles.image} />
            </div>

            <div className={styles.slide}>
              <Image src={row.src} alt="" fill className={styles.image} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}