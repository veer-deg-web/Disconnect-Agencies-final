"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import "./TeamMemberCard.css";

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  description: string;
  detailedDescription: string;
  linkedin: string;
  github: string;
}

export default function TeamMemberCard({
  name,
  role,
  image,
  description,
  detailedDescription,
  linkedin,
  github,
}: TeamMemberProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPopOpen, setIsPopOpen] = useState(false);

  return (
    <motion.div
      className={`team-card ${isPopOpen ? "pop-open" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPopOpen(false);
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="team-card-inner">
        {/* IMAGE CONTAINER */}
        <div className="team-image-container">
          <motion.img
            src={image}
            alt={name}
            className="team-image"
            animate={{
              filter: isHovered ? "grayscale(0%) brightness(1.2)" : "grayscale(100%) brightness(0.8)",
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.4 }}
          />
          {isHovered && <div className="spotlight-overlay" />}

          {/* POP OVERLAY / EXPANDABLE DESCRIPTION OVER PHOTO */}
          <AnimatePresence>
            {isPopOpen && (
              <motion.div
                className="team-pop-description"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="pop-inner-content">
                  <p className="detailed-info">{detailedDescription}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* SOCIALS DIRECTLY ON IMAGE/CARD (RIGHT BOTTOM) */}
          <div className="team-socials absolute-socials">
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
              <FaLinkedin />
            </a>
            <a href={github} target="_blank" rel="noopener noreferrer" className="social-link">
              <FaGithub />
            </a>
          </div>
        </div>

        {/* CONTENT */}
        <div className="team-content">
          <h3 className="team-name">{name}</h3>
          <p className="team-role">{role}</p>
          
          <div 
            className="team-description-preview"
            onMouseEnter={() => setIsPopOpen(true)}
          >
            <p>{description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
