"use client";

import { motion } from "framer-motion";
import { SiAmazon, SiGooglecloud, SiCloudflare } from "react-icons/si";
import "./CloudServices.css";

const services = [
  {
    id: "01",
    title: "Cloud Setup & Migration",
    desc: "UI Design, UX Design",
    icon: SiAmazon,
  },
  {
    id: "02",
    title: "Cloud Managed Services",
    desc: "Visual Planning",
    icon: SiGooglecloud,
  },
  {
    id: "03",
    title: "Cloud Security & Backup",
    desc: "Marketing Strategy",
    icon: SiCloudflare,
  },
];

export default function CloudServicesSection() {
  return (
    <section className="cloud-services">
      {/* Header */}
      <motion.div
        className="cloud-header"
        initial={{ x: -60, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* LABEL */}
        <div className="cloud-label">
          <span className="label-dot" />
          <span className="label-text">OUR SERVICES</span>
        </div>

        {/* HEADING */}
        <h2>
          What are <br />
          <span>our Services</span>
        </h2>
      </motion.div>

      {/* Cards */}
      <div className="cloud-grid">
        {services.map((service, index) => {
          const Icon = service.icon;

          return (
            <motion.div
              key={service.id}
              className="cloud-card"
              initial={{ y: 60, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: index * 0.1,
              }}
            >
              <div className="card-top">
                <span className="service-id">#{service.id}</span>
                <Icon className="service-icon" />
              </div>

              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}