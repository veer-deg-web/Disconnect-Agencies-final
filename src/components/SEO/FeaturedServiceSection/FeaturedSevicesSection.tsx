"use client";

import styles from "./FeaturedServices.module.css";
import FeaturedServiceCard from "./FeaturedServiceCard";
import { motion } from "framer-motion";

const services = [
  {
    image: "/assets/Partners/six.webp",
    url: "https://www.six.ind.in/",
  },
  {
    image: "/assets/Partners/doctar.webp",
    url: "https://doctar.in/",
  },
  {
    image: "/assets/Partners/sixfinance.webp",
    url: "https://sixfinance.app/",
  },
];

export default function FeaturedServicesSection() {
  return (
    <section className={styles.section}>
      {/* HEADING ANIMATION */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <span className={styles.label}>FEATURED SERVICE</span>

        <h2 className={styles.heading}>
          Explore our partners’
          <br />
          top-performing pages
        </h2>

        <p className={styles.subheading}>
          Discover high-impact content that consistently outperforms and delivers value.
        </p>
      </motion.div>

      {/* CARDS ANIMATION */}
      <motion.div
        className={styles.cardGrid}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.15,
              delayChildren: 0.2,
            },
          },
        }}
      >
        {services.map((item, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 25 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <FeaturedServiceCard {...item} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}