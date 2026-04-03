"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Cobe } from "@/components/ui/cobe-globe";
import { FaMapMarkerAlt } from "react-icons/fa";
import ShinyText from "@/components/Shared/ShinyText/ShinyText";
import styles from "./AddressSection.module.css";

export default function AddressSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section ref={ref} className={styles.addressSection} id="contact">
      <div className={styles.container}>
        {/* Content Side */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={styles.content}
        >
          <h2 className={styles.heading}>
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
          </h2>
          <p className={styles.description}>
            Disconnect is a digital product agency helping modern businesses design, build, and scale through technology and elite engineering — regardless of geography.
          </p>

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
            ].map((card) => (
              <motion.div
                key={card.id}
                whileHover={{ scale: 1.02 }}
                className={styles.addressCard}
              >
                <div className={styles.cardIcon}>
                   {card.icon}
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.cardTitle}>{card.title}</span>
                  <p className={styles.cardLocation}>{card.location}</p>
                  <p className={styles.cardAddress}>{card.address}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Globe Side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
          className={styles.globeWrapper}
        >
          <div className="relative z-10 h-[300px] w-full overflow-hidden rounded-lg sm:h-[550px] md:h-[600px]">
            <Cobe
              variant="default"
              phi={0}
              theta={0.2}
              mapSamples={16000}
              mapBrightness={1.8}
              mapBaseBrightness={0.05}
              diffuse={3}
              dark={1.1}
              baseColor="#ffffff"
              markerColor="#fb6415"
              markerSize={0.05}
              glowColor="#ffffff"
              scale={1.0}
              offsetX={0.0}
              offsetY={0.0}
              opacity={0.7}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
