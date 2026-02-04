"use client";

import styles from "./FeaturedServices.module.css";
import FeaturedServiceCard from "./FeaturedServiceCard";
import { motion } from "framer-motion";
import {
  SiReact,
  SiGoogleanalytics,
  SiFigma,
} from "react-icons/si";

const services = [
  {
    icon: SiReact,
    title: "Code Solutions",
    role: "Head of Development",
    type: "Full-time",
    date: "Nov 26, 2024",
    featured: true,
  },
  {
    icon: SiGoogleanalytics,
    title: "ABC Studios",
    role: "UI/UX Designer",
    type: "Full-time",
    date: "Dec 20, 2024",
    featured: true,
  },
  {
    icon: SiFigma,
    title: "Design Spark",
    role: "Lead Product Designer",
    type: "Full-time",
    date: "Dec 30, 2024",
    featured: true,
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
          Find the right SEO
          <br />
          solution for your business.
        </h2>

        <p className={styles.subheading}>
          Explore our core SEO services designed to increase visibility,
          drive qualified traffic, and convert organic growth into revenue.
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