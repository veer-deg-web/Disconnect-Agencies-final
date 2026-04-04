"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

import { FaMapMarkerAlt } from "react-icons/fa";
import ShinyText from "@/components/Shared/ShinyText/ShinyText";
import styles from "./AddressSection.module.css";

export default function AddressSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section ref={ref} className={styles.addressSection} id="contact">
      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className={styles.heading}
      >
        <ShinyText
          text="Our Global"
          speed={3}
          color="#b5b5b5"
          shineColor="#ffffff"
        />
        <br />
        <ShinyText
          text="Presence."
          speed={3}
          color="#DE5E03"
          shineColor="#ffffff"
        />
      </motion.h2>

      {/* Subheading */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.15 }}
        className={styles.description}
      >
        Disconnect is a digital product agency helping modern businesses
        design, build, and scale through technology and elite engineering —
        regardless of geography.
      </motion.p>


      {/* Three cards in a row */}
      <div className={styles.cardsGrid}>
        {[
          {
            id: 1,
            title: "North America Hub",
            location: "Silicon Valley, CA",
            address: "Tech Hub Tower, San Francisco, CA, USA",
            icon: <FaMapMarkerAlt size={22} />,
          },
          {
            id: 2,
            title: "Asia Engineering Hub",
            location: "Delhi NCR, India",
            address: "Disconnect Tech Center, New Delhi, India",
            icon: <FaMapMarkerAlt size={22} />,
          },
          {
            id: 3,
            title: "Europe/UK Hub",
            location: "London, United Kingdom",
            address: "Innovation Square, London, SE1, United Kingdom",
            icon: <FaMapMarkerAlt size={22} />,
          },
        ].map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 + i * 0.12 }}
            whileHover={{ scale: 1.02 }}
            className={styles.addressCard}
          >
            <div className={styles.cardIcon}>{card.icon}</div>
            <div className={styles.cardBody}>
              <span className={styles.cardTitle}>{card.title}</span>
              <p className={styles.cardLocation}>{card.location}</p>
              <p className={styles.cardAddress}>{card.address}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
